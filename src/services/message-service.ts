import { gql, useMutation, useQuery } from "@apollo/client";

const SEND_MESSAGE = gql`
  mutation SendMessage($messageDto: MessageDto!) {
    sendConversationMessage(messageDto: $messageDto) {
      id
      text
    }
  }
`;

const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($getMessageDto: GetMessageDto!) {
    getChatConversationMessages(getMessageDto: $getMessageDto) {
      messages {
        id
        text
      }
    }
  }
`;

export const useSendMessage = () => {
  return useMutation(SEND_MESSAGE);
};

export const useGetChatMessages = (getMessageDto: any) => {
  return useQuery(GET_CHAT_MESSAGES, {
    variables: { getMessageDto },
    fetchPolicy: "no-cache",
  });
};
