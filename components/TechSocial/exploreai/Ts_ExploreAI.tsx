"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  AiModel,
  SubscriptionData,
} from "@/Type/Subscription/UserSubscriptionStatus";
import { ChatData } from "@/Type/Explore AI/AIChat";
import Image from "next/image";
import axiosCall from "@/Utils/TsAPIcall";
import ReactMarkdown from "react-markdown";
import DarkLoader from "../Loader/DarkLoader";
import { useRouter } from "next/navigation";
import axios from "axios";

export interface SubscriptionStatusResponse {
  status: number;
  success: string;
  message: string;
  data: SubscriptionData;
}

export interface ChatApiResponse {
  status: number;
  success: string;
  message: string;
  data: ChatData;
}

const Ts_ExploreAI = () => {
  const router = useRouter();
  // 🔹 State to store textarea value
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "ai"; file?: string; fileType?: string }[]
  >([]);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [adSubscribed, setAdSubscribed] = useState(false);
  const [workModels, setWorkModels] = useState<AiModel[]>([]);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [selectedAI, setSelectedAI] = useState("Ad.AI");
  //   const [isBookmarked, setIsBookmarked] = useState(false);
  const didFetch = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedWorkModel = workModels.find((m) => m.name === selectedAI);
  const isSpecialChat = selectedAI === "Ad.AI" || selectedWorkModel?.id === 14;

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const sendMessage = async () => {
    if (message.trim() === "" && !attachedFile) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        text: message,
        sender: "user",
        file: attachedFile ? URL.createObjectURL(attachedFile) : undefined,
        fileType: attachedFile?.type,
      },
    ]);
    setMessage(""); // clear input
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setLoading(true);
    if (!firstMessageSent) setFirstMessageSent(true);

    try {
      let aiResponse = "";

      if (selectedAI === "Ad.AI") {
        const formData = new FormData();
        formData.append("prompt", message);
        if (attachedFile) {
          formData.append("files", attachedFile);
        }

        // ✅ Call Ad.AI API
        const res = await axiosCall<ChatApiResponse>({
          ENDPOINT: "ais/chat",
          METHOD: "POST",
          PAYLOAD: formData,
        });

        if (res?.data?.data?.errors) {
          const errors = res.data.data.errors;
          const firstField = Object.keys(
            errors ?? {},
          )[0] as keyof typeof errors;
          const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
          toast.error(firstMessage);
          return;
        }

        aiResponse =
          res?.data?.data?.chat_response?.response ?? "No response from Ad.AI";
      } else {
        // ✅ Call Work.AI API
        // Find the selected Work model object
        const workModel = workModels.find((m) => m.name === selectedAI);

        if (!workModel) {
          aiResponse = "Please select a valid Work.AI model.";
        } else {
          const formData = new FormData();
          formData.append("prompt", message);
          formData.append("model_id", workModel.id.toString());
          formData.append("model", workModel.ai_model);
          formData.append("provider", workModel.provider.toString());
          if (attachedFile) {
            formData.append("files", attachedFile);
          }
          const res = await axiosCall<ChatApiResponse>({
            ENDPOINT: "ais/work-ai",
            METHOD: "POST",
            PAYLOAD: formData,
          });

          if (res?.data?.data?.errors) {
            const errors = res.data.data.errors;
            const firstField = Object.keys(
              errors ?? {},
            )[0] as keyof typeof errors;
            const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
            toast.error(firstMessage);
            return;
          }

          aiResponse =
            res?.data?.data?.chat_response?.response ??
            "No response from Work.AI";
        }
      }

      // Add AI response to messages
      setMessages((prev) => [...prev, { text: aiResponse, sender: "ai" }]);
    } catch (err: any) {
      // catch (err) {
      //   console.error(err);
      //   setMessages((prev) => [
      //     ...prev,
      //     {
      //       text: "Oops! Something went wrong while fetching AI response.",
      //       sender: "ai",
      //     },
      //   ]);
      console.error(err);

      if (axios.isAxiosError(err) && err.response) {
        const { status, data } = err.response;

        // Handle subscription / limit errors
        if (status === 403 || status === 429) {
          const errorMessage = data?.message?.error || "Access denied.";

          const subscribeUrl = data?.message?.subscribe_url || "/subscribe";

          // Show backend error message in chat
          setMessages((prev) => [
            ...prev,
            {
              text: errorMessage,
              sender: "ai",
            },
          ]);

          // Redirect after short delay
          setTimeout(() => {
            router.push(subscribeUrl);
          }, 1500);

          return;
        }
      }

      // Fallback error
      setMessages((prev) => [
        ...prev,
        {
          text: "Oops! Something went wrong while fetching AI response.",
          sender: "ai",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Send Button Click
  const handleSend = () => {
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 1. Fetch subscription data (runs once)
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const fetchSubscriptions = async () => {
      try {
        setPageLoading(true);
        const res = await axiosCall<SubscriptionStatusResponse>({
          ENDPOINT: "users/get-subscription-status",
          METHOD: "POST",
        });

        if (res?.data?.data?.errors) {
          const errors = res.data.data.errors;
          const firstField = Object.keys(
            errors ?? {},
          )[0] as keyof typeof errors;
          const firstMessage = errors[firstField]?.[0] ?? "Unknown error";
          toast.error(firstMessage);
          return;
        }

        const subscriptionData: SubscriptionData = res.data?.data;

        // Ad.AI
        if (subscriptionData?.ad_ai?.hasSubscription) {
          const isAdSubscribed =
            !subscriptionData.ad_ai.expired &&
            subscriptionData.ad_ai.subscription?.status === "active";
          setAdSubscribed(isAdSubscribed);
        }

        // Work.AI
        if (subscriptionData?.work_ai?.hasSubscription) {
          const activeWorkModels = subscriptionData.work_ai.subscriptions
            .filter((sub) => sub.status === "active" && !sub.expired)
            .map((sub) => sub.ai_model);

          setWorkModels(activeWorkModels);
        }
      } catch (error) {
        toast.error(`Failed to fetch subscription data ${error}`);
      } finally {
        setPageLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // 2. Select default AI when subscription state changes
  useEffect(() => {
    if (!selectedAI) {
      if (adSubscribed) {
        setSelectedAI("Ad.AI");
      } else if (workModels.length > 0) {
        setSelectedAI(workModels[0].name);
      }
    }
  }, [adSubscribed, workModels, selectedAI]);

  const handleCopy = async () => {
    try {
      const textToCopy = messages[messages.length - 1];

      // Copy to clipboard
      await navigator.clipboard.writeText(textToCopy.text);

      // Optional: feedback
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy!");
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setMessage("");
    setAttachedFile(null);
    setFirstMessageSent(false);
  };

  return (
    <>
      {pageLoading && <DarkLoader />}
      <div className="top-bar row w-100 justify-content-between">
        <div className="col-auto">
          <Link href="/" className="chat-btn">
            <i
              className="material-symbols-outlined"
              style={{ color: "#ffffff" }}
            >
              close
            </i>
          </Link>
        </div>
        <div className="middle-bar dropdown col-auto">
          <button
            className="ai-toggler"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="ai-toggler-content">
              {/* ✅ If selected AI is one of the Work.AI models, show Work.AI prefix */}
              {workModels.some((model) => model.name === selectedAI) ? (
                <>
                  <span className="workai-display">
                    <span className="ai-toggler-content">Work.AI</span>
                    <span className="ai-toggler-content">{selectedAI}</span>
                  </span>
                </>
              ) : (
                <>{selectedAI}</>
              )}
            </span>
            <i className="material-symbols-outlined">expand_more</i>
          </button>

          <ul className="dropdown-menu ai-dropdown-menu">
            {/* Ad.AI selectable */}
            {adSubscribed && (
              <li>
                <button
                  className="dropdown-item ai-models"
                  onClick={() => {
                    setSelectedAI("Ad.AI");
                    setMessages([]);
                  }}
                >
                  Ad.AI
                </button>
              </li>
            )}

            {/* Work.AI label + models */}
            {workModels.length > 0 && (
              <>
                <li>
                  <span className="dropdown-item ai-models">Work.AI</span>
                </li>

                {workModels.map((model) => (
                  <li key={model.id}>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedAI(model.name);
                        setMessages([]);
                      }}
                    >
                      <span
                        className="ai-models"
                        // style={{ paddingLeft: "1rem" }}
                      >
                        <i className="material-symbols-outlined mat-icon">
                          fiber_manual_record
                        </i>
                        {model.name}
                      </span>
                    </button>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
        <div className="right-icons col-auto">
          {/* <button
          className="chat-btn"
          onClick={handleShare}
          title="Copy share link"
        >
          <i className="material-symbols-outlined" style={{ color: "#ffffff" }}>
            upload
          </i>
        </button>
        <button className="chat-btn" title="Bookmark" onClick={handleBookmarkClick}>
          <i className="material-symbols-outlined" style={{ color: "#ffffff" }}>
            {isBookmarked ? <FaBookmark size={16}/> : "bookmark"}
          </i>
        </button> */}
          <button className="chat-btn" title="New Chat" onClick={handleNewChat}>
            <i
              className="material-symbols-outlined"
              style={{ color: "#ffffff" }}
            >
              edit_square
            </i>
          </button>
        </div>
      </div>
      <div
        className={`screen-container ${
          firstMessageSent ? "input-bottom" : "input-middle"
        }`}
      >
        {/* 🔹 Chat Messages */}
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${
                msg.sender === "user" ? "user-message" : "ai-message"
              }`}
            >
              {msg.file && (
                <>
                  {msg.fileType?.startsWith("video/") ? (
                    <video
                      width={90}
                      height={90}
                      style={{ borderRadius: "8px", marginBottom: "5px" }}
                    >
                      <source src={msg.file} type={msg.fileType} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={msg.file}
                      alt="Attached"
                      width={90}
                      height={90}
                      style={{
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "5px",
                      }}
                    />
                  )}
                </>
              )}

              <ReactMarkdown>{msg.text}</ReactMarkdown>

              {/* ✅ Show icons only for AI messages */}
              {msg.sender === "ai" && (
                <div className="ai-actions ai-btn">
                  <button
                    title="Copy"
                    className="chat-btn"
                    onClick={handleCopy}
                  >
                    <i className="material-symbols-outlined">content_copy</i>
                  </button>
                  {/* <button title="Share">
                    <i className="material-symbols-outlined">share</i>
                  </button>
                  <button title="Like">
                    <i className="material-symbols-outlined">thumb_up</i>
                  </button>
                  <button title="Dislike">
                    <i className="material-symbols-outlined">thumb_down</i>
                  </button> */}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Inner box only for textarea + buttons */}
        {isSpecialChat && (
          <>
            {loading && (
              <div className="loader-container">
                <div className="loader"></div>
                <span className="thinking-text">Thinking...</span>
              </div>
            )}
            <div className="chat-container">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*,video/*"
              />
              {attachedFile && (
                <div className="attached-file">
                  {attachedFile.type.startsWith("image/") && (
                    <Image
                      src={URL.createObjectURL(attachedFile)}
                      alt={attachedFile.name}
                      width={60}
                      height={60}
                      style={{ objectFit: "cover", borderRadius: "4px" }}
                      onClick={() => setAttachedFile(null)}
                    />
                  )}

                  {attachedFile.type.startsWith("video/") && (
                    <video
                      width={60}
                      height={60}
                      style={{ borderRadius: "4px" }}
                      onClick={() => setAttachedFile(null)}
                    >
                      <source
                        src={URL.createObjectURL(attachedFile)}
                        type={attachedFile.type}
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}

              <textarea
                placeholder="Please enter message"
                className="chat-textarea"
                onKeyDown={handleKeyDown}
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <ul className="chat-actions">
                <li>
                  <button className="chat-btn" onClick={handleAttachClick}>
                    <i
                      className="material-symbols-outlined"
                      style={{ color: "#f05a28" }}
                    >
                      attach_file
                    </i>
                  </button>
                </li>
                <li>
                  <button className="chat-btn" onClick={handleSend}>
                    <i
                      className="material-symbols-outlined"
                      style={{ color: "#f05a28" }}
                    >
                      send
                    </i>
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
        {!isSpecialChat && (
          <>
            {loading && (
              <div className="loader-container">
                <div className="loader"></div>
                <span className="thinking-text">Thinking...</span>
              </div>
            )}
            <div className="chat-container-aimodels">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {attachedFile && attachedFile.type.startsWith("image/") && (
                <div className="attached-file">
                  <Image
                    src={URL.createObjectURL(attachedFile)}
                    alt={attachedFile.name}
                    width={50} // required
                    height={50} // required
                    style={{ objectFit: "cover", borderRadius: "4px" }}
                    onClick={() => setAttachedFile(null)} // 👈 remove on click
                  />
                </div>
              )}

              <textarea
                placeholder="Please enter message"
                className="chat-textarea"
                onKeyDown={handleKeyDown}
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button className="chat-btn" onClick={handleSend}>
                <i
                  className="material-symbols-outlined"
                  style={{ color: "#f05a28" }}
                >
                  send
                </i>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Ts_ExploreAI;
