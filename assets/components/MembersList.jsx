import React, { useEffect, useState } from "react";
import List from "./List";
import ModalProfile from "./ModalProfile";

const MembersList = ({
  group,
  members,
  BASE_URL,
  isOpen,
  onClose,
  currentUser,
}) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const groupPhotoPath = `${BASE_URL}/uploads/groups/${
    group.photo ?? "group_default_avatar.jpg"
  }`;

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  useEffect(() => {
    const modalElement = document.getElementById("group-profile-modal");
    if (isOpen && modalElement) {
      modalElement.showModal();
    }
  }, [isOpen]);
  const handleClose = () => {
    const modalElement = document.getElementById("group-profile-modal");
    if (modalElement) {
      modalElement.close();
    }
    onClose();
  };

  const handleShowMemberProfile = (member) => (event) => {
    event.preventDefault();

    setSelectedMember(member);
    setIsModalOpen(true);
  };

  return (
    <dialog id="group-profile-modal" className="modal" onClose={handleClose}>
      <div className="relative flex flex-col items-center w-11/12 max-w-md modal-box bg-base-100">
        {/* Header with large profile picture */}
        <div className="absolute left-0 w-full h-32 rounded-t-lg bg-gradient-to-r from-primary to-secondary opacity-90"></div>

        <div className="z-10 -mb-16 rounded-full ring-4 ring-base-100 ring-offset-2 mt-14">
          <div className="w-32 h-32 overflow-hidden rounded-full shadow-xl">
            <img
              src={groupPhotoPath}
              alt={`${group.name}'s profile`}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <h3>{group.name}</h3>
        <div className="w-full mt-20">
          <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
            {members.map((member) => (
              <List
                member={member}
                BASE_URL={BASE_URL}
                key={member.id}
                handleShowMemberProfile={handleShowMemberProfile}
              />
            ))}
          </ul>
        </div>

        {selectedMember && (
          <ModalProfile
            member={selectedMember}
            BASE_URL={BASE_URL}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            currentUser={currentUser}
          />
        )}

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

export default MembersList;
