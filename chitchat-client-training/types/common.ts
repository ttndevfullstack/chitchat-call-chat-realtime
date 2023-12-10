export type Message = {
  _id?: string;
  chatroom_id: string;
  content: string;
  type: string;
  sender: string;
  sendAt: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: [string];
  chatroomIds: string;
};

export type Chatroom = {
  _id: string;
  name: string;
  roomMaster: string;
  members: string[];
};

export type Channel = {
  _id: string;
  createBy: string;
  members: string[];
};
