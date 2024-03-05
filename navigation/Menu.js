import React, { useState } from "react";
import { TouchableWithoutFeedback, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { useSafeArea } from "react-native-safe-area-context";
import { Drawer as DrawerCustomItem } from '../components/';
import { materialTheme } from "../constants/";
import { app, db } from './firebase'
import { getDoc, doc } from "firebase/firestore"; 


function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const [currentUser, setCurrentUser] = useState('')
  const [userName, setUsername] = useState('')

  const [userType, setUserType] = useState('')
  const auth = getAuth(app);
  onAuthStateChanged(auth,async (user) => {
    if (user) {
      setCurrentUser(user.email)
      const request = await getDoc(doc(db, "account-data", '' + user.email))
      setUsername(request.data().username)
      getUserType()
    } else {
      // User is signed out
      // ...
    }
  });
  const getUserType = async () => {
    await getDoc(doc(db, "account-data", '' + currentUser)).then((req) => {
      setUserType('' + req.data().type)
    })
  } 
  const insets = useSafeArea();
  const screens = [
    "Home",
    "Profile",
    "Leaderboard",
    "Statistics",
    // "Settings"
  ];
  const screensBusiness = [
    "Dashboard",
    "Profile",
    "Statistics",
    "Settings"
  ];
  console.log(userName)
  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
        <Block flex={0.25} style={styles.header}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("Profile")}
          >
            <Block style={styles.profile}>
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              <Text h5 color={"white"}>
                {userName}
              </Text>
            </Block>
          </TouchableWithoutFeedback>
          <Block row>
            <Block middle style={styles.pro}>
              <Text size={16} color="white">
                {profile.plan}
              </Text>
            </Block>
            <Text size={16} muted style={styles.seller}>
              {profile.type}
            </Text>
            <Text size={16} color={materialTheme.COLORS.WARNING}>
              {profile.rating}{" "}
            </Text>
          </Block>
        </Block>
        <Block flex style={{ paddingLeft: 7, paddingRight: 14 }}>
          <ScrollView
            contentContainerStyle={[
              {
                paddingTop: insets.top * 0.4,
                paddingLeft: drawerPosition === "left" ? insets.left : 0,
                paddingRight: drawerPosition === "right" ? insets.right : 0
              }
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* NOT WORKING */}
            {
              userType == 'business' ? (
                screensBusiness.map((item, index) => {
                  return (
                    <DrawerCustomItem
                      title={item}
                      key={index}
                      navigation={navigation}
                      focused={state.index === index ? true : false}
                    />
                  );
                })
              ) : (
                screens.map((item, index) => {
                  return (
                    <DrawerCustomItem
                      title={item}
                      key={index}
                      navigation={navigation}
                      focused={state.index === index ? true : false}
                    />
                  );
                })
              )
  
            
            }
          </ScrollView>
        </Block>
        <Block flex={0.3} style={{ paddingLeft: 7, paddingRight: 14, top: 75}}>
      <TouchableOpacity style={{ height: 55 }} onPress={() => {navigation.navigate('Onboarding')}}>
        <Block
          flex
          row
          style={[
            styles.defaultStyle,
            // focused ? [styles.activeStyle, styles.shadow] : null
          ]}
        >
          <Block middle flex={0.1} style={{ marginRight: 28}}>
          <Image
          source={require('../assets/icons/sign-in.png')}
          style={{ left: 10, height: 25, width: 25 }}
        />
        {/* door arrow image */}
          </Block>
          <Block row center flex={0.9}>
            <Text
              size={18}
              color="black"
            >
              Log out
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
        </Block>
      </Block>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#44c8a4',
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 2,
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 28,
    justifyContent: 'flex-end'
  },
  profile: {
    marginBottom: theme.SIZES.BASE / 2,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: theme.SIZES.BASE / 2,
    top: 10
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: 8,
    borderRadius: 4,
    height: 19,
    width: 38,
  }, 
  seller: {
    marginRight: 16,
  }
});

export default CustomDrawerContent;
