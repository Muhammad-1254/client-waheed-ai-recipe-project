import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import axios from "axios";
import { apiRoutes } from "../lib/apiRoutes";
import { useEffect } from "react";

const AuthProvider = ({children}) => {
    const user = useSelector((state) => state.user);
const dispatch = useDispatch();
    async function getUser() {
        try {
            dispatch(setUser({ isLoading: true }));
          const res = await axios.get(apiRoutes.getUser, { withCredentials: true });
          const data = res.data.data;
          console.log("data from auth provider: ", data);
          if (data._id) {
           dispatch(setUser({
            userId: data._id,
            username: data.username,
            email: data.email,
            isAuth: true,
            isLoading: false,
           }))
          }else{
            dispatch(setUser({ isLoading: false, isAuth: false }));
          }
          console.log("user from user provider: ", user);
        } catch (error) {
          console.error("error getting auth user", error);
          dispatch(setUser({ isLoading: false, isAuth: false }));
        } 
      }
      useEffect(() => {
        getUser();
      }, []);
  return (
    <>
    {children}
    </>
  )
}

export default AuthProvider
