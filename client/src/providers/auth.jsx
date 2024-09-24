import axios from "axios";
import { useEffect, useState } from "react";
import { apiRoutes } from "../utils/apiRoutes";
import { UserContext } from "../store/user";

export const globalUserInitialState = {
  userId: null,
  username: null,
  email: null,
  isAuth: false,
  isLoading: false,
};
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(globalUserInitialState);

  async function getAuthUser() {
    try {
      setUser((prev) => ({ ...prev, isLoading: true }));
      const res = await axios.get(apiRoutes.getUser, { withCredentials: true });
      console.log("res from user provider: ", res.data);
      const data = res.data;
      if (data.statusCode === 200) {
        setUser((prev) => ({
          ...prev,
          userId: data.data._id,
          username: data.data.username,
          email: data.data.email,
          isAuth: true,
        }));
      }
      console.log("user from user provider: ", user);
    } catch (error) {
      console.error("error getting auth user", error);
    } finally {
      setUser((prev) => ({ ...prev, isLoading: false }));
    }
  }
  useEffect(() => {
    getAuthUser();
  }, [user.isAuth]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
export default AuthProvider;
