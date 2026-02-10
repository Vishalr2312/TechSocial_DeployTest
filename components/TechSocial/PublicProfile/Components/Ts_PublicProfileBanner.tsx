import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import avatar_14 from "/public/images/avatar-14.png";
import avatar_2 from "/public/images/avatar-2.png";
import avatar_3 from "/public/images/avatar-3.png";
import avatar_4 from "/public/images/avatar-4.png";
import profile_cover_img from "/public/images/profile-cover-img.png";
import ContactAction from "@/components/ui/ContactAction";
import { useAppSelector } from "@/Redux/hooks";

const Ts_PublicProfileBanner = () => {
  //   const path = usePathname();
  const pathname = usePathname();
  //   const splitPath = path.split("/");
  //   const lastPath = splitPath[splitPath.length - 1];

  const user = useAppSelector((state) => state.publicProfile.user);

  return (
    <div className="banner-area pages-create mb-5">
      <div className="single-box p-5">
        {/* <div className="avatar-area">
          <Image
            className="avatar-img w-100"
            src={user?.coverImageUrl || profile_cover_img}
            alt="cover image"
            width={100}
            height={0}
          />
        </div> */}
        <div className="avatar-area">
          <div className="cover-wrapper">
            <Image
              src={user?.coverImageUrl || profile_cover_img}
              alt="cover image"
              width={1200}
              height={300}
              className="object-cover w-full h-auto"
            />
          </div>
        </div>
        <div className="top-area py-4 d-center flex-wrap gap-3 justify-content-between align-items-start">
          <div className="d-flex gap-3 align-items-center">
            <div className="avatar-item p">
              {/* <div className="profile_pic_wrapper"> */}
              {/* <Image
                  src={user?.picture || avatar_14}
                  alt="profile pic"
                  // style={{ border: "1px solid #f05a28" }}
                  fill
                  className="object-cover"
                /> */}
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #f05a28",
                }}
              >
                <Image
                  src={user?.picture || avatar_14}
                  alt="profile pic"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  width={120}
                  height={120}
                  // className="object-cover"
                />
              </div>
              {/* </div> */}
            </div>
            <div className="text-area text-start">
              <h4 className="m-0 mb-0">
                {user?.name}{" "}
                {user?.is_verified ? (
                  <i className="material-symbols-outlined mat-icon">verified</i>
                ) : (
                  ""
                )}
              </h4>
              <span className="mdtxt status m-0 mb-4">@{user?.username}</span>
              <div className="friends-list d-flex flex-wrap gap-2 align-items-center text-center">
                {/* <ul className="d-flex align-items-center justify-content-center">
                  <li>
                    <Image src={avatar_3} alt="image" />
                  </li>
                  <li>
                    <Image src={avatar_2} alt="image" />
                  </li>
                  <li>
                    <Image src={avatar_4} alt="image" />
                  </li>
                </ul> */}
                <span className="mdtxt d-center">{`${user?.totalFollower} Followers`}</span>
                {/* Add "following" to the classname for a dot */}
                <span className="mdtxt d-center">{`${user?.totalFollowing} Following`}</span>
              </div>
            </div>
          </div>
          <div className="btn-item d-center gap-3">
            {/* <Link href="#" className="cmn-btn d-center gap-1"> */}
            {/* <button
              className="cmn-btn d-center gap-1"
              data-bs-toggle="modal"
              data-bs-target="#goTsEditProfileMod"
              role="modal"
            >
              <i className="material-symbols-outlined mat-icon fs-2">
                edit_note
              </i>
              Edit Profile
            </button> */}
            {/* </Link> */}

            {/* Contact Action */}
            <ContactAction
              actionList={[
                // ["Block", "lock"],
                // ["Report", "flag"],
                {
                  label: "Unfollow",
                  icon: "person_remove",
                  onClick: () => {},
                },
                {
                  label: "Message",
                  icon: "chat",
                  onClick: () => {},
                },
              ]}
            />
          </div>
        </div>
        <div className="page-details">
          <ul className="nav mt-5 pt-4 flex-wrap gap-2 tab-area">
            <li className="nav-item" role="presentation">
              <Link
                // href="/profile/post"
                // className={`nav-link d-center ${
                //   lastPath === "post" && "active"
                // }`}
                href={`/profile/${user?.id}/post`}
                className={`nav-link d-center ${
                  pathname.includes("/post") ? "active" : ""
                }`}
              >
                Posts
              </Link>
            </li>
            <li className="nav-item" role="presentation">
              <Link
                // href="/profile/liked-posts"
                // className={`nav-link d-center ${
                //   lastPath === "liked-posts" && "active"
                // }`}
                href={`/profile/${user?.id}/liked-posts`}
                className={`nav-link d-center ${
                  pathname.includes("/liked-posts") ? "active" : ""
                }`}
              >
                Likes
              </Link>
            </li>
            <li className="nav-item" role="presentation">
              <Link
                // href="/profile/reposts"
                // className={`nav-link d-center ${
                //   lastPath === "reposts" && "active"
                // }`}
                href={`/profile/${user?.id}/reposts`}
                className={`nav-link d-center ${
                  pathname.includes("/reposts") ? "active" : ""
                }`}
              >
                Reposts
              </Link>
            </li>
            <li className="nav-item" role="presentation">
              <Link
                // href="/profile/commented-posts"
                // className={`nav-link d-center ${
                //   lastPath === "commented-posts" && "active"
                // }`}
                href={`/profile/${user?.id}/commented-posts`}
                className={`nav-link d-center ${
                  pathname.includes("/commented-posts") ? "active" : ""
                }`}
              >
                Comments
              </Link>
            </li>
            <li className="nav-item" role="presentation">
              <Link
                // href="/profile/connections"
                // className={`nav-link d-center ${
                //   lastPath === "connections" && "active"
                // }`}
                href={`/profile/${user?.id}/mentioned-posts`}
                className={`nav-link d-center ${
                  pathname.includes("/mentioned-posts") ? "active" : ""
                }`}
              >
                Mentions
              </Link>
            </li>
            <li className="nav-item" role="presentation">
              <Link
                href="/profile/saved-posts"
                // className={`nav-link d-center ${
                //   lastPath === "saved-posts" && "active"
                // }`}
              >
                Saved
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Ts_PublicProfileBanner;
