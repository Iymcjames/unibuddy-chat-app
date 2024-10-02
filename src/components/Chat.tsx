import React, { useEffect, useState } from "react";
import { ChatMessage } from "../interfaces/chat-message.interface";
import {
  useGetChatMessages,
  useSendMessage,
} from "../services/message-service";
import { createChatConversation } from "../services/api";

const Chat = () => {
  const [conversationId, setConversationId] = useState<string>("");
  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [sendMessage] = useSendMessage();
  const { data, refetch } = useGetChatMessages({ conversationId });

  useEffect(() => {
    if (data && data.getChatConversationMessages) {
      setMessages(data.getChatConversationMessages.messages);
    }
  }, [data]);

  const handleSendMessage = async () => {
    if (messageText.trim() === "") return;

    await sendMessage({
      variables: { messageDto: { text: messageText, conversationId } },
    });
    setMessageText("");
    refetch();
  };

  const handleStartChat = async () => {
    try {
      //TODO: We can generate a new uniqueId using either nanoid or uuidv4
      const data = {
        product: "virtualEvent",
        context: [
          {
            id: "unique-string",
            type: "university",
          },
        ],
      };

      let res = await createChatConversation(data);
      if (res.status == 201) {
        const { id } = res.data;
        setConversationId(id);
      }
      // refetch();
    } catch (error) {
      console.log(
        "Error cocurred when creating Conversation",
        JSON.stringify(error)
      );
    }
  };

  return (
    <div className="flex flex-col h-screen w-96">
      <button
        onClick={handleStartChat}
        className="p-2 bg-blue-500 text-white mb-2"
      >
        Start Chat
      </button>
      {conversationId && (
        <div className="flex-grow overflow-y-auto bg-gray-100 p-4">
          {messages.map((msg) => (
            <div key={msg.id} className="p-2 border-b">
              {msg.text}
            </div>
          ))}
        </div>
      )}
      <div className="flex">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="flex-grow p-2 border"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-green-500 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
