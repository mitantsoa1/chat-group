import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Input from "../components/Input";
import Group from "../components/Groups";
import ChatGroup from "../components/ChatGroup";
import NotMembers from "../components/NotMembers";
import ModalAddGroup from "../components/ModalAddGroup";
import { AdminContext } from "../context/useAdmin";

const Main = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [notMembers, setNotMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { isAdmin, toggleAdmin } = useContext(AdminContext);

  // Chargement de l'utilisateur actuel
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await axios.get(
          `https://localhost:8000/api/user/current`
        );
        if (response.data) {
          setCurrentUser(response.data);
          const roles = response.data.roles;
          if (roles.includes("ROLE_ADMIN")) {
            toggleAdmin();
          }
          // setIsAdmin(roles.includes("ROLE_ADMIN"));
        } else {
          window.location("/login");
        }
      } catch (error) {
        console.error("Error loading current user:", error);
      }
    };
    loadCurrentUser();
  }, []);

  // Chargement des amis
  useEffect(() => {
    if (currentUser) {
      const loadFriends = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`https://localhost:8000/api/groups`);

          setGroups(response.data);
        } catch (error) {
          console.error("Error loading friends:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadFriends();

      // Configuration de Mercure pour les notifications
      const hubUrl = new URL("http://localhost:3000/.well-known/mercure");
      hubUrl.searchParams.append(
        "topic",
        `/user/${currentUser.id}/friends/status`
      );

      const eventSource = new EventSource(hubUrl);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("data ??????", data);

          // setFriends((prevFriends) =>
          //   prevFriends.map((friend) =>
          //     friend.id === data.userId
          //       ? { ...friend, connected: data.connected }
          //       : friend
          //   )
          // );

          // Mise à jour de l'ami sélectionné si nécessaire
          if (selectedFriend && selectedFriend.id === data.userId) {
            setSelectedFriend((prev) => ({
              ...prev,
              connected: data.connected,
            }));
          }
        } catch (error) {
          console.error("Erreur lors du traitement du message:", error);
        }
      };

      // return () => {
      //   eventSource.close();
      //   axios
      //     .post("https://localhost:8000/api/user/disconnect")
      //     .catch((error) => {
      //       console.error("Erreur lors de la déconnexion:", error);
      //     });
      // };
    }
  }, [currentUser, selectedFriend]);
  // fin useEffect chargement des amis

  // Connexion et déconnexion de l'utilisateur
  useEffect(() => {
    const connectUser = async () => {
      try {
        const res = await axios.post("https://localhost:8000/api/user/connect");
      } catch (error) {
        console.error("Error connecting user:", error);
      }
    };

    if (currentUser) {
      connectUser();
    }

    const handleBeforeUnload = () => {
      navigator.sendBeacon("https://localhost:8000/api/user/disconnect");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      axios.post("https://localhost:8000/api/user/disconnect");
    };
  }, [currentUser]);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    const loadNotMember = async () => {
      try {
        const response = await axios.get(
          `https://localhost:8000/api/groups/${group.id}`
        );

        setNotMembers(response.data.notMembers);
        setMembers(response.data.members);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadNotMember();
  };

  const handleAddMember = async (group, id) => {
    try {
      const response = await axios.post(
        `https://localhost:8000/api/groups/add/${group}/${id}`
      );

      if (response.status == 200) {
        setNotMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== id)
        );
        setMembers((prevMembers) => [...prevMembers, response.data.member]);
      }
    } catch (error) {
      console.error("Error connecting user:", error);
    }
  };

  return (
    <>
      <div className="w-full h-8 bg-gray-200">
        <header className="fixed z-50 flex flex-col w-full h-8 p-0 mb-0 text-lg font-semibold bg-gray-300">
          {isLoading ? (
            <></>
          ) : currentUser ? (
            <div className="flex items-center space-x-2">
              <div>{currentUser.username ?? ""}</div>
            </div>
          ) : (
            <p>Erreur de chargement de l'utilisateur</p>
          )}
        </header>
      </div>
      <div className="flex w-full h-full gap-0">
        <div className="flex flex-col flex-none w-1/6 h-screen bg-gray-300">
          <p className="fixed p-1 pt-[10px] w-1/6 bg-primary text-white font-semibold text-sm justify-center h-8">
            Vos groupes
          </p>
          {isAdmin && (
            <div className="w-full mt-10 mb-4">
              <button
                className="w-full h-8 text-3xl text-white bg-blue-700"
                onClick={() =>
                  document.getElementById("modal_add_group").showModal()
                }
              >
                +
              </button>
            </div>
          )}
          <Group
            groups={groups}
            handleGroupClick={handleGroupClick}
            setGroups={setGroups}
          />
        </div>
        <div
          className={`grow flex flex-col overflow-x-hidden bg-white shadow-lg `}
        >
          {selectedGroup && (
            <ChatGroup
              group={selectedGroup}
              currentUser={currentUser}
              members={members}
              setGroups={setGroups}
            />
          )}
        </div>
        {isAdmin && selectedGroup && (
          <div className="flex flex-col flex-none w-1/6 h-screen bg-gray-300">
            <p className="fixed p-1 pt-[10px] w-full bg-primary text-white font-semibold text-sm justify-center h-8">
              Pas encore membre de {selectedGroup.name}
            </p>
            {notMembers.length > 0 && (
              <NotMembers
                notMembers={notMembers}
                handleAddMember={handleAddMember}
                group={selectedGroup}
                setMembers={setMembers}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Main;
