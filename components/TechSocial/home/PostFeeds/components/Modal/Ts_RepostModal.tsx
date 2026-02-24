import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';
import LightLoader from '@/components/TechSocial/Loader/LightLoader';
// import Image from "next/image";
import axiosCall from '@/Utils/TsAPIcall';
import Ts_InputBox from './Ts_InputBox';
import { clearSelectedPost } from '@/Redux/Reducers/PostFeeds/PostSlice';
import Ts_RePost from './Ts_RePost';

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
    const modalEl = document.getElementById('goTsRepostMod');
    if (!modalEl) return;

    const handleHidden = () => {
      dispatch(clearSelectedPost());
    };

    modalEl.addEventListener('hidden.bs.modal', handleHidden);

    return () => {
      modalEl.removeEventListener('hidden.bs.modal', handleHidden);
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

  const handleDeletePost = async () => {};

  const handleRepost = async (text: string) => {
    if (!selectedPost) {
      toast.error('No post selected to repost');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        origin_post_id: selectedPost.postId,
        type: 5, // 🔁 REPOST
        title: text?.trim() || '',
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
        latitude: '',
        longitude: '',
        address: '',
      };

      const res = await axiosCall<ApiResponse>({
        ENDPOINT: 'posts',
        METHOD: 'POST',
        PAYLOAD: payload,
      });

      toast.success(res?.data?.message || 'Reposted successfully');

      // ✅ Close modal
      const modalEl = document.getElementById('goTsRepostMod');
      if (modalEl && (window as any).bootstrap) {
        const modalInstance = (
          window as any
        ).bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.hide();
      }

      setTimeout(() => {
        window.location.href = '/';
      }, 300);
    } catch (error: any) {
      console.error('Repost error:', error);
      toast.error(error?.message || 'Failed to repost');
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
                      {/* <h5>Repost</h5> */}
                    </div>
                    <div className="mid-area">
                      <div className="d-flex flex-column mb-5 gap-3 w-100">
                        {selectedPost && (
                          <>
                            <div>
                              <Ts_RePost
                                post={selectedPost}
                                onDelete={handleDeletePost}
                              />
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
