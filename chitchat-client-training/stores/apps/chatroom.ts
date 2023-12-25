import type { Chatroom, User } from '@/types/common';
import { defineStore } from 'pinia';
import useApi from '@/plugins/api';

const $api = useApi();

interface ChatroomType {
  chatroom_show: Chatroom | null;
  chatroom_list: Chatroom[];
  member_list: User[];
  message_content: string;
  message_status: string;
}

export const useChatroomStore = defineStore({
  id: 'chatroom',
  state: (): ChatroomType => ({
    chatroom_show: null,
    chatroom_list: [],
    member_list: [],
    message_content: '',
    message_status: '',
  }),
  getters: {},
  actions: {
    async fetchChats() {
      try {
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    // select chat
    SelectChat(itemID: number) {
      this.chatContent = itemID;
    },
    sendMsg(itemID: number, item: string) {
      const newMessage = {
        id: itemID,
        msg: item,
        type: 'text',
        attachments: [],
        createdAt: sub(new Date(), { seconds: 1 }),
        senderId: itemID,
      };

      this.chats = this.chats.filter((chat: any) => {
        return chat.id === itemID
          ? {
              ...chat,
              ...chat.chatHistory.push(newMessage),
            }
          : chat;
      });
    },
  },
});
