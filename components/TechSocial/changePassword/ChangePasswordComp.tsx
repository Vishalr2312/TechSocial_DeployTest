"use client";

import axiosCall from "@/Utils/APIcall";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Col, FormGroup, Label, Row } from "reactstrap";

interface ApiResponse {
  status: number;
  message: string;
  data: [];
}

const FaEyeIcon: React.FC = FaEye as React.FC;
const FaEyeOffIcon: React.FC = FaEyeSlash as React.FC;

const ChangePasswordComp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter;

  const togglePassword = () => setShowPassword((prev) => !prev);

  const initialValues = {
    old_password: "",
    password: "",
    confirm_password: "",
  };

  const handleSubmit = async (
    values: {
      old_password: string;
      password: string;
      confirm_password: string;
    },
    { resetForm }: { resetForm: () => void },
  ) => {
    // 1️⃣ Validate password match
    if (values.password !== values.confirm_password) {
      toast.error("Password and Confirm Password do not match");
      return;
    }

    const payload = {
      old_password: values.old_password,
      password: values.password,
    };

    try {
      const response = await axiosCall<ApiResponse>({
        ENDPOINT: "users/update-password",
        METHOD: "POST",
        PAYLOAD: payload,
      });

      // Handle backend validation errors
      if ((response as any)?.data?.errors) {
        const errors = (response as any).data.errors;
        const firstField = Object.keys(errors)[0];
        const firstMessage = errors[firstField]?.[0] ?? "Something went wrong";
        toast.error(firstMessage);
        return;
      }

      toast.success(response.data.message || "Password updated successfully");
      resetForm();
    } catch (error: any) {
      if (error.response) {
        toast.error(
          error.response.data?.message || "Failed to update password",
        );
      } else {
        toast.error("Network error, please try again");
      }
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <div className="subscription-container container-fluid">
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <div className={`subs-plan-card`}>
          <div className="plan-title-row">
            <div className="paln-title">Change Password</div>
          </div>
          <div className="subs-card-features">
            <Formik
              //   innerRef={formikRef}
              initialValues={initialValues}
              enableReinitialize={true}
              // validationSchema={SignInValidation}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, resetForm }) => (
                <Form className="text-center d-grid gap-4">
                  <Row className="mt-3">
                    {/* <Col sm="12">
                      <FormGroup className="single-input text-start">
                        <Label className="col-form-label" check>
                          Old Password
                        </Label>
                        <Field name="old_password">
                          {({ field, meta }: any) => (
                            <>
                              <input
                                {...field}
                                className={`input-area dark ${
                                  meta.touched && meta.error ? "error" : ""
                                }`}
                                type="password"
                                placeholder="Enter your Old Password"
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
                          New Password
                        </Label>
                        <Field name="password">
                          {({ field, meta }: any) => (
                            <>
                              <input
                                {...field}
                                className={`input-area dark ${
                                  meta.touched && meta.error ? "error" : ""
                                }`}
                                type="password"
                                placeholder="Enter your New Password"
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
                          Confirm Password
                        </Label>
                        <Field name="confirm_password">
                          {({ field, meta }: any) => (
                            <>
                              <input
                                {...field}
                                className={`input-area dark ${
                                  meta.touched && meta.error ? "error" : ""
                                }`}
                                type="password"
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
                    </Col> */}

                    <Col sm="12">
                      <FormGroup className="single-input text-start">
                        <Label className="col-form-label" check>
                          Old Password
                        </Label>
                        <Field name="old_password">
                          {({ field, meta }: any) => (
                            <>
                              <input
                                {...field}
                                className={`input-area dark ${
                                  meta.touched && meta.error ? "error" : ""
                                }`}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your old password"
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

                    <Col sm="12">
                      <FormGroup className="single-input text-start">
                        <Label className="col-form-label" check>
                          New Password
                        </Label>
                        <Field name="password">
                          {({ field, meta }: any) => (
                            <>
                              <input
                                {...field}
                                className={`input-area dark ${
                                  meta.touched && meta.error ? "error" : ""
                                }`}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your new password"
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

                    <Col sm="12">
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
                                  meta.touched && meta.error ? "error" : ""
                                }`}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your new password"
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
  );
};

export default ChangePasswordComp;
