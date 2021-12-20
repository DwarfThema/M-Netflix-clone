import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMutiSearch } from "../api";
import { makeImagePath } from "../utils";

const Banner = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  top: 140px;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-size: cover;
`;
const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Sliders = styled.div``;

const Slider = styled.div`
  position: relative;
  top: -100px;
  margin: 0 20px 200px 20px;
`;

const SliderName = styled.div`
  font-size: 30px;
  position: relative;
  bottom: 110px;
  margin: 0 20px 0px 20px;
  background-image: url(${(props) => props.theme.white.lighter});
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);

  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center, center;
  height: 170px;
  margin-bottom: 5px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-style: center right;
  }
  /* 맨 첫번째 맨 마지막 슬라이더들는 특정 origin 을 갖고 transform 한다 */
`;

const BoxVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.3, type: "tween", duration: 0.25 },
  },
};
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.3, type: "tween", duration: 0.25 },
  },
};
const rowVariants = {
  hidden: {
    x: window.innerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 5 /* -5는 row 끼리의 갭을 주기위해 작성 */,
  },
};

const offset = 6;

function Search() {
  const location = useLocation();
  /* console.log(location); */
  /* location을 사용하면 현 url 위치나 정보들을 확인 할 수 있다. */

  const keyword = new URLSearchParams(location.search).get("keyword");
  /* console.log(keyword); */
  /* URLSearchParams 를 이용하면 url의 특정 정보를 얻어 낼 수 있다. */

  const { data, isLoading } = useQuery(["searchId", keyword], () =>
    getMutiSearch(keyword)
  );
  console.log(data);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseMultiIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  return (
    <Wrapper>
      <Banner onClick={increaseMultiIndex}>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <SliderName>Movie & TV Result</SliderName>
            <Slider>
              <AnimatePresence
                initial={false}
                /* initial false는 처음에 hidden으로 시작하지 않고 visible로 마운트 할 수 있게해준다. */
                onExitComplete={toggleLeaving}
                /* exitComplete는 exit가 끝나고 나서 실행된다 */
              >
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={
                    index
                  } /* key가 다르면 animation 시 새로운 Row 가 나오는걸로 인식 */
                  transition={{ type: "tween", duration: 1 }}
                >
                  {data?.results
                    .slice(1)
                    .slice(
                      offset * index,
                      offset * index + offset
                    ) /* index는 page다 */
                    .map((multi: any) => (
                      <Box
                        layoutId={multi.id + ""}
                        key={multi.id}
                        whileHover="hover"
                        initial="normal"
                        variants={BoxVariants}
                        bgphoto={makeImagePath(multi.backdrop_path)}
                        transition={{ type: "tween" }}
                      >
                        <Info variants={infoVariants}>
                          <h4>{multi.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
          </>
        )}
      </Banner>
    </Wrapper>
  );
}

export default Search;
