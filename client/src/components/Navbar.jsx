import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
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
      <Link to="/setting" className="flex gap-1 items-center">
        <Settings size="20" />
        Setting
      </Link>
    </div>
  );
};

export default Navbar;
