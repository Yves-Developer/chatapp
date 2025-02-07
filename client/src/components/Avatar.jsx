import { useAuthStore } from "../store/useAuthStore";
import { useMessageStore } from "../store/useMessageStore";
const Avatar = ({ imgUrl, userData }) => {
  const { onlineUsers } = useAuthStore();
  return (
    <div
      className={`avatar ${
        onlineUsers.includes(userData) ? "avatar-online" : "avatar-offline"
      }`}
    >
      <div className="w-8 rounded-full">
        <img src={imgUrl} />
      </div>
    </div>
  );
};

export default Avatar;
