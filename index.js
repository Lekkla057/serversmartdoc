const express = require("express");
// const { handleGenerateRequest,handleGenerateRequestLine } = require("./generateContent");
const bodyParser = require("body-parser");
const request = require("request");
const cors = require("cors");

require("dotenv").config();
const {
  checkUser,
  pushTransection,
  get,
  test,
  getF,
  getbyid,
} = require("./database");
const app = express();
//
app.use(express.static("public"));
// app.use('/pdfs', express.static('pdfs'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;
var mqtt = require("mqtt");

const MQTT_SERVER = "broker.hivemq.com";
const MQTT_PORT = "1883";
//if your server don't have username and password let blank.
const MQTT_USER = "";
const MQTT_PASSWORD = "";

// Connect MQTT
var client = mqtt.connect({
  host: MQTT_SERVER,
  port: MQTT_PORT,
  username: MQTT_USER,
  password: MQTT_PASSWORD,
});

client.on("connect", function () {
  // Subscribe any topic
  console.log("MQTT Connect");
  client.subscribe("c", function (err) {
    if (err) {
      console.log(err);
    }
  });
  client.subscribe("O2", function (err) {
    if (err) {
      console.log(err);
    }
  });
  client.subscribe("heartRate", function (err) {
    if (err) {
      console.log(err);
    }
  });
  client.subscribe("weight", function (err) {
    if (err) {
      console.log(err);
    }
  });
});

// Receive Message and print on terminal
client.on("message", function (topic, message) {
  // message is Buffer
  pushTransection(topic, message.toString());
  console.log(message.toString());
});

app.get("/", (req, res) => {
  res.send("Node.js and Google Gem ini integration example");
  // pushTransection(d++,"add",50);
  // get(1);
  // test()
});
app.get("/test", get);
app.post("/testbyid", getbyid);

app.get("/testF", getF);
app.post("/test", pushTransection);
// app.post('/webhook', handleGenerateRequestLine);
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
