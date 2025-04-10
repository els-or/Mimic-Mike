import { useContext, useEffect, useState } from "react";
import gameContext from "../../utils/gameContext";
import "../../styles/Multiplayer.css";

const redAudio = new Audio("/sounds/red.mp3");
const greenAudio = new Audio("/sounds/green.mp3");
const blueAudio = new Audio("/sounds/blue.mp3");
const yellowAudio = new Audio("/sounds/yellow.mp3");

redAudio.volume = 0.3;
greenAudio.volume = 0.3;
blueAudio.volume = 0.3;
yellowAudio.volume = 0.3;

interface IMultiplayerGameButtonProps {
  color: string;
  lit: boolean;
  handleClick(color: string): void;
}

export function MultiplayerGameButton(props: IMultiplayerGameButtonProps) {
  const { roundState } = useContext(gameContext);
  const bg = {
    red: "#b71c1c", // deep red
    green: "#1b5e20", // deep green
    blue: "#0d47a1", // deep blue
    yellow: "#ff6f00", // orange amber
  };
  const _bgLit = {
    red: "#ff4d4d", // brighter red
    green: "#4dff4d", // brighter green
    blue: "#4d79ff", // brighter blue
    yellow: "#ffb84d", // brighter orange
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
  const letterMap = {
    red: "A",
    green: "C",
    blue: "B",
    yellow: "D",
  };

  return (
    <div
      className={`multiplayer-button multiplayer-${props.color} ${
        props.lit ? "active" : ""
      }`}
      onClick={handleClick}
    >
      <div className="button-inner">{letterMap[color]}</div>
    </div>
  );
}
