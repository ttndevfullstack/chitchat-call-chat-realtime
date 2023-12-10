import useApi from '@/plugins/api';

export default function useGetAllChatroom(email: string) {
  const $api = useApi();
  return $api.chatroom
    .getAllChatroomByEmail(email)
    .then((data) => data)
    .catch((error) => console.log(error));
}
