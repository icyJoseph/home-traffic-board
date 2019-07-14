import axios, { CancelTokenSource } from "axios";

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
) => {
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
