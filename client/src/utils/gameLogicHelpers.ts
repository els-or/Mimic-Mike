//TODO: update this to return in a single line once testing is done
export const getRandomInt = (min: number, max: number): number => {
  //return Math.floor(Math.random() * (max - min + 1)) + min;
  const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`Random Int: ${randomInt}`);
  return randomInt;
};

export const playSound = (soundFile: string, volume: number = 1.0) => {
  const audio = new Audio(soundFile);
  audio.volume = volume;
  audio.play();
};
