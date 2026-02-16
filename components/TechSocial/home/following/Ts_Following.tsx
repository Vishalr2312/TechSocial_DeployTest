"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axiosCall from "@/Utils/APIcall";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import DarkLoader from "../../Loader/DarkLoader";
import { FollowingItem, FollowingList } from "@/Type/Followers/Ts_Followers";
import { NewChatRoom } from "@/Type/ChatsSection/chatRoom";
import { findRoomWithUser } from "@/Utils/chatMessageHelper";
import { useRouter } from "next/navigation";
import { setActiveRoom } from "@/Redux/Reducers/ChatSection/chatSlice";

export interface FollowingApiResponse {
  status: number;
  message: string;
  data: {
    following: FollowingList;
    errors?: any;
  };
}

export interface CreateChatRoomApiResponse {
  status: number;
  message: string;
  data: {
    room_id: number;
    room: NewChatRoom;
  };
}

const Ts_Following = ({ clss = "" }: { clss?: string }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const rooms = useAppSelector((state) => state.chat.rooms);
  const currentUserId = useAppSelector((state) => state.user.user?.id);
  const [following, setFollowing] = useState<FollowingItem[]>([]);
  const [loading, setLoading] = useState(false);

  const createChatRoomApi = (userId: number) => {
    return axiosCall<CreateChatRoomApiResponse>({
      ENDPOINT: "chats/create-room",
      METHOD: "POST",
      PAYLOAD: {
        receiver_id: userId,
        type: 1,
      },
    });
  };

  const handleMessageClick = async (userId: number) => {
    try {
      // 1️⃣ Check if room already exists
      const existingRoom = findRoomWithUser(rooms, userId);

      if (existingRoom) {
        dispatch(setActiveRoom(existingRoom.id));
        router.push("/profile/chat");
        return;
      }

      // 2️⃣ Create new room
      const response = await createChatRoomApi(userId);
      const newRoomId = response.data.data.room_id;

      dispatch(setActiveRoom(newRoomId));
      router.push("/profile/chat");
    } catch (err) {
      toast.error("Failed to open chat");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!currentUserId) return;
        setLoading(true);

        const response = await axiosCall<FollowingApiResponse>({
          ENDPOINT: `followers/my-following?expand=followingUserDetail,followingUserDetail.isFollowing,followerUserDetail.isFollower&user_id=${currentUserId}`,
          METHOD: "GET",
        });

        if (response?.data?.data?.errors) {
          const errors = response.data.data.errors;
          const firstField = Object.keys(errors)[0] as keyof typeof errors;
          const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
          toast.error(firstMessage);
          return;
        }
        const fetchedFollowing = response?.data?.data?.following?.items || [];
        setFollowing(fetchedFollowing);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUserId]);
  return (
    <>
      {loading && <DarkLoader />}
      <div className={clss}>
        <div className="mb-7">
          <h4>Following</h4>
        </div>
        <ul>
          {following.map((following) => {
            const user = following.followingUserDetail;
            const firstLetter = user.username?.charAt(0).toUpperCase() || "?";
            const hasImage = !!user.picture;

            return (
              <li key={following.id}>
                <div className="d-flex align-items-center justify-content-between mb-5">
                  <div className="d-flex align-items-center gap-3">
                    {/* Avatar */}
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "1px solid #f05a28",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        //   backgroundColor: hasImage ? "transparent" : "#f05a28",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      {hasImage ? (
                        <Image
                          src={user.picture!}
                          alt={user.username}
                          width={50}
                          height={50}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span>{firstLetter}</span>
                      )}
                    </div>

                    {/* Username */}
                    <span>{user.username}</span>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="cmn-btn justify-content-center gap-1 w-100 fourth"
                      onClick={() => handleMessageClick(user.id)}
                    >
                      Message
                    </button>

                    {/* {user.isFollowing ? (
                      <button className="btn btn-sm btn-outline-danger">
                        Unfollow
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-primary">Follow</button>
                    )} */}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Ts_Following;
