import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import ContactAction from "../ui/ContactAction";
import { UserList } from "@/Type/SearchUsers/SearchUsers";
import { useAppSelector } from "@/Redux/hooks";

// interface ContactProps {
//   id: number;
//   name: string;
//   avt: StaticImageData;
// }

interface SingleContactProps {
  data: UserList;
  onFollowToggle: (userId: number, isFollowing: number) => void;
}

const SingleContact = ({ data, onFollowToggle }: SingleContactProps) => {
  // const { avt, id, name } = data;
  const { id, name, picture, isFollower, isFollowing: apiIsFollowing } = data;
  const firstLetter = name?.charAt(0).toUpperCase() || "?";
  const followStatus = useAppSelector((state) => state.user.followStatus);
  const loggedInUserId = useAppSelector((state) => state.user.user?.id);
  const isOwnProfile = loggedInUserId === id;

  // const actionList: [string, string][] = isFollowing
  //   ? [["Unfollow", "person_remove"]]
  //   : [["Follow", "person_add"]];
  const isFollowing = followStatus[id] ?? apiIsFollowing === 1;
  const actionList = isFollowing
    ? [
        {
          label: "Unfollow",
          icon: "person_remove",
          onClick: () => onFollowToggle(id, apiIsFollowing),
        },
      ]
    : [
        {
          label: "Follow",
          icon: "person_add",
          onClick: () => onFollowToggle(id, apiIsFollowing),
        },
      ];

  return (
    <>
      <div className="avatar-item d-flex gap-3 align-items-center">
        <div className="avatar-item">
          {/* <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              overflow: "hidden",
              // border: "1px solid #f05a28",
            }}
          >
            <Image
              className="avatar-img max-un"
              src={picture || "/images/default-avatar.png"}
              width={48}
              height={48}
              alt="avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div> */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              overflow: "hidden",
              border: "1px solid #f05a28",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // backgroundColor: picture ? "transparent" : "#f05a28",
              color: "#fff",
              // fontSize: 20,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {picture ? (
              <Image
                src={picture}
                alt={`name`}
                width={48}
                height={48}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                priority
              />
            ) : (
              <span>{firstLetter}</span>
            )}
          </div>
        </div>
        <div className="info-area">
          <h6 className="m-0">
            <Link href="/public-profile/post" className="mdtxt">
              {name || "Unknown User"}
            </Link>
          </h6>
        </div>
      </div>
      {/* Contact Action */}
      {/* <ContactAction
        actionList={[
          ["Unfollow", "person_remove"],
          ["Hide Contact", "hide_source"],
        ]}
      /> */}
      {!isOwnProfile && <ContactAction actionList={actionList} />}
    </>
  );
};

export default SingleContact;
