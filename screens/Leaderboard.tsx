import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, ScrollView, View, SafeAreaView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
import { Icon, ThinCard, Search } from '../components/';

import { getDocs, query, collection } from "firebase/firestore"; 
import { FlatList } from 'react-native-gesture-handler';
import { db } from './firebase'


const { width, height } = Dimensions.get('screen');

export default function Leaderboard() {
  const [refreshing, setRefreshing] = useState(true);
  const [users, setUsers] = useState([''])
  const [showSearchList, setShowSearchList] = useState(false)
  const [input, setInput] = useState('')
  let usersList = []
  let postureCountList = []
  let counter = 0

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    let postureCount = 0
    const querySnap = await getDocs(query(collection(db, "account-data")))
    querySnap.forEach(doc => {
        if (doc.data().postureData != null) {
          postureCount = (doc.data().postureData.filter(x => x.includes('normal')).length / doc.data().postureData.length) * 100;
        } else {
          postureCount = 0
        }

        usersList.push(doc.data())
        postureCountList.push(postureCount)

    });
   sortUsers(usersList, postureCountList)
  };

  const sortUsers = (ulist, plist) => {
    let postureCountListSorted = plist.slice().sort((a, b) => a - b).reverse()
    let usersListSorted = []
    for (let i = 0; i < plist.length; i++) {
      if (postureCountListSorted[i] != 0.0) {
        let index = plist.indexOf(postureCountListSorted[i]) 
        usersListSorted.push(ulist[index])
      }
    }
    setUsers(usersListSorted)
    setRefreshing(false)
  }

  const ItemView = ({ item }) => {
    let postureCount = 0
    if (item.postureData != null) {
        postureCount = (item.postureData.filter(x => x.includes('normal')).length / item.postureData.length) * 100;
    }
    counter++
    let updownArr = ['true', 'false', 'true']
    return (
      <Block flex column>
        <ThinCard product={{
          title: item.username, 
          image: 'https://source.unsplash.com/dS2hi__ZZMk/840x840', 
          stat: postureCount.toFixed(1) + '%', 
          count: counter,
          triangle: updownArr[counter-1]  }} horizontal />
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

  const renderSearch = () => {
    const iconCamera = <Icon size={16} color={theme.COLORS.MUTED} name="zoom-in" family="material" />
    const iconCancel = 
    <TouchableOpacity onPress={() => setShowSearchList(false)}>
      <Icon size={16} color={theme.COLORS.MUTED} name="cancel" family="material" />
    </TouchableOpacity>

    return (
      <View style={{width: width, height: height - 150, position: 'absolute'}}>
        <Input
          right
          color="black"
          style={styles.search}
          iconContent={showSearchList ? iconCancel: iconCamera}
          placeholder="Search employees..."
          // onFocus={handleSearch}
          onChangeText={(text) => {
            setShowSearchList(true)
            setInput(text)
          }}
        />

        {
          showSearchList && input.length > 5 ? (
            <Search input={input}/>
          ) : null
        }
      </View>

    )
  }


  const renderTabs = () => {
    return (
      <Block row style={styles.tabs}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon name="" family="feather" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>Friends</Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon size={16} name="" family="GalioExtra" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>Global</Text>
          </Block>
        </Button>
      </Block>
    )
  }

  return (
     <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
      {renderSearch()}
      { !showSearchList ? (renderTabs()) : null }
      {refreshing ? <ActivityIndicator /> : null}
      {
        !showSearchList ? (
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
        ) : null
      }

        
      </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    top: 0
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 70,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 0,
    borderWidth: 0,
    height: 15,
    left: -15,
    elevation: 0,
  },
  tabTitle: {
    // lineHeight: 19,
    fontWeight: '300'
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    // paddingVertical: 55,
    marginTop: -55
  },
});
