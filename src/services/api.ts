import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": process.env.REACT_APP_API_KEY,
  },
});

export const createChatConversation = async (data: any) => {
  const response = await api.post("/conversation", data);
  return response;
};

export const getMessages = async (
  conversationIds: string[],
  startDate: string,
  endDate: string
) => {
  const response = await api.get("/conversation/messages", {
    params: { conversationIds, startDate, endDate },
  });
  return response.data;
};
