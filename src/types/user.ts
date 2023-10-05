export interface IUser {
  _id?: string;
  username: string;
  email: string;
  phoneNumber: string;
  profilePic: { filename: string };
}
