const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
} = require("firebase/firestore");
const firebaseConfig = {
  apiKey: "AIzaSyA-4_5rHvcMOh3iY4PttN4l29iGXRDiFPI",
  authDomain: "shopee-8710c.firebaseapp.com",
  databaseURL: "https://shopee-8710c.firebaseio.com",
  projectId: "shopee-8710c",
  storageBucket: "shopee-8710c.appspot.com",
  messagingSenderId: "708925055871",
  appId: "1:708925055871:web:10676d6c233e816aca304a",
};

const app = initializeApp(firebaseConfig);
const db2 = getFirestore(app);
const request = require("request");

exports.test = async () => {
  // pdf2base64("./doc1.pdf")
  // .then(
  //     (response) => {
  //         console.log(`data:application/pdf;base64,${response}`); //cGF0aC90by9maWxlLmpwZw==
  //     }
  // )
  // .catch(
  //     (error) => {
  //         console.log(error); //Exepection error....
  //     }
  // )
};

exports.pushTransection = async (topic, message) => {
  try {
    // let numberOfElements = await db.count(`/transaction/${userid}`);

    let date = NOW();
    var ch_data = query(
      collection(db2, "smartDoc"),
      where("userID", "==", "000"),
      where("date", "==", date)
    );
    const ch_dataSnapshot = await getDocs(ch_data);
    const ch_dataList = ch_dataSnapshot.docs.map(function (doc) {
      return doc.data();
    });
    console.log(ch_dataList.length);
    
    if (ch_dataList.length > 0) {
      if (topic == "C") {
      } else if (topic == "O2") {
      } else if (topic == "heartRate") {
      } else if (topic == "weight") {
      }
      var docID;
      ch_dataSnapshot.forEach( (doc) => {
        // doc.data() is never undefined for query doc snapshots
        docID=doc.id.toString();
        console.log(doc.id.toString(), " => ", doc.data());
      });
      const smartDocRef = doc(db2, "smartDoc", docID);
      var obj = new Object();
      obj[topic] = message;
      console.log(obj);
      await updateDoc(smartDocRef, obj);
    } else {
      var obj = {
        userID: "000",
        C: 0,
        O2: 0,
        heartRate: 0,
        weight: 0,
        date: date,
      };
      // db.push(`/transaction/${userid}[]`,obj);
      // await db.save();
      const smartDoc = collection(db2, "smartDoc");
      await addDoc(smartDoc, obj);
    }

    return true;
  } catch (error) {
    console.error(error);
    return error;
  }
};
exports.get = async (req, res) => {
  try {
    var smartDoc = query(collection(db2, "smartDoc"), orderBy("date"));

    const smartDocSnapshot = await getDocs(smartDoc);
    const smartDocList = smartDocSnapshot.docs.map(function (doc) {
      return doc.data();
    });

    // var data=await db.getData(`/transaction/${userid}`);
    console.log(smartDocList);
    res.json(smartDocList);
    return smartDocList;
  } catch (error) {
    console.error(error);
    return error;
  }
};
exports.getbyid = async (req, res) => {
  try {
    var userid =req.body.userid;
    var date =req.body.date;
    var smartDoc = query(collection(db2, "smartDoc"),where("userid", "==", userid), where("userid", "==", date),orderBy("date"));

    const smartDocSnapshot = await getDocs(smartDoc);
    const smartDocList = smartDocSnapshot.docs.map(function (doc) {
      return doc.data();
    });

    // var data=await db.getData(`/transaction/${userid}`);
    console.log(smartDocList);
    res.json(smartDocList);
    return smartDocList;
  } catch (error) {
    console.error(error);
    return error;
  }
};
exports.getF = async (req, res) => {
  try {
    var smartDoc = query(collection(db2, "FinD"), orderBy("userid"));

    const smartDocSnapshot = await getDocs(smartDoc);
    const smartDocList = smartDocSnapshot.docs.map(function (doc) {
      return doc.data();
    });
    var counts = smartDocList.reduce((p, c) => {
      var name = c.userid;
      if (!p.hasOwnProperty(name)) {
        p[name] = 0;
      }
      p[name]++;
      return p;
    }, {});

    console.log(counts);

    var countsExtended = Object.keys(counts).map((k) => {
      return { name: k, count: counts[k] };
    });

    console.log(countsExtended);
    // var data=await db.getData(`/transaction/${userid}`);
    countsExtended.sort((a,b) => a.count - b.count);
    console.log(countsExtended);
    res.json(countsExtended);


    let headers = {
      "Content-Type": "application/json",
      Authorization:
        "Bearer BrNPhLaaBLY8PfG8xGXQx5xMqHORaVg3ZmBDywQlCofl/FsnRD4L4u4GoxJ55oS7AievR0UahaEY2l5C9BGBeG9ZpeAOYuW+XR3eDQm/0QYYEyU85amf9m5pLNrgEFJL7wASC+mnghEQpXdlRYTNjgdB04t89/1O/w1cDnyilFU=",
    };
    // let body = JSON.stringify({
    //   replyToken: reply_token,
    //   messages: [
    //     {
    //       type: "text",
    //       text: msg,
    //     },
    //   ],
    // })
    return smartDocList;
  } catch (error) {
    console.error(error);
    return error;
  }
};
function NOW() {
  var d = new Date();
  var date = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  var aaaa = date.getUTCFullYear();
  var gg = date.getUTCDate();
  var mm = date.getUTCMonth() + 1;

  if (gg < 10) gg = "0" + gg;

  if (mm < 10) mm = "0" + mm;

  var cur_day = aaaa + "-" + mm + "-" + gg;

  return cur_day;
}
