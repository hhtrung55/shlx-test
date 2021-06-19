import React, { useEffect, useState } from "react";
import SocketClient from "../init-socket";

const EXAM_RESULT = "EXAM_RESULT";
const DISTANCES_EVENT = "DISTANCES";

function Step1() {
  const [distances, setDistances] = useState(0);
  const [data, setData] = useState({});

  useEffect(() => {
    SocketClient.on(DISTANCES_EVENT, (socket) => {
      console.log("DISTANCES_EVENT", socket);
      setDistances(socket);
    });
    SocketClient.on(EXAM_RESULT, (socket) => {
      console.log("EXAM_RESULT", socket);
      setData(socket);
    });
  }, []);

  return (
    <>
      <h3
        style={{
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        }}
      >
        Quảng đường: {(distances * 1e-3).toFixed(2)} mét
      </h3>
      <h3>Thời gian: {Math.floor(data.time /( 60 * 1e3) || 0)} : {((data.time / 1e3) % 60 || 0).toFixed(0)}</h3>
      <h1>Bài thi: {data.name || ''}</h1>
      <h1>Điểm: {data.score || 0}</h1>
    </>
  );
}

export default Step1;
