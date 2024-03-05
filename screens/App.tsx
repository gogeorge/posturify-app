import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Dimensions, Platform, Image, Pressable, ActivityIndicator } from 'react-native';
import { Input, Button, Text } from 'galio-framework';
import { Camera } from 'expo-camera';
import { BlurView } from 'expo-blur';
import { Slider } from '@miblanchard/react-native-slider';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import * as ScreenOrientation from 'expo-screen-orientation';
import {
  bundleResourceIO,
  cameraWithTensors,
} from '@tensorflow/tfjs-react-native';
import Svg, { Circle } from 'react-native-svg';
import { ExpoWebGLRenderingContext } from 'expo-gl';
import { CameraType, WhiteBalance } from 'expo-camera/build/Camera.types';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { updateDoc, getDoc, doc, arrayUnion, getFirestore } from "firebase/firestore"; 
import { app, db } from './firebase'

// tslint:disable-next-line: variable-name
const TensorCamera = cameraWithTensors(Camera);

const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';

// Camera preview size.
//
// From experiments, to render camera feed without distortion, 16:9 ratio
// should be used fo iOS devices and 4:3 ratio should be used for android
// devices.
//
// This might not cover all cases.
const CAM_PREVIEW_WIDTH = Dimensions.get('window').width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// The score threshold for pose detection results.
const MIN_KEYPOINT_SCORE = 0.3;

// The size of the resized output from TensorCamera.
//
// For movenet, the size here doesn't matter too much because the model will
// preprocess the input (crop, resize, etc). For best result, use the size that
// doesn't distort the image.
const OUTPUT_TENSOR_WIDTH = 180;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// Whether to auto-render TensorCamera preview.
const AUTO_RENDER = false;

// Whether to load model from app bundle (true) or through network (false).
const LOAD_MODEL_FROM_BUNDLE = false;

let rightShoulder: any = [0];
let rightHip: any = [0];
let leftShoulder: any = [0];
let leftHip: any = [0];

let shoulderHeightL: any = [0];
let shoulderHeightR: any = [0];
let hipHeightL: any = [0];
let hipHeightR: any = [0];

var postures: any = [];

