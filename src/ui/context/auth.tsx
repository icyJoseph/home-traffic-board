import React, { createContext, useEffect, useContext, useReducer } from "react";
import { getToken } from "../../data/token";

interface IAuthContext {
  token: Token;
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

const ONE_HOUR = 1000 * 60 * 60;

type AuthActionsTypes = FetchToken | SuccessToken | FailureToken;

const authReducer = (state: AuthState, action: AuthActionsTypes): AuthState => {
  switch (action.type) {
    case AuthActions.FETCH:
      return { ...state, loading: true, error: false };
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

const AuthContext = createContext<IAuthContext>({ token: "" });

export function AuthProvider({ children }: IAuthProvider) {
  const [state, dispatch] = useReducer(authReducer, authInitialState);
  const { loading, error, token, expiry } = state;

  // check token
  useEffect(() => {
    if (!token) {
      getToken(process.env.REACT_APP_VT_TOKEN).then(({ token, expiry }) =>
        dispatch({ type: AuthActions.SUCCESS, token, expiry })
      );
    }
  }, [token]);

  // at intervals check token validity
  useEffect(() => {
    const interval = setInterval(() => expiry > new Date().getTime(), ONE_HOUR);
    return () => clearInterval(interval);
  }, [expiry]);

  return (
    <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
