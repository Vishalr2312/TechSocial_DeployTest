import axiosCall from "./TsAPIcall";

export const uploadMedia = async (
  file: File,
  mediaType: string,
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("media_type", mediaType);

  const res = await axiosCall<{
    filename: string;
    path: string;
  }>({
    ENDPOINT: "file-uploads/upload-file",
    METHOD: "POST",
    PAYLOAD: formData,
    CONFIG: true, // multipart
  });

  return res.data;
};
