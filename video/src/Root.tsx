/* Author: Xinyi */
import "./index.css";
import { Composition } from "remotion";
import { Demo, DEMO_DURATION } from "./Demo";
import { VIDEO } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Demo"
      component={Demo}
      durationInFrames={DEMO_DURATION}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  );
};
