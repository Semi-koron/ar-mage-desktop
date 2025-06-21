import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useEffect, useRef } from "react";
import Stage from "../../object/Stage";
import Player from "../../object/Player";
import Ladder from "../../object/Ladder";

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

const GamePage = () => {
  const gameGrid = [
    [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
    ],
    [
      [0, 2, 0, 2, 10],
      [0, 0, 0, 0, 0],
      [0, 2, 0, 2, 5],
    ],
    [
      [0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0],
      [0, 2, 0, 2, 5],
    ],
    [
      [0, 11, 0, 13, 0],
      [0, 0, 0, 0, 0],
      [0, 12, 0, 6, 0],
    ],
  ];

  return (
    <Canvas>
      <OrthographicCamera makeDefault zoom={50} near={0.1} far={1000} />
      <CameraController />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 2, -3]} intensity={0.4} />
      <Stage grid={gameGrid} />
      <Player grid={gameGrid} />
    </Canvas>
  );
};

export default GamePage;
