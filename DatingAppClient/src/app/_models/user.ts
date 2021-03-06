export interface ILoginModel {
  username: string;
  password: string;
}

export interface IUser {
  userName: string;
  token: string;
  photoUrl: string;
  knownAs: string;
  gender: string;
  roles: string[];
}
