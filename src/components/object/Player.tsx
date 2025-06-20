import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

type BlockGrid = number[][][];

interface PlayerProps {
  grid: BlockGrid;
}

const Player: React.FC<PlayerProps> = ({ grid }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [rotation, setRotation] = useState(0); // 0=北, 1=東, 2=南, 3=西
  const textures = useTexture([
    "/assets/textures/cube/test1.png",
    "/assets/textures/cube/test2.png",
    "/assets/textures/cube/test3.png",
    "/assets/textures/cube/test4.png",
    "/assets/textures/cube/test5.png",
    "/assets/textures/cube/test6.png",
  ]);

  // 方向ベクトル
  const getDirectionVector = (rot: number): [number, number, number] => {
    switch (rot % 4) {
      case 0:
        return [0, 0, -1]; // 北 (-Z方向)
      case 1:
        return [1, 0, 0]; // 東 (+X方向)
      case 2:
        return [0, 0, 1]; // 南 (+Z方向)
      case 3:
        return [-1, 0, 0]; // 西 (-X方向)
      default:
        return [0, 0, -1];
    }
  };

  // グリッド座標からワールド座標に変換
  const gridToWorld = (
    x: number,
    y: number,
    z: number
  ): [number, number, number] => {
    if (!grid.length || !grid[0].length || !grid[0][0].length) return [0, 0, 0];

    return [
      x - Math.floor(grid[0][0].length / 2),
      y - Math.floor(grid.length / 2),
      z - Math.floor(grid[0].length / 2),
    ];
  };

  // ワールド座標からグリッド座標に変換
  const worldToGrid = (
    x: number,
    y: number,
    z: number
  ): [number, number, number] => {
    if (!grid.length || !grid[0].length || !grid[0][0].length) return [0, 0, 0];

    return [
      Math.round(x + Math.floor(grid[0][0].length / 2)),
      Math.round(y + Math.floor(grid.length / 2)),
      Math.round(z + Math.floor(grid[0].length / 2)),
    ];
  };

  // 指定位置にブロックがあるかチェック
  const hasBlockAt = (x: number, y: number, z: number): boolean => {
    if (
      y < 0 ||
      y >= grid.length ||
      z < 0 ||
      z >= grid[y].length ||
      x < 0 ||
      x >= grid[y][z].length
    ) {
      return false;
    }
    return grid[y][z][x] !== 0 && grid[y][z][x] !== 4 && grid[y][z][x] !== 5;
  };

  // 目の前のブロックのIDを取得
  const getFrontBlockId = (): number | null => {
    const [dx, dy, dz] = getDirectionVector(rotation);
    const [currentX, currentY, currentZ] = worldToGrid(...position);
    const frontX = currentX + dx;
    const frontY = currentY + dy;
    const frontZ = currentZ + dz;

    if (
      frontY < 0 ||
      frontY >= grid.length ||
      frontZ < 0 ||
      frontZ >= grid[frontY].length ||
      frontX < 0 ||
      frontX >= grid[frontY][frontZ].length
    ) {
      return null;
    }

    const blockId = grid[frontY][frontZ][frontX];
    return blockId === 0 ? null : blockId;
  };

  // キーボードイベントハンドラ
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "a":
          // 左に90度回転
          setRotation((prev) => (prev - 1 + 4) % 4);
          break;

        case "d":
          // 右に90度回転
          setRotation((prev) => (prev + 1) % 4);
          break;

        case "w":
          // 前進
          const [dx, dy, dz] = getDirectionVector(rotation);
          setPosition((prev) => {
            const newPos: [number, number, number] = [
              prev[0] + dx,
              prev[1] + dy,
              prev[2] + dz,
            ];

            // 移動先にブロックがないかチェック
            const [gridX, gridY, gridZ] = worldToGrid(...newPos);
            if (hasBlockAt(gridX, gridY, gridZ)) {
              console.log("移動できません: ブロックがあります");
              const failAudio = new Audio("/assets/se/ui-note.mp3");
              failAudio.play();
              return prev;
            }
            // 音声を再生
            const audio = new Audio("/assets/se/ui-pop.mp3");
            audio.play();
            return newPos;
          });
          break;

        case "s":
          // アクション
          const frontBlockId = getFrontBlockId();
          if (frontBlockId !== null) {
            console.log(`目の前のブロックID: ${frontBlockId}`);
          } else {
            console.log("目の前にブロックはありません");
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [rotation, position, grid]);

  // メッシュの位置と回転を更新
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...position);
      meshRef.current.rotation.y = -(rotation * Math.PI) / 2;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        {textures.map((texture, index) => (
          <meshStandardMaterial
            key={index}
            attach={`material-${index}`}
            map={texture}
          />
        ))}
      </mesh>
    </>
  );
};

export default Player;
