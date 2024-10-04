import { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Plus,
  Minus,
} from "lucide-react";
import ThemeButton from "./ThemeToggle";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Profile from "./Profile";
import axios from "axios";
import { apiRoutes } from "../lib/apiRoutes";
import { useDispatch, useSelector } from "react-redux";
import {
  chatScreenInitialState,
  setChatScreenData,
  setMessages,
} from "../store/slices/ChatScreenSlice";
import { timeFromNow } from "../lib/utils";
import { Card } from "./ui/card";
import { useSearchParams } from "react-router-dom";
import {
  setChatListData,
  setChatListLoading,
  setHasMore,
} from "../store/slices/chatListSlice";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import _ from "lodash";
export function LeftNavbarComponent() {
  const [isOpen, setIsOpen] = useState(true);
  const { chatList, loading, hasMore, page } = useSelector(
    (state) => state.chatList
  );
  const dispatch = useDispatch();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const fetchChats = async () => {
    if (loading || !hasMore) return;
    dispatch(setChatListLoading(true));
    try {
      const res = await axios.get(
        `${apiRoutes.getAllConversations}?skip=${page.skip}&limit=${page.limit}`,
        { withCredentials: true }
      );
      const data = res.data.data;
      console.log("Fetched chats:", data);
      dispatch(
        setChatListData({
          chatList: [...chatList, ...data],
          loading: false,
          page: { ...page, skip: page.skip + page.limit },
        })
      );
      if (data.length < page.limit) {
        dispatch(setChatListData({ hasMore: false })); 
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      dispatch(setChatListData({ loading: false }));
    }
  };

  // Handle scroll event
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50 &&
      !loading
    ) {
      fetchChats();
    }
  };

  useEffect(() => {
    fetchChats(); 
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll); 
    };
  }, []); 
  const newChatHandler = () => {
    dispatch(setChatScreenData(chatScreenInitialState));
  };

  const onChatSelect = (chatId) => {
    const chat = chatList.find((c) => c._id === chatId);
    if (chat) {
      dispatch(
        setChatScreenData({
          chatId: chat._id,
          ingredients: chat.ingredients,
          mealType: chat.mealType,
          complexity: chat.complexity,
          cuisine: chat.cuisine,
          messages: chat.messages,
          createdAt: chat.createdAt,
        })
      );
    }
  };
  return (
    <>
      <ToggleNavBtn isOpen={isOpen} toggleNavbar={toggleNavbar} />
      <div
        className={`
       h-screen  flex flex-col  items-start 
      transition-all duration-300 ease-in-out
      bg-background
      relative overflow-hidden
      
      ${isOpen ? "w-72 md:w-64  translate-x-0" : "w-0 md:-translate-x-full"}
    `}
      >
        <div className="w-full flex justify-end mt-4 pr-4">
          <Button className="p-2 rounded-full" onClick={newChatHandler}>
            <Plus size={24} />
          </Button>
        </div>
        <h2 className={`text-xl md:text-2xl font-bold text-center w-full  `}>
          Recipe App
        </h2>
        <SearchInput />
        <div className="w-full relative">
          <SearchResult onChatSelect={onChatSelect} />
        </div>
        <ChatList onChatSelect={onChatSelect} />
        <BottomNavbar />
      </div>
    </>
  );
}

const ToggleNavBtn = ({ isOpen, toggleNavbar }) => {
  return (
    <div className="absolute z-50 left-4 top-4 ">
      <Button onClick={toggleNavbar} className="p-2  rounded-full   ">
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </Button>
    </div>
  );
};

const SearchInput = () => {
  const [input, setInput] = useState();

  const dispatch = useDispatch();

  const searchChats = async () => {
    dispatch(setChatListData({ searchLoading: true, searchItemOpen: true }));
    try {
      const res = await axios.get(
        `${apiRoutes.searchConversations}?search=${input}`,
        { withCredentials: true }
      );
      const data = res.data.data;
      dispatch(
        setChatListData({ searchChatItems: data, searchLoading: false })
      );
      console.log("Searched chats:", data);
    } catch (error) {
      console.error("Error searching chats:", error);
      dispatch(setChatListData({ searchLoading: false }));
    }
  };
  const debounceSearch = _.debounce((value) => {
    if (value.trim()) {
      searchChats();
    }
  }, 500);
  const inputHandler = (e) => {
    const value = e.target.value;
    setInput(value);
    debounceSearch(value);
  };
  return (
    <div className="relative w-full px-2 mt-4 ">
      <Input
        type="text"
        placeholder="Search chats..."
        value={input}
        className="w-full "
        onChange={inputHandler}
      />
      <Search
        className={`absolute top-2 right-3 text-gray-500 ${
          input ? "hidden" : "block"
        }`}
        size={20}
      />
    </div>
  );
};

