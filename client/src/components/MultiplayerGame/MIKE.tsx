import { useContext } from "react";
import gameContext from "../../utils/gameContext";
import "../../styles/Multiplayer.css";

export function MIKE() {
  const { numOfFailures } = useContext(gameContext);
  return (
    <div className="mike-display">
      <p>Don&apos;t spell M.I.K.E. or you&apos;ll lose!</p>
      {numOfFailures > 0 ? <h4>M</h4> : null}
      {numOfFailures > 1 ? <h4>I</h4> : null}
      {numOfFailures > 2 ? <h4>K</h4> : null}
      {numOfFailures > 3 ? <h4>E</h4> : null}
    </div>
  );
}
