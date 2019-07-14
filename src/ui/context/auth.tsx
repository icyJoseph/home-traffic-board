import React, { createContext, useEffect, useContext, useReducer } from "react";
import axios from "axios";
import { getToken } from "../../data/token";
import { ONE_MINUTE } from "../../data/constants";

interface IAuthContext {
  token: Token;
  error: boolean;
  loading: boolean;
}

interface IAuthProvider {
  children: React.ReactNode;
}

enum AuthActions {
  FETCH = "fetching",
  SUCCESS = "success",
  FAILURE = "failure"
}

type Token = string;
type FetchToken = { type: typeof AuthActions.FETCH };
type SuccessToken = {
  type: typeof AuthActions.SUCCESS;
  token: Token;
  expiry: number;
};
type FailureToken = { type: typeof AuthActions.FAILURE };

interface AuthState {
  loading: boolean;
  error: boolean;
  token: string;
  expiry: number;
}

const authInitialState: AuthState = {
  loading: false,
  error: false,
  token: "",
  expiry: 0
};

type AuthActionsTypes = FetchToken | SuccessToken | FailureToken;

const authReducer = (state: AuthState, action: AuthActionsTypes): AuthState => {
  switch (action.type) {
    case AuthActions.FETCH:
      return { ...authInitialState, loading: true };
    case AuthActions.FAILURE:
      return { ...authInitialState, error: true };
    case AuthActions.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        token: action.token,
        expiry: action.expiry
      };
    default:
      return state;
  }
};

const AuthContext = createContext<IAuthContext>({
  token: "",
  error: false,
  loading: false
});

export function AuthProvider({ children }: IAuthProvider) {
  const [state, dispatch] = useReducer(authReducer, authInitialState);
  const { error, token, loading, expiry } = state;

  // check token
  useEffect(() => {
    if (!token) {
      const source = axios.CancelToken.source();

      getToken(process.env.REACT_APP_VT_TOKEN, source)
        .then(({ token, expiry }) =>
          dispatch({ type: AuthActions.SUCCESS, token, expiry })
        )
        .catch(e => {
          if (axios.isCancel(e)) {
            console.log("Request canceled", e.message);
          }
          dispatch({ type: AuthActions.FAILURE });
        });
      return () => source.cancel("Cancelling Token");
    }
    return () => console.log("Clean Up Check Token");
  }, [token]);

  // at intervals check token validity
  // implement as follows: after one minute => check if still valid
  // if valid, do nothing, otherwise fetch token

  useEffect(() => {
    const verifyToken = () => {
      const expired = new Date().getTime() > expiry;
      if (expired) {
        dispatch({ type: AuthActions.FETCH }); // token is set to ""
      }
      return () => {}; //noop
    };
    const timer = setTimeout(verifyToken, ONE_MINUTE);
    return () => clearTimeout(timer);
  }, [expiry]);

  return (
    <AuthContext.Provider value={{ token, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
