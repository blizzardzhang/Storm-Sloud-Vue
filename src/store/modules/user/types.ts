export interface UserState {
  id?: string;
  account?: string;
  name?: string;
  avatar?: string;
  phone?: string;
}

export interface UserStoreState{
  userInfo: UserState;
  accessToken: string;
  permissions: string[];
}