import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: null,
    username: null,
    email: null,
    isAuth: false,
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
    },
  });
  
  export const {  setUser} = chatSlice.actions;
  export default chatSlice.reducer;