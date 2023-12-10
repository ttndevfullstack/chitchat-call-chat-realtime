import type { Chatroom } from '@/types/common';

const chatroomShow = ref<string>('');
const chatroomList = ref<Chatroom[]>([]);
const setChatroomShow = (id: string) => (chatroomShow.value = id);
const setChatroomList = (chatrooms: Chatroom[]) => (chatroomList.value = chatrooms);

export { chatroomShow, chatroomList, setChatroomShow, setChatroomList };
