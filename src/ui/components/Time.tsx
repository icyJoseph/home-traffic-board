import React, { useState, useEffect } from "react";
import { ONE_SECOND } from "../../data/constants";

export function Time() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("default", { hour12: false })
  );

  useEffect(() => {
    const interval = setInterval(
      () =>
        setTime(() =>
          new Date().toLocaleTimeString("default", { hour12: false })
        ),
      ONE_SECOND
    );
    return () => clearInterval(interval);
  }, []);

  return <div style={{ fontSize: "7em", textAlign: "center" }}>{time}</div>;
}

export default Time;
