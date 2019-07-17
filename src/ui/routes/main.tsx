import React from "react";
import { useAuth } from "../context/auth";

import Time from "../components/Time";
import Search from "../components/Search";
import Board from "../components/Board";

const App: React.FC = () => {
  const { loading, error } = useAuth();

  return (
    <div className="App">
      <header className="App-header">
        {loading ? <p>Loading Token</p> : null}
        {error && <p>Error Getting Token</p>}
      </header>
      <section>
        <Time />
      </section>
      {!error ? <Search /> : null}
      {!error ? <Board /> : null}
    </div>
  );
};

export default App;
