import { Field, Form, Formik } from "formik";
import {
  SignInInitialValue,
  SignInInitialValueType,
  SignInResponseInterface,
  SignInValidation,
} from "@/Type/User/SignInType";
import { toast } from "react-toastify";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import secureLocalStorage from "react-secure-storage";
import { signInUser } from "@/Redux/Reducers/UserSlice";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LightLoader from "@/components/TechSocial/Loader/LightLoader";
import { EditProfileInitialValueType } from "@/Type/Profile/Ts_Profile";
import Image from "next/image";
import axiosCall from "@/Utils/TsAPIcall";

interface ApiResponse {
  data: [];
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    username?: string[];
    message?: string[];
  };
}

interface ProfileImageApiResponse {
  data: [];
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    username?: string[];
    message?: string[];
  };
}

interface CoverImageApiResponse {
  data: [];
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    username?: string[];
    message?: string[];
  };
}

const FaEyeIcon: React.FC = FaEye as React.FC;
const FaEyeOffIcon: React.FC = FaEyeSlash as React.FC;

const Ts_EditProfileModal = () => {
  const dispatch = useAppDispatch();
  const formikRef = useRef<any>(null);
  const currentUser = useAppSelector((state) => state.profile.user);

  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  // const [showPassword, setShowPassword] = useState(false);

  // const togglePassword = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    const modalElement = document.getElementById("goTsEditProfileMod");

    if (modalElement) {
      modalElement.addEventListener("show.bs.modal", () => {
        formikRef.current?.resetForm();
      });

      modalElement.addEventListener("hidden.bs.modal", () => {
        formikRef.current?.resetForm();
      });
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("show.bs.modal", () => {});
        modalElement.removeEventListener("hidden.bs.modal", () => {});
      }
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    setInitialValues({
      name: currentUser?.name,
      username: currentUser?.username,
      industry: currentUser?.industry,
      website: currentUser?.website,
      bio: currentUser?.bio,
      city: currentUser?.city,
      country: currentUser?.country,
    });
  }, [currentUser]);

  const handleSubmit = async (
    values: EditProfileInitialValueType,
    { resetForm }: { resetForm: () => void },
  ) => {
    const payload = {
      name: values?.name,
      username: values?.username,
      industry: values?.industry,
      city: values?.city,
      country: values?.country,
      website: values?.website,
      bio: values?.bio,
    };

    try {
      setLoading(true);

      const response = await axiosCall<ApiResponse>({
        ENDPOINT: "users/profile-update",
        METHOD: "POST",
        PAYLOAD: payload,
      });
      if (response?.data?.errors) {
        const errors = response.data.errors;
        const firstField = Object.keys(errors)[0] as keyof typeof errors;
        const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
        toast.error(firstMessage);
        return;
      }
      toast.success(response?.data?.message || "Profile updated successfully");
      window.location.href = "/profile/post";
      // resetForm();
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Something went wrong";
        toast.error(errorMessage);
      } else if (error.request) {
        console.error("No response received:", error.request);
      }
      setLoading(false);
    } finally {
      if (window.location.pathname === "/profile/post") {
        setLoading(false);
      }
    }
  };

  const handleProfileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfilePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("imageFile", file);

    try {
      await axiosCall<ProfileImageApiResponse>({
        ENDPOINT: "users/update-profile-image",
        METHOD: "POST",
        PAYLOAD: formData,
        // isFormData: true,
      });
      toast.success("Profile image updated");
    } catch {
      toast.error("Failed to update profile image");
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("imageFile", file);

    try {
      await axiosCall<CoverImageApiResponse>({
        ENDPOINT: "users/update-profile-cover-image",
        METHOD: "POST",
        PAYLOAD: formData,
        // isFormData: true,
      });
      toast.success("Cover image updated");
    } catch {
      toast.error("Failed to update cover image");
    }
  };

  return (
    <>
      {loading && <LightLoader />}

      <div className="go-sign-in-popup">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="modal ts-cmn-modal fade" id="goTsEditProfileMod">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                  <div className="modal-content p-5">
                    <div className="modal-header justify-content-center">
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        <i className="material-symbols-outlined mat-icon xxltxt">
                          close
                        </i>
                      </button>
                    </div>
                    <div className="top-content pb-5">
                      <h5>Edit Profile</h5>
                    </div>
                    <div className="mid-area">
                      <div className="edit-profile-header">
                        {/* -------- COVER IMAGE -------- */}
                        <div className="cover-wrapper">
                          <Image
                            src={
                              coverPreview ||
                              currentUser?.coverImageUrl ||
                              "/cover-placeholder.png"
                            }
                            alt="cover"
                            fill
                            priority
                            unoptimized
                            className="cover-img"
                          />

                          <div className="image-overlay">
                            <label className="cover-edit-btn">
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleCoverChange}
                              />
                              <i className="material-symbols-outlined">
                                photo_camera
                              </i>
                            </label>
                          </div>
                        </div>

                        {/* -------- PROFILE IMAGE -------- */}
                        <div className="profile-wrapper">
                          <div className="profile-inner">
                            <Image
                              src={
                                profilePreview ||
                                currentUser?.picture ||
                                "/avatar-placeholder.png"
                              }
                              alt="profile"
                              width={112}
                              height={112}
                              unoptimized
                              className="profile-img"
                            />

                            <div className="image-overlay">
                              <label className="profile-edit-btn">
                                <input
                                  type="file"
                                  hidden
                                  accept="image/*"
                                  onChange={handleProfileChange}
                                />
                                <i className="material-symbols-outlined">
                                  photo_camera
                                </i>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex mb-5 gap-3">
                        <Formik
                          innerRef={formikRef}
                          initialValues={initialValues}
                          enableReinitialize={true}
                          // validationSchema={SignInValidation}
                          onSubmit={handleSubmit}
                        >
                          {({ values, setFieldValue, resetForm }) => (
                            <Form className="text-center d-grid gap-4">
                              <Row className="mt-3">
                                <Col sm="4">
                                  <FormGroup className="single-input text-start">
                                    <Label className="col-form-label" check>
                                      Name
                                    </Label>
                                    <Field name="name">
                                      {({ field, meta }: any) => (
                                        <>
                                          <input
                                            {...field}
                                            className={`input-area dark ${
                                              meta.touched && meta.error
                                                ? "error"
                                                : ""
                                            }`}
                                            type="text"
                                            placeholder="Enter your name"
                                          />
                                          {meta.touched && meta.error && (
                                            <div className="error-message-inline">
                                              {meta.error}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </Field>
                                  </FormGroup>
                                </Col>

                                <Col sm="4">
                                  <FormGroup className="single-input text-start">
                                    <Label className="col-form-label" check>
                                      Username
                                    </Label>
                                    <Field name="username">
                                      {({ field, meta }: any) => (
                                        <>
                                          <input
                                            {...field}
                                            className={`input-area dark ${
                                              meta.touched && meta.error
                                                ? "error"
                                                : ""
                                            }`}
                                            type="text"
                                            placeholder="Enter your username"
                                          />
                                          {meta.touched && meta.error && (
                                            <div className="error-message-inline">
                                              {meta.error}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </Field>
                                  </FormGroup>
                                </Col>

                                <Col sm="4">
                                  <FormGroup className="single-input text-start">
                                    <Label className="col-form-label" check>
                                      Industry / Field
                                    </Label>
                                    <Field name="industry">
                                      {({ field, meta }: any) => (
                                        <>
                                          <input
                                            {...field}
                                            className={`input-area dark ${
                                              meta.touched && meta.error
                                                ? "error"
                                                : ""
                                            }`}
                                            type="text"
                                            placeholder="Enter your industry"
                                          />
                                          {meta.touched && meta.error && (
                                            <div className="error-message-inline">
                                              {meta.error}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </Field>
                                  </FormGroup>
                                </Col>

                                <Col sm="4">
                                  <FormGroup className="single-input text-start">
                                    <Label className="col-form-label" check>
                                      City
                                    </Label>
                                    <Field name="city">
                                      {({ field, meta }: any) => (
                                        <>
                                          <input
                                            {...field}
                                            className={`input-area dark ${
                                              meta.touched && meta.error
                                                ? "error"
                                                : ""
                                            }`}
                                            type="text"
                                            placeholder="Enter your city"
                                          />
                                          {meta.touched && meta.error && (
                                            <div className="error-message-inline">
                                              {meta.error}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </Field>
                                  </FormGroup>
                                </Col>

                                <Col sm="4">
                                  <FormGroup className="single-input text-start">
                                    <Label className="col-form-label" check>
                                      Country
                                    </Label>
                                    <Field name="country">
                                      {({ field, meta }: any) => (
                                        <>
                                          <input
                                            {...field}
                                            className={`input-area dark ${
                                              meta.touched && meta.error
                                                ? "error"
                                                : ""
                                            }`}
                                            type="text"
                                            placeholder="Enter your country"
                                          />
                                          {meta.touched && meta.error && (
                                            <div className="error-message-inline">
                                              {meta.error}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </Field>
                                  </FormGroup>
                                </Col>

                                <Col sm="4">
                                  <FormGroup className="single-input text-start">
                                    <Label className="col-form-label" check>
                                      Website
                                    </Label>
                                    <Field name="website">
                                      {({ field, meta }: any) => (
                                        <>
                                          <input
                                            {...field}
                                            className={`input-area dark ${
                                              meta.touched && meta.error
                                                ? "error"
                                                : ""
                                            }`}
                                            type="text"
                                            placeholder="Enter your website"
                                          />
                                          {meta.touched && meta.error && (
                                            <div className="error-message-inline">
                                              {meta.error}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </Field>
                                  </FormGroup>
                                </Col>

                                <Col sm="4">
                                  <FormGroup className="single-input text-start">
                                    <Label className="col-form-label" check>
                                      Bio
                                    </Label>
                                    <Field name="bio">
                                      {({ field, meta }: any) => (
                                        <>
                                          <input
                                            {...field}
                                            className={`input-area dark ${
                                              meta.touched && meta.error
                                                ? "error"
                                                : ""
                                            }`}
                                            type="textarea"
                                            placeholder="Enter your bio"
                                          />
                                          {meta.touched && meta.error && (
                                            <div className="error-message-inline">
                                              {meta.error}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </Field>
                                  </FormGroup>
                                </Col>

                                {/* <Col sm="12">
                                  <FormGroup className="single-input text-start">
                                    <Label className="col-form-label" check>
                                      Password
                                    </Label>
                                    <Field name="password">
                                      {({ field, meta }: any) => (
                                        <>
                                          <input
                                            {...field}
                                            className={`input-area dark ${
                                              meta.touched && meta.error
                                                ? "error"
                                                : ""
                                            }`}
                                            type={
                                              showPassword ? "text" : "password"
                                            }
                                            placeholder="Enter your password"
                                          />
                                          <span
                                            style={{ top: "72%" }}
                                            className="position-absolute end-0 translate-middle-y pe-3 cursor-pointer"
                                            onClick={togglePassword}
                                          >
                                            {showPassword ? (
                                              <FaEyeIcon />
                                            ) : (
                                              <FaEyeOffIcon />
                                            )}
                                          </span>
                                          {meta.touched && meta.error && (
                                            <div className="error-message-inline">
                                              {meta.error}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </Field>
                                  </FormGroup>
                                </Col> */}
                              </Row>
                              <Row className="footer-area pt-5">
                                <Col className="btn-area d-flex justify-content-between gap-2">
                                  {/* <button
                                    type="button"
                                    className="cmn-btn alt"
                                    data-bs-toggle="modal"
                                    data-bs-target="#goTsForgotPasswordMod"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    role="modal"
                                  >
                                    Forgot password?
                                  </button>
                                  <button
                                    type="button"
                                    className="cmn-btn alt"
                                    data-bs-toggle="modal"
                                    data-bs-target="#goTsRegistrationModal"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    role="modal"
                                  >
                                    Sign up
                                  </button> */}
                                  <button type="submit" className="cmn-btn">
                                    <b>Submit</b>
                                  </button>
                                </Col>
                              </Row>
                            </Form>
                          )}
                        </Formik>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ts_EditProfileModal;
