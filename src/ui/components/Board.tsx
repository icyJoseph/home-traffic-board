import React from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { getDepartureBoard } from "../../data/traffic";
import { textColor, HEX2RGB } from "../../utils/colors";
import { STIGBERGSTORGET } from "../../data/constants";

interface ITram {
  journeyid: string;
  name: string;
  rtTime: string;
  time: string;
  sname: string;
  fgColor: string;
  direction: string;
  track: string;
  type: string;
}

export function Board() {
  const { token } = useAuth();
  const [board, setBoard] = React.useState({ Departure: [] });

  React.useEffect(() => {
    if (token) {
      const source = axios.CancelToken.source();
      getDepartureBoard(token, STIGBERGSTORGET.id, source).then(res =>
        setBoard(res)
      );
      return () => source.cancel("Token clean up");
    }
  }, [token]);

  const { Departure: departures = [] } = board;
  return (
    <div>
      <h3>{STIGBERGSTORGET.name}</h3>
      <div>
        {departures.map(
          ({
            journeyid,
            name,
            rtTime,
            time,
            sname,
            fgColor,
            direction,
            track,
            type
          }: ITram) => (
            <div key={journeyid}>
              <div
                style={{
                  background: `${fgColor}`,
                  color: textColor(HEX2RGB(fgColor)),
                  border: "1px solid white",
                  margin: "1em"
                }}
              >
                {sname}
              </div>
              <div>{type}</div>
              <div>{rtTime}</div>
              <div>{time}</div>
              <div>{track}</div>
              <div>{sname}</div>
              <div>{direction}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Board;
