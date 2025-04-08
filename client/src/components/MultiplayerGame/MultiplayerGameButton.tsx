import { useContext, useEffect, useState } from "react";
import gameContext from "../../utils/gameContext";

import redAudioFile from "../../assets/red.mp3";
import greenAudioFile from "../../assets/green.mp3";
import blueAudioFile from "../../assets/blue.mp3";
import yellowAudioFile from "../../assets/yellow.mp3";

const redAudio = new Audio(redAudioFile);
const greenAudio = new Audio(greenAudioFile);
const blueAudio = new Audio(blueAudioFile);
const yellowAudio = new Audio(yellowAudioFile);

interface IMultiplayerGameButtonProps {
  color: string;
  lit: boolean;
  handleClick(color: string): void;
}

export function MultiplayerGameButton(props: IMultiplayerGameButtonProps) {
  const { roundState } = useContext(gameContext);
  const bg = {
    red: "#ff0000",
    green: "#008000",
    blue: "#0000ff",
    yellow: "#ffff00",
  };
  const bgLit = {
    red: "#ff9999",
    green: "#99ff99",
    blue: "#9999ff",
    yellow: "#ffff99",
  };

  const [_isClicked, setIsClicked] = useState(false);
  const handleClick = () => {
    if (roundState === "waitingForInput") {
      setIsClicked(true);
      props.handleClick(props.color);
      setTimeout(() => {
        setIsClicked(false);
      }, 500);
    }
  };
  // play sound if lit prop turns on
  useEffect(() => {
    if (props.lit) {
      switch (props.color) {
        case "red":
          redAudio.play();
          break;
        case "green":
          greenAudio.play();
          break;
        case "blue":
          blueAudio.play();
          break;
        case "yellow":
          yellowAudio.play();
          break;
        default:
          break;
      }
    }
  }, [props.lit]);
  const color = props.color as keyof typeof bg;
  return (
    <div
      style={{
        backgroundColor: props.lit ? bgLit[color] : bg[color],
        height: 120,
        width: 120,
        margin: 10,
        borderColor: props.lit ? bgLit[color] : bg[color],
        borderStyle: "solid",
        borderRadius: 30,
        boxShadow: props.lit ? `0px 0px 5px ${bgLit[color]}` : undefined,
      }}
      onClick={handleClick}
    ></div>
  );
}
