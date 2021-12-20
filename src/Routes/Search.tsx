import { useLocation } from "react-router-dom";

function Search() {
  const location = useLocation();
  console.log(location);
  /* location을 사용하면 현 url 위치나 정보들을 확인 할 수 있다. */

  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);
  /* URLSearchParams 를 이용하면 url의 특정 정보를 얻어 낼 수 있다. */

  return null;
}

export default Search;
