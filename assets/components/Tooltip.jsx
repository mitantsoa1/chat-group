export default function Tooltip({ message, children }) {
  return (
    <div className="relative flex flex-col items-center justify-center group max-w-max">
      {children}
      <div className="absolute z-50 px-3 py-2 ml-auto mr-auto text-xs font-medium transition-all duration-500 transform scale-0 -translate-x-1/2 rounded-lg left-1/2 top-10 min-w-max group-hover:scale-100">
        <div className="flex flex-col items-center max-w-xs shadow-lg">
          <div className="w-4 h-2 bg-gray-800 clip-bottom"></div>
          <div className="relative z-20 p-2 text-xs text-center text-white bg-gray-800 rounded">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
