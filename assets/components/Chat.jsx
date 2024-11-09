import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import formatDate from "../_helpers";

// Fonction utilitaire améliorée pour formater la date

function Chat({ friend, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await axios.get(
          `https://localhost:8000/api/chat/messages/${friend.id}`
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
      // Vérifiez si le message n'existe pas déjà avant de l'ajouter
      setMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg.id === data.message.id)) {
          return [...prevMessages, data.message];
        }
        return prevMessages;
      });
    };

    return () => {
      eventSource.close();
    };
  }, [friend, currentUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    try {
      const response = await axios.post(
        "https://localhost:8000/api/chat/send",
        {
          message: newMessage,
          recipients: friend.id,
        }
      );

      const newMessageObject = response.data;
      // Si user_id est undefined, utilisez currentUserId comme fallback
      if (newMessageObject.user_id === undefined) {
        newMessageObject.user_id = currentUserId;
      }

      // Vérifiez si le message n'existe pas déjà avant de l'ajouter
      setMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg.id === newMessageObject.id)) {
          return [...prevMessages, newMessageObject];
        }
        return prevMessages;
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-8 p-1 text-lg font-semibold bg-white border-b border-gray-300">
        {friend ? friend.username : "Sélectionner un ami"}
      </div>

      <div className="flex-grow px-4 py-2 overflow-y-auto">
        <ul className="space-y-4">
          {messages.map((message) => {
            const messageUserId =
              message.user_id !== undefined ? message.user_id : currentUserId;
            return (
              <li
                key={message.id + "" + uuidv4()}
                className={`mb-2 ${
                  messageUserId === currentUserId ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[60%] px-2 py-1 text-sm font-lato rounded-lg ${
                    messageUserId === currentUserId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {message.body}
                  <br />
                  <small className="text-[9px] text-right opacity-70">
                    {formatDate(message.created_at)}
                  </small>
                </div>
              </li>
            );
          })}
        </ul>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-auto">
        <div className="flex items-center p-4 bg-gray-100 border-t border-gray-300">
          <textarea
            className="flex-grow p-2 mr-4 bg-white border rounded-lg outline-none"
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

export default Chat;
