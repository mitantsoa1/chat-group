import { useEffect, useState } from "react";
import axios from "axios";
import Input from "../components/Input";
import Group from "../components/Groups";
import ChatGroup from "../components/ChatGroup";
import NotMembers from "../components/NotMembers";

const Main = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [notMembers, setNotMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [friends, setFriends] = useState([]);

  const [randomNotMembers, setRandomNotFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingFriends, setPendingFriends] = useState([]);
  const [notFriends, setNotFriends] = useState([]);

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

          setFriends((prevFriends) =>
            prevFriends.map((friend) =>
              friend.id === data.userId
                ? { ...friend, connected: data.connected }
                : friend
            )
          );

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
      }
    } catch (error) {
      console.error("Error connecting user:", error);
    }
  };

  return (
    <>
      <div className="w-full h-8 bg-gray-200">
        <header className="fixed z-50 w-full h-8 p-1 mb-0 text-lg font-semibold bg-gray-300">
          {isLoading ? (
            <></>
          ) : currentUser ? (
            <div className="flex items-center space-x-2">
              <div>{currentUser.photoProfile ?? ""}</div>
            </div>
          ) : (
            <p>Erreur de chargement de l'utilisateur</p>
          )}
        </header>
      </div>
      <div className="flex w-full h-screen overflow-hidden">
        <div className="w-1/6 bg-gray-300">
          <header className="h-8 p-1 text-lg font-semibold text-white bg-primary">
            Vos groupes
          </header>
          <div className="my-3">
            <Input
              type="text"
              className="flex-grow w-full p-2 bg-white border-2 rounded-lg outline-none"
              placeholder="Rechercher un ami"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Group groups={groups} handleGroupClick={handleGroupClick} />
        </div>
        <div
          className={`flex flex-col overflow-x-hidden bg-white shadow-lg ${
            isAdmin ? "w-4/6" : "w-full"
          }`}
        >
          {selectedGroup && (
            <ChatGroup
              group={selectedGroup}
              currentUser={currentUser}
              members={members}
            />
          )}
        </div>

        <div className="flex flex-col w-1/6 bg-gray-300">
          {isAdmin && selectedGroup && (
            <>
              <p className="p-1 pt-[10px] w-full bg-primary text-white font-semibold text-sm justify-center h-8">
                Pas encore membre de {selectedGroup.name}
              </p>
              <div className="my-3">
                <Input
                  type="text"
                  className="flex-grow w-full p-2 bg-white border-2 rounded-lg outline-none"
                  placeholder="Rechercher "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {notMembers.length > 0 && (
                <NotMembers
                  notMembers={notMembers}
                  handleAddMember={handleAddMember}
                  group={selectedGroup}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Main;
