import React from "react";
import { useAuth } from "../context/auth";

const App: React.FC = () => {
  const { token, error } = useAuth();
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello World!</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>token: {token}</p>
        <p>error: {error ? "Error" : ""}</p>
      </header>
    </div>
  );
};

export default App;
