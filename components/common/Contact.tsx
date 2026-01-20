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

interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    user: UserList[];
    errors?: any;
  };
}

interface ContactProps {
  children: React.ReactNode;
}

const Contact = ({ children }: ContactProps) => {
  const pathname = usePathname();
  const [users, setUsers] = useState<UserList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

        console.log("API Response:", response);

        const users = response?.data?.data?.user;

        console.log("Users data:", users);

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
        {loading ? (
          <div>Loading users...</div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="profile-area d-center position-relative align-items-center justify-content-between"
            >
              <SingleContact data={user} />
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
