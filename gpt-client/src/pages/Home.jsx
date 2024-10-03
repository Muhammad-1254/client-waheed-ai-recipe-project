import { useSelector } from "react-redux";
import { LeftNavbarComponent } from "../components/LeftNavbar";
import Selection from "../components/Selection";
import { UserInput } from "../components/UserInput";
import { ScrollArea } from "../components/ui/scroll-area";
import ChatSection from "../components/ChatSection";

const Home = () => {
  return (
    <div className="w-screen h-screen    flex items-start  pt-14  md:pt-0">
      <LeftNavbarComponent />
      <ScrollArea className="border  flex flex-1 h-full">
          <div className="relative flex items-center justify-center w-full  max-w-xs  md:max-w-[500px] lg:max-w-[850px] xl:max-w-[1150px]  mx-auto ">
              <ChatSection />
        </div>
      </ScrollArea>
    </div>
  );
};

export default Home;
