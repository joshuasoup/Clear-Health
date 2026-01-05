"use client";
import { useState } from "react";
import Navbar from "./components/NavBar";
import "../styles/globals.css";
import Footer from "./components/Footer";
import dynamic from "next/dynamic";
import randomBg from "../assets/images/randombg.png";
import Image from "next/image";

const featureCards = [
  {
    title: "Translate every scan",
    body: "Upload any PDF report and receive a calm, human explanation in seconds. No jargon—just what matters for your next step.",
    accent: "decode",
  },
  {
    title: "Converse with context",
    body: "Chat on top of your report and get references back to the exact passages we used. Trust stays intact.",
    accent: "context",
  },
  {
    title: "Keep moving",
    body: "Highlight confusing phrases, request plain-language rewrites, and leave with a clear plan to discuss with your clinician.",
    accent: "action",
  },
];

const steps = [
  { title: "Drop your report", note: "Drag a PDF—no accounts required." },
  {
    title: "Instant clarity",
    note: "We summarize findings and decode terminology without losing nuance.",
  },
  {
    title: "Ask and iterate",
    note: "Chat through specifics: risks, next steps, and terms to revisit with your doctor.",
  },
];

const videoReel = [
  {
    title: "Highlight to define",
    src: "/assets/toolTipVideo.mp4",
    note: "Select any confusing phrase and get a plain-language definition on the spot.",
  },
  {
    title: "Explain complex findings",
    src: "/assets/explainToolTipVideo.mp4",
    note: "See nuanced explanations anchored to the exact section of your report.",
  },
  {
    title: "Chat in-context",
    src: "/assets/chatComponentVideo.mp4",
    note: "Ask follow-ups while we keep answers tied to citations from your upload.",
  },
];

const sampleReportUrl = "/sample-report.pdf";

const proofPoints = [
  { label: "Avg. clarity time", value: "58s" },
  { label: "Reports decoded", value: "12,400+" },
  { label: "Care conversations sparked", value: "3.2x" },
];

const PDFPreview = dynamic(() => import("./components/PDFLoader"), {
  ssr: false,
});

const Home = () => {
  const [viewerReset, setViewerReset] = useState(0);
  const [viewerMoved, setViewerMoved] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cloud)] relative overflow-hidden text-[var(--ink)]">
      <div className="radiant-blob -left-10 -top-10" />
      <div className="radiant-blob right-0 top-32" />
      <Navbar />

      <main className="flex-1">
        <section className="relative max-w-6xl mx-auto px-0 pt-16 pb-12 lg:pt-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 text-left space-y-6">
              <h1 className="headline text-2xl sm:text-3xl lg:text-4xl leading-tight text-[var(--ink)]">
                Clinical clarity with a single upload.
              </h1>
              <p className="text-sm sm:text-base text-[var(--muted-ink)] max-w-2xl">
                Drop any report, get a trustworthy summary and contextual
                answers instantly. No accounts, no friction—just language you
                can use in your next appointment.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex gap-3 text-xs text-[var(--muted-ink)]">
                  {proofPoints.map((item) => (
                    <div key={item.label} className="flex flex-col">
                      <span className="text-[var(--ink)] font-semibold text-sm">
                        {item.value}
                      </span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="max-w-6xl mx-auto px-0 py-14">
          <div className="flex flex-col lg:flex-row-reverse items-start lg:items-end justify-between gap-6">
            <div className="lg:text-right">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted-ink)]">
                How it works
              </div>
              <h2 className="headline text-xl md:text-2xl mt-1 text-[var(--ink)]">
                From upload to confident conversation
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted-ink)] mt-3 max-w-2xl">
                Every step stays transparent: we preserve nuance, cite sources,
                and keep your session contained.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {steps.map((step, idx) => (
              <div
                key={step.title}
                className="rounded-[16px] border border-[var(--grid-line)] p-3 bg-white"
              >
                <div className="text-[var(--muted-ink)] text-[11px] mb-1">
                  0{idx + 1}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[var(--ink)] mb-1">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--muted-ink)] leading-relaxed">
                  {step.note}
                </p>
              </div>
            ))}
          </div>
        </section> */}

        <section className="max-w-6xl mx-auto px-0 pb-14">
          <div className="relative rounded-[20px] border border-[var(--grid-line)] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="absolute right-4 top-4 text-right space-y-1 z-10">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted-ink)]">
                Try highlighting
              </div>
              <p className="text-xs sm:text-sm text-[var(--muted-ink)]">
                Select text in the sample report and use the inline tools.
              </p>
            </div>
            <div
            className="pdf-demo relative flex flex-col justify-center px-3 sm:px-4 py-10 bg-cover bg-center"
            style={{
              backgroundImage: `url(${randomBg.src})`,
              backgroundSize: "1400px 760px",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              minHeight: "760px",
            }}
          >
              <Image src={randomBg} alt="" priority className="hidden" />
              <div className="w-full max-w-6xl mx-auto flex justify-center">
                <PDFPreview
                  pdfUrl={sampleReportUrl}
                  pageHeight={560}
                  showNavigation={false}
                  showPageNumber={false}
                  variant="compact"
                  pageScale={1.65}
                  openHref="/pdf-viewer"
                  resetSignal={viewerReset}
                  onPositionChange={(moved) => setViewerMoved(moved)}
                />
              </div>
              {viewerMoved && (
                <button
                  onClick={() => {
                    setViewerReset((count) => count + 1);
                    setViewerMoved(false);
                  }}
                  className="absolute bottom-4 right-4 text-[var(--muted-ink)] hover:text-[var(--ink)] transition"
                  aria-label="Reset viewer position"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v6h6M20 20v-6h-6M6 10a8 8 0 0 1 13.66-2.34M18 14a8 8 0 0 1-13.66 2.34"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-0 pb-20">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted-ink)] text-left">
                See it live
              </div>
              <h2 className="headline text-xl md:text-2xl text-[var(--ink)]">
                Moments from the product
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted-ink)] max-w-xl self-end">
              Loops straight from the app—definitions, explanations, and chat.
            </p>
          </div>
          <div className="space-y-6">
            {videoReel[0] && (
              <div className="video-card space-y-3">
                <div className="video-frame w-full">
                  <video
                    src={videoReel[0].src}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <div className="video-caption">
                  <h3 className="text-sm sm:text-base font-semibold text-[var(--ink)] text-left">
                    {videoReel[0].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted-ink)] leading-relaxed text-left">
                    {videoReel[0].note || "Product moment"}
                  </p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {videoReel.slice(1).map((clip) => (
                <div key={clip.title} className="video-card space-y-3">
                  <div className="video-frame">
                    <video
                      src={clip.src}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div className="video-caption">
                    <h3 className="text-sm sm:text-base font-semibold text-[var(--ink)] text-left">
                      {clip.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--muted-ink)] leading-relaxed text-left">
                      {clip.note || "Product moment"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
