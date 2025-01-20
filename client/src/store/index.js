import { configureStore } from "@reduxjs/toolkit";
import ChatScreenReducer from "./slices/ChatScreenSlice";
import UserReducer from "./slices/userSlice";
import ChatListReducer from "./slices/chatListSlice";



export const store = configureStore({
    reducer:{
        chatList:ChatListReducer,
        chatScreen: ChatScreenReducer,
        user:UserReducer
    }
})