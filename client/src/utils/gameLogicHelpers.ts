//TODO: update this to return in a single line once testing is done
export const getRandomInt = (min: number, max: number): number => {
  //return Math.floor(Math.random() * (max - min + 1)) + min;
  const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`Random Int: ${randomInt}`);
  return randomInt;
};


export const playSound = async (sound: string) => {
    const audio = new Audio(sound);
    audio.volume = 0.3; // Set volume to 30%
    audio.play().catch(err => {
        console.error("Audio play error:", err);
      });
};

