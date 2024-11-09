import React from "react";

function Friend({ friends, handleFriendClick }) {
  return (
    <div className="flex flex-col space-y-2 overflow-y-auto h-1/3">
      {friends.map((friend) => (
        <div
          key={friend.id}
          onClick={() => handleFriendClick(friend)}
          className="flex items-center p-1 transition-all rounded-lg cursor-pointer hover:bg-gray-200"
        >
          <div className="w-10 h-10 mr-2 bg-white border-white rounded-full"></div>
          <div className="flex items-center">
            <div className="font-medium text-gray-700">{friend.username}</div>
            <div className="flex items-center ml-2">
              {/* {friend.connected ? (
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                </div>
              )} */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Friend;
