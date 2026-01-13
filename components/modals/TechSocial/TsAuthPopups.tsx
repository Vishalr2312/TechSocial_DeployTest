import ForgotPasswordModal from "../../TechSocial/login/Modal/ForgotPasswordModal";
import SignInModal from "../../TechSocial/login/Modal/SignInModal";
import SignUpModal from "../../TechSocial/login/Modal/SignUpModal";

const privacySelect = [
  { id: 1, name: "Public" },
  { id: 2, name: "Only Me" },
  { id: 3, name: "Friends" },
  { id: 4, name: "Custom" },
];

const TsAuthPopups = () => {
  return (
    <>
      <SignInModal />
      <ForgotPasswordModal />
      <SignUpModal />
    </>
  );
};

export default TsAuthPopups;
