import React, { useState, createContext } from 'react';
import { StyleSheet, StatusBar, Dimensions } from 'react-native';
import { Block, Button, Text, theme, Input } from 'galio-framework';
import { getAuth, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { setDoc, doc, collection, getFirestore } from "firebase/firestore"; 
import materialTheme from '../constants/Theme';
import { db } from './firebase'

const { width } = Dimensions.get('screen');


function SignUp({navigation}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userInit = async () => {
    try {
      await setDoc(doc(db, "account-data", '' + email), {
        username: username,
        email: email,
        postureData: [""],
        reminder: [""],
        calibrationHeight: 0,
        intensity: ""
      }).then(() => {
        navigation.navigate('Home');
      });
    } catch (e) {
      console.error("Error adding document: ", e); 
    }
  }

  const handleSignUp = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        userInit();
        updateProfile(auth.currentUser, { displayName: username, photoURL: 'null' })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

  }

  return (
    <Block flex style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Block flex space="between" style={styles.padded}>
        <Block flex space="around" style={{ zIndex: 2 }}>
          <Block center>
            <Input rounded 
              placeholder='Enter username'
              onChangeText={text => setUsername(text)}
              ></Input>
            <Input rounded 
              placeholder='Enter email'
              onChangeText={text => setEmail(text)}
              ></Input>
            <Input rounded placeholder='Enter password' password={true} viewPass></Input>
            <Input rounded 
              placeholder='Repeat password' 
              password={true} 
              onChangeText={text => setPassword(text)}
              viewPass></Input>
            <Button
              shadowless
              style={styles.button}
              color={materialTheme.COLORS.BUTTON_COLOR}
              onPress={handleSignUp}>
              Sign Up
            </Button>
            <Text color='lightgrey' onPress={() => navigation.navigate('Onboarding')}>Already have an account? Click here</Text>
          </Block>
        </Block>
      </Block>
    </Block>
  );
}

export default SignUp

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: 'relative',
    bottom: 175,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
});

