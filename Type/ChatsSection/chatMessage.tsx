// ==============================
// Chat API Types (Single File)
// ==============================

/* ---------- User ---------- */
export interface ChatUser {
  id: number;
  username: string;
  email: string;
  unique_id: number;
  image: string | null;
  picture: string | null;
  is_chat_user_online: number;
  chat_last_time_online: number;
  is_show_online_chat_status: number;
  is_reported: number;
  coverImageUrl: string | null;
  userStory: string | null;
  profileCategoryName: string | null;
  is_like: number;
  is_match: number;
  profile_views: number;
  isFollower: number;
  isFollowing: number;
}

export interface ChatMessageUI extends ChatMessageItem {
  decryptedMessage: string;
  messageType: number;
  isDeleted?: boolean;
  isStarred?: boolean;
}

/* ---------- Message Status Per User ---------- */
export interface ChatMessageUser {
  id: number;
  chat_message_id: number;
  user_id: number;
  is_user_notify: number;
  status: number;
}

/* ---------- Single Chat Message ---------- */
export interface ChatMessageItem {
  id: number;
  local_message_id: string; 
  room_id: number;
  type: number;
  message: string;
  replied_on_message: string | null;
  is_encrypted: number;
  current_status: number;
  is_user_notify: number;
  chat_version: number;
  delete_time: number;
  status: number;
  created_by: number;
  created_at: number;
  user: ChatUser;
  chatMessageUser: ChatMessageUser[];
}

export interface ChatMessageReplyModel {
  id: number;
  message: string;
  messageType: number;
  is_encrypted: number;
  created_by: number;
  created_at: number;
  chat_version?: number;
}

/* ---------- API Links ---------- */
export interface ApiLink {
  href: string;
}

export interface ApiLinks {
  self: ApiLink;
  first: ApiLink;
  last: ApiLink;
}

/* ---------- API Meta ---------- */
export interface ApiMeta {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}

/* ---------- Chat Message Wrapper ---------- */
export interface ChatMessageWrapper {
  items: ChatMessageItem[];
  _links: ApiLinks;
  _meta: ApiMeta;
}

/* ---------- API Response Data ---------- */
export interface ChatMessageResponseData {
  chatMessage: ChatMessageWrapper;
  errors?: any;
}
