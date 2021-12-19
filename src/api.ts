const API_KEY = "3a74fd88ff1eacb2c32ae9eaaef00278";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovies {
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  id: number;
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
