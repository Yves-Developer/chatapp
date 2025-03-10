import { LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
const Navbar = () => {
  const { userAuth, logOut } = useAuthStore();
  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-none">
        <div className="w-[40px] bg-primary/10 p-2 rounded-sm">
          <img src="/paper-plane.svg" alt="icon" />
        </div>
      </div>
      <div className="flex-1 px-2 mx-2">
        <Link to="/" className="text-xl">
          Chatify
        </Link>
      </div>
      {userAuth ? (
        <button onClick={() => logOut()} className="flex gap-1 items-center">
          <LogOut size="20" />
          Log Out
        </button>
      ) : (
        <Link to="/setting" className="flex gap-1 items-center">
          <Settings size="20" />
          Setting
        </Link>
      )}
    </div>
  );
};

export default Navbar;
