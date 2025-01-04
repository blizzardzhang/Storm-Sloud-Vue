export interface UserState {
  id?: number;
  account?: string;
  name?: string;
  avatar?: string;
  email?: string;
  phone?: string;
}

export interface UserStoreState{
  userInfo: UserState;
  accessToken: string;
}