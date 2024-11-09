import React from "react";

function Group({ groups, handleGroupClick }) {
  return (
    <div className="flex flex-col space-y-2 overflow-y-auto h-1/3">
      {groups.map((group) => (
        <div
          key={group.id}
          onClick={() => handleGroupClick(group)}
          className="flex items-center p-1 transition-all rounded-lg cursor-pointer hover:bg-gray-200"
        >
          <div className="w-10 h-10 mr-2 bg-white border-white rounded-full"></div>
          <div className="flex items-center">
            <div className="font-medium text-gray-700">{group.name}</div>
            <div className="flex items-center ml-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Group;
