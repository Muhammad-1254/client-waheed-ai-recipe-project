import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { useEffect, useState } from "react";
import { ToastAction } from "../components/ui/toast";
import { toast } from "../hooks/use-toast";
import axios from "axios";
import { apiRoutes } from "../lib/apiRoutes";
import { setIsAuth, setUser } from "../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  return (
    <div className="w-screen px-[2%] md:px-0 h-screen flex items-center justify-center">
      <LoginTabs />
    </div>
  );
};

export default Login;

const loginUserInitialState = {
  email: "usman@gmail.com",
  password: "12345678",
};
const signupUserInitialState = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

export function LoginTabs() {
  const [loginUser, setLoginUser] = useState(loginUserInitialState);
  const [signupUser, setSignupUser] = useState(signupUserInitialState);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.post(apiRoutes.login, loginUser, {
        withCredentials: true,
      });
      const data = res.data.data;
      if (data.user._id) {
        dispatch(
          setUser({
            userId: data.user._id,
            username: data.user.username,
            email: data.user.email,
          }));
        dispatch(setIsAuth(true))
      } else {
        toast({
          title: "Invalid credentials",
        });
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log("error while signup", error);
      toast({
        title: "Something went wrong",
        description: error.response.data.message,
      });
      setLoading(false);
    }
  };
  const signupHandler = async () => {
    for (const key in signupUser) {
      if (!signupUser[key]) {
        toast({
          title: "Please fill all the fields",
        });

        return;
      }
    }
    if (signupUser.password !== signupUser.confirmPassword) {
      toast({
        title: "Password does not match",
      });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(apiRoutes.signup, signupUser, {
        withCredentials: true,
      });
      console.log("res", res.data);
      const data = res.data;
      if (!data.user._id) {
        toast({
          title: "Invalid credentials",
        });
        setLoading(false);
        return;
      }
      if (data.statusCode === 200) {
        dispatch(
          setUser({
            userId: data.user._id,
            username: data.user.username,
            email: data.user.email,
          }));
        dispatch(setIsAuth(true))
      }
      navigate("/");

      setLoading(false);
    } catch (error) {
      console.log("error while signup", error);
      toast({
        title: "Something went wrong",
        description: error.response.data.message,
      });
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Signup</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card className="pt-4 ">
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                value={loginUser.email}
                onChange={(e) =>
                  setLoginUser({ ...loginUser, email: e.target.value })
                }
                placeholder="jondoe@gmail.com"
              />
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                value={loginUser.password}
                onChange={(e) =>
                  setLoginUser({ ...loginUser, password: e.target.value })
                }
                placeholder="*****"
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-center">
            <Button disabled={loading} onClick={loginHandler}>
              {loading ? "Loading..." : "Login"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card className="pt-4 ">
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                value={signupUser.email}
                onChange={(e) =>
                  setSignupUser({ ...signupUser, email: e.target.value })
                }
                placeholder="jondoe@gmail.com"
              />
            </div>
            <div className="space-y-1">
              <Label>Username</Label>
              <Input
                value={signupUser.username}
                onChange={(e) =>
                  setSignupUser({ ...signupUser, username: e.target.value })
                }
                placeholder="jon-doe"
              />
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                value={signupUser.password}
                onChange={(e) =>
                  setSignupUser({ ...signupUser, password: e.target.value })
                }
                placeholder="*****"
              />
            </div>
            <div className="space-y-1">
              <Label>Confirm Password</Label>
              <Input
                value={signupUser.confirmPassword}
                onChange={(e) =>
                  setSignupUser({
                    ...signupUser,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="*****"
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-center">
            <Button disabled={loading} onClick={signupHandler}>
              {loading ? "Loading..." : "Login"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
