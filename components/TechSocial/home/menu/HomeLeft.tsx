"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import avatar_1 from "/public/images/avatar-1.png";
import { homeLeftMenu } from "@/data/TechSocial/sidebarData";
import Ts_Logout from "../common/Ts_Logout";
import { useAppSelector } from "@/Redux/hooks";

const HomeLeft = ({ clss }: { clss?: string }) => {
  const currentUser = useAppSelector((state) => state.user.user);
  const [activeProfile, setActiveProfile] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <>
      <div className={`d-inline-block ${clss}`}>
        <button
          className="button profile-active mb-4 mb-lg-0 d-flex align-items-center gap-2"
          onClick={() => setActiveProfile(!activeProfile)}
        >
          <i className="material-symbols-outlined mat-icon"> tune </i>
          <span>My profile</span>
        </button>
      </div>
      <div
        className={`profile-sidebar cus-scrollbar p-5 ${
          activeProfile && "active"
        }`}
      >
        <div className="d-block d-lg-none position-absolute end-0 top-0">
          <button
            className="button profile-close mt-3 me-2"
            onClick={() => setActiveProfile(false)}
          >
            <i className="material-symbols-outlined mat-icon fs-xl"> close </i>
          </button>
        </div>
        <div className="profile-pic d-flex gap-2 align-items-center">
          <div className="avatar position-relative">
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid #f05a28",
              }}
            >
              <Image
                className="avatar-img max-un"
                src={currentUser?.picture || avatar_1}
                width={48}
                height={48}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt="avatar"
              />
            </div>
          </div>
          <div className="text-area">
            <h6 className="m-0 mb-1">
              <Link href="profile/post">{currentUser?.name}</Link>
            </h6>
            <p className="mdtxt">@{currentUser?.username}</p>
          </div>
        </div>
        <ul className="profile-link mt-7 mb-7 pb-7">
          {/* home Left Menu */}
          {homeLeftMenu.map(([icon, item, url], i) => (
            <li key={i}>
              <Link
                href={url}
                className={`d-flex gap-4 ${pathname === url ? "active" : ""}`}
              >
                <i className="material-symbols-outlined mat-icon"> {icon} </i>
                <span>{item}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="your-shortcuts">
          {/* <h6 className="mb-7">Your shortcuts</h6> */}
          <Ts_Logout />
        </div>
      </div>
    </>
  );
};

export default HomeLeft;
