import { useEffect, useState, useRef } from "react";

type DataMessage = {
  type: string;
  content: StageData | PlayerData | GimickData;
  from: string;
};

type StageData = {
  stage: number[][][];
};

type PlayerData = {
  rotation: number;
};

type GimickData = {
  gimick: string;
  data: boolean;
};

const useWebsocket = (roomId: string) => {
  const [stage, setStage] = useState<StageData | null>(null);
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [onOff, setOnOff] = useState<GimickData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // WebSocket の URL
    const baseUrl = "localhost:8080";
    const protocol = "ws";
    const socket = new WebSocket(`${protocol}://${baseUrl}/mobile/${roomId}`);
    socketRef.current = socket;

    // 接続成功
    socket.onopen = () => {
      console.log(`✅ Connected to room: ${roomId}`);
      setIsConnected(true);
    };

    // メッセージ受信
    socket.onmessage = (event) => {
      try {
        const data: DataMessage = JSON.parse(event.data);
        switch (data.type) {
          case "stage":
            setStage(data.content as StageData);
            console.log("📬 Stage data updated:", data.content);
            break;
          case "player":
            setPlayer(data.content as PlayerData);
            console.log("📬 Player data updated:", data.content);
            break;
          case "gimick":
            setOnOff(data.content as GimickData);
            console.log("📬 Gimick data updated:", data.content);
            break;
          default:
            console.warn("⚠️ Unknown message type:", data.type);
        }
      } catch (error) {
        console.error(
          "❌ Error parsing message:",
          error,
          "Message:",
          event.data
        );
      }
    };

    // エラー処理
    socket.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    // 切断処理
    socket.onclose = (event) => {
      console.warn(`⚠️ WebSocket closed: ${event.code}, ${event.reason}`);
      setIsConnected(false);
    };

    // クリーンアップ（コンポーネントがアンマウントされたとき）
    return () => {
      console.log(`🔌 Disconnecting from room: ${roomId}`);
      socket.close();
    };
  }, [roomId]); // roomId が変更されるたびに WebSocket 接続を再作成

  // メッセージ送信
  const sendMessage = (message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.warn("❌ WebSocket is not open");
    }
  };

  return { stage, player, onOff, sendMessage, isConnected };
};

export default useWebsocket;
