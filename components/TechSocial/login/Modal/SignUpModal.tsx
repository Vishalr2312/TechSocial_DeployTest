import Image from "next/image";
import Link from "next/link";
import add_post_avatar from "/public/images/add-post-avatar.png";
import { ErrorMessage, Field, Form, Formik } from "formik";
import axiosCall from "@/Utils/APIcall";
import { toast } from "react-toastify";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useEffect, useRef, useState } from "react";
import {
  OtpVerificationInitialValue,
  OtpVerificationInitialValueType,
  OtpVerificationValidation,
  SignInResponseInterface,
  SignUpInitialValue,
  SignUpInitialValueType,
  SignUpValidation,
} from "@/Type/User/SignInType";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DarkLoader from "../../Loader/DarkLoader";
import Cookies from "js-cookie";
import secureLocalStorage from "react-secure-storage";
import { useAppDispatch } from "@/Redux/hooks";
import { signInUser } from "@/Redux/Reducers/UserSlice";

interface ApiResponse {
  data: SignInResponseInterface;
  success: boolean;
  message: string;
}

const FaEyeIcon: React.FC = FaEye as React.FC;
const FaEyeOffIcon: React.FC = FaEyeSlash as React.FC;

const SignUpModal = () => {
  const dispatch = useAppDispatch();

  const signUpFormikRef = useRef<any>(null);
  const otpFormikRef = useRef<any>(null);

  const [formStep, setFormStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationToken, setRegistrationToken] = useState("");

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  useEffect(() => {
    const modalElement = document.getElementById("goTsRegistrationModal");

    if (modalElement) {
      modalElement.addEventListener("show.bs.modal", () => {
        signUpFormikRef.current?.resetForm();
        otpFormikRef.current?.resetForm();
        setFormStep(1);
        setRegistrationToken("");
      });

      modalElement.addEventListener("hidden.bs.modal", () => {
        signUpFormikRef.current?.resetForm();
        otpFormikRef.current?.resetForm();
        setFormStep(1);
        setRegistrationToken("");
      });
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("show.bs.modal", () => {});
        modalElement.removeEventListener("hidden.bs.modal", () => {});
      }
    };
  }, []);

  const handleSubmit = async (
    values: SignUpInitialValueType,
    { resetForm }: { resetForm: () => void },
  ) => {
    const payload = {
      username: values?.username,
      name: `${values?.first_name} ${values?.last_name}`,
      email: values?.email,
      password: values?.password,
      phone: values?.phone,
      country_code: values?.country_code,
      login_ip: values?.login_ip,
      role: values?.role,
      device_type: values?.device_type,
      industry: values?.industry,
      location: values?.location,
      bio: values?.bio,
      website: values?.website,
      profile_category_type: values?.profile_category_type,
      interest_id: values?.interest_id,
    };

    try {
      setLoading(true);
      const response = await axiosCall<ApiResponse>({
        ENDPOINT: "users/register",
        METHOD: "POST",
        PAYLOAD: payload,
      });

      if (response?.data?.data?.errors) {
        const errors = response.data.data.errors;
        const firstField = Object.keys(errors)[0] as keyof typeof errors;
        const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
        toast.error(firstMessage);
        return;
      }
      setRegistrationToken(response.data.data.token!);
      setFormStep(2);
      toast.success(response.data.message);
      resetForm();
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Something went wrong";
        toast.error(errorMessage);
      } else if (error.request) {
        console.error("No response received:", error.request);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async (
    values: OtpVerificationInitialValueType,
    { resetForm }: { resetForm: () => void },
  ) => {
    const payload = {
      otp: values?.received_otp,
      token: registrationToken,
    };

    try {
      setLoading(true);
      const response = await axiosCall<ApiResponse>({
        ENDPOINT: "users/verify-registration-otp",
        METHOD: "POST",
        PAYLOAD: payload,
      });

      if (response?.data?.data?.errors) {
        const errors = response.data.data.errors;
        const firstField = Object.keys(errors)[0] as keyof typeof errors;
        const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
        toast.error(firstMessage);
        return;
      }
      const token = response?.data?.data?.auth_key!;
      Cookies.set("loginToken", token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      secureLocalStorage.setItem("loginToken", token);
      dispatch(signInUser(response?.data?.data));
      window.location.href = "/user-interest";
      toast.success(response.data.message);
      resetForm();
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
      if (window.location.pathname === "/user-interest") {
        setLoading(false);
        setRegistrationToken("");
        setFormStep(1);
      }
    }
  };

  return (
    <>
      {loading && <DarkLoader />}
      <div className="go-sign-in-popup">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div
                className="modal ts-cmn-modal fade"
                id="goTsRegistrationModal"
              >
                <div className="modal-dialog modal-dialog-centered">
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
                      <h5>{formStep === 1 ? "Sign Up" : "Verify OTP"}</h5>
                    </div>
                    <div className="mid-area">
                      {formStep === 1 ? (
                        <div className="d-flex mb-5 gap-3">
                          <Formik
                            innerRef={signUpFormikRef}
                            initialValues={SignUpInitialValue}
                            validationSchema={SignUpValidation}
                            onSubmit={handleSubmit}
                          >
                            {({ values, setFieldValue, resetForm }) => (
                              <Form className="text-center d-grid gap-4">
                                <Row className="mt-3">
                                  <Col md="6">
                                    <FormGroup className="single-input text-start">
                                      <Label className="col-form-label" check>
                                        First Name
                                      </Label>
                                      <Field name="first_name">
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
                                              placeholder="Enter your first name"
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

                                  <Col md="6">
                                    <FormGroup className="single-input text-start">
                                      <Label className="col-form-label" check>
                                        Last Name
                                      </Label>
                                      <Field name="last_name">
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
                                              placeholder="Enter your last name"
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

                                  <Col md="12">
                                    <FormGroup className="single-input text-start">
                                      <Label className="col-form-label" check>
                                        User Name
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
                                              placeholder="Choose a username"
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

                                  <Col md="12">
                                    <FormGroup className="single-input text-start">
                                      <Label className="col-form-label" check>
                                        Email
                                      </Label>
                                      <Field name="email">
                                        {({ field, meta }: any) => (
                                          <>
                                            <input
                                              {...field}
                                              className={`input-area dark ${
                                                meta.touched && meta.error
                                                  ? "error"
                                                  : ""
                                              }`}
                                              type="email"
                                              placeholder="Enter your email"
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

                                  <Col md="12">
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
                                                showPassword
                                                  ? "text"
                                                  : "password"
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
                                  </Col>

                                  <Col md="12">
                                    <FormGroup className="single-input text-start">
                                      <Label className="col-form-label" check>
                                        Confirm Password
                                      </Label>
                                      <Field name="confirm_password">
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
                                                showConfirmPassword
                                                  ? "text"
                                                  : "password"
                                              }
                                              placeholder="Confirm your password"
                                            />
                                            <span
                                              style={{ top: "72%" }}
                                              className="position-absolute end-0 translate-middle-y pe-3 cursor-pointer"
                                              onClick={toggleConfirmPassword}
                                            >
                                              {showConfirmPassword ? (
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
                                  </Col>
                                </Row>

                                <Row className="footer-area pt-5">
                                  <Col className="btn-area d-flex justify-content-between gap-2">
                                    <button
                                      type="button"
                                      className="cmn-btn alt"
                                      data-bs-toggle="modal"
                                      data-bs-target="#goTsLoginMod"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                      role="modal"
                                    >
                                      Sign in
                                    </button>
                                    <button className="cmn-btn" type="submit">
                                      <b>Submit</b>
                                    </button>
                                  </Col>
                                </Row>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      ) : (
                        <div className="mb-5 gap-3">
                          <Formik
                            innerRef={otpFormikRef}
                            initialValues={OtpVerificationInitialValue}
                            validationSchema={OtpVerificationValidation}
                            onSubmit={handleSubmitOtp}
                          >
                            {({}) => (
                              <Form className="text-center d-grid gap-4">
                                <Row className="mt-3">
                                  <Col md="12">
                                    <FormGroup className="single-input text-start">
                                      <Label className="col-form-label" check>
                                        Enter the OTP received on your email
                                      </Label>
                                      <Field name="received_otp">
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
                                              inputMode="numeric"
                                              autoComplete="one-time-code"
                                              placeholder="Enter OTP"
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
                                </Row>

                                <Row className="footer-area pt-5">
                                  <Col className="btn-area d-flex justify-content-between gap-2">
                                    <button className="cmn-btn" type="submit">
                                      <b>Submit</b>
                                    </button>
                                  </Col>
                                </Row>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      )}
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

export default SignUpModal;
