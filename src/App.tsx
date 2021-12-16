import { motion } from "framer-motion";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: white;
  border-radius: 40px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const boxVars = {
  hover: { scale: 2, rotateZ: 360 },
  click: { scale: 1, borderRadius: "50%" },
  drag: { backgroundColor: "rgb(46,204,113)", transition: { duration: 1 } },
};

function App() {
  return (
    <Wrapper>
      <Box
        drag
        variants={boxVars}
        whileHover="hover"
        whileDrag="drag"
        whileTap="click"
      ></Box>
    </Wrapper>
  );
}

export default App;