const ChatList = ({ onChatSelect }) => {
  const dispatch = useDispatch();

  const {
    chatList,
    loading,
    hasMore,
    searchChatItems,
    searchLoading,
    searchItemOpen,
  } = useSelector((state) => state.chatList);
  const currentDate = useRef(timeFromNow(new Date()));
  return (
    <ScrollArea className="w-full flex-1 border-y   py-1 ">
      {chatList.map((chat, index) => {
        const tempDate = timeFromNow(chat.createdAt);
        const shouldDateDisplay = currentDate.current !== tempDate;
        currentDate.current = tempDate;
        const content = JSON.parse(
          chat.messages.find((m) => m.role == "user").content
        )?.prompt;
        return (
          <Card key={chat.id} className=" border-0 px-3">
            {shouldDateDisplay && (
              <p className="bg-muted    inline  text-xs md:text-sm  mb-0.5 px-2 py-1 rounded  ">
                {tempDate}
              </p>
            )}
            <div
              onClick={() => onChatSelect(chat._id)}
              className="flex items-center py-3 cursor-pointer rounded bg-card border border-transparent hover:border-border"
            >
              <MessageSquare size={20} className="mr-2" />
              <span className="overflow-hidden text-ellipsis text-nowrap w-1/2">
                {content}
              </span>
            </div>
          </Card>
        );
      })}
      {loading && <ChatListFetchingLoading />}
      {!hasMore && (
        <p className="px-3  w-fit ml-3 py-0.5 rounded  bg-muted">
          No more Chats
        </p>
      )}
      {!hasMore && chatList.length === 0 && (
        <p className="px-3  w-fit ml-3 py-0.5 rounded  bg-muted">
          No chats Found
        </p>
      )}
    </ScrollArea>
  );
};

const SearchResult = ({ onChatSelect }) => {
  const { searchChatItems, searchLoading, searchItemOpen } = useSelector(
    (state) => state.chatList
  );
  const dispatch  = useDispatch();
  const closeSearchLayout = () => {
    dispatch(setChatListData({ searchItemOpen: false }));
  }
  return (
    <div
      className={`absolute left-0 top-0 z-30
    w-full flex flex-col items-start bg-popover border border-border
    transition-all duration-300 ease-in-out   
    overflow-hidden pt-4 
    ${searchItemOpen ? "translate-x-0" : "-translate-x-full"}
     `}
    >
      <div className="w-full flex justify-end  mb-2 pr-4">
        <Button className="p-2" onClick={closeSearchLayout}>
          <Minus size={16} />
        </Button>
      </div>

      {searchChatItems.map((chat, index) => (
        <Card
          key={chat.id}
          className="w-full  py-2 pl-2 rounded   bg-muted hover:border-popover border border-transparent cursor-pointer "
          onClick={() => onChatSelect(chat._id)}
        >
          {/* <MessageSquare size={20} className="mr-2" /> */}
          <p className="overflow-hidden text-ellipsis text-nowrap ">
            {JSON.parse(chat.messages.find((m) => m.role == "user").content)?.prompt}
          </p>
        </Card>
      ))}
      {searchLoading && <ChatListFetchingLoading />}
      {!searchChatItems.length && !searchLoading && (
        <p className="px-3  w-fit ml-3 py-0.5 rounded  bg-muted">
          No chats Found
        </p>
      )}
    </div>
  );
};

const ChatListFetchingLoading = () => {
  return (
    <div className="w-full px-3 flex flex-col  ">
      <Skeleton className={" h-9 border"} />
      <Skeleton className={" h-9 border"} />
      <Skeleton className={" h-9 border"} />
    </div>
  );
};
const BottomNavbar = () => {
  return (
    <div
      className={`w-full flex items-center justify-between px-2 h-14 

    `}
    >
      <ThemeButton />
      <Profile />
    </div>
  );
};
