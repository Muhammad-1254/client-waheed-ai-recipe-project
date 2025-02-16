import { useDispatch, useSelector } from "react-redux";
import { setIsAuth, setUser } from "../store/slices/userSlice";
import axios from "axios";
import { apiRoutes } from "../lib/apiRoutes";
import { useEffect } from "react";
import { print } from "../lib/utils";

const AuthProvider = ({children}) => {
    const user = useSelector((state) => state.user);
const dispatch = useDispatch();
    async function getUser() {
        try {
            dispatch(setUser({ isLoading: true }));
          const res = await axios.get(apiRoutes.getUser, { withCredentials: true });
          const data = res.data.data;
          print(data._id)
          if (data._id) {
           dispatch(setUser({
            userId: data._id,
            username: data.username,
            email: data.email,
            isLoading: false,
           }))
           dispatch(setIsAuth(true))
          }else{
            dispatch(setUser({ isLoading: false,  }));
           dispatch(setIsAuth(false))
          }
          print("user from user provider: ", user);
        } catch (error) {
          console.error("error getting auth user", error);
          dispatch(setUser({ isLoading: false,  }));
          dispatch(setIsAuth(false))

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
