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
