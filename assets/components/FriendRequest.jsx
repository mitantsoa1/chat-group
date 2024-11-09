import { useEffect, useState } from "react";
import Input from "./Input";
import axios from "axios";

function FriendRequest({ pendingFriends, handlePendingFriendAction }) {
  const [activeFriendId, setActiveFriendId] = useState(null);

  const handleToggleButtons = (id) => {
    setActiveFriendId((prevId) => (prevId === id ? null : id));
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".friend-item")) {
      setActiveFriendId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handlePendingFriendClick = async (pendingFriend, action) => {
    try {
      const response = await axios.post(
        `https://localhost:8000/api/friends/${action}/${pendingFriend.id}`
      );
      if (response.data.status === 200) {
        handlePendingFriendAction(pendingFriend, action);
        setActiveFriendId(null);
      }
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-2">
        {pendingFriends.map((pendingFriend) => (
          <div
            key={pendingFriend.id}
            className="flex flex-col p-1 space-y-2 transition-all friend-item"
          >
            <div
              className="flex items-center"
              onClick={() => handleToggleButtons(pendingFriend.id)}
            >
              <div className="w-10 h-10 mr-2 bg-white border-white rounded-full"></div>
              <div className="font-medium text-gray-700">
                <span className="cursor-pointer">{pendingFriend.username}</span>
              </div>
            </div>
            {activeFriendId === pendingFriend.id && (
              <div className="flex flex-row items-center justify-between px-8 space-x-2">
                <button
                  className="h-fit bg-primary cursor-pointer text-[8px] text-white p-1 rounded-md hover:bg-primary/80 transition-all"
                  onClick={() =>
                    handlePendingFriendClick(pendingFriend, "accept")
                  }
                >
                  Accepter
                </button>
                <button
                  className="h-fit bg-primary cursor-pointer text-[8px] text-white p-1 rounded-md hover:bg-primary/80 transition-all"
                  onClick={() =>
                    handlePendingFriendClick(pendingFriend, "refuse")
                  }
                >
                  Refuser
                </button>
                <button
                  className="h-fit bg-primary cursor-pointer text-[8px] text-white p-1 rounded-md hover:bg-primary/80 transition-all"
                  onClick={() =>
                    handlePendingFriendClick(pendingFriend, "block")
                  }
                >
                  Bloquer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default FriendRequest;
