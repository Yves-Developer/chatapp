const DecorativeGrid = ({ title, description }) => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center min-h-screen bg-base-200 text-white p-6">
      {/* Animated Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="w-16 h-16 bg-primary rounded-xl animate-pulse"
            style={{ animationDelay: `${index * 100}ms` }}
          ></div>
        ))}
      </div>

      {/* Heading & Description */}
      <h1 className="text-3xl font-bold text-center">{title}</h1>
      <p className="text-lg text-gray-300 text-center mt-2 max-w-md">
        {description}
      </p>
    </div>
  );
};

export default DecorativeGrid;
