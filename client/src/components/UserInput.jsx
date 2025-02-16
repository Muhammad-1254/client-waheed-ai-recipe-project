import { useState } from "react";
import { Send } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { apiRoutes } from "../lib/apiRoutes";
import {
  setChatScreenData,
  setMessageLoading,
} from "../store/slices/ChatScreenSlice";
import { toast } from "../hooks/use-toast";
import { setAddChatList,  } from "../store/slices/chatListSlice";
import { print } from "../lib/utils";

export function UserInput() {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const { chatId } = useSelector((state) => state.chatScreen);

  const { ingredients, mealType, cuisine, complexity } = useSelector(
    (state) => state.chatScreen
  );

  const validateConversation = () => {
    if (!input) {
      toast({
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };
  const handlePromptSubmit = async () => {
    // if chatId is null then we need to create a new chat
    // else we have to hit conversation endpoint
    if (chatId) {
      // hit conversation endpoint
      dispatch(setMessageLoading(true));
      try {
        const res = await axios.post(
          apiRoutes.addConversationMessage,
          {
            prompt: input,
            conversationId: chatId,
          },
          { withCredentials: true }
        );
        const data = res.data.data;
        print("data", data);
        if (data._id) {
          dispatch(
            setChatScreenData({
              messages: data.messages,
              messageLoading: false,
            })
          );
          
        }else{
          dispatch(setMessageLoading(false));
          toast({
            description: data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        print("error while conversation", error);
        dispatch(setMessageLoading(false));
      }
    } else {
      // create a new chat
      if (!validateConversation()) return;
      dispatch(setMessageLoading(true));
      try {
        const res = await axios.post(
          apiRoutes.createNewConversation,
          {
            ingredients: ingredients ?? "any",
            mealType: mealType ?? "any",
            cuisine: cuisine ?? "any",
            complexity: complexity ?? "any",
            prompt: input,
          },
          { withCredentials: true }
        );
        const data = res.data.data;
        print("data", data);
        if (data._id) {
          dispatch(
            setChatScreenData({
              chatId: data._id,
              messages: data.messages,
              createdAt: data.createdAt,
              messageLoading: false,
            })
          );
          // for new chat add chat to chatList
          dispatch(setAddChatList(data));
        } else {
          dispatch(setMessageLoading(false));
          toast({
            description: data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        print("error while create new conversation", error);
        dispatch(setMessageLoading(false));
      }

    }
    setInput("");
  };

  return (
    <div className="fixed bottom-0 z-10   w-full max-w-[400px] lg:max-w-[600px] 
    pb-3 pt-1 px-3 md:px-0 ">
      <div className="relative w-full ">
        <Textarea
          placeholder="Type Your Message Here!"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full md:text-lg max-h-32 md:max-h-40 bg-background"
        />
        <Button
          variant="secondary"
          size="lg"
          className="absolute right-3 bottom-3 z-30"
          onClick={handlePromptSubmit}
        >
          <Send size={24} />
        </Button>
      </div>
    </div>
  );
}
