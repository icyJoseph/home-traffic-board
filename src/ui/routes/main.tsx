import React from "react";
import { useAuth } from "../context/auth";

import Search from "../components/Search";
import Board from "../components/Board";

const App: React.FC = () => {
  const { token, loading, error } = useAuth();

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello World!</p>
        {loading ? <p>Loading Token</p> : null}
        <p>error: {error ? "Error" : ""}</p>
      </header>
      {!error ? <Search token={token} /> : null}
      {!error ? <Board token={token} /> : null}
    </div>
  );
};

export default App;
