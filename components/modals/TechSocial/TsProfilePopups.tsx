import Ts_EditProfileModal from "@/components/TechSocial/Profile/Components/Modal/Ts_EditProfileModal";

const privacySelect = [
  { id: 1, name: "Public" },
  { id: 2, name: "Only Me" },
  { id: 3, name: "Friends" },
  { id: 4, name: "Custom" },
];

const TsProfilePopups = () => {
  return (
    <>
      <Ts_EditProfileModal />
    </>
  );
};

export default TsProfilePopups;
