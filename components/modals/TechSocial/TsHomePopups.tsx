import Ts_Gif_Modal from "@/components/TechSocial/home/PostInputs/Modal/Ts_Gif_Modal";
import Ts_Location_Modal from "@/components/TechSocial/home/PostInputs/Modal/Ts_Location_Modal";
import Ts_Pdf_Modal from "@/components/TechSocial/home/PostInputs/Modal/Ts_Pdf_Modal";
import Ts_Photo_Modal from "@/components/TechSocial/home/PostInputs/Modal/Ts_Photo_Modal";
import Ts_Poll_Modal from "@/components/TechSocial/home/PostInputs/Modal/Ts_Poll_Modal";

const privacySelect = [
  { id: 1, name: "Public" },
  { id: 2, name: "Only Me" },
  { id: 3, name: "Friends" },
  { id: 4, name: "Custom" },
];

const TsHomePopups = () => {
  return (
    <>
      <Ts_Photo_Modal />
      <Ts_Pdf_Modal />
      <Ts_Gif_Modal />
      <Ts_Poll_Modal />
      <Ts_Location_Modal />
    </>
  );
};

export default TsHomePopups;
