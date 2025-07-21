import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import Stage from "../../object/Stage";
import Player from "../../object/Player";
import useWebsocket from "../../../hooks/useWebsocket";
import { makeGimickData, makeStageData } from "../../../util/websocketData";
import { useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import GoalPanel from "../../feature/GoalPanel";

const CameraController = () => {
  const { camera, gl } = useThree();
  const zoomRef = useRef(50);

  useEffect(() => {
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    const handleWheel = (event: {
      preventDefault: () => void;
      deltaY: number;
    }) => {
      event.preventDefault();
      const delta = event.deltaY * 0.01;
      zoomRef.current = Math.max(10, Math.min(200, zoomRef.current - delta));
      camera.zoom = zoomRef.current;
      camera.updateProjectionMatrix();
    };

    gl.domElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      gl.domElement.removeEventListener("wheel", handleWheel);
    };
  }, [camera, gl]);

  return null;
};

const GameStage1 = () => {
  const navigate = useNavigate();
  const param = useParams();
  // envからbaseUrlを取得
  const baseUrl = import.meta.env.VITE_MOBILE_URL || "localhost:5173";
  const { sendMessage, isConnected } = useWebsocket(param.roomCode || "test");
  const [onOff, setOnOff] = useState(false);
  const [isGoaled, setIsGoaled] = useState(false);
  const gameGrid = [
    [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
    ],
    [
      [9, 0, 0, 0, 0],
      [2, 0, 0, 2, 5],
      [0, 0, 0, 0, 0],
      [2, 0, 2, 0, 0],
      [0, 2, 0, 0, 2],
    ],
    [
      [0, 0, 0, 0, 0],
      [2, 0, 0, 2, 5],
      [2, 0, 0, 0, 0],
      [2, 2, 2, 0, 0],
      [0, 2, 0, 0, 2],
    ],
    [
      [0, 0, 0, 0, 0],
      [2, 0, 0, 2, 5],
      [4, 0, 0, 0, 0],
      [0, 5, 2, 0, 0],
      [9, 2, 0, 0, 2],
    ],
    [
      [0, 0, 0, 2, 0],
      [2, 7, 7, 2, 5],
      [4, 0, 0, 2, 0],
      [0, 5, 2, 2, 0],
      [0, 2, 0, 2, 2],
    ],
    [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 5, 2, 0, 0],
      [0, 2, 0, 0, 2],
    ],
    [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 5, 2, 0, 0],
      [0, 2, 2, 8, 2],
    ],
    [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 6],
    ],
    [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  ];

  useEffect(() => {
    const onOffData = makeGimickData("onOff", onOff);
    sendMessage(JSON.stringify(onOffData));
  }, [onOff]);

  useEffect(() => {
    if (!isConnected) return;
    const stageData = makeStageData(gameGrid);
    sendMessage(JSON.stringify(stageData));
  }, [isConnected]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGoaled) {
      const goalData = makeGimickData("goal", true);
      sendMessage(JSON.stringify(goalData));
      // ゴールパネルを表示するためのタイマーを設定
      timer = setTimeout(() => {
        setIsGoaled(false); // 一定時間後にゴール状態をリセット
        // ステージのデータをリセットするためのメッセージを送信
        const resetStageData = makeStageData([[[0]]]);
        sendMessage(JSON.stringify(resetStageData));
        navigate("/");
      }, 2000); // 2秒後にリセット
    }
    return () => {
      clearInterval(timer);
    }; // クリーンアップ関数
  }, [isGoaled]);

  return (
    <>
      <Canvas>
        <OrthographicCamera makeDefault zoom={50} near={0.1} far={1000} />
        <CameraController />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 2, 1]} intensity={0.4} />
        <Stage grid={gameGrid} isOnOff={onOff} />
        <Player
          grid={gameGrid}
          handleLever={() => setOnOff((prev) => !prev)}
          isOnOff={onOff}
          sendMessage={sendMessage}
          setIsGoaled={setIsGoaled}
        />
      </Canvas>
      {isGoaled && <GoalPanel />}
      <QRCode
        value={baseUrl + "/game/" + param.roomCode}
        size={128}
        style={{ position: "fixed", top: 10, right: 10 }}
      />
    </>
  );
};

export default GameStage1;
