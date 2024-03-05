import React, { useState } from 'react';
import { ImageBackground, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { Block, Button, Text, theme, Input } from 'galio-framework';
import materialTheme from '../constants/Theme';
import frontPic from '../assets/images/posturify.png';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, getDoc, updateDoc } from "firebase/firestore"; 
import { useNavigation } from '@react-navigation/native';
import { app, db } from './firebase'


const { height, width } = Dimensions.get('screen');

export default function SetReminders() {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState('')
  const [reminder, setReminder] = useState('');
  const [dmReminder, seDmReminder] = useState('');
  const [employees, setEmployees] = useState('');

  const handleSend = async () => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser('' + user.email)
    });

    if (currentUser) {
      await getDoc(doc(db, "account-data", currentUser)).then((req) => {
        setEmployees(req.data().employees)
      })
  
      await getDoc(doc(db, "account-data", currentUser)).then((req) => {
        employees.forEach(async empl => {
          await getDoc(doc(db, "account-data", empl)).then((req) => {
            let reminders = req.data().reminder
            reminders.push(reminder + '\n')
            const update = doc(db, "account-data", empl);
            updateDoc(update, {
              reminder: reminders
            });
          })

        })
      });
    }
  }


  return (
    <Block flex style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Block flex center>
      </Block>
      <Block flex space="between" style={styles.padded}>
        <Block flex space="around" style={{ zIndex: 2 }}>
          <Block center>
            <Text>Set Global Reminder</Text>
            <Input rounded 
              placeholder='Enter reminder'
              onChangeText={text => setReminder(text)}></Input>
            <Button
              shadowless
              style={styles.button}
              color={materialTheme.COLORS.BUTTON_COLOR}
              onPress={handleSend}>
              Send
            </Button>
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