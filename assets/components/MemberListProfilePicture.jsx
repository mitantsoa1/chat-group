import React, { useState } from "react";
import ModalProfile from "./ModalProfile";
import MembersList from "./MembersList";

const MemberListProfilePicture = ({
  group,
  members,
  BASE_URL,
  currentUser,
}) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalListOpen, setIsModalListOpen] = useState(false);
  const countMembers = members.length;
  const groupPicturePath = `${BASE_URL}/uploads/groups/${
    group.photo ?? "group_default_avatar.jpg"
  }`;

  const handleShowMemberProfile = (member) => (event) => {
    event.preventDefault();
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handleShowMembersList = (group) => (event) => {
    event.preventDefault();

    setSelectedGroup(group);
    setIsModalListOpen(true);
  };

  const handleCloseModalList = () => {
    setIsModalListOpen(false);
    setIsModalListOpen(null);
  };

  const renderMembers = () => {
    if (countMembers <= 3) {
      return members.map((member) => (
        <div
          key={member.id}
          className="tooltip tooltip-bottom"
          data-tip={member.username}
        >
          <div className="avatar">
            <div
              className="w-6 h-6 overflow-hidden transition-all rounded-full cursor-pointer hover:ring-2 hover:ring-primary"
              onClick={handleShowMemberProfile(member)}
            >
              <img
                src={`${BASE_URL}/uploads/profiles/${
                  member.profilePicture ?? "default_avatar.png"
                }`}
                alt={`Avatar ${member.username}`}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      ));
    }

    return members.slice(0, 2).map((member) => (
      <div
        key={member.id}
        className="tooltip tooltip-bottom"
        data-tip={member.username}
      >
        <div className="avatar">
          <div
            className="w-6 h-6 overflow-hidden transition-all rounded-full cursor-pointer hover:ring-2 hover:ring-primary"
            onClick={handleShowMemberProfile(member)}
          >
            <img
              src={`${BASE_URL}/uploads/profiles/${
                member.profilePicture ?? "default_avatar.png"
              }`}
              alt={`Avatar ${member.username}`}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <>
        <p className="p-0 my-0">
          <img
            src={groupPicturePath}
            alt="image"
            className="mr-2 rounded-full cursor-pointer w-7 h-7 tooltip tooltip-bottom"
            onClick={handleShowMembersList(group)}
          />
        </p>
        {group ? group.name : "Sélectionner un groupe"}

        <div className="relative z-0 flex ml-2 -space-x-2 avatar-group rtl:space-x-reverse">
          {renderMembers()}
          {countMembers > 3 && (
            <div
              className="tooltip tooltip-bottom"
              data-tip={`${countMembers - 2} more members`}
            >
              <div
                className="avatar placeholder "
                onClick={handleShowMembersList(group)}
              >
                <div className="flex items-center justify-center w-6 h-6 text-xs rounded-full cursor-pointer bg-neutral text-neutral-content">
                  <span>+{countMembers - 2}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </>

      {selectedMember && (
        <ModalProfile
          member={selectedMember}
          BASE_URL={BASE_URL}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          currentUser={currentUser}
        />
      )}
      {selectedGroup && (
        <MembersList
          group={group}
          members={members}
          BASE_URL={BASE_URL}
          isOpen={isModalListOpen}
          onClose={handleCloseModalList}
          currentUser={currentUser}
        />
      )}
    </>
  );
};

export default MemberListProfilePicture;
