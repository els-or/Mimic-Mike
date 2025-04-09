export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


export const playSound = async (sound: string) => {
    const audio = new Audio(sound);
    audio.volume = 0.3; // Set volume to 30%
    audio.play().catch(err => {
        console.error("Audio play error:", err);
      });
};

