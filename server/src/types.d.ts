interface BaseUser {
  firstname: string;
  middlename?: string;
  lastname: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  password?: string;
}

interface UserWithUserid {
  userid: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string
}

export type User = BaseUser | UserWithUserid;

export type Session = {
  sessionid: string;
  userid: string;
  useragent: string;
  expires: Date;
}