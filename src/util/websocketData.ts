const makePlayerData = (
  position: [number, number, number],
  rotation: number
) => {
  const data = {
    type: "player",
    content: {
      position: position,
      rotation: rotation,
    },
    from: "desktop",
  };
  return data;
};

const makeStageData = (grid: number[][][]) => {
  const data = {
    type: "stage",
    content: {
      stage: grid,
    },
    from: "desktop",
  };
  return data;
};

const makeGimickData = (gimick: string, data: boolean) => {
  const gimickData = {
    type: "gimick",
    content: {
      gimick: gimick,
      data: data,
    },
    from: "desktop",
  };
  return gimickData;
};

export { makePlayerData, makeStageData, makeGimickData };
