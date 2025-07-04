import React, { useContext } from "react";
import ModalAddGroup from "./ModalAddGroup";
import { AdminContext } from "../context/useAdmin";

function Group({ groups, handleGroupClick, setGroups }) {
  const BASE_URL = "http://localhost:8000";

  const { isAdmin } = useContext(AdminContext);

  return (
    <>
      <ModalAddGroup setGroups={setGroups} />
      <div
        className={`flex flex-col w-full ${
          isAdmin ? "mt-3" : "mt-10"
        }  space-y-2 overflow-y-auto h-1/3`}
      >
        {groups.map((group) => (
          <div
            key={group.id}
            onClick={() => handleGroupClick(group)}
            className="flex items-center p-1 transition-all rounded-lg cursor-pointer hover:bg-gray-200"
          >
            <img
              src={`${BASE_URL}/uploads/groups/${
                group.photo ?? "group_default_avatar.jpg"
              }`}
              alt={group.name}
              className="w-10 h-10 mr-2 border-white rounded-full"
            />
            <div className="flex items-center">
              <div className="font-medium text-gray-700">{group.name}</div>
              <div className="flex items-center ml-2"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Group;
