import React, { useEffect } from "react";
import formatDate from "../_helpers";

const ModalProfile = ({ member, BASE_URL, isOpen, onClose, currentUser }) => {
  const profilePicturePath = `${BASE_URL}/uploads/profiles/${
    member.profilePicture ?? "default_avatar.png"
  }`;

  useEffect(() => {
    const modalElement = document.getElementById("member-profile-modal");
    if (isOpen && modalElement) {
      modalElement.showModal();
    }
  }, [isOpen]);

  const handleClose = () => {
    const modalElement = document.getElementById("member-profile-modal");
    if (modalElement) {
      modalElement.close();
    }
    onClose();
  };

  return (
    <dialog id="member-profile-modal" className="modal" onClose={handleClose}>
      <div className="relative flex flex-col items-center w-11/12 max-w-md modal-box bg-base-100">
        {/* Header with large profile picture */}
        <div className="absolute left-0 w-full h-32 rounded-t-lg bg-gradient-to-r from-primary to-secondary opacity-90"></div>

        <div className="z-10 -mb-16 rounded-full ring-4 ring-base-100 ring-offset-2 mt-14">
          <div className="w-32 h-32 overflow-hidden rounded-full shadow-xl">
            <img
              src={profilePicturePath}
              alt={`${member.username}'s profile`}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* User Info Section */}
        <div className="flex flex-col items-center w-full mt-20 space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-center">
              {member.id == currentUser.id ? "Vous" : member.username}
            </h2>
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                member.isConnected ? "bg-success" : "bg-gray-400"
              }`}
            ></span>
          </div>

          <div className="flex flex-col items-center space-y-2 text-center">
            <span className="px-4 py-1 text-sm rounded-full bg-base-200">
              {member.email}
            </span>
            <p className="text-sm text-base-content/70">
              Membre depuis {formatDate(member.createdAt)}
            </p>
          </div>

          {/* Additional Info Cards */}
          {/* <div className="grid w-full grid-cols-2 gap-4 p-4">
            <div className="p-4 text-center rounded-lg bg-base-200">
              <p className="text-sm font-semibold">Total Posts</p>
              <p className="text-xl font-bold text-primary">
                {member.totalPosts || 0}
              </p>
            </div>
            <div className="p-4 text-center rounded-lg bg-base-200">
              <p className="text-sm font-semibold">Groups</p>
              <p className="text-xl font-bold text-primary">
                {member.groupsCount || 0}
              </p>
            </div>
          </div> */}
        </div>

        {/* Modal Actions */}
        <div className="modal-action">
          <form method="dialog" className="space-x-2">
            <button className="btn btn-ghost" onClick={handleClose}>
              Close
            </button>
            {/* <button className="btn btn-primary">Send Message</button> */}
          </form>
        </div>
      </div>

      {/* Modal Background Click Handler */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
};

export default ModalProfile;
