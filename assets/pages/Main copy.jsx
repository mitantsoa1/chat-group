import { useEffect, useState } from "react";
import axios from "axios";
import Chat from "../components/Chat";
import NotFriends from "../components/NotFriends";
import Input from "../components/Input";
import Friend from "../components/Friend";
import FriendRequest from "../components/FriendRequest";

const Main = () => {
  const [friends, setFriends] = useState([]);
  const [randomNotFriends, setRandomNotFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
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
        setCurrentUser(response.data);
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
          const response = await axios.get(
            `https://localhost:8000/api/friends/${currentUser.id}`
          );
          setFriends(response.data.friends);
          setRandomNotFriends(response.data.notFriends);
          setPendingFriends(response.data.pendingFriends);
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

      return () => {
        eventSource.close();
        axios
          .post("https://localhost:8000/api/user/disconnect")
          .catch((error) => {
            console.error("Erreur lors de la déconnexion:", error);
          });
      };
    }
  }, [currentUser, selectedFriend]); // fin useEffect chargement des amis

  // Connexion et déconnexion de l'utilisateur
  useEffect(() => {
    const connectUser = async () => {
      try {
        await axios.post("https://localhost:8000/api/user/connect");
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

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };

  const handleAddFriend = async (id) => {
    console.log("id_not_friend", id);
    try {
      const response = await axios.post(
        `https://localhost:8000/api/friends/add/${id}`
      );
      if (response.data.status === 200) {
        setPendingFriends((prevPending) => [
          ...prevPending,
          response.data.friend,
        ]);
        setRandomNotFriends((prevNotFriends) =>
          prevNotFriends.filter((friend) => friend.id !== id)
        );
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error connecting user:", error);
    }
  };

  // Fonction pour gérer les actions sur les demandes d'amis
  const handlePendingFriendAction = async (pendingFriend, action) => {
    try {
      const response = await axios.post(
        `https://localhost:8000/api/friends/${action}/${pendingFriend.id}`
      );

      if (response.data.status === 200) {
        // Retirer l'utilisateur de la liste des demandes en attente
        setPendingFriends((prevPending) =>
          prevPending.filter((friend) => friend.id !== pendingFriend.id)
        );

        // Selon l'action, ajouter l'utilisateur à la liste appropriée
        if (action === "accept") {
          setFriends((prevFriends) => [...prevFriends, pendingFriend]);
        } else if (action === "refuse" || action === "block") {
          setRandomNotFriends((prevNotFriends) => [
            ...prevNotFriends,
            pendingFriend,
          ]);
        }
      }
    } catch (error) {
      console.error(`Error handling friend request (${action}):`, error);
    }
  };

  return (
    <>
      <div className="w-full bg-gray-200 ">
        <div className="h-8 p-1 text-lg font-semibold bg-gray-300">
          {isLoading ? (
            <></>
          ) : currentUser ? (
            `${currentUser.username} - ${currentUser.email}`
          ) : (
            <p>Erreur de chargement de l'utilisateur</p>
          )}
        </div>
      </div>
      <div className="flex w-full h-screen overflow-hidden">
        <div className="w-1/6 bg-gray-300">
          <div className="h-8 p-1 text-lg font-semibold text-white bg-primary">
            Vos amis
          </div>
          <div className="my-3">
            <Input
              type="text"
              className="flex-grow w-full p-2 bg-white border-2 rounded-lg outline-none"
              placeholder="Rechercher un ami"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Friend friends={friends} handleFriendClick={handleFriendClick} />
          <FriendRequest
            pendingFriends={pendingFriends}
            handlePendingFriendAction={handlePendingFriendAction}
          />
        </div>
        <div className="flex flex-col w-4/6 h-full overflow-x-hidden bg-white shadow-lg">
          {selectedFriend && (
            <Chat friend={selectedFriend} currentUserId={currentUser.id} />
          )}
        </div>
        <div className="flex flex-col w-1/6 bg-gray-300">
          <p className="p-1 pt-[10px] w-full bg-primary text-white font-semibold text-sm justify-center h-8">
            Vous connaissez peut-être
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
          {randomNotFriends.length > 0 && (
            <NotFriends
              randomNotFriends={randomNotFriends}
              handleAddFriend={handleAddFriend}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Main;