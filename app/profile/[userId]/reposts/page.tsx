import Ts_PublicProfileReposts from "@/components/TechSocial/PublicProfile/Components/Ts_PublicProfileReposts";
import Ts_PublicProfile from "@/components/TechSocial/PublicProfile/Ts_PublicProfile";


export default function PublicProfileRepost({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <Ts_PublicProfile userId={Number(params.userId)}>
      <Ts_PublicProfileReposts />
    </Ts_PublicProfile>
  );
}