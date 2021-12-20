import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getAiringTv,
  getLatestTv,
  getPopularTv,
  getUpTopTv,
  IGetMoveisResult,
} from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const OverView = styled.p`
  font-size: 36px;
  width: 50%;
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

const Overylay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: -30px;
  width: 120%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigTv = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  top: 95px;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  padding: 10px 20px 10px 20px;
  font-weight: 600;
  font-size: 46px;
  position: relative;
  top: -60;
`;

const BigOverView = styled.p`
  padding: 20px;
  top: -60;
  color: ${(props) => props.theme.white.lighter};
`;
const BigDate = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 0 20px 10px 20px;
  font-size: 20px;
`;

const BigAverage = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 0 20px 10px 20px;
  font-size: 20px;
`;
const offset = 6;

function Tv() {
  const { data, isLoading } = useQuery<IGetMoveisResult>(
    ["Tv", "nowPlaying"],
    getLatestTv
  );

  console.log(data);

  const { data: airingData, isLoading: airLoading } = useQuery(
    ["topTv", "top"],
    getAiringTv
  );

  const { data: popularData, isLoading: popularLoading } = useQuery(
    ["popularTv", "upComming"],
    getPopularTv
  );

  const { data: topData, isLoading: topLoading } = useQuery(
    ["topTv", "upComming"],
    getUpTopTv
  );

  const navigate = useNavigate();
  const bigTvMatch = useMatch("/tv/:tvId");
  /* useMatch는 내 url 상태를 확인하고 params도 확인 할 수 있어서 id나 key를 얻고 상호작용을 만들기 위함이다. */
  /* console.log(bigTvMatch); */

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = data?.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      /* 이미 베너에서 쓰고있는 무비때문에 1개는 빼고 봐야함 */
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/${tvId}`);
  };
  const onOverlayClick = () => {
    navigate("/tv");
  };
  const clickedTv =
    bigTvMatch?.params.tvId &&
    data?.results.find((tv: any) => tv.id + "" === bigTvMatch.params.tvId);

  const clickedAiringTv =
    bigTvMatch?.params.tvId &&
    airingData?.results.find(
      (tv: any) => tv.id + "" === bigTvMatch.params.tvId
    );

  const clickedPopularTv =
    bigTvMatch?.params.tvId &&
    popularData?.results.find(
      (tv: any) => tv.id + "" === bigTvMatch.params.tvId
    );

  const clickedTopTv =
    bigTvMatch?.params.tvId &&
    topData?.results.find((tv: any) => tv.id + "" === bigTvMatch.params.tvId);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgphoto={makeImagePath(data?.results[7].backdrop_path || "")}
          >
            <Title>{data?.results[7].title}</Title>
            <OverView>{data?.results[7].overview}</OverView>
          </Banner>
          <Sliders>
            {" "}
            <SliderName>Latest TV Show</SliderName>
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
                    .slice(0)
                    .slice(
                      offset * index,
                      offset * index + offset
                    ) /* index는 page다 */
                    .map((tv) => (
                      <Box
                        layoutId={tv.id + "4"}
                        key={tv.id}
                        whileHover="hover"
                        initial="normal"
                        variants={BoxVariants}
                        onClick={() => onBoxClicked(tv.id)}
                        bgphoto={makeImagePath(tv.backdrop_path)}
                        transition={{ type: "tween" }}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.name}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <AnimatePresence>
                {bigTvMatch ? (
                  <>
                    <Overylay
                      onClick={onOverlayClick}
                      exit={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                    <BigTv
                      layoutId={bigTvMatch.params.tvId + "4"} /* Box와 연결 */
                    >
                      {clickedTv && (
                        <>
                          <BigCover
                            style={{
                              backgroundImage: `linear-gradient(to top, #2f2f2f, transparent), url(${makeImagePath(
                                clickedTv.backdrop_path,
                                "w500"
                              )})`,
                            }}
                          />
                          <BigTitle>{clickedTv.name}</BigTitle>{" "}
                          <div>
                            <BigDate>
                              Release Date : {clickedTv.first_air_date}
                            </BigDate>
                            <BigAverage>
                              Rating : {clickedTv.vote_average}
                            </BigAverage>
                            <BigOverView>{clickedTv.overview}</BigOverView>
                          </div>
                        </>
                      )}
                    </BigTv>
                  </>
                ) : null}
              </AnimatePresence>
            </Slider>
            <SliderName>Airing TV Show</SliderName>
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
                  {airingData?.results
                    .slice(5)
                    .slice(
                      offset * index,
                      offset * index + offset
                    ) /* index는 page다 */
                    .map((tv: any) => (
                      <Box
                        layoutId={tv.id + "1"}
                        key={tv.id}
                        whileHover="hover"
                        initial="normal"
                        variants={BoxVariants}
                        onClick={() => onBoxClicked(tv.id)}
                        bgphoto={makeImagePath(tv.backdrop_path)}
                        transition={{ type: "tween" }}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <AnimatePresence>
                {bigTvMatch ? (
                  <>
                    <Overylay
                      onClick={onOverlayClick}
                      exit={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                    <BigTv
                      layoutId={bigTvMatch.params.tvId + "1"} /* Box와 연결 */
                    >
                      {clickedAiringTv && (
                        <>
                          <BigCover
                            style={{
                              backgroundImage: `linear-gradient(to top, #2f2f2f, transparent), url(${makeImagePath(
                                clickedAiringTv.backdrop_path,
                                "w500"
                              )})`,
                            }}
                          />
                          <BigTitle>{clickedAiringTv.title}</BigTitle>
                          <div>
                            <BigDate>
                              Release Date : {clickedAiringTv.first_air_date}
                            </BigDate>
                            <BigAverage>
                              Rating : {clickedAiringTv.vote_average}
                            </BigAverage>
                            <BigOverView>
                              {clickedAiringTv.overview}
                            </BigOverView>
                          </div>
                        </>
                      )}
                    </BigTv>
                  </>
                ) : null}
              </AnimatePresence>
            </Slider>
            <SliderName>Popular TV Show</SliderName>
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
                  {popularData?.results
                    .slice(0)
                    .slice(
                      offset * index,
                      offset * index + offset
                    ) /* index는 page다 */
                    .map((tv: any) => (
                      <Box
                        layoutId={tv.id + "2"}
                        key={tv.id}
                        whileHover="hover"
                        initial="normal"
                        variants={BoxVariants}
                        onClick={() => onBoxClicked(tv.id)}
                        bgphoto={makeImagePath(tv.backdrop_path)}
                        transition={{ type: "tween" }}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <AnimatePresence>
                {bigTvMatch ? (
                  <>
                    <Overylay
                      onClick={onOverlayClick}
                      exit={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                    <BigTv
                      layoutId={bigTvMatch.params.tvId + "2"} /* Box와 연결 */
                    >
                      {clickedPopularTv && (
                        <>
                          <BigCover
                            style={{
                              backgroundImage: `linear-gradient(to top, #2f2f2f, transparent), url(${makeImagePath(
                                clickedPopularTv.backdrop_path,
                                "w500"
                              )})`,
                            }}
                          />
                          <BigTitle>{clickedPopularTv.title}</BigTitle>
                          <div>
                            <BigDate>
                              Release Date : {clickedPopularTv.first_air_date}
                            </BigDate>
                            <BigAverage>
                              Rating : {clickedPopularTv.vote_average}
                            </BigAverage>
                            <BigOverView>
                              {clickedPopularTv.overview}
                            </BigOverView>
                          </div>
                        </>
                      )}
                    </BigTv>
                  </>
                ) : null}
              </AnimatePresence>
            </Slider>
            <SliderName>Top TV Show</SliderName>
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
                  {topData?.results
                    .slice(0)
                    .slice(
                      offset * index,
                      offset * index + offset
                    ) /* index는 page다 */
                    .map((tv: any) => (
                      <Box
                        layoutId={tv.id + "3"}
                        key={tv.id + "3"}
                        whileHover="hover"
                        initial="normal"
                        variants={BoxVariants}
                        onClick={() => onBoxClicked(tv.id)}
                        bgphoto={makeImagePath(tv.backdrop_path)}
                        transition={{ type: "tween" }}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <AnimatePresence>
                {bigTvMatch ? (
                  <>
                    <Overylay
                      onClick={onOverlayClick}
                      exit={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                    <BigTv layoutId={bigTvMatch.params.tvId} /* Box와 연결 */>
                      {clickedTopTv && (
                        <>
                          <BigCover
                            style={{
                              backgroundImage: `linear-gradient(to top, #2f2f2f, transparent), url(${makeImagePath(
                                clickedTopTv.backdrop_path,
                                "w500"
                              )})`,
                            }}
                          />
                          <BigTitle>{clickedTopTv.title}</BigTitle>
                          <div>
                            <BigDate>
                              Release Date : {clickedTopTv.first_air_date}
                            </BigDate>
                            <BigAverage>
                              Rating : {clickedTopTv.vote_average}
                            </BigAverage>
                            <BigOverView>{clickedTopTv.overview}</BigOverView>
                          </div>
                        </>
                      )}
                    </BigTv>
                  </>
                ) : null}
              </AnimatePresence>
            </Slider>
          </Sliders>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
