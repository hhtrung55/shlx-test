const express = require("express");
const app = express();
const port = 5000;
const io = require("socket.io");

const DISTANCES_EVENT = "DISTANCES";
const EXAM_RESULT = "EXAM_RESULT";

const INTERVAL_TIME = 50 //ms
const SECONDS_TO_MS = 1000

const MAX_TIME = 20 * 60 * 1000 // 20 minutes

const data = [
  { time: 0, name: "XUAT_PHAT", event: "VAO_BAI", score: 100 },
  { time: 11, name: "XUAT_PHAT", event: "HET_BAI", score: 100 },
  { time: 25, name: "DUNG_VACH_DI_BO", event: "VAO_BAI", score: 100 },
  { time: 41, name: "DUNG_VACH_DI_BO", event: "HET_BAI", score: 100 },
  { time: 62, name: "DUNG_NGANG_DOC", event: "VAO_BAI", score: 100 },
  { time: 66, name: "DUNG_NGANG_DOC", event: "LOI", score: 95 },
  { time: 117, name: "DUONG_VUONG_GOC", event: "VAO_BAI", score: 95 },
  { time: 134, name: "DUONG_VUONG_GOC", event: "HET_BAI", score: 95 },
  { time: 188, name: "DUNG_NGANG_DOC", event: "VAO_BAI", score: 95 },
  { time: 235, name: "NGA_TU_1", event: "VAO_BAI", score: 95 },
  { time: 249, name: "NGA_TU_1", event: "HET_BAI", score: 95 },
  { time: 302, name: "QUANH_CO", event: "VAO_BAI", score: 95 },
  { time: 348, name: "QUANH_CO", event: "HET_BAI", score: 95 },
  { time: 387, name: "NGA_TU_2", event: "VAO_BAI", score: 95 },
  { time: 401, name: "NGA_TU_2", event: "HET_BAI", score: 95 },
  { time: 452, name: "GHEP_XE_DOC", event: "VAO_BAI", score: 95 },
  { time: 524, name: "GHEP_XE_DOC", event: "LOI", score: 90 },
  { time: 553, name: "GHEP_XE_DOC", event: "HET_BAI", score: 90 },
  { time: 611, name: "NGA_TU_3", event: "VAO_BAI", score: 90 },
  { time: 618, name: "NGA_TU_3", event: "HET_BAI", score: 90 },
  { time: 633, name: "TINH_HUONG_KHAN_CAP", event: "VAO_BAI", score: 90 },
  { time: 643, name: "TINH_HUONG_KHAN_CAP", event: "HET_BAI", score: 90 },
  { time: 664, name: "DUNG_XE_DUONG_SAT", event: "VAO_BAI", score: 90 },
  { time: 686, name: "DUNG_XE_DUONG_SAT", event: "HET_BAI", score: 90 },
  { time: 717, name: "TANG_TOC_TANG_SO", event: "VAO_BAI", score: 90 },
  { time: 749, name: "TANG_TOC_TANG_SO", event: "HET_BAI", score: 90 },
  { time: 835, name: "GHEP_XE_NGANG", event: "VAO_BAI", score: 90 },
  { time: 861, name: "GHEP_XE_NGANG", event: "LOI", score: 90 },
  { time: 943, name: "GHEP_XE_NGANG", event: "HET_BAI", score: 85 },
  { time: 961, name: "NGA_TU_4", event: "VAO_BAI", score: 85 },
  { time: 969, name: "NGA_TU_4", event: "VAO_BAI", score: 85 },
  { time: 975, name: "KET_THUC", event: "VAO_BAI", score: 85 },
  { time: 979, name: "KET_THUC", event: "VAO_BAI", score: 85 },
];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const httpServer = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const socketServer = io(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

socketServer.on("connection", (socket) => {
  let cm = 0;
  let count = 0;
  let timer = 0;
  let package = {}
  let prevPackage = {}
  let interval
  interval = setInterval(() => {
    cm = 5 * count
    count++;
    timer = count * INTERVAL_TIME - INTERVAL_TIME
    package = data.find(({ time }) => {
      return time * SECONDS_TO_MS  === timer
    })
    console.log({ prevPackage, timer, package })
    if (package) {
      console.log(timer, package)
      socket.emit(EXAM_RESULT, package);
      prevPackage = package
    } else {
      socket.emit(EXAM_RESULT, { ...prevPackage, time: timer })
    }
    socket.emit(DISTANCES_EVENT, cm);
    if (timer > MAX_TIME) clearInterval(interval)
  }, INTERVAL_TIME); 

});
