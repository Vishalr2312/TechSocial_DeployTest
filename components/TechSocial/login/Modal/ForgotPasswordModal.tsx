import Image from 'next/image';
import Link from 'next/link';
import add_post_avatar from '/public/images/add-post-avatar.png';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import {
  ForgotPasswordInitialValue,
  ForgotPasswordInitialValueType,
  ForgotPasswordValidation,
  SignInResponseInterface,
} from '@/Type/User/SignInType';
import axiosCall from '@/Utils/APIcall';
import { toast } from 'react-toastify';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import { useEffect, useRef } from 'react';

interface ApiResponse {
  data: SignInResponseInterface;
  success: boolean;
  message: string;
}

const ForgotPasswordModal = () => {
  const formikRef = useRef<any>(null);

  useEffect(() => {
    const modalElement = document.getElementById('goTsForgotPasswordMod');

    if (modalElement) {
      // When modal is opened
      modalElement.addEventListener('show.bs.modal', () => {
        formikRef.current?.resetForm();
      });

      // When modal is closed
      modalElement.addEventListener('hidden.bs.modal', () => {
        formikRef.current?.resetForm();
      });
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener('show.bs.modal', () => {});
        modalElement.removeEventListener('hidden.bs.modal', () => {});
      }
    };
  }, []);

  const handleSubmit = async (
    values: ForgotPasswordInitialValueType,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      // const response = await axiosCall<ApiResponse>({
      //   ENDPOINT: 'job-categories/add',
      //   METHOD: 'POST',
      //   PAYLOAD: values,
      // });

      // dispatch(addJobCategory(response.data.data));
      // toast.success(response.data.message);
      resetForm();
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || 'Something went wrong';
        toast.error(errorMessage);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
    }
  };

  return (
    <div className="go-sign-in-popup">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="modal ts-cmn-modal fade" id="goTsForgotPasswordMod">
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
                    <h5>Find your TS account</h5>
                  </div>
                  <div className="mid-area">
                    <div className="mb-5 gap-3">
                      <Formik
                        innerRef={formikRef}
                        initialValues={ForgotPasswordInitialValue}
                        validationSchema={ForgotPasswordValidation}
                        onSubmit={handleSubmit}
                      >
                        {({ values, setFieldValue, resetForm }) => (
                          <Form className="text-center d-grid gap-4">
                            <Row className="mt-3">
                              <Col md="12">
                                <FormGroup className="single-input text-start">
                                  <Label className="col-form-label" check>
                                    Enter the email with your account to get
                                    reset link.
                                  </Label>
                                  <Field name="email">
                                    {({ field, meta }: any) => (
                                      <>
                                        <input
                                          {...field}
                                          className={`input-area dark ${
                                            meta.touched && meta.error
                                              ? 'error'
                                              : ''
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
                            </Row>
                            <Row className="footer-area pt-5">
                              <Col className="btn-area d-flex justify-content-between gap-2">
                                <button
                                  className="cmn-btn alt"
                                  data-bs-toggle="modal"
                                  data-bs-target="#goTsLoginMod"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                  role="modal"
                                >
                                  <b>Sign in</b>
                                </button>
                                <button
                                  className="cmn-btn"
                                  {...{ type: 'submit' }}
                                >
                                  <b>Get Link</b>
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
  );
};

export default ForgotPasswordModal;
