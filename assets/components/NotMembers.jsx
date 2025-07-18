function NotMembers({ notMembers, handleAddMember, group, setMembers }) {
  return (
    <>
      <div className="flex flex-col mt-10 space-y-2">
        {notMembers.map((notMember) => (
          <div
            key={notMember.id}
            // onClick={() => handleFriendClick(notMember)}
            className="flex flex-row items-center justify-between p-1 transition-all"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 mr-2 bg-white border-white rounded-full"></div>
              <div className="font-medium text-gray-700 sm:block">
                <span className="cursor-pointer">{notMember.username}</span>
              </div>
            </div>
            <button
              className="h-fit bg-primary cursor-pointer text-[8px] text-white p-1 rounded-md hover:bg-primary/80 transition-all"
              onClick={() => handleAddMember(group.id, notMember.id)}
            >
              Ajouter
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default NotMembers;
