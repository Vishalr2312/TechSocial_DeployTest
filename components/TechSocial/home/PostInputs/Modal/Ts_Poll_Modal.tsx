import React, { useState } from "react";

function Ts_Poll_Modal() {
  const initialChoices = ["", ""];
  const [choices, setChoices] = useState(["", ""]);
  const [question, setQuestion] = useState("");

  const handleChoiceChange = (index: number, value: string) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  const addChoice = () => {
    if (choices.length < 4) {
      setChoices([...choices, ""]);
    }
  };

  const handlePost = () => {
    // ✅ Validate
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }
    const filledChoices = choices.filter((c) => c.trim() !== "");
    if (filledChoices.length < 2) {
      alert("Please provide at least 2 options.");
      return;
    }

    // ✅ Console poll data
    console.log("Poll Question:", question);
    console.log("Poll Options:", filledChoices);

    // ✅ Reset fields
    setChoices(initialChoices);
    setQuestion("");
  };

  const handleCancel = () => {
    setChoices(initialChoices);
    setQuestion("");
  };

  return (
    <div className="go-live-popup video-popup">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="modal cmn-modal fade" id="goTsPollMod">
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
                    <h5>Add post poll</h5>
                  </div>
                  <div className="mid-area">
                    <div className="file-upload">
                      {/* <label>Upload attachment</label> */}
                      {/* <label className="file mt-1">
                        <input type="file" />
                        <span className="file-custom pt-8 pb-8 d-grid text-center">
                          <i className="material-symbols-outlined mat-icon">
                            perm_media
                          </i>
                          <span>Drag here or click to upload photo.</span>
                        </span>
                      </label> */}
                      <form action="#" className="w-100">
                        <textarea
                          className=" text-white border-0"
                          style={{ resize: "none" }}
                          cols={10}
                          rows={1}
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="Ask a question.."
                        ></textarea>
                        {choices.map((choice, index) => (
                          <div key={index} className="relative">
                            <textarea
                              className="w-full text-white border-1 bg-transparent focus:outline-none placeholder-neutral-500 pr-12"
                              style={{ resize: "none" }}
                              cols={10}
                              rows={1}
                              maxLength={25}
                              value={choice}
                              onChange={(e) =>
                                handleChoiceChange(index, e.target.value)
                              }
                              placeholder={`Option ${index + 1}`}
                            ></textarea>
                            {/* <span className="absolute right-0 bottom-0 text-xs text-neutral-500">
                              {choice.length}/25
                            </span> */}
                          </div>
                        ))}
                        {/* Add choice button */}
                        {choices.length < 4 && (
                          <button
                            type="button"
                            onClick={addChoice}
                            className="flex items-center gap-1  text-sm"
                            style={{ color: "#ff6a00" }}
                          >
                            <span
                              className="text-lg font-bold"
                              style={{ color: "#ff6a00" }}
                            >
                              +
                            </span>{" "}
                            Add more options
                          </button>
                        )}
                      </form>
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
                      <button className="cmn-btn" onClick={handlePost}>Post</button>
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

export default Ts_Poll_Modal;
