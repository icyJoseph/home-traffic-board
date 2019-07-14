import axios from "axios";
import qs from "qs";

const tokenEndPoint = "https://api.vasttrafik.se/token";

export const getToken = (key: string | undefined) => {
  return axios
    .post(
      tokenEndPoint,
      qs.stringify({
        grant_type: "client_credentials",
        scope: "raspberry_12soqp38"
      }),
      {
        headers: {
          Authorization: `Basic ${key}`,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/x-www-form-urlencoded;"
        }
      }
    )
    .then(res => {
      return {
        ...res.data,
        expiry: new Date().getTime() + res.data.expires_in * 1000
      };
    });
};
