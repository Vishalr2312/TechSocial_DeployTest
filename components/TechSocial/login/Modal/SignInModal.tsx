import { Field, Form, Formik } from "formik";
import {
  SignInInitialValue,
  SignInInitialValueType,
  SignInResponseInterface,
  SignInValidation,
} from "@/Type/User/SignInType";
import axiosCall from "@/Utils/APIcall";
import { toast } from "react-toastify";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/Redux/hooks";
import secureLocalStorage from "react-secure-storage";
import { signInUser } from "@/Redux/Reducers/UserSlice";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LightLoader from "../../Loader/LightLoader";

interface ApiResponse {
  data: SignInResponseInterface;
  success: boolean;
  message: string;
}

const FaEyeIcon: React.FC = FaEye as React.FC;
const FaEyeOffIcon: React.FC = FaEyeSlash as React.FC;

const SignInModal = () => {
  const dispatch = useAppDispatch();
  const formikRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    const modalElement = document.getElementById("goTsLoginMod");

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

  const handleSubmit = async (
    values: SignInInitialValueType,
    { resetForm }: { resetForm: () => void },
  ) => {
    const payload = {
      email: values?.email,
      password: values?.password,
      device_type: values?.device_type,
      device_token: values?.device_token,
      device_token_voip_ios: values?.device_token_voip_ios,
    };

    try {
      setLoading(true);

      const response = await axiosCall<ApiResponse>({
        ENDPOINT: "users/login",
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
      window.location.href = "/";
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
      if (window.location.pathname === "/") {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading && <LightLoader />}

      <div className="go-sign-in-popup">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="modal ts-cmn-modal fade" id="goTsLoginMod">
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
                      <h5>Sign In</h5>
                    </div>
                    <div className="mid-area">
                      <div className="d-flex mb-5 gap-3">
                        <Formik
                          innerRef={formikRef}
                          initialValues={SignInInitialValue}
                          validationSchema={SignInValidation}
                          onSubmit={handleSubmit}
                        >
                          {({ values, setFieldValue, resetForm }) => (
                            <Form className="text-center d-grid gap-4">
                              <Row className="mt-3">
                                <Col sm="12">
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

                                <Col sm="12">
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
                                </Col>
                              </Row>
                              <Row className="footer-area pt-5">
                                <Col className="btn-area d-flex justify-content-between gap-2">
                                  <button
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
                                  </button>
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

export default SignInModal;
