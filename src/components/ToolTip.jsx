// components/ToolTip.js
import React, { useState, useEffect, forwardRef, useRef } from "react";
import "../styles/tooltip.css";
import { useChat } from "ai/react";
import { tool } from "ai";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

const ToolTip = forwardRef(({ tooltipText }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [contentMode, setContentMode] = useState("buttons"); // 'buttons' or 'text'
  const [definitions, setDefinitions] = useState([]);
  const [explanation, setExplanation] = useState("");
  const tooltipRef = useRef();
  const [source, setSource] = useState(null);
  const baseToolTipHeight = 40;

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
        if (ref.current) {
          const containerRect = ref.current.getBoundingClientRect();

          if (
            rect.left > containerRect.left &&
            rect.right < containerRect.right &&
            rect.top > containerRect.top &&
            rect.bottom < containerRect.bottom
          ) {
            setPosition({
              top:
                rect.top +
                window.scrollY -
                containerRect.top -
                baseToolTipHeight,
              left: rect.left - containerRect.left + window.scrollX,
            });

            setIsVisible(true);
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

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [ref, baseToolTipHeight]);

  useEffect(() => {
    if (!isVisible) {
      setContentMode("buttons"); // Reset content mode to 'buttons' when tooltip is not visible
    }
  }, [isVisible]);

  const handleDefineClick = async () => {
    setContentMode("text"); // Change mode to just text on clicking Define
    const selection = window.getSelection();
    const selectedWord = selection.toString().trim();
    setDefinitions([]); // Clear previous definitions
    setSource("");

    if (selectedWord) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const container = ref.current.getBoundingClientRect();

      // Set the tooltip position to be right under the selected text
      setPosition({
        top: rect.bottom + window.scrollY - container.top + 5, // Add a small space below the selection
        left: rect.left - container.left + window.scrollX,
      });

      // Fetch the definition of the selected word
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`
      );
      if (response.ok) {
        const data = await response.json();
        const definitionsData =
          data[0]?.meanings.map((meaning, index) => ({
            partOfSpeech: meaning.partOfSpeech,
            definitions: meaning.definitions.slice(0, 4).map((def, idx) => ({
              definition: def.definition,
              index: idx + 1,
            })),
          })) || [];
        setDefinitions(definitionsData);
        setSource("Wiktionary");
      } else {
        setDefinitions([
          {
            partOfSpeech: "",
            definitions: [{ definition: "No definition found.", index: 1 }],
          },
        ]);
        setSource("Wiktionary");
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
      const container = ref.current.getBoundingClientRect();

      // Set the tooltip position to be right under the selected text
      setPosition({
        top: rect.bottom + window.scrollY - container.top + 5, // Add a small space below the selection
        left: rect.left - container.left + window.scrollX,
      });

      const response = await fetch("/api/chat", {
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
          console.log("Stream completed.");
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
            console.log(message); // Logs each extracted message
            result += message;
            ``;
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

  function sanitizeHTML(html) {
    return DOMPurify.sanitize(html);
  }

  return (
    isVisible && (
      <div
        style={{
          position: "absolute",
          top: `${position.top}px`,
          left: `${position.left}px`,
          visibility: isVisible ? "visible" : "hidden",
          padding: "5px",
          backgroundColor: "white",
          color: "black",
          borderRadius: "4px",
          zIndex: 9,
          maxWidth: "435px",
          border: "1px solid rgba(220, 220, 220, 0.7)",
          boxShadow:
            "0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-around",
          overflow: "auto",
        }}
      >
        {contentMode === "buttons" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <button
              className="styled-button mr-1 font-inter"
              onClick={handleDefineClick}
            >
              Define
            </button>
            <div
              style={{
                height: "20px",
                width: "1px",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              }}
            ></div>
            <button
              className="styled-button ml-1 font-inter"
              onClick={handleExplainSubmit}
            >
              Explain
            </button>
          </div>
        ) : (
          <div
            style={{ textAlign: "left" }}
            className="px-3 py-1"
            ref={tooltipRef}
          >
            {definitions.length > 0 && (
              <>
                {definitions.map((meaning, idx) => (
                  <div key={idx} style={{ marginBottom: "10px" }}>
                    <div className="">
                      <strong
                        style={{
                          textTransform: "capitalize",
                          fontSize: "14px",
                        }}
                      >
                        {meaning.partOfSpeech}
                      </strong>
                    </div>
                    <ol
                      style={{ marginLeft: "10px", marginTop: "4px" }}
                      className="mt-2"
                    >
                      {meaning.definitions.map((def) => (
                        <li
                          key={def.index}
                          style={{
                            fontSize: "13px",
                            marginBottom: "5px",
                            color: "black",
                          }}
                        >
                          <span style={{ color: "gray", marginRight: "5px" }}>
                            {def.index}.
                          </span>
                          {def.definition}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
                <span
                  style={{ fontSize: "11px", color: "gray", marginTop: "10px" }}
                >
                  Definitions retrieved from {source}
                </span>
              </>
            )}

            {explanation && (
              <div className="mb-2">
                <div className="mt-1 mb-1">
                  <h4 style={{ fontSize: "14px", fontWeight: "bold" }}>
                    Explanation:
                  </h4>
                </div>
                <p
                  style={{ fontSize: "13px", marginLeft: "5px" }}
                  id="explanation"
                  // dangerouslySetInnerHTML={{ __html: explanation }}
                >
                  {parse(explanation)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  );
});

export default ToolTip;
