import React, { useContext, useState } from "react";
import ModalProfile from "./ModalProfile";
import MembersList from "./MembersList";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { AdminContext } from "../context/useAdmin";

const MemberListProfilePicture = ({
  group,
  members,
  BASE_URL,
  currentUser,
  setGroups,
}) => {
  const [selectedGroup, setSelectedGroup] = useState(group);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalListOpen, setIsModalListOpen] = useState(false);
  const countMembers = members?.length || 0;
  const groupPicturePath = `${BASE_URL}/uploads/groups/${
    selectedGroup?.photo ?? "group_default_avatar.jpg"
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
    setSelectedGroup(group); // Reset to original group
  };

  const renderMembers = () => {
    if (!members || countMembers === 0) return null;

    if (countMembers <= 3) {
      return members.map((member) => (
        <div
          key={member.id}
          className="tooltip tooltip-bottom "
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

  const MySwal = withReactContent(Swal);

  const DeleteGroup = async (id) => {
    try {
      const response = await axios.post(`/api/groups/delete/${id}`);

      if (response.data.success) {
        // Update the groups list by filtering out the deleted group
        setGroups((prevGroups) => prevGroups.filter((g) => g.id !== id));

        // Update the selected group with the response data
        setSelectedGroup(null);

        await MySwal.fire({
          title: "Success!",
          text: "Group deleted successfully",
          icon: "success",
          didOpen: () => {
            MySwal.hideLoading();
          },
        });

        return true;
      } else {
        throw new Error(response.data.message || "An error occurred");
      }
    } catch (error) {
      await MySwal.fire({
        title: "Error!",
        text: error.message || "Failed to delete group",
        icon: "error",
        didOpen: () => {
          MySwal.hideLoading();
        },
      });
      console.error("Error:", error);
      return false;
    }
  };

  const handleDeleteGroup = async (e) => {
    e.preventDefault();

    const result = await MySwal.fire({
      title: "Do you want to delete the group?",
      text: "This action cannot be undone.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      didOpen: () => {
        MySwal.hideLoading();
      },
    });

    if (result.isConfirmed) {
      const deleted = await DeleteGroup(group.id);
      if (deleted) {
        // Additional cleanup if needed
        setIsModalListOpen(false);
      }
    }
  };

  const { isAdmin } = useContext(AdminContext);
  return (
    <>
      <div className="flex items-center min-w-52 w-52">
        <div className="flex items-center flex-1 min-w-0">
          <img
            src={groupPicturePath}
            alt={group?.name || "Group"}
            className="mr-2 rounded-full cursor-pointer w-7 h-7 tooltip tooltip-bottom"
            onClick={handleShowMembersList(group)}
          />
          <span className="font-medium truncate">
            {group?.name || "Select a group"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative z-0 flex -space-x-2 avatar-group rtl:space-x-reverse">
            {renderMembers()}
            {countMembers > 3 && (
              <div
                className="tooltip tooltip-bottom"
                data-tip={`${countMembers - 2} more members`}
              >
                <div
                  className="avatar placeholder"
                  onClick={handleShowMembersList(group)}
                >
                  <div className="flex items-center justify-center w-6 h-6 text-xs rounded-full cursor-pointer bg-neutral text-neutral-content">
                    <span>+{countMembers - 2}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="dropdown dropdown-end bg-white">
              <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm">
                <img
                  src={`${BASE_URL}/images/dots.png`}
                  alt="Menu"
                  className="w-5 h-5"
                />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[100] menu p-2 shadow-lg bg-base-100 rounded-box w-52"
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
          )}
        </div>
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
          group={selectedGroup}
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
