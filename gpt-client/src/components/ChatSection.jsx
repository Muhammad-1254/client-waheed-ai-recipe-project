import React, { useRef } from "react";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import Selection from "./Selection";
import { UserInput } from "./UserInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import rehypeRaw from "rehype-raw";
import "github-markdown-css/github-markdown.css";
import { Skeleton } from "./ui/skeleton";
const ChatSection = () => {
  const { chatId } = useSelector((state) => state.chatScreen);

  return (
    <>
      <div className="w-full  flex flex-col items-center      mt-20 pb-20">
        <div
          className={`w-full   items-center justify-center   
          ${chatId ? "hidden" : "flex"}
          `}
        >
          <img
            className="object-cover bg-center w-full md:w-[80%] lg:w-[60%] aspect-video rounded-lg "
            src="https://theaicuisine.com/wp-content/uploads/2023/06/A-photo-of-a-chef-and-an-AI-system-working-together-in-the-kitchen.webp"
            alt="img"
          />
        </div>
        <Selection />
        <NewChatCarousel />
        <Chats />
      </div>
      <UserInput />
    </>
  );
};

export default ChatSection;

const Chats = () => {
  const {messages, messageLoading} = useSelector((state) => state.chatScreen);
  return (
    <div className="w-full space-y-5 my-4  ">
      {messages.map((message, _) => {
        if (message?.role === "user" || message?.role === "assistant") {
          let content = message.content;
          try {
            content = JSON.parse(content)?.prompt;
          } catch (error) {
            // console.log("error", error);
          }
          return (
            <div
              key={_}
              className={`flex  items-start  justify-center
            ${message.role === "user" ? "md:justify-end" : "md:justify-start"}`}
            >
              <Card
                className={`flex-1 w-full max-w-full md:max-w-[90%] p-4 overflow-x-auto
              ${message.role === "user" ? "bg-accent" : "bg-card"}`}
              >
                {message.role === "user" ? (
                  <p className="text-sm md:text-base lg:text-lg">{content}</p>
                ) : (
                  <RenderMarkdown content={content} />
                )}
              </Card>
            </div>
          );
        }
      
      })}
      {messageLoading && (
    <MessageLoadingSkeleton/>
      )}
    </div>
  );
};

const RenderMarkdown = ({ content }) => {
  return (
    <div
      className="
prose-sm
md:prose-base lg:prose-lg xl:prose-xl
bg-card
prose-ul:list-disc
prose-ol:list-decimal
prose-em:italic
prose-strong:font-bold
prose-a:underline

prose-img:mx-auto
prose-img:w-full
md:prose-img:w-[80%]
lg:prose-img:w-[60%]
md:prose-img:aspect-auto
md:prose-img:object-cover
md:prose-img:bg-center
prose-img:rounded-lg

    "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

const MessageLoadingSkeleton = ()=>{
  return(
    <Card className="w-full md:w-[90%]  max-w-xs  md:max-w-[500px] lg:max-w-[850px] xl:max-w-[1150px] 
    flex flex-col items-start gap-y-2   p-4 ">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[80%]" />
      <Skeleton className="h-4 w-[70%]" />

  </Card>
  )
}
const NewChatCarousel = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const chatId = useSelector((state) => state.chatScreen.chatId);
  return (
    <div
      // className={`${
      //   chatId ? "-translate-y-[1000%]" : "translate-y-0 "
      // } transition-all ease-in-out duration-300 `}
      className={`${chatId ? "hidden" : "block"} `}
    >
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-xs md:max-w-sm lg:max-w-lg relative flex items-center justify-center"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {newChatData.map((item, _) => (
            <CarouselItem key={_}>
              <div className="p-1">
                <Card>
                  <CardContent>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -bottom-10     flex items-center justify-center">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};
const newChatData = [
  {
    title: "Get Best and healthy Recipe with AI",
    description: "Ask me anything about recipe",
  },
  {
    title: "Find the best recipe for your mood",
    description: "Ask me Nutrition facts",
  },
  {
    title: "Get the best recipe for your diet",
    description: "Get best Diet for you health",
  },
];