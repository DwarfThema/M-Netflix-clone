import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import styled from "styled-components";

const Wrapper = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, rgb(238, 0, 153), rgb(221, 0, 238));
`;

const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const boxVars = {
  hover: { scale: 2, rotateZ: 360 },
  click: { scale: 1, borderRadius: "50%" },
};

function App() {
  const x = useMotionValue(0);
  const scale = useTransform(x, [-800, 800], [2, 0.2]);
  const rotate = useTransform(x, [-800, 800], [-360, 360]);
  const gradient = useTransform(
    x,
    [-800, 800],
    [
      "linear-gradient(135deg, rgb(238, 0, 153), rgb(221, 0, 238))",
      "linear-gradient(135deg, rgb(36, 238, 0), rgb(0, 238, 226))",
    ]
  );
  useEffect(() => {
    x.onChange(() => console.log(x.get()));
  }, [x]);
  return (
    <Wrapper style={{ background: gradient }}>
      <Box
        style={{ x, scale, rotateZ: rotate }}
        drag="x"
        dragSnapToOrigin
      ></Box>
    </Wrapper>
  );
}

export default App;
