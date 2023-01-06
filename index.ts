// ------------ CONFIGURATION AND IMPORTS -------------

"use strict";
import { InfluxDB, Point } from "@influxdata/influxdb-client";

const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT; // env variables should be instanciate in .env
const url: string = process.env.INFLUX_URL!;
const token: string = process.env.INFLUX_TOKEN!;
const bucket: string = process.env.INFLUX_BUCKET!;
const org: string = process.env.INFLUX_ORG!;

// ------------ END CONFIGURATION AND IMPORTS -------------

// ------------ TEST API RUN -------------

app.listen(port, () => {
  console.log(`API node run on port ${port}`);
});

// ------------ API ROUTE TEMPERATURE -------------

app.post("/api/temperature", (req: any, res: any) => {
  let request = "";
  req.on("data", (buffer: any) => {
    request += buffer;
  });
  req.on("end", () => {
    const trame = JSON.parse(request);
    const code = parseInt("0x" + trame.data.substr(0, 2));
    const value = parseInt("0x0" + trame.data.substr(2, 4));
    var finalValuetemp = value / 10;
    if (trame.data.length > 6) {
      let alert = 0;
      alert = parseInt("0x" + trame.data.substr(6, 4));
      var finalValuetemp = alert / 10;
    }
    // ------------ WRITE DATA WITH CLIENT API NODE.JS INFLUXDB -------------
    const influxDB = new InfluxDB({ url, token });
    const writeApi = influxDB.getWriteApi(org, bucket);
    writeApi.useDefaultTags({ region: "west" });
    const pointTemp = new Point("temperature")
      .tag("sensor_temp", "TLM01")
      .floatField("temperature", finalValuetemp); //get temperature value from temperature.js
    console.log(` ${pointTemp}`);
    writeApi.writePoint(pointTemp);
    // ------------ END WRITE DATA WITH CLIENT API NODE.JS INFLUXDB -------------
  });
});

// ------------  API ROUTE HUMIDITY -------------

app.post("/api/humidity", (req: any, res: any) => {
  let request = "";
  req.on("data", (buffer: any) => {
    request += buffer;
  });
  req.on("end", () => {
    const trame = JSON.parse(request);
    const code = parseInt("0x" + trame.data.substr(0, 2));
    const value = parseInt("0x0" + trame.data.substr(2, 4));
    var finalValueHum = value / 10;
    if (trame.data.length > 6) {
      let alert = 0;
      alert = parseInt("0x" + trame.data.substr(6, 4));
      var finalValueHum = alert / 10;
    }
    // ------------ WRITE DATA WITH CLIENT API NODE.JS INFLUXDB -------------
    const influxDB = new InfluxDB({ url, token });
    const writeApi = influxDB.getWriteApi(org, bucket);
    writeApi.useDefaultTags({ region: "west" });
    const pointTemp = new Point("humidity")
      .tag("sensor_hum", "TLM02")
      .floatField("humidity", finalValueHum); //get humidity value from temperature.js
    console.log(` ${pointTemp}`);

    writeApi.writePoint(pointTemp);
    writeApi.close().then(() => {
      console.log("WRITE FINISHED");
    });
    // ------------ END WRITE DATA WITH CLIENT API NODE.JS INFLUXDB -------------
  });
});
