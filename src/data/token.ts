import axios from "axios";
import qs from "qs";
import { tokenEndPoint, VT_KEY, EMPTYJSON } from "../data/constants";

interface TokenResponse {
  token: string;
  expiry: number;
}

// currently this is doing two things
// check if token is saved to local storage
// if so, check expiry
// if valid, return token + expiry
// otherwise fetch a new token
// and save it to local storage
export const getToken = (key: string | undefined): Promise<TokenResponse> => {
  const store = localStorage.getItem(VT_KEY) || EMPTYJSON;
  const { expiry, token } = JSON.parse(store);
  const now = new Date().getTime();
  const expired = now - expiry > 0;
  if (!token || expired) {
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
      .then(({ data: { access_token: token, expires_in } }) => {
        return {
          token,
          expiry: new Date().getTime() + expires_in * 1000
        };
      })
      .then(res => {
        localStorage.setItem(VT_KEY, JSON.stringify(res));
        return res;
      });
  }
  return new Promise(resolve => resolve({ token, expiry }));
};
