const API_KEY = "3a74fd88ff1eacb2c32ae9eaaef00278";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovies {
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  id: number;
  name: string;
  release_date: string;
  first_air_date: string;
  vote_average: number;
}

export interface IGetMoveisResult {
  dates: {
    maximun: string;
    minimum: string;
  };
  page: number;
  results: IMovies[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}

export function getTopMovie() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}

export function getUpcomingMovie() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}

export function getLatestTv() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}
export function getAiringTv() {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}
export function getPopularTv() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}
export function getUpTopTv() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}

export function getMutiSearch(keyword: string | null) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=en-US&query=${keyword}`
  ).then((response) => response.json());
}
