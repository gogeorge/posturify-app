import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, ScrollView, View, SafeAreaView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
import { Icon, ThinCard } from '../components/';

import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, query, collection } from "firebase/firestore"; 
import { FlatList } from 'react-native-gesture-handler';
import { app, db } from './firebase'

const { width, height } = Dimensions.get('screen');

const Search = (props) => {
  const [refreshing, setRefreshing] = useState(true);
  const [users, setUsers] = useState([''])
  const [showSearchList, setShowSearchList] = useState(false)

  let usersList = []
  let postureCountList = []
  let counter = 0

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const querySnap = await getDocs(query(collection(db, "account-data")))
    querySnap.forEach(doc => {
      let user = doc.data().username
      let re = new RegExp("\b" + props.input + "\b")
      // make the regex work
      if (user == props.input) {
        usersList.push(doc.data())
      }
    });
    setUsers(usersList)
    setRefreshing(false)
  };

  const ItemView = ({ item }) => {
    let postureCount = 0
    if (item.postureData != null) {
        postureCount = (item.postureData.filter(x => x.includes('normal')).length / item.postureData.length) * 100;
    }
    counter++
    let updownArr = [true, false, true]
    return (
      <Block flex column>
        <ThinCard product={{
          title: item.username, 
          image: 'https://source.unsplash.com/dS2hi__ZZMk/840x840', 
          friendBtn: true
          }} horizontal />
      </Block>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'lightgrey',
          opacity: 0
        }}
      />
    );
  };

  return (
     <SafeAreaView style={styles.searchBlock}>
      {refreshing ? <ActivityIndicator /> : null}
          <FlatList
            data={users}
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

export default Search

const styles = StyleSheet.create({
  searchBlock: {
    width: width * 0.9,
    height: height * 0.9,
    left: width*0.05,
    top: 0,
    backgroundColor: 'white',
  }
});
