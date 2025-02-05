const Avatar = ({ imgUrl }) => {
  return (
    <div className="avatar avatar-online">
      <div className="w-8 rounded-full">
        <img src={imgUrl} />
      </div>
    </div>
  );
};

export default Avatar;
