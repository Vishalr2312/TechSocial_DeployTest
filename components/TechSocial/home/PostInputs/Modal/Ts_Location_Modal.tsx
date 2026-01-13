// import React, { useEffect, useState } from "react";

// interface LocationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// function Ts_Location_Modal({ isOpen, onClose }: LocationModalProps) {
//   const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
//     null
//   );
//   const [error, setError] = useState<string | null>(null);
//   useEffect(() => {
//     if (isOpen) {
//       if (!navigator.geolocation) {
//         setError("Geolocation is not supported by your browser.");
//         return;
//       }

//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             lat: position.coords.latitude,
//             lon: position.coords.longitude,
//           });
//           setError(null);
//         },
//         (err) => {
//           setError("Unable to retrieve your location.");
//           console.error(err);
//         }
//       );
//     } else {
//       // reset when modal closes
//       setLocation(null);
//       setError(null);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null; // do not render modal when closed
//   return (
//     <div className="go-live-popup video-popup">
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-8">
//             <div className="modal cmn-modal fade" id="goTsLocationMod">
//               <div className="modal-dialog modal-dialog-centered">
//                 <div className="modal-content p-5">
//                   <div className="modal-header justify-content-center">
//                     <button
//                       type="button"
//                       className="btn-close"
//                       data-bs-dismiss="modal"
//                       aria-label="Close"
//                     >
//                       <i className="material-symbols-outlined mat-icon xxltxt">
//                         close
//                       </i>
//                     </button>
//                   </div>
//                   <div className="top-content pb-5">
//                     <h5>Add Current Location</h5>
//                   </div>
//                   <div className="mid-area">
//                     {/* <div className="file-upload">
//                       <label>Upload attachment</label>
//                       <label className="file mt-1">
//                         <input type="file" />
//                         <span className="file-custom pt-8 pb-8 d-grid text-center">
//                           <i className="material-symbols-outlined mat-icon">
//                             perm_media
//                           </i>
//                           <span>Drag here or click to upload gif.</span>
//                         </span>
//                       </label>
//                     </div> */}
//                     {error && <p className="text-red-500">{error}</p>}

//                     {location ? (
//                       <iframe
//                         title="user-location"
//                         width="100%"
//                         height="300"
//                         style={{ border: 0 }}
//                         loading="lazy"
//                         allowFullScreen
//                         referrerPolicy="no-referrer-when-downgrade"
//                         src={`https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${location.lat},${location.lon}&zoom=15`}
//                       ></iframe>
//                     ) : (
//                       <p className="text-gray-500 text-center">
//                         Fetching your location...
//                       </p>
//                     )}
//                   </div>
//                   <div className="footer-area pt-5">
//                     <div className="btn-area d-flex justify-content-end gap-2">
//                       <button
//                         type="button"
//                         className="cmn-btn alt"
//                         data-bs-dismiss="modal"
//                         aria-label="Close"
//                       >
//                         Cancel
//                       </button>
//                       <button className="cmn-btn">Add</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Ts_Location_Modal;
import React, { useEffect, useState } from "react";

function Ts_Location_Modal() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const modalEl = document.getElementById("goTsLocationMod");

    if (!modalEl) return;

    // ✅ When modal is opened
    const handleOpen = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setError(null);
        },
        (err) => {
          setError("Unable to retrieve your location.");
          console.error(err);
        }
      );
    };

    // ✅ When modal is closed
    const handleClose = () => {
      setLocation(null);
      setError(null);
    };

    modalEl.addEventListener("shown.bs.modal", handleOpen);
    modalEl.addEventListener("hidden.bs.modal", handleClose);

    return () => {
      modalEl.removeEventListener("shown.bs.modal", handleOpen);
      modalEl.removeEventListener("hidden.bs.modal", handleClose);
    };
  }, []);

  return (
    <div className="modal cmn-modal fade" id="goTsLocationMod">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-5">
          <div className="modal-header justify-content-center">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i className="material-symbols-outlined mat-icon xxltxt">close</i>
            </button>
          </div>
          <div className="top-content pb-5">
            <h5>Add Current Location</h5>
          </div>
          <div className="mid-area">
            {error && <p className="text-red-500">{error}</p>}

            {location ? (
              <iframe
                title="user-location"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  location.lon - 0.01
                },${location.lat - 0.01},${location.lon + 0.01},${
                  location.lat + 0.01
                }&layer=mapnik&marker=${location.lat},${location.lon}`}
              ></iframe>
            ) : (
              <p className="text-gray-500 text-center">
                Fetching your location...
              </p>
            )}
          </div>
          <div className="footer-area pt-5">
            <div className="btn-area d-flex justify-content-end gap-2">
              <button
                type="button"
                className="cmn-btn alt"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                className="cmn-btn"
                data-bs-dismiss="modal"
                onClick={() => {
                  if (location) {
                    console.log("User Location:", location.lat, location.lon);
                  } else {
                    console.warn("No location available yet.");
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ts_Location_Modal;
