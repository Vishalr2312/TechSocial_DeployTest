import Image, { StaticImageData } from "next/image";
import Link from "next/link";
// import ContactAction from "../ui/ContactAction";
import { UserList } from "@/Type/SearchUsers/SearchUsers";
import ContactAction from "@/components/ui/ContactAction";
import { useAppSelector } from "@/Redux/hooks";

// interface ContactProps {
//   id: number;
//   name: string;
//   avt: StaticImageData;
// }

interface SinglePostProps {
  data: PostItem;
}

const SinglePost = ({ data }: SinglePostProps) => {
  // const { avt, id, name } = data;
  const { title, description, created_at, user } = data;
  //   const firstLetter = name?.charAt(0).toUpperCase() || "?";

  /** Convert timestamp → days ago */
  const daysAgo = Math.floor(
    (Date.now() - created_at * 1000) / (1000 * 60 * 60 * 24),
  );

  const loggedInUserId = useAppSelector((state) => state.user.user?.id);
  const isOwnProfile = loggedInUserId === user.id;

  const actionList: [string, string][] = user.isFollowing
    ? [["Unfollow", "person_remove"]]
    : [["Follow", "person_add"]];

  return (
    <>
      <div className="avatar-item d-flex flex-column gap-1">
        {/* Post title */}
        <div className="info-area d-flex align-items-start justify-content-between gap-2">
          <h6 className="m-0">
            <Link href={`/post/${data.id}`} className="mdtxt">
              {title || description || "Untitled Post"}
            </Link>
          </h6>
          {/* {!isOwnProfile && (
            <div className="ms-auto flex-shrink-0">
              <ContactAction actionList={actionList} />
            </div>
          )} */}    
        </div>

        {/* Meta info */}
        <div className="d-flex gap-2">
          <p className="small">{user?.username ?? "Unknown user"}</p>
          <span>·</span>
          <span className="small">
            {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
          </span>
        </div>
      </div>
    </>
  );
};

export default SinglePost;
