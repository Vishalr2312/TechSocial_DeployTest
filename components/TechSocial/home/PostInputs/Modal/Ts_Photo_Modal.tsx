import React, { useEffect, useState } from "react";

function Ts_Photo_Modal() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = (selectedFiles: File[]) => {
    const totalFiles = files.length + selectedFiles.length;
    if (totalFiles > 4) {
      alert("You can upload up to 4 files only.");
      return; // ✅ Do not add anything
    }
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;

    const droppedFiles = Array.from(e.dataTransfer.files);

    // ✅ Check before adding — if exceeds, show alert and do nothing
    if (files.length + droppedFiles.length > 4) {
      alert("You can upload up to 4 files only.");
      return;
    }
    handleFiles(droppedFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); // ✅ Prevents opening file in new tab
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const totalFiles = [...files, ...selectedFiles];

    if (totalFiles.length > 4) {
      alert("You can upload up to 4 files only.");
      return;
    }

    setFiles(totalFiles);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // ✅ Prevent browser opening file anywhere on the page
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => e.preventDefault();

    window.addEventListener("dragover", preventDefaults);
    window.addEventListener("drop", preventDefaults);

    return () => {
      window.removeEventListener("dragover", preventDefaults);
      window.removeEventListener("drop", preventDefaults);
    };
  }, []);

  const handleCancel = () =>{
    setFiles([]);
  }
  return (
    <div className="go-live-popup video-popup">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="modal cmn-modal fade" id="goTsPhotoMod">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-5">
                  <div className="modal-header justify-content-center">
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={handleCancel}
                    >
                      <i className="material-symbols-outlined mat-icon xxltxt">
                        close
                      </i>
                    </button>
                  </div>
                  <div className="top-content pb-5">
                    <h5>AI Models</h5>
                  </div>
                  <div className="mid-area">
                    <div className="file-upload">
                      <label>Upload attachment</label>
                      <label
                        className="file mt-1"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleFileChange}
                        />
                        <span className="file-custom pt-8 pb-8 d-grid text-center">
                          <i className="material-symbols-outlined mat-icon">
                            perm_media
                          </i>
                          <span>Drag here or click to upload photo.</span>
                        </span>
                      </label>
                      {files.length > 0 && (
                        <ul className="mt-2 text-white text-sm space-y-1 block w-full">
                          {files.map((file, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between bg-neutral-800 px-3 py-1 rounded-md w-full"
                              style={{ display: "flex", width: "100%" }}
                            >
                              {/* File name & size */}
                              <span className="truncate flex-1">
                                {file.name} ({Math.round(file.size / 1024)} KB)
                              </span>
                              {/* Remove button at far right */}
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="ml-3 text-red-400 hover:text-red-600 font-bold"
                              >
                                ✖
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="footer-area pt-5">
                    <div className="btn-area d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="cmn-btn alt"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button className="cmn-btn">Upload</button>
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
}

export default Ts_Photo_Modal;
