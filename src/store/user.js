import { getCurrentEndpointKey } from "utils/auth/sessionStorage.js"
import * as authActions from "actions/auth";
import {
  EMAIL_SIGN_IN_COMPLETE,
  EMAIL_SIGN_UP_COMPLETE,
  SIGN_OUT_COMPLETE,
  SIGN_OUT_ERROR
} from "actions/auth";

import { OAUTH_SIGN_IN_COMPLETE } from "actions/oAuthSignIn";
import { DESTROY_ACCOUNT_COMPLETE } from "actions/destroyAccount";
import * as ssActions from "actions/server";
import { STORE_CURRENT_ENDPOINT_KEY, SET_ENDPOINT_KEYS } from "actions/configure";

const initialState = {
  attributes: null,
  isSignedIn: false,
  firstTimeLogin: false,
  mustResetPassword: false,
  endpointKey: null
};

const ACTION_HANDLERS = {
  [authActions.AUTHENTICATE_COMPLETE]: (state, { payload }) =>
  ({ ...state, ...{
    attributes: payload,
    isSignedIn: true,
    endpointKey: getCurrentEndpointKey()
  }}),

  [ssActions.SS_TOKEN_VALIDATION_COMPLETE]: (state, { user, mustResetPassword, firstTimeLogin }) =>
  ({ ...state, ...{
    attributes: user,
    isSignedIn: true,
    firstTimeLogin,
    mustResetPassword
  }}),

  [STORE_CURRENT_ENDPOINT_KEY]: (state, {currentEndpointKey}) =>
  ({ ...state, ...{ currentEndpointKey } }),

  [SET_ENDPOINT_KEYS]: (state, {currentEndpointKey}) =>
  ({ ...state, ...{ endpointKey: currentEndpointKey } }),

  [EMAIL_SIGN_IN_COMPLETE]: (state, { endpoint, user }) =>
  ({ ...state, ...{
    attributes: user.data,
    isSignedIn: true,
    endpointKey: endpoint
  }}),

  // if registration does not require confirmation, user will be signed in at this point.
  [EMAIL_SIGN_UP_COMPLETE]: (state, { endpoint, user }) => {
    return (user.uid) ? ({ ...state, ...{
        attributes: user,
        isSignedIn: true,
        endpointKey: endpoint
      }}) : state;
  },

  [OAUTH_SIGN_IN_COMPLETE]: (state, { endpoint, user }) =>
  ({ ...state, ...{
    attributes: user,
    isSignedIn: true,
    endpointKey: endpoint
  }}),

  [ssActions.SS_AUTH_TOKEN_UPDATE]: (state, {user, mustResetPassword, firstTimeLogin}) =>
  ({ ...state, ...{
    mustResetPassword,
    firstTimeLogin,
    isSignedIn: !!user,
    attributes: user
  }}),

  [authActions.AUTHENTICATE_FAILURE]:    state => ({ ...state, ...initialState }),
  [ssActions.SS_TOKEN_VALIDATION_ERROR]: state => ({ ...state, ...initialState }),
  [SIGN_OUT_COMPLETE]:                   state => ({ ...state, ...initialState }),
  [SIGN_OUT_ERROR]:                      state => ({ ...state, ...initialState }),
  [DESTROY_ACCOUNT_COMPLETE]:            state => ({ ...state, ...initialState })
};

export default function userReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
