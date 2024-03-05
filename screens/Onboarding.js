import React, { useState } from 'react';
import { ImageBackground, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { Block, Button, Text, theme, Input } from 'galio-framework';
import materialTheme from '../constants/Theme';
import frontPic from '../assets/images/posturify.png';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './firebase'

const { height, width } = Dimensions.get('screen');

export default function Onboarding() {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('');

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser('' + user.email)
          getType()
        }
      });

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  const handleLogin = () => {
    // UNSAFE
    if (currentUser) {
      if (type == 'user') navigation.navigate('App', { screen: 'App' });
      if (type == 'business') navigation.navigate('App', { screen: 'Dashboard' });
    }
  }


  const getType = async () => {
    await getDoc(doc(db, "account-data", '' + currentUser)).then((req) => {
      setType(req.data().type)
    })
  }


  return (
    <Block flex style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Block flex center>
        <ImageBackground
          source= { frontPic }
          style={{ height: height/4, width: width/2, zIndex: 1, marginTop: 50 }}
        />
      </Block>
      <Block flex space="between" style={styles.padded}>
        <Block flex space="around" style={{ zIndex: 2 }}>
          <Block center>
            <Input rounded 
              placeholder='Enter email'
              onChangeText={text => setEmail(text)}></Input>
            <Input rounded 
              placeholder='Enter password' 
              password={true} 
              onChangeText={pass => setPassword(pass)}
              viewPass></Input>
            <Button
              shadowless
              style={styles.button}
              color={materialTheme.COLORS.BUTTON_COLOR}
              onPress={handleLogin}>
              Login
            </Button>
            <Text color='lightgrey' onPress={() => navigation.navigate('App', {screen : 'Sign Up'})}>New here? Click to register</Text>
          </Block>
        </Block>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: 'relative',
    bottom: 250,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
});