import React from "react";
import axios from "axios";
import Card, { ICard } from "./Card";
import { useAuth } from "../context/auth";
import { getDepartureBoard, DepartureBoardResponse } from "../../data/traffic";
import { STIGBERGSTORGET } from "../../data/constants";
import styles from "../styles/Board.module.css";

export function Board() {
  const { token } = useAuth();
  const [board, setBoard] = React.useState<DepartureBoardResponse>({
    Departure: [],
    serverdate: "",
    servertime: ""
  });

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

  const now = new Date().getTime();

  const withTimeLeft = departures
    .map(({ rtTime, rtDate, ...rest }) => ({
      ...rest,
      rtTime,
      rtDate,
      timeLeft: new Date(`${rtDate}T${rtTime}`).getTime() - now
    }))
    .sort((a, b) => a.timeLeft - b.timeLeft);

  return (
    <div>
      <h3 className={styles.name}>{STIGBERGSTORGET.name}</h3>
      <div className={styles.board}>
        {withTimeLeft.map(({ journeyid, ...props }: ICard) => (
          <Card key={journeyid} journeyid={journeyid} {...props} />
        ))}
      </div>
    </div>
  );
}

export default Board;
