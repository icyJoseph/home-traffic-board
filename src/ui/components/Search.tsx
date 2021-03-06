import React from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { searchStops } from "../../data/traffic";

const useDebounce = (value: any) => {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return debounced;
};

const useStopSearch = (query: string, token: string) => {
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    if (query) {
      const source = axios.CancelToken.source();

      searchStops(token, query, source)
        .then(res => setData(res))
        .catch(e => {
          if (axios.isCancel(e)) {
            console.log("Cancelled stop search", e.message);
          }
        });

      return () => source.cancel("Cancelling stop search request");
    }
    return () => {
      console.log("Clean Up use stop search");
    };
  }, [query, token]);

  return data;
};

export function Search() {
  const { token } = useAuth();
  const [query, setQuery] = React.useState("");

  const debounced = useDebounce(query);

  const result = useStopSearch(debounced, token);

  console.log(result);

  return (
    <input type="text" value={query} onChange={e => setQuery(e.target.value)} />
  );
}

export default Search;
