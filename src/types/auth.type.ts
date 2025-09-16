export type LoginType = {
  id: string;
  pw: string;
};

export type SignupType = LoginType & {
  email: string;
};

export type CheckEmailNumberType = {
  email: string;
  emailNum: string;
};

export type ResetPasswordType = {
  token: string;
  newPwd: string;
};

export type LoginResponseData = {
  accessToken: string;
  memberId: number;
  id: string;
  email: string;
  role: string;
  planId: number;
};

export type SignupResponseData = {
  memberId: number;
  message: string;
};

export type CheckIdResponseData = {
  result: boolean;
};
