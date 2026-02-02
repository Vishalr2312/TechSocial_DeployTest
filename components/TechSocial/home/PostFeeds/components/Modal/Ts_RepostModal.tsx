import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import LightLoader from "@/components/TechSocial/Loader/LightLoader";
// import Image from "next/image";
import axiosCall from "@/Utils/TsAPIcall";
import Ts_InputBox from "./Ts_InputBox";
import { clearSelectedPost } from "@/Redux/Reducers/PostFeeds/PostSlice";
import Ts_RePost from "./Ts_RePost";

interface ApiResponse {
  status: number;
  message: string;
  data: {
    post_id: number;
  };
}

const Ts_RepostModal = ({ postId }: { postId: number | null }) => {
  const dispatch = useAppDispatch();
  const selectedPost = useAppSelector((state) => state.post.selectedPost);

  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);

  //   useEffect(() => {
  //     const modalElement = document.getElementById("goTsRepostMod");

  //     if (modalElement) {
  //       modalElement.addEventListener("show.bs.modal", () => {
  //         formikRef.current?.resetForm();
  //       });

  //       modalElement.addEventListener("hidden.bs.modal", () => {
  //         formikRef.current?.resetForm();
  //       });
  //     }

  //     return () => {
  //       if (modalElement) {
  //         modalElement.removeEventListener("show.bs.modal", () => {});
  //         modalElement.removeEventListener("hidden.bs.modal", () => {});
  //       }
  //     };
  //   }, []);
  useEffect(() => {
    const modal = document.getElementById("goTsRepostMod");

    const cleanup = () => dispatch(clearSelectedPost());

    modal?.addEventListener("hidden.bs.modal", cleanup);

    return () => {
      modal?.removeEventListener("hidden.bs.modal", cleanup);
    };
  }, [dispatch]);

  //   useEffect(() => {
  //     if (!currentUser) return;
  //     setInitialValues({
  //       name: currentUser?.name,
  //       username: currentUser?.username,
  //       industry: currentUser?.industry,
  //       website: currentUser?.website,
  //       bio: currentUser?.bio,
  //       city: currentUser?.city,
  //       country: currentUser?.country,
  //     });
  //   }, [currentUser]);

  const handleRepost = async (text: string) => {
    if (!selectedPost) {
      toast.error("No post selected to repost");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        origin_post_id: selectedPost.postId,
        type: 5, // 🔁 REPOST
        title: text?.trim() || "",
        hashtag: null,
        mentionUser: null,
        gallary: [],
        competition_id: null,
        content_type_reference_id: null,
        club_id: null,
        post_content_type: 1, // text
        audio_id: null,
        audio_start_time: null,
        audio_end_time: null,
        is_add_to_post: 0,
        is_comment_enable: 1,
        latitude: "",
        longitude: "",
        address: "",
      };

      const res = await axiosCall<ApiResponse>({
        ENDPOINT: "posts",
        METHOD: "POST",
        PAYLOAD: payload,
      });

      toast.success(res?.data?.message || "Reposted successfully");

      // ✅ Close modal
      const modalEl = document.getElementById("goTsRepostMod");
      if (modalEl && (window as any).bootstrap) {
        const modalInstance = (
          window as any
        ).bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.hide();
      }

      setTimeout(() => {
        window.location.href = "/";
      }, 300);
    } catch (error: any) {
      console.error("Repost error:", error);
      toast.error(error?.message || "Failed to repost");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LightLoader />}

      <div className="go-sign-in-popup">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="modal ts-cmn-modal fade" id="goTsRepostMod">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                  <div className="modal-content p-5 repost-modal">
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
                      <h5>Repost</h5>
                    </div>
                    <div className="mid-area">
                      <div className="d-flex flex-column mb-5 gap-3 w-100">
                        {/* <Formik
                          innerRef={formikRef}
                          initialValues={initialValues}
                          enableReinitialize={true}
                          // validationSchema={SignInValidation}
                          onSubmit={handleRepost}
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

                              </Row>
                              <Row className="footer-area pt-5">
                                <Col className="btn-area d-flex justify-content-between gap-2">
                                  <button type="submit" className="cmn-btn">
                                    <b>Submit</b>
                                  </button>
                                </Col>
                              </Row>
                            </Form>
                          )}
                        </Formik> */}
                        {selectedPost && (
                          <>
                            <div>
                              <Ts_RePost post={selectedPost} />
                              <Ts_InputBox
                                onSubmit={handleRepost}
                                loading={loading}
                              />
                            </div>
                          </>
                        )}
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

export default Ts_RepostModal;
