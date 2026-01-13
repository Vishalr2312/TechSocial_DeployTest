import React from "react";
import Image from "next/image";
import Link from "next/link";
import ts_profile_avatar from "/public/images/add-post-avatar.png";

function Ts_Logout() {
  const shortcutsData = [
    {
      id: 1,
      img: ts_profile_avatar,
      title: "Vishal R",
    }
  ];
  return (
    <div className="single-single">
      <div>
        <button
          className="cmn-btn justify-content-center gap-1 w-100 fourth"
        >
          Post
        </button>
      </div>
      {/* <div>
        <button className="cmn-btn fourth">
          <ul>
            {shortcutsData.map((itm) => (
              <li key={itm.id}>
                <Link
                  href="/public-profile/post"
                  className="d-flex align-items-center gap-3"
                >
                  <Image src={itm.img} alt="icon" className="rounded-circle" />
                  <span>{itm.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </button>
      </div> */}
    </div>
  );
}

export default Ts_Logout;
