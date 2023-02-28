import { UserInfo } from '../models/UserInfo';
import { GlobalContextType } from './globalContext';

export enum UserInfoActionTypes {
  UpdateUserInfo = 'UPDATE_USER_INFO',
}

export interface UserAction {
  type: UserInfoActionTypes;
  payload: UserInfo;
}

export const userInfoReducer = (
  state: GlobalContextType,
  action: UserAction
) => {
  const { type, payload } = action;
  let next = state;
  switch (type) {
    case UserInfoActionTypes.UpdateUserInfo:
      next = {
        ...state,
        userInfo: payload,
      };
      break;
  }
  return next;
};
