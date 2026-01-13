import ProfileMain from "@/components/common/ProfileMain";
import ProfilePostMain from "@/components/profilePost/ProfilePostMain";
import Ts_ProfilePost from "@/components/TechSocial/Profile/Components/Ts_ProfilePost";
import Ts_Profile from "@/components/TechSocial/Profile/Ts_Profile";

export default function ProfilePost() {
  return (
    // Profile Main section
    // <ProfileMain>
    //   {/* Profile Post Main */}
    //   <ProfilePostMain />
    // </ProfileMain>
    <Ts_Profile>
      {/* Profile Post Main */}
      {/* <ProfilePostMain /> */}
      <Ts_ProfilePost />
    </Ts_Profile>
  );
}
