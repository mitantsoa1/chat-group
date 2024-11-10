import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import formatDate from "../_helpers";

function ChatGroup({ group, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [notMembers, setNotMembers] = useState([]);

  const [writing, setWriting] = useState("hidden");
  const [btnWriting, setBtnWriting] = useState("block");
  const messagesEndRef = useRef(null);

  const BASE_URL = "https://localhost:8000";
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Détection de clics en dehors du champ de saisie
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".writing-area") && writing === "block") {
        setWriting("hidden");
        setBtnWriting("block");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [writing]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await axios.get(
          `https://localhost:8000/api/chat/messages/${group.id}`
        );
        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          console.error(
            "Les données reçues ne sont pas un tableau:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();

    // Configuration de Mercure pour les nouveaux messages
    if (!window.MERCURE_PUBLIC_URL) {
      console.error("MERCURE_PUBLIC_URL is not defined");
      return;
    }

    const url = `${window.MERCURE_PUBLIC_URL}?topic=chat`;
    console.log("Connecting to Mercure hub:", url);

    const eventSource = new EventSource(url, {
      withCredentials: false,
    });

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg.id === data.message.message.id)) {
          return [...prevMessages, data.message];
        }
        return prevMessages;
      });
    };

    return () => {
      eventSource.close();
    };
  }, [group, currentUser.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    try {
      const response = await axios.post(
        `https://localhost:8000/api/chat/send/${group.id}`,
        {
          message: newMessage,
          recipients: group.id,
        }
      );

      const newMessageObject = response.data;
      if (newMessageObject.user_id === undefined) {
        newMessageObject.user_id = currentUser.id;
      }

      setMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg.id === newMessageObject.id)) {
          return [...prevMessages, newMessageObject];
        }
        return prevMessages;
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setWriting("hidden");
      setBtnWriting("block");
    }
  };

  const handleWriting = () => {
    setWriting("block");
    setBtnWriting("hidden");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-8 p-1 text-lg font-semibold bg-white border-b border-gray-300">
        {group ? group.name : "Sélectionner un groupe"}
        {group && (
          <div className="relative z-0 flex ml-2 -space-x-2 avatar-group rtl:space-x-reverse">
            <div className="avatar">
              <div className="w-6 h-6 overflow-hidden rounded-full">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="Avatar 1"
                />
              </div>
            </div>
            <div className="avatar">
              <div className="w-6 h-6 overflow-hidden rounded-full">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="Avatar 2"
                />
              </div>
            </div>
            <div className="avatar">
              <div className="w-6 h-6 overflow-hidden rounded-full">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="Avatar 3"
                />
              </div>
            </div>
            <div className="avatar placeholder">
              <div className="flex items-center justify-center w-6 h-6 text-xs rounded-full bg-neutral text-neutral-content">
                <span>+99</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-grow px-4 py-2 overflow-y-auto">
        <ul className="space-y-4">
          {messages.map((item) => {
            const messageUserId =
              item.user.id !== undefined ? item.user.id : currentUser.id;

            const profilePicturePath = `${BASE_URL}/uploads/profiles/${item.user.profilePicture}`;
            return (
              <li
                key={item.message.id + "" + uuidv4()}
                className={`mb-2 ${
                  messageUserId === currentUser.id ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`flex ${
                    messageUserId === currentUser.id
                      ? "justify-end"
                      : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`flex flex-col ${
                      messageUserId === currentUser.id
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <small className="text-[10px] text-gray-500 mb-1 flex flex-row">
                      <img
                        src={profilePicturePath}
                        alt="image"
                        className="mr-2 rounded-full w-7 h-7"
                      />
                      <span className="flex items-center">
                        {item.user.username}
                      </span>
                    </small>

                    <div
                      className={`inline-block px-4 py-1 text-sm font-lato rounded-lg shadow-md max-w-xs ${
                        messageUserId === currentUser.id
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-black rounded-bl-none"
                      }`}
                      style={{
                        textAlign: "justify",
                        textJustify: "inter-word",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {item.message.body}

                      <small className="block text-[8px] opacity-70 mt-1 text-right">
                        {formatDate(item.message.created_at)}
                      </small>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-20 left-2">
        <img
          src="https://localhost:8000/images/icons.png"
          alt="Image du groupe"
          className="w-10 h-10 rounded-full"
          onClick={handleWriting}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className={`sticky bottom-10 ${writing} writing-area`}
      >
        <div className="flex items-center p-4 bg-gray-100 border-t border-gray-300">
          <textarea
            className="flex-grow p-2 mr-4 text-sm bg-white border rounded-lg outline-none"
            placeholder="Écrire un message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="px-4 py-2 text-white rounded-lg shadow-lg cursor-pointer bg-primary">
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatGroup;
