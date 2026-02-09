export interface ChatRoomsData {
  room: ChatRoom[];
  errors?: any;
}

export interface ChatRoom {
  id: number;
  title: string | null;
  order_id: number | null;
  club_id: number | null;
  type: number;
  image: string | null;
  imageUrl: string;
  description: string | null;
  chat_access_group: number;
  status: number;
  created_at: number;
  created_by: number;
  updated_at: number | null;
  updated_by: number | null;
  lastMessage: ChatMessage | null;
  chatRoomUser: ChatRoomUser[];
  createdByUser: ChatUser;
}

export interface ChatMessage {
  id: number;
  local_message_id: string;
  room_id: number;
  type: number;
  message: string;
  replied_on_message: ChatMessage | null;
  is_encrypted: number;
  current_status: number;
  is_user_notify: number;
  chat_version: number;
  delete_time: number;
  status: number;
  created_by: number;
  created_at: number;
}

export interface ChatRoomUser {
  id: number;
  room_id: number;
  user_id: number;
  is_admin: number;
  status: number;
  created_at: number;
  created_by: number | null;
  updated_at: number | null;
  user: ChatUser;
}

export interface ChatUser {
  id: number;
  username: string;
  email: string;
  unique_id: number;
  image: string | null;
  picture: string | null;
  coverImageUrl: string | null;
  is_chat_user_online: 0 | 1;
  chat_last_time_online: number;
  is_show_online_chat_status: number;
  is_reported: number;
  is_like: number;
  is_match: number;
  profile_views: number;
  isFollower: number;
  isFollowing: number;
  userStory: any | null;
  profileCategoryName: string | null;
  userLiveDetail: any | null;
}
