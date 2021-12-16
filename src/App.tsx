import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BiggerBox = styled.div`
  width: 600px;
  height: 600px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
  const boxscale = useTransform(x, [-800, 0, 800], [2, 1, 0.2]);
  useEffect(() => {
    x.onChange(() => console.log(x.get()));
  }, [x]);
  return (
    <Wrapper>
      <Box style={{ x, scale: boxscale }} drag="x" dragSnapToOrigin></Box>
    </Wrapper>
  );
}

export default App;
