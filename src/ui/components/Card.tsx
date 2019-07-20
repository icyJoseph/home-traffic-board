import React from "react";

import { textColor, HEX2RGB } from "../../utils/colors";
import { ONE_MINUTE } from "../../data/constants";
import styles from "../styles/Card.module.css";

export interface ICard {
  journeyid: string;
  name: string;
  timeLeft: number;
  rtTime: string;
  rtDate: string;
  time: string;
  sname: string;
  fgColor: string;
  direction: string;
  track: string;
  type: string;
}

export function Card({
  journeyid,
  name,
  timeLeft,
  sname,
  rtTime,
  rtDate,
  time,
  fgColor,
  direction,
  track,
  type
}: ICard) {
  const [remove, setRemove] = React.useState(false);
  const urgent = timeLeft < ONE_MINUTE * 10;

  React.useEffect(() => {
    if (timeLeft < ONE_MINUTE * 4) {
      setRemove(true);
    }
  }, [timeLeft]);

  return (
    <div className={remove ? styles.remove : styles.card}>
      <div
        className={styles.sign}
        style={{
          background: `${fgColor}`,
          color: textColor(HEX2RGB(fgColor))
        }}
      >
        <div>{direction}</div>
        <div>{sname}</div>
      </div>
      {/* <div>{type}</div> */}
      {/* <div>{rtTime}</div>
      <div>{time}</div> */}
      <div className={urgent ? styles.urgent : styles.time}>
        <div>{Math.round(timeLeft / ONE_MINUTE)}</div>
        <div>Minutes</div>
      </div>
      {/* <div>{track}</div> */}
    </div>
  );
}

export default Card;
