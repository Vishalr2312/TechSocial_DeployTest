import Ts_PublicProfilePost from "@/components/TechSocial/PublicProfile/Components/Ts_PublicProfilePost";
import Ts_PublicProfile from "@/components/TechSocial/PublicProfile/Ts_PublicProfile";

export default function PublicProfilePost({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <Ts_PublicProfile userId={Number(params.userId)}>
      <Ts_PublicProfilePost />
    </Ts_PublicProfile>
  );
}