export default function App() {
  const navigation = useNavigation()
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();
  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState<posedetection.PoseDetector>();
  const [poses, setPoses] = useState<posedetection.Pose[]>();
  const [psmodel, setPsModel] = useState<tf.LayersModel>();
  const [imgTensor, setImgTensor] = useState<tf.Tensor3D>();
  const [orientation, setOrientation] =
    useState<ScreenOrientation.Orientation>();
  const [cameraType, setCameraType] = useState<CameraType>(
    Camera.Constants.Type.front
  );
  const [shouldShow, setShouldShow] = useState(false);
  const [btnClicked, setBtnClicked] = useState(false);
  const [remArray, setRemArray] = useState(['']);
  const [remText, setRemText] = useState('');
  const [intensity, setIntensity] = useState<number | number[]>(0.0);
  const [mlSwitch, setMlSwitch] = useState(false);

  const [calibBtn, setCalibBtn] = useState(false);
  const [calib, setCalibration] = useState(false);
  const [calibHeight, setCalibHeight] = useState<number>(0.0);

  const [posDetected, setPosDetected] = useState(false);
  const [posMessage, setPosMessage] = useState('');
  const [posTitle, setPosTitle]  = useState('');
  const posBtnMsg = 'Done'

  const calibTitle = 'Calibration';
  const calibMsg = 'Sit on your chair with a straight back. When you are ready press calibrate.';
  const calibBtnMsg = 'Start Calibration';

  const [currentUser, setCurrentUser] = useState('')
  const auth = getAuth(app);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser('' + user.email)
      // warning error for calib height
      // getCalibHeight()
    }
  });

  const getReminders = async () => {
    const request = await getDoc(doc(db, "account-data", '' + currentUser))
    let rem = request.data().reminder
    setRemArray(rem)
  }

  const getCalibHeight = async () => {
    const request = await getDoc(doc(db, "account-data", '' + currentUser))
    let ch = request.data().calibrationHeight
    setCalibHeight(ch)
  }

  const getIntensity = async () => {
    const request = await getDoc(doc(db, "account-data", '' + currentUser))
    let i = request.data().intensity
    setIntensity(i)
  }

  const rafId = useRef<number | null>(null);

  var btnColors = shouldShow? 'black' : 'white'

  useEffect(() => {
    async function prepare() {

      rafId.current = null;

      // Set initial orientation.
      const curOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(curOrientation);

      // Listens to orientation change.
      ScreenOrientation.addOrientationChangeListener((event) => {
        setOrientation(event.orientationInfo.orientation);
      });

      // Camera permission.
      await Camera.requestCameraPermissionsAsync();

      // Wait for tfjs to initialize the backend.
      await tf.ready();

      // Load movenet model.
      // https://github.com/tensorflow/tfjs-models/tree/master/pose-detection
      const movenetModelConfig: posedetection.MoveNetModelConfig = {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
      };
      if (LOAD_MODEL_FROM_BUNDLE) {
        const modelJson = require('../offline_model/model.json');
        const modelWeights1 = require('../offline_model/group1-shard1of2.bin');
        const modelWeights2 = require('../offline_model/group1-shard2of2.bin');
        movenetModelConfig.modelUrl = bundleResourceIO(modelJson, [
          modelWeights1,
          modelWeights2,
        ]);
      }
      const model = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        movenetModelConfig
      );
      setModel(model);

      // Ready!
      setTfReady(true);

    }

    prepare();
  }, []);

  useEffect(() => {
    // Called when the app is unmounted.
    return () => {
      if (rafId.current != null && rafId.current !== 0) {
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
    };
  }, []); 

  const handleCameraStream = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: ExpoWebGLRenderingContext
  ) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const loop = async () => {
      // Get the tensor and run pose detection.
      const imageTensor = images.next().value as tf.Tensor3D;

      const poses = await model!.estimatePoses(
        imageTensor,
        undefined,
        Date.now()
      );
      setPoses(poses);
      tf.dispose([imageTensor]);

      if (rafId.current === 0) {
        return;
      }
      // Render camera preview manually when autorender=false.
      if (!AUTO_RENDER) {
        updatePreview();
        gl.endFrameEXP();
      }

      rafId.current = requestAnimationFrame(loop);

    };
    loop();
  };
  
  const renderPose = () => {
    if (poses != null && poses.length > 0) {
      new Promise(resolve => setTimeout(resolve, 5000));
      // if (mlSwitch) predict(psmodel, imgTensor)
      
      const keypoints = poses[0].keypoints
        .filter((k) => (k.score ?? 0) > MIN_KEYPOINT_SCORE)
        .map((k) => {
          // Flip horizontally on android or when using back camera on iOS.
          const flipX = IS_ANDROID || cameraType === Camera.Constants.Type.back;
          const x = flipX ? getOutputTensorWidth() - k.x : k.x;
          const y = k.y;
          const cx =
            (x / getOutputTensorWidth()) *
            (isPortrait() ? CAM_PREVIEW_WIDTH : CAM_PREVIEW_HEIGHT);
          const cy =
            (y / getOutputTensorHeight()) *
            (isPortrait() ? CAM_PREVIEW_HEIGHT : CAM_PREVIEW_WIDTH);
            if (k.name == "right_shoulder") rightShoulder.push(cx);
            if (k.name == "right_shoulder") shoulderHeightR.push(cy);
            if (k.name == "left_shoulder") leftShoulder.push(cx);
            if (k.name == "left_shoulder") shoulderHeightL.push(cy);
            if (k.name == "right_hip") rightHip.push(cx);
            if (k.name == "right_hip") hipHeightR.push(cy);
            if (k.name == "left_hip") leftHip.push(cx);
            if (k.name == "left_hip") hipHeightL.push(cy);

          return (
            true
          );
        });
        if (rightShoulder.length > 75 && 
          rightShoulder.length > 5 &&
          leftShoulder.length > 5 &&
          shoulderHeightR.length > 5 &&
          shoulderHeightL.length > 5 &&
          rightHip.length > 5 &&
          leftHip.length > 5 && 
          hipHeightR.length > 5 &&
          hipHeightL.length > 5) {
          const rsAverage = (rightShoulder).reduce((a: any, b: any) => a + b) / rightShoulder.length;
          const rsAverageH = (shoulderHeightR).reduce((a: any, b: any) => a + b) / shoulderHeightR.length;
          const lsAverage = (leftShoulder).reduce((a: any, b: any) => a + b) / leftShoulder.length;
          const lsAverageH = (shoulderHeightL).reduce((a: any, b: any) => a + b) / shoulderHeightL.length;
          const rhAverage = (rightHip).reduce((a: any, b: any) => a + b) / rightHip.length;
          const lhAverage = (leftHip).reduce((a: any, b: any) => a + b) / leftHip.length;
          const rhAverageH = (hipHeightR).reduce((a: any, b: any) => a + b) / hipHeightR.length;
          const lhAverageH = (hipHeightL).reduce((a: any, b: any) => a + b) / hipHeightL.length;
          setPosDetected(false);
          // write code for a tilted neck
          if (calib) {
            const calibValue = ((rsAverageH - rhAverageH) + (lsAverageH - lhAverageH)) / 2
            setCalibHeight(calibValue)
            setCalibration(false)
            setPosDetected(true)
            setPosTitle('Calibration')
            setPosMessage('Calibration finished')
            const update = doc(db, "account-data", currentUser);
            updateDoc(update, {
              calibrationHeight: calibValue
            });
          } else {
            setPosTitle('Improper Posture')
            if (rsAverage - rhAverage > (15 + Number(intensity)/100)) {
              if (Math.abs(lsAverageH - rsAverageH) > (15 + Number(intensity)/100)) {
                const update = doc(db, "account-data", currentUser);
                updateDoc(update, {
                  postureData: arrayUnion('right:shoulders:' + new Date())
                });
                setPosDetected(true)
                setPosMessage('You are tilted to the right and your shoulders are not straight. Please fix your posture')
              } else {
                const update = doc(db, "account-data", currentUser);
                updateDoc(update, {
                  postureData: arrayUnion('right:' + new Date())
                });
                setPosDetected(true)
                setPosMessage('You are tilted to the right. Please fix your posture')
              }
            }
            else if (lhAverage - lsAverage > (15 + Number(intensity)/100)) {
              if (Math.abs(lsAverageH - rsAverageH) > (15 + Number(intensity)/100)) {
                const update = doc(db, "account-data", currentUser);
                updateDoc(update, {
                  postureData: arrayUnion('left:shoulders:' + new Date())
                });
                setPosDetected(true)
                setPosMessage('You are tilted to the left and your shoulders are not straight. Please fix your posture')
              } else {
                const update = doc(db, "account-data", currentUser);
                updateDoc(update, {
                  postureData: arrayUnion('left:' + new Date())
                });
                setPosDetected(true)
                setPosMessage('You are tilted to the left. Please fix your posture')
              }
            } else if (rsAverageH - rhAverageH > (calibHeight + Number(intensity)/100) ||
                       lsAverageH - lhAverageH > (calibHeight + Number(intensity)/100)) {
              const update = doc(db, "account-data", currentUser);
              updateDoc(update, {
                postureData: arrayUnion('forward:' + new Date())
              });
              setPosDetected(true)
              setPosMessage('You are too bent forward. Please fix your posture')
            } 
            else {
              if (Math.abs(lsAverageH - rsAverageH) > 15) {
                const update = doc(db, "account-data", currentUser);
                updateDoc(update, {
                  postureData: arrayUnion('shoulders:' + new Date())
                });
                setPosDetected(true)
                setPosMessage('Your shoulders are not straight. Please fix your posture')
              } else {
                const update = doc(db, "account-data", currentUser);
                updateDoc(update, {
                  postureData: arrayUnion('normal:' + new Date())
                });
              }      
            }
          }

          rightShoulder = [];
          shoulderHeightR = [];
          leftShoulder = [];
          shoulderHeightL = [];
          rightHip = [];
          leftHip = [];
          hipHeightR = [];
          hipHeightL = [];
        } 
      return <Svg style={styles.svg}>{keypoints}</Svg>;
    } else {
      return <View></View>;
    }

  };
  const renderMessageBox = (title: String, message: String, btnMessage: String) => {
    return (
    <View style={styles.messageBox}>
      <Text style={{fontSize: 20, fontWeight: '500'}}>{title}</Text>
      <Text style={{fontSize: 15, width: '95%', top: 5, alignText: 'center'}}>
        {message}
      </Text>
      <Button onPress={handleMessageBox} style={{top: 10}}>
        {btnMessage}
      </Button>
    </View>
    );
  }

  const renderFps = () => {
    return (
      <View 
        style={styles.fpsContainer}
        onTouchEnd={() => {
          setShouldShow(!shouldShow);
          getReminders();
        }}
      > 
        {
          shouldShow ? (
            <View style={styles.whiteBg}>
              {/* fontSize does not work */}
              <Text bold style={[{top: -7}, {fontSize: 35}, styles.reminderText]}>Reminders</Text>
              <Text style={styles.reminderText}>
              {remArray}
              </Text>
            </View>
          ) : null
        }
        <Text style={{color: btnColors}}>{shouldShow ? 'Show' : 'Hide'}</Text>
      </View>
    );
  };

  const handleReminder = () => {
    setBtnClicked(false)
    setRemArray(remArray => [...remArray, remText + '\n'])
    const update = doc(db, "account-data", currentUser);
    updateDoc(update, {
      reminder: arrayUnion(remText + '\n')
    });
  }

  const handleCalibration = () => {
    setBtnClicked(false)
    setCalibBtn(true)
  }

  const handleMessageBox = () => {
    if (calibBtn) {
      setCalibBtn(false)
      setCalibration(true)
    }
    if (posDetected) {
      setPosDetected(false)
    } 
  }

  // rmeove the function keep the set state
  const handleMlSwitch = (sw: boolean) => {
    setMlSwitch(!sw)
  }

  const renderCameraTypeSwitcher = () => {
    return (
      <View
        style={styles.cameraTypeSwitcher}
      >
        {
          btnClicked ? 
          (
            <BlurView intensity={20} tint="light" style={styles.blurBg}></BlurView>
          ) : null
        }
        <Pressable onPress={() => {
          setBtnClicked(!btnClicked)
          getIntensity()
          }}>
          <Image
            source={require('../assets/icons/icn_4.png')}
            style={{ height: 25, width: 25, tintColor: btnColors }}
          />
        </Pressable>
        {btnClicked ?
        (
          <View style={styles.inputContainer}>
          <View style={styles.inputPrompt}>
            <Text center size={15} style={{ marginTop: 10}}>Reminder</Text>
              <Input placeholder="regular" style={styles.input} onChangeText={newText => setRemText(newText)}/>
              <View style={{flexDirection: "row"}}>
                  <Button color='danger' onPress={handleReminder} style={styles.subBtns}>
                      Cancel
                  </Button>
                  <Button onPress={handleReminder} style={styles.subBtns}>
                      Done
                  </Button>
              </View>
          </View>
          <View>
            <Text center size={15} style={{color: 'white', marginTop: 10}}>Sensitivity</Text>
            <View style={styles.slider}>
              <Slider
                animateTransitions={true}
                minimumValue={-50}
                maximumValue={50}
                value={intensity}
                minimumTrackTintColor='#44c8a4'
                thumbTintColor='#287561'
                onSlidingComplete={(value) => {
                  const update = doc(db, "account-data", currentUser);
                  updateDoc(update, {
                    intensity: value
                  });
                  setIntensity(value)
                }}
              />
            </View>
          </View>
          <View>
            <Button onPress={handleCalibration} >
              Calibrate
            </Button>  

          </View>   
          <View style={{flexDirection: 'row', alignItems: 'center'}}>     
            {/* <Text style={{color: 'white', paddingRight: 100}}>Enable ML model</Text>   */}
            <View>
              {/* <Switch
                value={mlSwitch}
                onValueChange={() => handleMlSwitch(mlSwitch)}
              /> */}
              <Button onPress={() => navigation.navigate("MLCamera")} >
                Enable ML model
              </Button>  
            </View>     
          </View>  

       </View>
        ) : null
     }
      </View>
    );
  };

  const isPortrait = () => {
    return (
      orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
      orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
    );
  };

  const getOutputTensorWidth = () => {
    // On iOS landscape mode, switch width and height of the output tensor to
    // get better result. Without this, the image stored in the output tensor
    // would be stretched too much.
    //
    // Same for getOutputTensorHeight below.
    return isPortrait() || IS_ANDROID
      ? OUTPUT_TENSOR_WIDTH
      : OUTPUT_TENSOR_HEIGHT;
  };

  const getOutputTensorHeight = () => {
    return isPortrait() || IS_ANDROID
      ? OUTPUT_TENSOR_HEIGHT
      : OUTPUT_TENSOR_WIDTH;
  };

  const getTextureRotationAngleInDegrees = () => {
    // On Android, the camera texture will rotate behind the scene as the phone
    // changes orientation, so we don't need to rotate it in TensorCamera.
    if (IS_ANDROID) {
      return 0;
    }

    // For iOS, the camera texture won't rotate automatically. Calculate the
    // rotation angles here which will be passed to TensorCamera to rotate it
    // internally.
    switch (orientation) {
      // Not supported on iOS as of 11/2021, but add it here just in case.
      case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        return 180;
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
        return cameraType === Camera.Constants.Type.front ? 270 : 90;
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        return cameraType === Camera.Constants.Type.front ? 90 : 270;
      default:
        return 0;
    }
  };

  if (!tfReady) {

    return (
      <View style={styles.loadingMsg}>
        <ActivityIndicator /> 
      </View>
    );
  } else {
    return (
      // Note that you don't need to specify `cameraTextureWidth` and
      // `cameraTextureHeight` prop in `TensorCamera` below.
      <View
        style={
          isPortrait() ? styles.containerPortrait : styles.containerLandscape
        }
      >
        <TensorCamera
          ref={cameraRef}
          style={styles.camera}
          autorender={AUTO_RENDER}
          type={cameraType}
          // tensor related props
          resizeWidth={getOutputTensorWidth()}
          resizeHeight={getOutputTensorHeight()}
          resizeDepth={3}
          rotation={getTextureRotationAngleInDegrees()}
          onReady={handleCameraStream}
        />

        {
          isFocused ? (
            renderPose()
          ) : null
        }
        {renderFps()}
        {renderCameraTypeSwitcher()}
        {
          posDetected ? (
            renderMessageBox(posTitle, posMessage, posBtnMsg)
          ) : null
        }
        {
          calibBtn ? (
            renderMessageBox(calibTitle, calibMsg, calibBtnMsg)
          ) : null
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  containerPortrait: {
    position: 'relative',
    width: CAM_PREVIEW_WIDTH,
    height: CAM_PREVIEW_HEIGHT,
    marginTop: Dimensions.get('window').height / 2 - CAM_PREVIEW_HEIGHT / 2 -75,
  },
  containerLandscape: {
    position: 'relative',
    width: CAM_PREVIEW_HEIGHT,
    height: CAM_PREVIEW_WIDTH,
    marginLeft: Dimensions.get('window').height / 2 - CAM_PREVIEW_HEIGHT / 2,
  },
  loadingMsg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '120%',
    height: '120%',
    zIndex: 1,
  },
  svg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 30,
  },
  fpsContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 80,
    alignItems: 'center',
    // backgroundColor: 'rgba(255, 255, 255, .4)',
    borderRadius: 2,
    padding: 8,
    zIndex: 200,
  },
  cameraTypeSwitcher: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 50,
    alignItems: 'center',
    // backgroundColor: 'rgba(255, 255, 255, .4)',
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
  messageBox: {
    position: 'absolute',
    top: CAM_PREVIEW_HEIGHT/2 - 75,
    right: '10%',
    left: '10%',
    width: '80%',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .9)',
    borderRadius: 15,
    padding: 10,
    zIndex: 400,
  },
  whiteBg: {
    backgroundColor: 'white',
    position: 'absolute',
    top: '-50%',
    width: '1020%',
    height: '5120%',
    justifyContent: 'center',
    alignItems: "center",
  },
  blurBg: {
    position: 'absolute',
    top: '-50%',
    width: '2000%',
    height: '5120%',
    justifyContent: 'center',
    alignItems: "center",
  },
  reminderText: {
    color: 'black', 
    zIndex: 100, 
    fontSize: 20,
    justifyContent: 'center',
    left: '21%'
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: "center",
    flex: 1,
    width: 300,
    left: -150,
  },
  inputPrompt: {
    width: '95%',
    height: 150,
    // backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: "center",
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, .7)',
  },
  reminderBtn: {
    width: '35%',
    color: '#44c8a4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '90%',
  },
  subBtns: {
    width: '35%'
  },
  slider : {
    width: 250,
  }
});

