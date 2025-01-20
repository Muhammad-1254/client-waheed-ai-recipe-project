import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatList: [],
  
  loading: false,
  hasMore: true,
  page: { skip: 0, limit: 20 },
  searchChatItems: [],
  searchLoading:false,
  searchItemOpen:false,
};

const chatListSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    setChatListData:(state,action)=>{
        for(const key in action.payload){
            state[key]=action.payload[key]
        }
    },
    setAddChatList:(state,action)=>{
        state.chatList=[action.payload, ...state.chatList,]
    }   ,
    setChatList: (state, action) => {
      state.chatList = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setChatListLoading: (state, action) => {
      state.loading = action.payload;
    },
    setChatListPage: (state, action) => {
      state.page = action.payload;
  }
}
});

export const { setChatList,setAddChatList,setChatListLoading,setChatListPage,setHasMore, setChatListData} = chatListSlice.actions;
export default chatListSlice.reducer;
