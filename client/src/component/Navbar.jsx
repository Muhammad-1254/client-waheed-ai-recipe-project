import { useContext, useEffect, useState } from "react";
import { Link, useNavigation } from "react-router-dom";
import { globalUserInitialState,  } from "../providers/auth";
import axios from "axios";
import { apiRoutes } from "../utils/apiRoutes";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { UserContext } from "../store/user";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const [nav, setNav] = useState(false);
 
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        apiRoutes.logout,
        {},
        { withCredentials: true }
      );
      console.log("res: ", res);
      if (res.status === 200) {
        setUser(globalUserInitialState);
        window.location.href = "/login";
      }
    } catch (error) {
      console.log("error while logging out", error);
    }
  };
  const handleNavBtnClickedS = () => {
    setNav(false);
  };
  const handleLogoutS = async () => {
    setNav(false);
    await handleLogout();
  };
  return (
    <header className="w-full h-14 md:h-16 relative bg-blue-500  flex  justify-between items-center px-4  ">
      <Link
        to="/"
        className="text-2xl font-bold text-white  hover:text-white/80 "
      >
        Flavor Nexus
      </Link>

      {/* for medium devices */}
      <nav className="hidden md:flex items-center justify-normal gap-x-3">
        <GetNavButton title={"Home"} link={"/"} />
        <GetNavButton title={"About"} link={"/about"} />

        {user.isAuth ? (
          <>
            <GetNavButton title={"Recipes"} link={"/recipes"} />
            <GetNavButton title={"Recipe Generator"} link={"/chatbot"} />
            <GetNavButton title={"Contact"} link={"/contact"} />

            <GetNavButton title={"Logout"} btnClicked={handleLogout} />
          </>
        ) : (
          <>
            <GetNavButton title={"Login"} link={"/login"} />
            <GetNavButton title={"Register"} link={"/register"} />
          </>
        )}
      </nav>
      {/* for small devices */}
      <nav className="md:hidden flex items-center gap-x-3 ">
        <button onClick={() => setNav(!nav)} className="z-30">
          {nav ? (
            <AiOutlineMenuUnfold className="text-white text-2xl " />
          ) : (
            <AiOutlineMenuFold className="text-white text-2xl  " />
          )}
        </button>
        <div
          className={`absolute top-0 right-0 z-20 min-h-[85vh] max-h-[85vh] w-full h-full bg-blue-500 
      flex flex-col items-center justify-center gap-y-3
      rounded overflow-hidden
      duration-200 ease-in 
        ${nav ? "max-w-[85vw] " : "max-w-0 "}
        `}
        >
          <GetNavButtonS
            title={"Home"}
            link={"/"}
            btnClicked={handleNavBtnClickedS}
          />
          <GetNavButtonS
            title={"About"}
            link={"/about"}
            btnClicked={handleNavBtnClickedS}
          />
          {user.isAuth ? (
            <>
              <GetNavButtonS
                title={"Recipes"}
                link={"/recipes"}
                btnClicked={handleNavBtnClickedS}
              />
              <GetNavButtonS
                title={"Recipe Generator"}
                link={"/chatbot"}
                btnClicked={handleNavBtnClickedS}
              />
              <GetNavButtonS
                title={"Contact"}
                link={"/contact"}
                btnClicked={handleNavBtnClickedS}
              />

              <GetNavButtonS title={"Logout"} btnClicked={handleLogoutS} />
            </>
          ) : (
            <>
              <GetNavButtonS
                title={"Login"}
                link={"/login"}
                btnClicked={handleNavBtnClickedS}
              />
              <GetNavButtonS
                title={"Register"}
                link={"/register"}
                btnClicked={handleNavBtnClickedS}
              />
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

const GetNavButton = ({ title, link, styles, btnClicked }) => {
  if (link) {
    return (
      <Link
        to={link}
        className={
          `bg-white text-blue-500 px-4 py-2 rounded-md mr-2 hover:bg-blue-400 hover:text-white capitalize
          ` +" "+
          styles
        }
      >
        {title}
      </Link>
    );
  } else {
    return (
      <button
        onClick={btnClicked}
        className={
          `bg-white text-blue-500 px-4 py-2 rounded-md mr-2 hover:bg-blue-400 hover:text-white capitalize` +
          styles
        }
      >
        {title}
      </button>
    );
  }
};

const GetNavButtonS = ({ title, link, styles, btnClicked }) => {
  if (link) {
    return (
      <Link
        onClick={btnClicked}
        to={link}
        className={
          `bg-white text-blue-500 px-4 py-2 rounded-md mr-2 hover:bg-blue-400 hover:text-white capitalize` +
          styles
        }
      >
        {title}
      </Link>
    );
  } else {
    return (
      <button
        onClick={btnClicked}
        className={
          `bg-white text-blue-500 px-4 py-2 rounded-md mr-2 hover:bg-blue-400 hover:text-white capitalize` +
          styles
        }
      >
        {title}
      </button>
    );
  }
};
