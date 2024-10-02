import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chat from "./Chat";
import {
  useGetChatMessages,
  useSendMessage,
} from "../services/message-service";
import { createChatConversation } from "../services/api";

jest.mock("axios");

jest.mock("../services/message-service");
jest.mock("../services/api");

describe("Chat Component", () => {
  const mockRefetch = jest.fn();
  const mockSendMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSendMessage as jest.Mock).mockReturnValue([mockSendMessage]);
  });

  it("renders the chat component", () => {
    (useGetChatMessages as jest.Mock).mockReturnValue({ data: null });

    render(<Chat />);

    expect(screen.getByText("Start Chat")).toBeInTheDocument();
  });

  it("starts a chat and sets the conversation ID", async () => {
    (useGetChatMessages as jest.Mock).mockReturnValue({
      data: {
        getChatConversationMessages: {
          messages: [],
        },
      },
      refetch: mockRefetch,
    });

    (createChatConversation as jest.Mock).mockResolvedValue({
      status: 201,
      data: { id: "unique-conversation-id" },
    });

    render(<Chat />);

    fireEvent.click(screen.getByText("Start Chat"));

    await waitFor(() => {
      expect(mockRefetch).not.toHaveBeenCalled();
      expect(
        screen.getByPlaceholderText("Type your message...")
      ).toBeInTheDocument();
    });
  });

  it("sends a message and refetches messages", async () => {
    (useGetChatMessages as jest.Mock).mockReturnValue({
      data: {
        getChatConversationMessages: {
          messages: [{ id: "1", text: "Hello" }],
        },
      },
      refetch: mockRefetch,
    });

    render(<Chat />);

    fireEvent.change(screen.getByPlaceholderText("Type your message..."), {
      target: { value: "Test message" },
    });

    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        variables: { messageDto: { text: "Test message", conversationId: "" } },
      });
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});
