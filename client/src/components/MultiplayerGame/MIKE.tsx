import { useContext } from "react";
import gameContext from "../../utils/gameContext";
import "../../styles/Multiplayer.css";

export function MIKE() {
  const { numOfFailures } = useContext(gameContext);
  return (
    <div className="mike-display">
      <p>Don&apos;t spell M.I.K.E. or you&apos;ll lose!</p>
      <h4>
        {numOfFailures > 0 ? "M" : null}
        {numOfFailures > 1 ? " I" : null}
        {numOfFailures > 2 ? " K" : null}
        {numOfFailures > 3 ? " E" : null}
      </h4>
    </div>
  );
}
