import { User, UserCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import axios from "axios";
import { apiRoutes } from "../lib/apiRoutes";
import { useNavigate } from "react-router-dom";
import { toast } from "../hooks/use-toast";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const navigation = useNavigate();
  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        apiRoutes.logout,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        navigation("/login");
      }
    } catch (error) {
      console.log("error while logging out", error);
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="p-2">
          <User />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[320px] md:w-[400px] lg:w-[600px]">
        <AlertDialogHeader className={"items-center justify-center "}>
          <AlertDialogTitle className="text-xl md:text-2xl text-center">
            User Information
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="text-lg md:text-xl  text-center">
              username: <span className="font-semibold ">{user.username}</span>
            </p>
            <p className="text-lg md:text-xl  text-center">
              email: <span className="font-semibold ">{user.email}</span>
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={logoutHandler}>Logout</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Profile;
