import { useEffect, useState } from "react";
import Input from "./Input";
import axios from "axios";

function NotFriends({ randomNotFriends, handleAddFriend }) {
  const [idNotFriend, setIdNotFriend] = useState(null);

  return (
    <>
      <div className="flex flex-col space-y-2">
        {randomNotFriends.map((notFriend) => (
          <div
            key={notFriend.id}
            // onClick={() => handleFriendClick(notFriend)}
            className="flex flex-row items-center justify-between p-1 transition-all"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 mr-2 bg-white border-white rounded-full"></div>
              <div className="font-medium text-gray-700">
                <span className="cursor-pointer">{notFriend.username}</span>
              </div>
            </div>
            <button
              className="h-fit bg-primary cursor-pointer text-[8px] text-white p-1 rounded-md hover:bg-primary/80 transition-all"
              onClick={() => handleAddFriend(notFriend.id)}
            >
              Ajouter
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default NotFriends;
