"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import avatar_1 from "/public/images/avatar-1.png";
import DarkLoader from "../TechSocial/Loader/DarkLoader";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import secureLocalStorage from "react-secure-storage";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { signOutUser } from "@/Redux/Reducers/UserSlice";
import { toast } from "react-toastify";

const Setting = ({ activeHandler }: { activeHandler: (a: string) => void }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);

  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [theme, setTheme] = useState("dark");

  const handleTheme = () => {
    setTheme(theme === "light" || theme === "system" ? "dark" : "light");
  };

  useEffect(() => setEnabled(true), []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      Cookies.remove("loginToken");
      secureLocalStorage.removeItem("loginToken");
      dispatch(signOutUser());
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Something went wrong while logging out. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.location.pathname === "/login") {
      setLoading(false);
    }
  }, [router]);

  if (!enabled) return null;

  return (
    <>
      {loading && <DarkLoader />}

      <div className="profile-pic d-flex align-items-center">
        <span
          className="avatar cmn-head active-status"
          onClick={() => activeHandler("settings")}
        >
          <Image className="avatar-img max-un" src={avatar_1} alt="avatar" />
        </span>
      </div>
      <div className="main-area p-5 profile-content">
        <div className="head-area">
          <div className="d-flex gap-3 align-items-center">
            <div className="avatar-item">
              {/* <Image
                className="avatar-img max-un"
                src={avatar_1}
                alt="avatar"
              /> */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "1px solid #f05a28",
                }}
              >
                <Image
                  src={user?.picture || avatar_1}
                  alt={`avatar`}
                  width={48}
                  height={48}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  priority
                />
              </div>
            </div>
            <div className="text-area">
              <h6 className="m-0 mb-1">{user?.name}</h6>
              {/* <p className="mdtxt">Web Developer</p> */}
              <span className="mdtxt status">@{user?.username}</span>
            </div>
          </div>
        </div>
        <div className="view-profile my-2">
          <Link href="/profile/post" className="mdtxt w-100 text-center py-2">
            View profile
          </Link>
        </div>
        <ul>
          {/* <li>
            <Link href="/profile/edit" className="mdtxt">
              <i className="material-symbols-outlined mat-icon"> settings </i>
              Settings & Privacy
            </Link>
          </li> */}
          <li>
            <Link href="/change-password" className="mdtxt">
              <i className="material-symbols-outlined mat-icon"> key </i>
              Change Password
            </Link>
          </li>
          <li>
            <button className="ts_logout_btn mdtxt" onClick={handleLogout}>
              <i className="material-symbols-outlined mat-icon">
                power_settings_new
              </i>
              Sign Out
            </button>
          </li>
        </ul>
        {/* <div className="switch-wrapper mt-4 d-flex gap-1 align-items-center">
          <i
            className={`mat-icon material-symbols-outlined moon icon ${
              theme === 'dark' && 'active'
            }`}
          >
            dark_mode
          </i>
          <label className="switch">
            <input
              type="checkbox"
              className="checkbox"
              checked={theme === 'light' ? false : true}
              onClick={handleTheme}
            />
            <span
              className={`slider ${theme === 'light' ? ' slider-active' : ''}`}
            ></span>
          </label>
          <i
            className={`mat-icon material-symbols-outlined sun icon ${
              theme === 'light' && 'active'
            }`}
          >
            light_mode
          </i>
          <span className="mdtxt ms-2">Light mode</span>
        </div> */}
      </div>
    </>
  );
};

export default Setting;
