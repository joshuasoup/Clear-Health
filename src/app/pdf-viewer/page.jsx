"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useChat } from "ai/react";
import "../../styles/globals.css";
import "../../styles/viewer.css";
import message from "../../assets/images/chatsymbol.png";
import avatar from "../../assets/images/defaultAvatar.png";
import pdfIcon from "../../assets/images/pdf-icon.png";
import Link from "next/link";
import openaiLogo from "../../assets/images/openai.svg";
import logo from "../../assets/images/clearhealthlogo.png";

const PDFLoader = dynamic(() => import("../components/PDFLoader"), {
  ssr: false,
});

const starterPrompts = [
  "Give me the key findings from this report in plain language.",
  "What should I ask my doctor about based on this PDF?",
  "List any values that look out of range and what they mean.",
  "Is there anything urgent or a red flag in this report?",
  "Translate the impression section into everyday language.",
  "What follow-up steps should I consider from this document?",
];

const cleanKey = (value) => {
  if (!value) return null;
  return value.split(/[?#]/)[0];
};

const deriveKeyFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  return cleanKey(parts[parts.length - 1]);
};

const ChatSurface = ({ title, fileKey, onBack, initialAsk }) => {
  const modelLabel = process.env.NEXT_PUBLIC_MODEL_NAME || "gpt-3.5-turbo";
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    setMessages,
    isLoading,
  } = useChat({
    api: "/api/chat",
    body: {
      fileKey,
    },
  });

  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const storageKey = `chat-${fileKey || "current"}`;
  const hasMessages = messages.length > 0;
  const [copiedId, setCopiedId] = useState(null);
  const [feedback, setFeedback] = useState({});
  const hasSeededInputRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Unable to load saved chat", error);
    }
  }, [storageKey, setMessages]);

  useEffect(() => {
    if (!messages) return;

    if (messages.length === 0) {
      localStorage.removeItem(storageKey);
      return;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error("Unable to persist chat", error);
    }
  }, [messages, storageKey]);

  useEffect(() => {
    if (initialAsk && !hasSeededInputRef.current && messages.length === 0) {
      setInput(initialAsk);
      hasSeededInputRef.current = true;
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [initialAsk, messages.length, setInput]);

  useEffect(() => {
    if (!chatBodyRef.current) return;
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handlePromptClick = (prompt) => {
    setInput(prompt);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const submitMessage = (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    handleSubmit(event);
  };

  const resetChat = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Unable to clear saved chat", error);
    }
    setMessages([]);
    setInput("");
  };

  const handleCopy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (error) {
      console.error("Failed to copy message", error);
    }
  };

  const toggleFeedback = (id, value) => {
    setFeedback((prev) => ({
      ...prev,
      [id]: prev[id] === value ? null : value,
    }));
  };

  if (hasMessages) {
    return (
      <div className="min-h-screen bg-[var(--cloud)] text-[var(--ink)] flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-6 pb-24 flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium hover:-translate-y-0.5 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 18l-6-6 6-6"
                  />
                </svg>
                Back to report
              </button>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full  px-3 py-1 text-xs sm:text-sm text-[var(--muted-ink)] ">
              {title}
            </span>
          </div>

          <div className="flex-1">
            <div className="rounded-[26px]  min-h-[60vh]">
              <div
                ref={chatBodyRef}
                className="max-h-[70vh] overflow-y-auto px-6 sm:px-8 py-8 space-y-8"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="max-w-3xl w-full text-left text-[15px] leading-relaxed text-[var(--ink)] whitespace-pre-wrap group">
                        <div className="inline-block">{m.content}</div>
                        <div className="flex items-center gap-2 text-[11px] text-[var(--muted-ink)] mt-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            type="button"
                            onClick={() => handleCopy(m.id, m.content)}
                            className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-[var(--grid-line)] hover:text-[var(--ink)]"
                            aria-label="Copy response"
                          >
                            {copiedId === m.id ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 9h10v10H9z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 5h10v2M5 5v10h2"
                                />
                              </svg>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleFeedback(m.id, "up")}
                            className={`inline-flex items-center justify-center h-7 w-7 rounded-full border border-[var(--grid-line)] hover:text-[var(--ink)] ${
                              feedback[m.id] === "up"
                                ? "bg-[rgba(124,251,115,0.15)] text-[var(--ink)]"
                                : ""
                            }`}
                            aria-label="Thumbs up"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 10h2l3-6.5L14 10h5l-2 9H7z"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleFeedback(m.id, "down")}
                            className={`inline-flex items-center justify-center h-7 w-7 rounded-full border border-[var(--grid-line)] hover:text-[var(--ink)] ${
                              feedback[m.id] === "down"
                                ? "bg-[rgba(94,196,255,0.15)] text-[var(--ink)]"
                                : ""
                            }`}
                            aria-label="Thumbs down"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 14h-2l-3 6.5L10 14H5l2-9h10z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center rounded-lg bg-[var(--ink)] text-white px-4 py-2 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.1)] max-w-[75%]">
                        {m.content}
                      </span>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-[var(--muted-ink)] px-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Drafting with the PDF...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={resetChat}
          className="fixed bottom-6 right-4 sm:right-6 z-50 text-[var(--muted-ink)] hover:text-[var(--ink)] transition"
          aria-label="Reset chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v6h6M20 20v-6h-6M6 10a8 8 0 0 1 13.66-2.34M18 14a8 8 0 0 1-13.66 2.34"
            />
          </svg>
        </button>

        <div className="fixed left-0 right-0 bottom-0">
          <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 pb-5">
            <form
              onSubmit={submitMessage}
              ref={formRef}
              className="rounded-full border border-[var(--grid-line)] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.07)] px-4 py-2.5 flex items-end gap-3"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Ask a follow-up question..."
                className="flex-1 resize-none border-0 bg-transparent text-sm leading-relaxed outline-none focus:ring-0"
                rows={1}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    formRef.current?.requestSubmit();
                  }
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-9 w-9 rounded-full bg-[var(--ink)] text-white flex items-center justify-center shadow-[0_10px_26px_rgba(0,0,0,0.16)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition"
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M13 5l7 7-7 7"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--cloud)] text-[var(--ink)] flex flex-col items-center">
      <div className="relative max-w-4xl w-full px-4 sm:px-5 py-8  h-screen">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium  hover:-translate-y-0.5 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 18l-6-6 6-6"
              />
            </svg>
            Back to report
          </button>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--muted-ink)]">
            <span className="hidden sm:inline text-[11px] uppercase tracking-[0.18em]">
              In-context chat
            </span>
          </div>
        </div>

        <div className="flex-1 w-full flex items-center justify-center h-full ">
          <div className="w-full max-w-4xl mx-auto gap-6 flex flex-col items-center">
            <div className="flex flex-col items-center text-center justify-center gap-3">
              <h1 className="headline text-2xl sm:text-3xl tracking-tight">
                Report Guide
              </h1>
              <p className="text-sm sm:text-base text-[var(--muted-ink)] max-w-2xl leading-relaxed">
                Ask anything about this PDF — we answer with context pulled
                straight from your document.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--grid-line)] bg-white px-3 py-1 text-xs sm:text-sm text-[var(--muted-ink)] shadow-sm">
                <Image src={openaiLogo} alt="OpenAI" width={16} height={16} />
                OpenAI · {modelLabel}
              </div>
            </div>

            <div className="w-full max-w-4xl mx-auto">
              <div className="rounded-[20px] border border-[var(--grid-line)] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)] overflow-hidden">
                <form
                  onSubmit={submitMessage}
                  ref={formRef}
                  className="border-t border-[var(--grid-line)] bg-white/90 px-5 py-4"
                >
                  <div className="flex items-end gap-3">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask anything about this report..."
                      className="flex-1 resize-none rounded-2xl border border-[var(--grid-line)] bg-[var(--cloud)] px-4 py-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-[#5ec4ff]/60"
                      rows={2}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          formRef.current?.requestSubmit();
                        }
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="h-10 w-10 rounded-full bg-[var(--ink)] text-white flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.16)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition"
                      aria-label="Send message"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14M13 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-2.5">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  className="text-left rounded-xl border border-[var(--grid-line)] bg-white px-4 py-3 text-sm text-[var(--ink)] shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ViewerContent() {
  const searchParams = useSearchParams();
  const sampleReportUrl = "/sample-report.pdf";
  const sampleTitle = "Sample report";

  const searchFileKey = searchParams.get("fileKey") || searchParams.get("key");
  const searchName = searchParams.get("name") || searchParams.get("title");
  const searchUrl = searchParams.get("url") || searchParams.get("pdfUrl");
  const searchAsk = searchParams.get("ask");

  const [selectedPdfUrl, setSelectedPdfUrl] = useState(
    searchUrl || sampleReportUrl
  );
  const [title, setTitle] = useState(searchName || sampleTitle);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [embedError, setEmbedError] = useState("");
  const [localObjectUrl, setLocalObjectUrl] = useState(null);
  const [isChatMode, setIsChatMode] = useState(false);
  const [initialAsk, setInitialAsk] = useState(searchAsk || "");
  const fileInputRef = useRef(null);
  const [activeFileKey, setActiveFileKey] = useState(
    cleanKey(searchFileKey) ||
      deriveKeyFromUrl(searchUrl) ||
      "sample-report.pdf"
  );

  const embedFileToPinecone = async (file, key) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileKey", key);

    const response = await fetch("/api/upload-pinecone", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Failed to upload to Pinecone");
    }

    return response.json();
  };

  const handleLocalFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setEmbedError("");
    setIsEmbedding(true);
    const keyRoot = cleanKey(file.name) || "local-upload.pdf";
    const newKey = `${Date.now()}-${keyRoot.replace(/\s+/g, "-")}`;

    if (localObjectUrl) {
      URL.revokeObjectURL(localObjectUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalObjectUrl(objectUrl);
    setSelectedPdfUrl(objectUrl);
    setTitle(file.name);
    setActiveFileKey(newKey);
    setIsChatMode(false);

    try {
      await embedFileToPinecone(file, newKey);
    } catch (error) {
      console.error("Failed to index uploaded PDF", error);
      setEmbedError("Couldn't prep the PDF for chat. Try again.");
    } finally {
      setIsEmbedding(false);
    }
  };

  useEffect(() => {
    const key = cleanKey(searchFileKey);
    const providedUrl = searchUrl;
    const derivedKey =
      key || deriveKeyFromUrl(providedUrl) || "sample-report.pdf";

    setActiveFileKey(derivedKey);
    setTitle(searchName || key || sampleTitle);

    if (providedUrl) {
      setSelectedPdfUrl(providedUrl);
      return;
    }

    if (!key) {
      setSelectedPdfUrl(sampleReportUrl);
      return;
    }

    const controller = new AbortController();
    const loadPdf = async () => {
      setIsLoadingPdf(true);
      try {
        const response = await fetch(
          `/api/presigned-url?key=${encodeURIComponent(key)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch PDF for key ${key}`);
        }

        const { presignedUrl } = await response.json();
        setSelectedPdfUrl(presignedUrl);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error(
          "Unable to load PDF for viewer; showing sample instead",
          error
        );
        setSelectedPdfUrl(sampleReportUrl);
        setActiveFileKey("sample-report.pdf");
        setTitle(sampleTitle);
      } finally {
        setIsLoadingPdf(false);
      }
    };

    loadPdf();

    return () => controller.abort();
  }, [searchFileKey, searchName, searchUrl]);

  useEffect(() => {
    setInitialAsk(searchAsk || "");
    if (searchAsk) {
      setIsChatMode(true);
    }
  }, [searchAsk]);

  useEffect(() => {
    const shouldUseSample = !searchFileKey && !searchUrl;
    const alreadyIndexed =
      typeof window !== "undefined" &&
      localStorage.getItem("sample-report-indexed") === "1";

    if (!shouldUseSample || alreadyIndexed) return;

    let cancelled = false;
    const indexSample = async () => {
      setIsEmbedding(true);
      setEmbedError("");
      try {
        const res = await fetch(sampleReportUrl);
        if (!res.ok) throw new Error("Sample PDF not found");
        const blob = await res.blob();
        const file = new File([blob], "sample-report.pdf", {
          type: "application/pdf",
        });
        await embedFileToPinecone(file, "sample-report.pdf");
        if (!cancelled && typeof window !== "undefined") {
          localStorage.setItem("sample-report-indexed", "1");
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to index sample PDF", error);
        setEmbedError("Sample PDF couldn't be indexed for chat.");
      } finally {
        if (!cancelled) setIsEmbedding(false);
      }
    };

    indexSample();

    return () => {
      cancelled = true;
    };
  }, [searchFileKey, searchUrl, sampleReportUrl]);

  useEffect(() => {
    return () => {
      if (localObjectUrl) {
        URL.revokeObjectURL(localObjectUrl);
      }
    };
  }, [localObjectUrl]);

  if (isChatMode) {
    return (
      <ChatSurface
        title={title || "Current PDF"}
        fileKey={activeFileKey}
        initialAsk={initialAsk}
        onBack={() => setIsChatMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cloud)] relative overflow-hidden text-[var(--ink)]">
      <div className="radiant-blob -left-10 -top-10" />
      <div className="radiant-blob right-0 top-32" />

      <main className="flex-1 w-full">
        <section className="max-w-6xl mx-auto px-4 lg:px-0  pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-left">
              <Link href="/" className="flex items-center">
                <Image
                  src={logo}
                  alt="ClearHealth"
                  width={36}
                  height={36}
                  className="shrink-0"
                />
              </Link>
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted-ink)]">
                  Report viewer
                </div>
                <h2 className="text-lg font-semibold text-[var(--ink)] truncate max-w-xl">
                  {title || "Select a report"}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="h-10 px-4 text-sm rounded-full border border-[var(--grid-line)] text-[var(--ink)] bg-white shadow-[0_6px_18px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isEmbedding}
                onClick={() => fileInputRef.current?.click()}
              >
                {isEmbedding ? "Preparing chat..." : "Upload PDF"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleLocalFileChange}
              />
              <button
                className="special-button px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isLoadingPdf || isEmbedding}
                onClick={() => setIsChatMode(true)}
              >
                {isLoadingPdf
                  ? "Loading PDF..."
                  : isEmbedding
                  ? "Preparing chat..."
                  : "Start chat"}
              </button>
            </div>
          </div>

          {embedError && (
            <div className="text-[12px] text-red-500 mb-2">{embedError}</div>
          )}

          <div className="flex flex-col lg:flex-row gap-4 min-h-[60vh] mt-10">
            <div className="flex-1 rounded-[18px]  overflow-hidden">
              <PDFLoader
                pdfUrl={selectedPdfUrl}
                pageHeight={880}
                pageScale={0.95}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function Viewer() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-[var(--muted-ink)]">
          Loading PDF viewer...
        </div>
      }
    >
      <ViewerContent />
    </Suspense>
  );
}
