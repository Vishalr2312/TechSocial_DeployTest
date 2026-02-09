"use client";

import contentData from "@/data/contentData";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SingleContact from "./SingleContact";
import avatar_6 from "/public/images/avatar-6.png";
import { UserList } from "@/Type/SearchUsers/SearchUsers";
import axiosCall from "@/Utils/APIcall";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
// import DarkLoader from "../TechSocial/Loader/DarkLoader";

interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    user: UserList[];
    errors?: any;
  };
}

interface FollowUnfollowApiResponse {
  status: number;
  message: string;
  data: [];
}

interface ContactProps {
  children: React.ReactNode;
}

const Contact = ({ children }: ContactProps) => {
  const pathname = usePathname();
  const [users, setUsers] = useState<UserList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // const [pageLoading, setPageLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       setLoading(true);

  //       const response = await axiosCall<ApiResponse>({
  //         ENDPOINT: "users/search-user?expand=totalActivePost",
  //         METHOD: "POST",
  //         PAYLOAD: {},
  //       });
  //       console.log("API Response:", response);

  //       if (response?.data?.data?.errors) {
  //         const errors = response.data.data.errors;
  //         const firstField = Object.keys(errors)[0] as keyof typeof errors;
  //         const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
  //         toast.error(firstMessage);
  //         return;
  //       }
  //       console.log("Users data:", response?.data?.data?.users);

  //       if (response?.data?.data?.users) {
  //         const sortedUsers = response.data.data.users.sort(
  //           (a, b) => (b.totalActivePost ?? 0) - (a.totalActivePost ?? 0),
  //         );
  //         console.log("Sorted users:", sortedUsers);

  //         // setUsers(sortedUsers);
  //         setUsers(sortedUsers.slice(0, 5));
  //       } else {
  //         console.log("No users found in response");
  //       }
  //     } catch (error: any) {
  //       toast.error(error?.response?.data?.message || "Failed to fetch users");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUsers();
  // }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const response = await axiosCall<ApiResponse>({
          ENDPOINT: "users/search-user?expand=totalActivePost",
          METHOD: "POST",
          PAYLOAD: {},
        });

        if (response?.data?.data?.errors) {
          const errors = response.data.data.errors;
          const firstField = Object.keys(errors)[0] as keyof typeof errors;
          const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
          toast.error(firstMessage);
          return;
        }

        const users = response?.data?.data?.user;

        if (!users || users.length === 0) {
          console.log("No users found in response");
          setUsers([]);
          return;
        }

        const sortedUsers = [...users].sort(
          (a, b) => (b.totalActivePost ?? 0) - (a.totalActivePost ?? 0),
        );

        setUsers(sortedUsers.slice(0, 5));
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const followUserApi = (userId: number) => {
    return axiosCall<FollowUnfollowApiResponse>({
      ENDPOINT: "followers",
      METHOD: "POST",
      PAYLOAD: {
        user_id: userId,
      },
    });
  };

  const unfollowUserApi = (userId: number) => {
    return axiosCall<FollowUnfollowApiResponse>({
      ENDPOINT: "followers/unfollow",
      METHOD: "POST", // change if backend uses DELETE
      PAYLOAD: {
        user_id: userId,
      },
    });
  };

  const handleFollowToggle = async (userId: number, isFollowing: number) => {
    // 1️⃣ Optimistic UI update
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, isFollowing: isFollowing ? 0 : 1 }
          : user,
      ),
    );

    try {
      // setPageLoading(true);
      if (isFollowing) {
        await unfollowUserApi(userId);
        toast.success("Unfollowed");
      } else {
        await followUserApi(userId);
        toast.success("Followed");
      }
    } catch (error: any) {
      // 2️⃣ Rollback on failure
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isFollowing } : user,
        ),
      );

      toast.error(
        error?.response?.data?.message || "Failed to update follow status",
      );
    } finally {
      // setPageLoading(false);
    }
  };

  return (
    <>
      {/* children props */}
      {children}

      <div className="d-flex flex-column gap-6">
        {/* {pathname === "/" && (
          <div className="profile-area d-center position-relative align-items-center justify-content-between">
            <div className="avatar-item d-flex gap-3 align-items-center">
              <div className="avatar-item">
                <Imagex
                  className="avatar-img max-un"
                  src={avatar_6}
                  alt="avatar"
                />
              </div>
              <div className="info-area">
                <h6 className="m-0">
                  <Link href="/public-profile/post" className="mdtxt">
                    Piter Maio
                  </Link>
                </h6>
              </div>
            </div>
            <span className="mdtxt abs-area d-center position-absolute end-0">
              5
            </span>
          </div>
        )} */}

        {/* {contentData?.map((itm) => (
          <div
            key={itm.id}
            className="profile-area d-center justify-content-between"
          >
            <SingleContact data={itm} />
          </div>
        ))} */}
        {/* {pageLoading && <DarkLoader />} */}
        {loading ? (
          <div>Loading users...</div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="profile-area d-center position-relative align-items-center justify-content-between"
            >
              <SingleContact data={user} onFollowToggle={handleFollowToggle} />
            </div>
          ))
        ) : (
          <div>No users found</div>
        )}
      </div>
    </>
  );
};

export default Contact;
