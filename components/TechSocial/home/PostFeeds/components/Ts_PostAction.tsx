import {
  getChatSocket,
  waitForSocketConnection,
} from '@/components/TechSocial/socket/chatSocket';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';
import {
  setActiveRoom,
  setChatRooms,
} from '@/Redux/Reducers/ChatSection/chatSlice';
import { toggleFollow, toggleSave } from '@/Redux/Reducers/PostFeeds/PostSlice';
import { closeSearchBar } from '@/Redux/Reducers/SearchBarSlice';
import { setFollowStatus } from '@/Redux/Reducers/UserSlice';
import {
  ChatRoom,
  ChatRoomsData,
  NewChatRoom,
} from '@/Type/ChatsSection/chatRoom';
import axiosCall from '@/Utils/APIcall';
import { findRoomWithUser } from '@/Utils/chatMessageHelper';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface FollowUnfollowApiResponse {
  status: number;
  message: string;
  data: [];
}

interface SaveUnsaveApiResponse {
  status: number;
  message: string;
  data: [];
}

interface CreateChatRoomApiResponse {
  status: number;
  message: string;
  data: {
    room_id: number;
    room: NewChatRoom;
  };
}

interface Ts_PostActionProps {
  postUserId: number;
  postId: number;
  isFollowing?: boolean;
  isSaved?: boolean;
  onDelete: (commentId: number) => void;
  isSearchBar?: boolean;
}

interface RoomDetailApiResponse {
  status: number;
  message: string;
  data: {
    room: ChatRoom;
  };
}

