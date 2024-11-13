import React, { useState } from "react";
import ModalProfile from "./ModalProfile";
import MembersList from "./MembersList";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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

  const handleDeleteGroup = () => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
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
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm">
          <img
            src={`${BASE_URL}/images/dots.png`}
            alt="Menu"
            className="w-5 h-5"
          />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52"
        >
          <li>
            <a>Group Settings</a>
          </li>
          <li>
            <a>Manage Members</a>
          </li>
          <li>
            <a className="text-error" onClick={handleDeleteGroup}>
              Delete Group
            </a>
          </li>
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
      {/* <div>
        <img src={`${BASE_URL}/images/dots.png`} alt="" className="h-6" />
      </div> */}
    </>
  );
};

export default MemberListProfilePicture;
