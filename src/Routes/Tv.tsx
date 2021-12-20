import { useViewportScroll } from "framer-motion";
import styled from "styled-components";

function Tv() {
  const { scrollY: myScroll } = useViewportScroll();
  console.log(myScroll.get());

  return (
    <div style={{ height: "2000vh", position: "relative" }}>
      <div
        style={{
          fontSize: 100,
          top: myScroll.get() + 100,
          position: "absolute",
        }}
      >
        hi
      </div>
    </div>
  );
}

export default Tv;
