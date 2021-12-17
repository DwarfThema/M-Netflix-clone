import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { start } from "repl";
import styled from "styled-components";

const Wrapper = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Box = styled(motion.div)`
  width: 400px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  top: 300px;
  position: absolute;
`;

const box = {
  initial: {
    x: 500,
    opacity: 0,
    scale: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: {
    x: -500,
    opacity: 0,
    scale: 0,
  },
};

function App() {
  const [visible, setVisible] = useState(1);
  const nextPlease = () => setVisible((prev) => (prev === 10 ? 1 : prev + 1));
  return (
    <Wrapper>
      <AnimatePresence>
        (
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) =>
          i === visible ? (
            <Box
              key={i}
              variants={box}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {i}
            </Box>
          ) : null
        )}
      </AnimatePresence>
      <button onClick={nextPlease}>click</button>
    </Wrapper>
  );
}

export default App;
