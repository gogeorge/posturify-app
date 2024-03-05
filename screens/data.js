import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 
import { app, db } from './firebase'

const data = [];

var right = 0
var left = 0
var shoulders = 0
var forward = 0

const getDbData = async () => {
  const auth = getAuth(app);
  if (auth.currentUser) {
    try {
      const request = await getDoc(doc(db, "account-data", '' + auth.currentUser.email))
      let pd = request.data().postureData
      for (let i = 0; i < pd.length; i++) {
        if (pd[i].includes('right')) right++
        if (pd[i].includes('left')) left++
        if (pd[i].includes('shoulders')) shoulders++
        if (pd[i].includes('forward')) forward++
      }
    } catch (err) {
      alert(err)
    }
  }
  
  const total = left + right + shoulders + forward

  data.push({
    value: right/total,
    color: '#44c8a4',
  });
  data.push({
    value: left/total,
    color: '#3d99b4',
  });
  data.push({
    value: shoulders/total,
    color: '#44aac8',
  });
  data.push({
    value: forward/total,
    color: '#2c9477',
  });
  // data.push({
  //   value: (1 - right/total + left/total + shoulders/total + forward/total)/total,
  //   color: '#2c9477',
  // });
}

export const generatePieChartData = () => {
  getDbData()
  return data;
};