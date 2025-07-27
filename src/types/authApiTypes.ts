// Authentication types
export interface signInRequestType {
  username: string;
  password: string;
}

export interface SignInResponseType {
  token: string;
  username:string;
  role:string;
}
