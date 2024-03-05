import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, ScrollView, View, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
import { Icon, ThinCard } from '../components/';

import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, getDoc } from "firebase/firestore"; 
import { FlatList } from 'react-native-gesture-handler';
import { app, db } from './firebase'


const { width } = Dimensions.get('screen');

export default function ManageEmployees() {
  const [refreshing, setRefreshing] = useState(true);
  const [employees, SetEmployees] = useState([''])
  const [currentUser, setCurrentUser] = useState('')

  const auth = getAuth(app);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user.email)
        await getDoc(doc(db, "account-data", '' + user.email)).then((req) => {
          const empl = req.data().employees
          SetEmployees(empl)
          setRefreshing(false);
        })
      }
    })
  };

  const ItemView = ({ item }) => {
    let count = 5
    return (
      <Block flex column>
        <ThinCard product={{title: item, image: 'https://source.unsplash.com/dS2hi__ZZMk/840x840', stat: '-', count }} horizontal />
      </Block>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View/>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
        {refreshing ? <ActivityIndicator /> : null}
        <FlatList
          data={employees}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          enableEmptySections={true}
          renderItem={ItemView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadUserData} />
          }
        />
    </SafeAreaView>
  );
}
