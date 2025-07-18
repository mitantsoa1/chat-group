import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Group from "../components/Groups";
import Chat from "../components/Chat";
import NotMembers from "../components/NotMembers";
import { AdminContext } from "../context/useAdmin";
import { Loader2, Menu } from "lucide-react";

const Main = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [notMembers, setNotMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [sidebarLeft, setSidebarLeft] = useState(false);
  const [sidebarRight, setSidebarRight] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { isAdmin, toggleAdmin } = useContext(AdminContext);

  // Chargement de l'utilisateur actuel
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/user/current`
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
          const response = await axios.get(`http://localhost:8000/api/groups`);

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

          /** Pour mettre à jour le statut d'un utilisateur dès qu'il se connecte */
          // setMembers((prevMembers) =>
          //   prevMembers.map((member) =>
          //     member.id === data.userId
          //       ? { ...member, isConnected: data.connected }
          //       : member
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
      //     .post("http://localhost:8000/api/user/disconnect")
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
        const res = await axios.post("http://localhost:8000/api/user/connect");
      } catch (error) {
        console.error("Error connecting user:", error);
      }
    };

    if (currentUser) {
      connectUser();
    }

    const handleBeforeUnload = () => {
      navigator.sendBeacon("http://localhost:8000/api/user/disconnect");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      axios.post("http://localhost:8000/api/user/disconnect");
    };
  }, [currentUser]);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    const loadNotMember = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/groups/${group.id}`
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
        `http://localhost:8000/api/groups/add/${group}/${id}`
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

  // Gestionnaire pour fermer la sidebar lors d'un clic à l'extérieur
  const handleClickOutside = (e) => {
    if (sidebarLeft || sidebarRight) {
      setSidebarLeft(false);
      setSidebarRight(false);
    }
  };

  return (
    <>
      <div className="flex w-full h-full gap-0" onClick={handleClickOutside}>
        {/* Sidebar gauche */}
        <div
          className={`flex flex-col flex-none ${
            sidebarLeft ? "w-2/6" : "w-1/6"
          } h-screen bg-gray-300 overflow-y-auto`}
        >
          <p
            className={`fixed p-1 pt-[10px] ${
              sidebarLeft ? "w-2/6" : "w-1/6"
            } bg-primary text-white font-semibold text-sm justify-center h-8`}
          >
            <span className="block sm:hidden">
              <Menu
                className="cursor-pointer"
                onClick={() => setSidebarLeft(true)}
              />
            </span>
            <span className="hidden sm:block">Vos groupes</span>
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
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <Group
              groups={groups}
              handleGroupClick={handleGroupClick}
              setGroups={setGroups}
              sidebarLeft={sidebarLeft}
            />
          )}
        </div>

        {/* Main (centre) */}
        <div
          className={`grow flex flex-col overflow-x-hidden overflow-y-auto bg-white shadow-lg h-screen`}
        >
          {/* Header centré */}
          <div className="w-full h-8 bg-gray-200">
            <header className="flex flex-col w-full h-8 p-0 mb-0 text-lg font-semibold bg-gray-300 items-center justify-center">
              {isLoading ? (
                <div>
                  <Loader2 className="animate-spin" />
                </div>
              ) : currentUser ? (
                <div className="flex flex-row justify-between items-center w-full px-2 md:px-4 lg:px-6">
                  <div className="flex items-center space-x-2">
                    <img
                      src={`${BASE_URL}/uploads/profiles/${
                        currentUser.profilePicture ?? "default_avatar.png"
                      }`}
                      alt={currentUser.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <p>{currentUser.username ?? ""}</p>
                  </div>
                  {!sidebarLeft && !sidebarRight && (
                    <div className="flex items-center ml-auto">
                      <a
                        href="/logout"
                        className="mx-3 my-2 border font-light text-sm text-gray-700 hover:text-white hover:bg-gray-700 px-2 py-1 rounded"
                      >
                        Se déconnecter
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p>Erreur de chargement de l'utilisateur</p>
              )}
            </header>
          </div>
          {/* Chat */}
          {selectedGroup && (
            <Chat
              group={selectedGroup}
              currentUser={currentUser}
              members={members}
              setGroups={setGroups}
            />
          )}
        </div>

        {/* Sidebar droite */}
        {isAdmin && selectedGroup && (
          <div
            className={`flex flex-col flex-none w-1/6 h-screen bg-gray-300 overflow-y-auto`}
          >
            <p
              className={`fixed p-1 pt-[10px] w-1/6 bg-primary text-white font-semibold text-sm justify-center h-8`}
            >
              <span className="block sm:hidden">
                {!sidebarRight ? (
                  <Menu
                    className="cursor-pointer"
                    onClick={() => setSidebarRight(true)}
                  />
                ) : (
                  <span className="hidden sm:block">Pas encore membre</span>
                )}
              </span>

              <span className="hidden sm:block">Pas encore membre</span>
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
