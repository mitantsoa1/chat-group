import React from "react";

const List = ({ member, BASE_URL, handleShowMemberProfile }) => {
  const memberPhotoPath = `${BASE_URL}/uploads/profiles/${
    member.profilePicture ?? "default_avatar.png"
  }`;

  const getStatusColor = () => {
    return member.isConnected ? "bg-success" : "bg-gray-400";
  };

  return (
    <li
      className="transition-all duration-300 rounded-lg cursor-pointer group hover:bg-base-200"
      key={member.id}
    >
      <div className="flex items-center justify-between w-full gap-4 p-4">
        {/* Avatar and User Info */}
        <div className="flex items-center flex-1 gap-4">
          <div className="relative">
            <div className="w-12 h-12 overflow-hidden rounded-full ring-2 ring-base-300">
              <img
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                src={memberPhotoPath}
                alt={member.username}
              />
            </div>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${getStatusColor()}`}
            ></span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold truncate">
                {member.username}
              </h3>
              {member.isVerified && (
                <span className="text-primary">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </span>
              )}
            </div>
            {member.role && (
              <p className="text-sm truncate text-base-content/70">
                {member.role}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 transition-opacity opacity-0 group-hover:opacity-100">
          <button
            className="btn btn-ghost btn-sm tooltip tooltip-left"
            data-tip="View Profile"
            onClick={handleShowMemberProfile(member)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Add to Group</a>
              </li>
              <li>
                <a>Block User</a>
              </li>
              <li>
                <a className="text-error">Report</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
};

export default List;
