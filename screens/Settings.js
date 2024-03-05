import React from 'react';
import { StyleSheet, Dimensions, ScrollView, View, Image, ImageBackground, TextInput} from 'react-native';
import { Block, Text, Button, Input, theme } from 'galio-framework';
import { Images, materialTheme } from '../constants';

import { TouchableOpacity } from 'react-native-gesture-handler';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateDoc, getDoc, doc } from "firebase/firestore"; 
import { app, doc } from './firebase'

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;


export default class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef();
    this.state = {
      filepath: {
        data: '',
        uri: ''
      },
      fileData: '',
      fileUri: '',
      currentUsername: '',
      username: '',
      password: '',
      changes: false,
      getUser: false,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      console.log('before cuser: ' + this.state.currentUsername)
      this.getUsername()    }, 2000);
      console.log('after cuser: ' + this.state.currentUsername)

  }

  
  launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log('response', JSON.stringify(response));
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri
        });
      }
    });
  }

  handleNewUsername(username) { 
    console.log('hnu: ' + this.state.changes)
    this.setState({changes: true, username: username})
  }

  handleChanges() {
    // let c = this.inputRef?.current?.value
    console.log('hc: ' + this.state.changes)
    const auth = getAuth(app);
    const update = doc(db, "account-data", auth.currentUser.email);
    updateDoc(update, {
      username: this.state.username
    });      
    // this.setState({changes: false})
  }

  getUsername() {
    console.log('gu: ' + this.state.changes)
    const auth = getAuth(app);
    onAuthStateChanged(auth,async (user) => {
      if (user.email) {
        try {
          const request = await getDoc(doc(db, "account-data", '' + user.email))
          this.setState({
            currentUsername: request.data().username
          });
          return <Text>{ request.data().username }</Text>
          console.log(request.data().username)
        } catch (err) {
          alert(err)
        }
      }
    })
  }
  render() {
    return (
      <Block flex style={styles.profile}>
        <ImageBackground
          source={{uri: Images.Profile}}
          style={styles.profileContainer}
          imageStyle={styles.profileImage}
          blurRadius={4}
          >
          <TouchableOpacity style={styles.profPicContainer} onPress={() => { navigation.navigate('Settings')}}>
            <Image
              source={{uri: Images.Profile}}
              style={styles.profPic}
            />
          </TouchableOpacity>
          <View style={[styles.profPicText, {marginTop: 85}]}>
            <TouchableOpacity onPress={this.launchImageLibrary}>
              <Image
                source={require('../assets/icons/add-icon.png')}
                style={styles.addProfPic}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <Block flex style={styles.options}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Block row space="between" style={{ paddingVertical: 16, alignItems: 'baseline' }}>
              <Text size={16}>Profile Settings</Text>
            </Block>
            <Block card style={styles.card}>
              <Text style={{left: -15}}>Username    </Text>
              <Input 
                borderless
                style={styles.usernameInput}
                onChangeText={username => { this.handleNewUsername(username) }}
                >
                <Text style={{color: 'black', fontSize: 14}}>
                { this.state.currentUsername != null ? this.getUsername() : 'err '}
                </Text>
              </Input>
            </Block>
            <Block card style={styles.card}>
              <Text style={{left: -15}}>Password    </Text>
              <Input 

                borderless
                password
                style={styles.usernameInput}
                ><Text style={{color: 'black', fontSize: 14}}>dontlookhere</Text></Input>
            </Block>
            {
              true ? (
                <Button
                  shadowless
                  style={styles.button}
                  color={materialTheme.COLORS.BUTTON_COLOR}
                  onPress={this.handleChanges()}
                 >
                  Save Changes
                </Button>
              ) : null
            }

          </ScrollView>
        </Block>
      </Block>
    )
  };
}

const styles = StyleSheet.create({
  settings: {
    marginTop: 8,
    left: width - 29,
    width: 22,
    height: 22 
  },
  profileImage: {
    width: width * 1.1,
    height: 'auto',
  },
  profileContainer: {
    width: width,
    height: height / 2,
  },
  profileDetails: {
    paddingTop: theme.SIZES.BASE * 4,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  profileTexts: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
    zIndex: 2
  },
  options: {
    position: 'relative',
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: -theme.SIZES.BASE * 13,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
    position: 'absolute',
  },
  card: {
    position: 'absolute',
    display: 'flex',
  },
  profPicText: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  profPicContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 100,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
  },
  addProfPic: {
    top: -55,
    left: 25, 
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profPic: {
    width: 125,
    height: 125,
    borderRadius: 100,
  },
  usernameInput: {
    height: 35,
    backgroundColor: 'transparent',
    color: 'red'
  },
  body: {
    paddingVertical: theme.SIZES.BASE / 3,
    flexDirection: 'row',
    alignItems: 'center'
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    // width: '90%',
    // left: 0.05*width
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    borderRadius: 10,
    left: -8
  },

});
