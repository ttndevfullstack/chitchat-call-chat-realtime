import useApi from '@/plugins/api';

export default function useGetMessageInChatroom(chatroomId: string) {
  const $api = useApi();
  return $api.message
    .getMessageInChatroom(chatroomId)
    .then((data) => data)
    .catch((error) => console.log(error));
}
