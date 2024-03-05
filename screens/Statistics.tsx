
import { Chart, Area, Line, Tooltip } from 'react-native-responsive-linechart';
import theme from '../constants/Theme'
import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
import {Donut} from 'react-native-donut-chart';

import {generatePieChartData} from './data';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 
import { app, db } from './firebase'

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

var data: any = []
const Statistics = () => {
  const [currentUser, setCurrentUser] = useState('')
  const [dbLoaded, setDbLoaded] = useState(false)
  const generatedData = generatePieChartData();

  var dbData: any = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 6, y: 0 },
    { x: 7, y: 0 },
    { x: 8, y: 0 },
    { x: 9, y: 0 }
  ]
  var dayArrays: any = []
  setInterval(async () => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser('' + user.email)
    });
    if (currentUser) {
      try {
        const request = await getDoc(doc(db, "account-data", '' + currentUser))
        let pd = request.data().postureData
        dbData[0].y = 0
        dbData[0].y = 0
        dbData[1].y = 0 
        dbData[2].y = 0
        dbData[3].y = 0
        dbData[4].y = 0
        dbData[5].y = 0
        dbData[6].y = 0

        for (let i = 0; i < pd.length; i++) {
          if (pd[i].includes('Mon')) { dbData[0].y += 1; dayArrays.push(dbData[0].y); }
          if (pd[i].includes('Tue')) { dbData[1].y += 1; dayArrays.push(dbData[1].y); }
          if (pd[i].includes('Wed')) { dbData[2].y += 1; dayArrays.push(dbData[2].y); }
          if (pd[i].includes('Thu')) { dbData[3].y += 1; dayArrays.push(dbData[3].y); }
          if (pd[i].includes('Fri')) { dbData[4].y += 1; dayArrays.push(dbData[4].y); }
          if (pd[i].includes('Sat')) { dbData[5].y += 1; dayArrays.push(dbData[5].y); }
          if (pd[i].includes('Sun')) { dbData[6].y += 1; dayArrays.push(dbData[6].y); }
        }  
        setDbLoaded(true)
      } catch (err) {
        alert(err)
      }
    }
  }, 2000)
  return (
    <View>
      {
        dbLoaded ? (
    <View>
    <Chart
      style={{ height: 200, width: '100%' }}
      data={dbData}
      padding={{ left: 5, bottom: 20, right: -115, top: 20 }}
      xDomain={{ min: 0, max: 12 }}
      yDomain={{ min: -4, max: 150}}
    >
      <Area theme={{ gradient: { from: { color: theme.COLORS.PRIMARY, opacity: 0.5 }, to: { color: theme.COLORS.PRIMARY, opacity: 0 } } }} />
      <Line
        initialTooltipIndex={3}
        hideTooltipOnDragEnd
        // hideTooltipAfter={750}
        smoothing="cubic-spline"
        tooltipComponent={<Tooltip theme={{
          shape: { 
              width: 95, 
              height: 35, 
              color: theme.COLORS.PRIMARY,
              opacity: 0.3}, 
          formatter: (v) => days[v.x % 6] + ": " + v.y
          }}/>}
        theme={{
          stroke: { color: theme.COLORS.PRIMARY, width: 4 },
          scatter: { default: { width: 6, height: 6, rx: 4, color: theme.COLORS.PRIMARY }, selected: { color: theme.COLORS.ACTIVE } },
        }}
      />
    </Chart>
    <View style={styles.keyContainer}>
      <Donut data={[
      {
        value: generatedData[0].value,
        color: generatedData[0].color,
      },
      {
        value:  generatedData[1].value,
        color: generatedData[1].color,
      }, {
        value: generatedData[2].value,
        color: generatedData[2].color,
      }, {
        value: generatedData[3].value,
        color: generatedData[3].color,
      }
    ]}/>
      </View>
    <View style={styles.keyContainer}>
      <View style={{flexDirection: "row", paddingBottom: 5}}>
        <View style={[{backgroundColor: '#44c8a4'}, styles.key]}></View>
        <Text>  Titled to the left</Text>
      </View>
      <View style={{flexDirection: "row", paddingBottom: 5}}>
        <View style={[{backgroundColor: '#3d99b4'}, styles.key]}></View>
        <Text>  Titled to the right</Text>
      </View>
      <View style={{flexDirection: "row", paddingBottom: 5}}>
        <View style={[{backgroundColor: '#44aac8'}, styles.key]}></View>
        <Text>  Tilted shoulders</Text>
      </View>
      <View style={{flexDirection: "row"}}>
        <View style={[{backgroundColor: '#2c9477'}, styles.key]}></View>
        <Text>  Forward  </Text>
      </View>
    </View>
  </View>
        ) : <View style={styles.loadingMsg}><ActivityIndicator/></View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  loadingMsg: {
    marginTop: 300,
    marginLeft: 0,
    justifyContent: 'center',
  },
  titleStyle: {
    alignSelf: 'center',
    paddingBottom: 20,
    fontSize: 18,
    fontWeight: '700',
  },
  rotate: {
    transform: [{rotateZ: '-90deg'}],
    top: 50,
    alignSelf: 'center',
  },
  buttonWrap: {marginTop: 20},
  key: {
    width: 25,
    height: 16,
    borderRadius: 16/2,
  },
  keyContainer: {
    alignSelf: 'center',
    top: 80,
    padding: 20
  }
});

export default Statistics;
