import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: null,
    username: null,
    email: null,
    isAuth: localStorage.getItem("isAuth") ==='true',
    isLoading: false,
}


const chatSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      
      setUser: (state, action) => {
        for(const key in action.payload){
          state[key] = action.payload[key];
        }
      },
      setIsAuth: (state, action) => {
        state.isAuth = action.payload;
        if(action.payload){
          localStorage.setItem("isAuth", 'true');
        }else{
          localStorage.removeItem("isAuth");
        }
      }

    },
  });
  
  export const {  setUser,setIsAuth,} = chatSlice.actions;
  export default chatSlice.reducer;