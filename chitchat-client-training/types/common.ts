export enum ChatroomType {
  DIRECT = 'direct',
  GROUP = 'group',
}

export type Message = {
  _id?: string;
  chatroom_id: string;
  content: string;
  type: string;
  sender: string;
  send_at: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: [string];
  status: string;
  friends: string[];
  chatroom_ids: string;
};

export type Chatroom = {
  _id: string;
  name: string;
  avatar: string;
  roomMaster: string;
  members: string[];
  status: string;
  total_member: string;
  type: string;
  latest_message: string;
};

export type ComingCall = {
  email: string;
  avatar: string;
  room_id: string;
};