const Ts_PostAction = ({
  postUserId,
  postId,
  isFollowing = false,
  isSaved = false,
  onDelete,
  isSearchBar,
}: Ts_PostActionProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const rooms = useAppSelector((state) => state.chat.rooms);
  const currentUserId = useAppSelector((state) => state.user.user?.id);
  const reduxIsFollowing = useAppSelector(
    (state) => state.user.followStatus[postUserId] ?? isFollowing,
  );

  const isMyPost = currentUserId === postUserId;

  const createChatRoomApi = (userId: number) => {
    return axiosCall<CreateChatRoomApiResponse>({
      ENDPOINT: 'chats/create-room',
      METHOD: 'POST',
      PAYLOAD: {
        receiver_id: userId,
        type: 1,
      },
    });
  };

  const handleMessageClick = async () => {
    try {
      if (isSearchBar) {
        dispatch(closeSearchBar());
      }
      // 1️⃣ Check if room already exists
      const existingRoom = findRoomWithUser(rooms, postUserId);

      if (existingRoom) {
        dispatch(setActiveRoom(existingRoom.id));
        router.push('/profile/chat');
        return;
      }

      // 2 ensure socket connected FIRST
      const socket = await waitForSocketConnection();

      // 2️⃣ Create new room
      const response = await createChatRoomApi(postUserId);
      const newRoomId = response.data.data.room_id;
      // 4 add users via socket
      // await new Promise<void>((resolve, reject) => {
      //   const timeout = setTimeout(() => {
      //     reject("addUser timeout");
      //   }, 5000);

      //   socket.once("addUser", (res) => {
      //     clearTimeout(timeout);
      //     resolve();
      //   });

      //   socket.emit("addUser", {
      //     userId: `${currentUserId},${postUserId}`,
      //     room: newRoomId,
      //   });
      // });
      socket.emit('addUser', {
        userId: `${currentUserId},${postUserId}`,
        room: newRoomId,
      });

      // 5 join room immediately (mobile does this)
      socket.emit('joinRoom', { room: newRoomId });

      // 🔥 3. fetch full room detail
      const roomDetailResponse = await axiosCall<RoomDetailApiResponse>({
        ENDPOINT: `chats/room-detail?room_id=${newRoomId}&expand=createdByUser,chatRoomUser,chatRoomUser.user,lastMessage,chatRoomUser.user.userLiveDetail`,
        METHOD: 'GET',
      });

      const fullRoom = roomDetailResponse.data.data.room;

      // 🔥 4. store room in redux
      dispatch(setChatRooms([...rooms, fullRoom]));

      // 🔥 5. activate room
      dispatch(setActiveRoom(newRoomId));

      dispatch(setActiveRoom(newRoomId));
      router.push('/profile/chat');
    } catch (err) {
      toast.error('Failed to open chat');
    }
  };

  const followUserApi = (userId: number) => {
    return axiosCall<FollowUnfollowApiResponse>({
      ENDPOINT: 'followers',
      METHOD: 'POST',
      PAYLOAD: {
        user_id: userId,
      },
    });
  };

  const unfollowUserApi = (userId: number) => {
    return axiosCall<FollowUnfollowApiResponse>({
      ENDPOINT: 'followers/unfollow',
      METHOD: 'POST',
      PAYLOAD: {
        user_id: userId,
      },
    });
  };

  const handleFollowToggle = async () => {
    // 1️⃣ Optimistic update
    // dispatch(toggleFollow(postUserId));
    if (isSearchBar) {
      dispatch(closeSearchBar());
    }
    dispatch(
      setFollowStatus({ userId: postUserId, isFollowing: !reduxIsFollowing }),
    );

    try {
      if (reduxIsFollowing) {
        await unfollowUserApi(postUserId);
        toast.success('Unfollowed');
      } else {
        await followUserApi(postUserId);
        toast.success('Followed');
      }
    } catch (error: any) {
      // 2️⃣ Rollback on failure
      // dispatch(toggleFollow(postUserId));
      dispatch(
        setFollowStatus({ userId: postUserId, isFollowing: !reduxIsFollowing }),
      );
      toast.error(
        error?.response?.data?.message || 'Failed to update follow status',
      );
    }
  };

  const savePostApi = (postId: number) => {
    return axiosCall<SaveUnsaveApiResponse>({
      ENDPOINT: 'posts/save',
      METHOD: 'POST',
      PAYLOAD: {
        post_id: postId,
      },
    });
  };

  const unsavePostApi = (postId: number) => {
    return axiosCall<SaveUnsaveApiResponse>({
      ENDPOINT: 'posts/unsave',
      METHOD: 'POST',
      PAYLOAD: {
        post_id: postId,
      },
    });
  };

  const handleSaveToggle = async () => {
    if (isSearchBar) {
      dispatch(closeSearchBar());
    }
    // 1️⃣ Optimistic update
    dispatch(toggleSave(postId));

    try {
      if (isSaved) {
        await unsavePostApi(postId);
        toast.success('Post unsaved');
      } else {
        await savePostApi(postId);
        toast.success('Post saved');
      }
    } catch (error: any) {
      // 2️⃣ Rollback on failure
      dispatch(toggleSave(postId));
      toast.error(
        error?.response?.data?.message || 'Failed to update save status',
      );
    }
  };

  return (
    <>
      <button
        type="button"
        className="dropdown-btn"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="material-symbols-outlined fs-xxl m-0">more_horiz</i>
      </button>
      <ul
        className={`dropdown-menu p-4 pt-2 ${isSearchBar && 'searchBarPostOptions'}`}
      >
        {/* <li>
          <button className="droplist d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon">chat</i>
            <span>Message</span>
          </button>
        </li>
        <li>
          <button className="droplist d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon">person_add</i>
            <span>Follow</span>
          </button>
        </li>
        <li>
          <button className="droplist d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon">bookmark_add</i>
            <span>Save Post</span>
          </button>
        </li>
        <li>
          <button className="droplist d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon"> block </i>
            <span>Block User</span>
          </button>
        </li>
        <li>
          <button className="droplist d-flex align-items-center gap-2">
            <i className="material-symbols-outlined mat-icon"> flag </i>
            <span>Report Post</span>
          </button>
        </li> */}
        {isMyPost ? (
          <>
            {/* 👑 OWN POST ACTIONS */}
            <li>
              <button
                className="droplist d-flex align-items-center gap-2"
                // onClick={() => {
                //   if (isSearchBar) {
                //     dispatch(closeSearchBar());
                //   }
                // }}
              >
                <i className="material-symbols-outlined mat-icon">edit</i>
                <span>Edit Post</span>
              </button>
            </li>

            <li>
              <button
                className="droplist d-flex align-items-center gap-2 text-danger"
                onClick={() => {
                  if (isSearchBar) {
                    dispatch(closeSearchBar());
                  }
                  if (confirm('Are you sure you want to delete this post?')) {
                    onDelete(postId);
                  }
                }}
              >
                <i className="material-symbols-outlined mat-icon">delete</i>
                <span>Delete Post</span>
              </button>
            </li>

            <li>
              <button className="droplist d-flex align-items-center gap-2 text-danger">
                <i className="material-symbols-outlined mat-icon">share</i>
                <span>Share Post</span>
              </button>
            </li>
          </>
        ) : (
          <>
            {/* 👥 OTHER USER POST ACTIONS */}
            <li>
              <button
                className="droplist d-flex align-items-center gap-2"
                onClick={handleMessageClick}
              >
                <i className="material-symbols-outlined mat-icon">chat</i>
                <span>Message</span>
              </button>
            </li>

            <li>
              <button
                className="droplist d-flex align-items-center gap-2"
                onClick={handleFollowToggle}
              >
                <i className="material-symbols-outlined mat-icon">
                  {reduxIsFollowing ? 'person_remove' : 'person_add'}
                </i>
                <span>{reduxIsFollowing ? 'Unfollow' : 'Follow'}</span>
              </button>
            </li>

            <li>
              <button
                className="droplist d-flex align-items-center gap-2"
                onClick={handleSaveToggle}
              >
                <i className="material-symbols-outlined mat-icon">
                  {isSaved ? 'bookmark_remove' : 'bookmark_add'}
                </i>
                <span>{isSaved ? 'Unsave Post' : 'Save Post'}</span>
              </button>
            </li>

            {/* <li>
              <button className="droplist d-flex align-items-center gap-2">
                <i className="material-symbols-outlined mat-icon">block</i>
                <span>Block User</span>
              </button>
            </li> */}

            <li>
              <button
                className="droplist d-flex align-items-center gap-2"
                onClick={() => {
                  if (isSearchBar) {
                    dispatch(closeSearchBar());
                  }
                }}
              >
                <i className="material-symbols-outlined mat-icon">flag</i>
                <span>Report Post</span>
              </button>
            </li>
          </>
        )}
      </ul>
    </>
  );
};

export default Ts_PostAction;
