import React, { useContext, useState } from 'react';
import { StyleSheet, Dimensions, ScrollView, ImageBackground, Platform, Image, Touchable} from 'react-native';
import { Block, Text, Card, theme } from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '../components';
import { Images, materialTheme } from '../constants';
import { HeaderHeight } from "../constants/utils";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore"; 
import { app, db } from './firebase'

import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;
const stats = [
  {
    name: '  Tilted like Piza',
    score: '  129 pts'
  },
  {
    name: '  Straight like Tim Cooks',
    score: '  59 pts'
  },
  {
    name: '  Straight back for 30 minutes',
    score: '  Gold'
  }
]

function Profile() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('')

  const auth = getAuth(app);
  onAuthStateChanged(auth, async (user) => {
    if (user.email) {
      try {
        const request = await getDoc(doc(db, "account-data", '' + user.email))
        setUsername(request.data().username)
      } catch (err) {
        alert(err)
      }
    }
  })
  
  return (
    <Block flex style={styles.profile}>
      <Block flex>            
        <ImageBackground
          source={{uri: Images.Profile}}
          style={styles.profileContainer}
          imageStyle={styles.profileImage}>
          <TouchableOpacity onPress={() => { navigation.navigate('Settings')}}>
            <Image
              source={require('../assets/icons/icn_4.png')}
              style={styles.settings}
            />
          </TouchableOpacity>

          <Block flex style={styles.profileDetails}>
            <Block style={styles.profileTexts}>
              <Text color="white" size={28} style={{ paddingBottom: 8 }}> {username}</Text>
              <Block row space="between">
                <Block row>
                  <Block middle style={styles.pro}>
                    <Text size={16} color="white">Pro</Text>
                  </Block>
                  <Text color="white" size={16} muted style={styles.seller}>Seller</Text>
                  <Text size={16} color={materialTheme.COLORS.WARNING}>
                    4.8 <Icon name="shape-star" family="GalioExtra" size={14} />
                  </Text>
                </Block>
                <Block>
                  <Text color={theme.COLORS.MUTED} size={16}>
                    <Icon name="map-marker" family="font-awesome" color={theme.COLORS.MUTED} size={16} />
                    </Text>
                </Block>
              </Block>
            </Block>
            <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']} style={styles.gradient} />
          </Block>
        </ImageBackground>
      </Block>
      <Block flex style={styles.options}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Block row space="between" style={{ padding: theme.SIZES.BASE, }}>
            <Block middle>
              <Text bold size={12} style={{marginBottom: 8}}>36</Text>
              <Text muted size={12}>Level</Text>
            </Block>
            <Block middle>
              <Text bold size={12} style={{marginBottom: 8}}>5</Text>
              <Text muted size={12}>Friends</Text>
            </Block>
            <Block middle>
              <Text bold size={12} style={{marginBottom: 8}}>2</Text>
              <Text muted size={12}>Super friends</Text>
            </Block>
          </Block>
          <Block row space="between" style={{ paddingVertical: 16, alignItems: 'baseline' }}>
            <Text size={16}>Your funniest achievements</Text>
          </Block>
            {
            stats.map((u, i) => {
              return (
                <Card
                  flex
                  shadow
                  title= {u.name}
                  caption= {u.score}
                  avatar='https://cdn-icons-png.flaticon.com/512/1378/1378582.png'
                />
                );
              })
            }
        </ScrollView>
      </Block>
    </Block>
  );
}

export default Profile

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    marginBottom: -HeaderHeight * 2,
  },
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
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    borderRadius: 4,
    height: 19,
    width: 38,
  },
  seller: {
    marginRight: theme.SIZES.BASE / 2,
  },
  options: {
    position: 'relative',
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: -theme.SIZES.BASE * 7,
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
  }
});

