import { selectCurrentToken } from "@/redux/auth/authSlice";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { useSelector } from "react-redux";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);

  type customJwtPayload = JwtPayload & {
    user: { phoneNumber: string; _id: string; accountStatus: string };
  };

  if (token) {
    const decoded = jwtDecode<customJwtPayload>(token);

    if (!decoded) return [];
    const { phoneNumber, _id, accountStatus } = decoded.user;

    return [phoneNumber, _id, accountStatus] as const; //important// infers tuple [ typeof roles] instead of (string[] | string)[]
  }
  //if token is null, useAuth will return undefined & you can't destructure undefined like const [roles] = useAuth() //err: must have a '[Symbol.iterator]
  //so return empty array
  return [];
};
export default useAuth;
