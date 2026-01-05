// components/ToolTip.js
import React, { useState, useEffect, useRef } from "react";
import "../../styles/tooltip.css";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { motion } from "framer-motion";

const ToolTip = ({ containerRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [contentMode, setContentMode] = useState("buttons"); // 'buttons' or 'text'
  const [definitions, setDefinitions] = useState([]);
  const [explanation, setExplanation] = useState("");
  const tooltipRef = useRef();
  const [source, setSource] = useState(null);
  const baseToolTipHeight = 40;
  const padding = 12;

  const clampToContainer = (rect, containerRect, offsetY = 0) => {
    if (!containerRect) return null;

    const tooltipWidth = tooltipRef.current?.offsetWidth ?? 260;
    const tooltipHeight = tooltipRef.current?.offsetHeight ?? 110;
    const rawLeft = rect.left - containerRect.left;
    const rawTop = rect.top - containerRect.top + offsetY;
    const maxLeft = Math.max(
      padding,
      containerRect.width - tooltipWidth - padding
    );
    const maxTop = Math.max(
      padding,
      containerRect.height - tooltipHeight - padding
    );

    return {
      left: Math.min(Math.max(rawLeft, padding), maxLeft),
      top: Math.min(Math.max(rawTop, padding), maxTop),
    };
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      let isSelectionWithinTooltip = false;

      if (tooltipRef.current) {
        const toolTip = tooltipRef.current.getBoundingClientRect();
        isSelectionWithinTooltip =
          rect.top >= toolTip.top &&
          rect.bottom <= toolTip.bottom &&
          rect.left >= toolTip.left &&
          rect.right <= toolTip.right;
      }

      if (
        selection.rangeCount > 0 &&
        selection.toString().length > 1 &&
        !isSelectionWithinTooltip
      ) {
        if (containerRef?.current) {
          const containerRect = containerRef.current.getBoundingClientRect();

          if (
            rect.left > containerRect.left &&
            rect.right < containerRect.right &&
            rect.top > containerRect.top &&
            rect.bottom < containerRect.bottom
          ) {
            const nextPosition = clampToContainer(
              rect,
              containerRect,
              -baseToolTipHeight
            );
            if (nextPosition) {
              setPosition(nextPosition);
              setIsVisible(true);
            } else {
              setIsVisible(false);
            }
          } else {
            setIsVisible(false);
          }
        }
      } else if (isSelectionWithinTooltip) {
        // Do nothing if the selection is within the tooltip
      } else {
        setIsVisible(false);
      }
    };

    document.addEventListener("mouseup", handleSelectionChange);
    return () => {
      document.removeEventListener("mouseup", handleSelectionChange);
    };
  }, [containerRef, baseToolTipHeight]);

  useEffect(() => {
    if (!isVisible) {
      setContentMode("buttons"); // Reset content mode to 'buttons' when tooltip is not visible
    }
  }, [isVisible]);

  const handleDefineClick = async () => {
    setContentMode("text");
    const selection = window.getSelection();
    const selectedWord = selection.toString().trim();
    setDefinitions([]); // Clear previous definitions
    setExplanation("");
    setSource("");

    if (selectedWord) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const container = containerRef?.current?.getBoundingClientRect();
      if (!container) return;

      // Set the tooltip position to be right under the selected text
      const nextPosition = clampToContainer(
        rect,
        container,
        rect.height + 5 // place just below the selection
      );
      if (nextPosition) {
        setPosition(nextPosition);
      }

      try {
        // First, try fetching from Wiktionary
        const wiktionaryResponse = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`
        );

        if (wiktionaryResponse.ok) {
          const wiktionaryData = await wiktionaryResponse.json();
          const definitionsData =
            wiktionaryData[0]?.meanings.map((meaning) => ({
              partOfSpeech: meaning.partOfSpeech,
              definitions: meaning.definitions.slice(0, 4).map((def, idx) => ({
                definition: def.definition,
                index: idx + 1,
              })),
            })) || [];

          // If Wiktionary has definitions, set them and stop further execution
          if (definitionsData.length > 0) {
            setDefinitions(definitionsData);
            setSource("Wiktionary");
            return; // Stop here if Wiktionary returns valid definitions
          }
        }

        // If Wiktionary does not return valid data, try Merriam-Webster Medical API
        const merriamWebsterResponse = await fetch(
          `https://www.dictionaryapi.com/api/v3/references/medical/json/${selectedWord}?key=2e02ed01-752b-4f99-8c80-256bb69ea462`
        );

        if (merriamWebsterResponse.ok) {
          const merriamWebsterData = await merriamWebsterResponse.json();
          if (
            merriamWebsterData.length > 0 &&
            typeof merriamWebsterData[0] === "object"
          ) {
            const definitionsData = merriamWebsterData[0].shortdef.map(
              (def, idx) => ({
                definition: def,
                index: idx + 1,
              })
            );
            setDefinitions([
              {
                partOfSpeech: merriamWebsterData[0].fl,
                definitions: definitionsData,
              },
            ]);
            setSource("Merriam-Webster Medical Dictionary");
          } else {
            // Handle case where no definition is found in Merriam-Webster
            setDefinitions([
              {
                partOfSpeech: "",
                definitions: [{ definition: "No definition found.", index: 1 }],
              },
            ]);
            setSource("Merriam-Webster Medical");
          }
        } else {
          // Handle error in Merriam-Webster API call
          setDefinitions([
            {
              partOfSpeech: "",
              definitions: [
                { definition: "Error fetching definition.", index: 1 },
              ],
            },
          ]);
          setSource("Merriam-Webster Medical");
        }
      } catch (error) {
        console.error("Error fetching definition:", error);
        setDefinitions([
          {
            partOfSpeech: "",
            definitions: [
              { definition: "Error fetching definition.", index: 1 },
            ],
          },
        ]);
        setSource("Merriam-Webster Medical");
      }
    }
  };

  const handleExplainSubmit = async (e) => {
    e.preventDefault();
    setContentMode("text");
    setExplanation("");
    setDefinitions([]); // Clear definitions
    setSource("");

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const container = containerRef?.current?.getBoundingClientRect();
      if (!container) return;

      // Set the tooltip position to be right under the selected text
      const nextPosition = clampToContainer(
        rect,
        container,
        rect.height + 5 // place just below the selection
      );
      if (nextPosition) {
        setPosition(nextPosition);
      }

      const response = await fetch("/api/openai-free-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: selectedText }],
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        // Decode the stream part
        const textChunk = decoder.decode(value, { stream: true });

        // Process each line individually
        const lines = textChunk.split("\n");
        lines.forEach((line) => {
          const match = line.match(/"([^"]+)"/);
          if (match) {
            const message = match[1].replace("\\n", "");
            result += message;
          }
        });

        // Assuming setExplanation is a function that updates your component or handles state
        setExplanation(sanitizeHTML(boldText(hyperlinkURLs(result))));
      }
    }
  };

  function hyperlinkURLs(text) {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlPattern,
      '<a href="$1" id="hyperlink" target="_blank">$1</a>'
    );
  }

  function boldText(text) {
    const pattern = /\\(.*?)\\/g;
    return text.replace(pattern, "<strong>$1</strong>");
  }

  const handleAskClick = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const prompt = `Please answer based on this excerpt: "${selectedText}"`;

    const url = new URL(window.location.href);
    url.pathname = "/pdf-viewer";
    url.searchParams.set("ask", prompt);

    const existingKey =
      url.searchParams.get("fileKey") || url.searchParams.get("key");
    if (existingKey) {
      url.searchParams.set("fileKey", existingKey);
    }

    window.location.href = url.toString();
  };

  function sanitizeHTML(html) {
    return DOMPurify.sanitize(html);
  }

  return (
    isVisible && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          visibility: isVisible ? "visible" : "hidden",
          position: "absolute",
        }}
        className={`inline-tooltip ${
          contentMode === "buttons" ? "inline-tooltip--actions" : ""
        }`}
        ref={tooltipRef}
      >
        {contentMode === "buttons" ? (
          <>
            <button
              className="styled-button font-inter"
              onClick={handleDefineClick}
            >
              Define
            </button>
            <span className="tooltip-divider" />
            <button
              className="styled-button font-inter"
              onClick={handleExplainSubmit}
            >
              Explain
            </button>
            <span className="tooltip-divider" />
            <button
              className="styled-button font-inter"
              onClick={handleAskClick}
            >
              Ask
            </button>
          </>
        ) : (
          <motion.div
            style={{ textAlign: "left" }}
            className="tooltip-body px-2 py-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {definitions.length > 0 && (
              <>
                {definitions.map((meaning, idx) => (
                  <div key={idx} style={{ marginBottom: "8px" }}>
                    <div className="">
                      <strong
                        style={{
                          textTransform: "capitalize",
                          fontSize: "12px",
                        }}
                      >
                        {meaning.partOfSpeech}
                      </strong>
                    </div>
                    <ol
                      style={{ marginLeft: "8px", marginTop: "2px" }}
                      className="mt-2"
                    >
                      {meaning.definitions.map((def) => (
                        <li
                          key={def.index}
                          style={{
                            fontSize: "12px",
                            marginBottom: "3px",
                            color: "var(--ink)",
                          }}
                        >
                          <span
                            style={{
                              color: "var(--muted-ink)",
                              marginRight: "5px",
                            }}
                          >
                            {def.index}.
                          </span>
                          {def.definition}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--muted-ink)",
                    marginTop: "10px",
                  }}
                >
                  Definitions retrieved from {source}
                </span>
              </>
            )}

            {explanation && (
              <div className="mb-2">
                <div className="mt-1 mb-1">
                  <h4 style={{ fontSize: "12px", fontWeight: "bold" }}>
                    Explanation:
                  </h4>
                </div>
                <p
                  style={{ fontSize: "12px", marginLeft: "4px" }}
                  id="explanation"
                  // dangerouslySetInnerHTML={{ __html: explanation }}
                >
                  {parse(explanation)}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    )
  );
};

export default ToolTip;
