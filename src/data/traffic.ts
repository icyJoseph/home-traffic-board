import axios, { CancelTokenSource } from "axios";
import { DateAndTime } from "../utils/dates";

interface StopLocation {
  id: string;
  idx: string;
  lat: string;
  lon: string;
  name: string;
}

interface SearchStopsResponse {
  serverdate: string;
  servertime: string;
  StopLocation: StopLocation[];
}

export const trafficPublicEndPoint =
  "https://api.vasttrafik.se/bin/rest.exe/v2";

const headers = (token: string) => {
  return {
    Authorization: `Bearer ${token}`
  };
};

const format = "json";

const defaults = {
  useVas: 0,
  useLDTrain: 0,
  useRegTrain: 0,
  excludeDR: 0
};

export const searchStops = (
  token: string,
  input: string,
  source: CancelTokenSource
): Promise<SearchStopsResponse> => {
  return axios
    .get(`${trafficPublicEndPoint}/location.name`, {
      headers: headers(token),
      params: { ...defaults, format, input },
      cancelToken: source.token
    })
    .then(res => {
      const {
        LocationList: { serverdate, servertime, StopLocation }
      } = res.data;
      return {
        serverdate,
        servertime,
        StopLocation
      };
    });
};

interface DepartureBoard {
  journeyid: string;
  name: string;
  rtTime: string;
  rtDate: string;
  time: string;
  sname: string;
  fgColor: string;
  direction: string;
  track: string;
  type: string;
}

export interface DepartureBoardResponse {
  Departure: DepartureBoard[];
  serverdate: string;
  servertime: string;
}

export const getDepartureBoard = (
  token: string,
  id: string,
  source: CancelTokenSource
): Promise<DepartureBoardResponse> => {
  const { date, time } = DateAndTime();

  return axios
    .get(`${trafficPublicEndPoint}/departureBoard`, {
      headers: headers(token),
      params: { ...defaults, format, id, date, time }
    })
    .then(
      ({
        data: {
          DepartureBoard: { noNamespaceSchemaLocation: omit, ...rest }
        }
      }) => ({ ...rest })
    );
};
