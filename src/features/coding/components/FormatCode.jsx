"use client";

import React, { useState, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

const FormatCode = ({ code = "", language = "javascript" }) => {
  const [highlightedCode, setHighlightedCode] = useState("");
  const safeCode = typeof code === "string" ? code : "";
  const safeLanguage =
    typeof language === "string" && language.trim() ? language.trim().toLowerCase() : "plaintext";

  useEffect(() => {
    if (!safeCode) {
      setHighlightedCode("");
      return;
    }

    try {
      const validLang = hljs.getLanguage(safeLanguage) ? safeLanguage : "plaintext";
      const highlighted = hljs.highlight(safeCode, { language: validLang }).value;
      setHighlightedCode(highlighted);
    } catch {
      setHighlightedCode(safeCode);
    }
  }, [safeCode, safeLanguage]);

  return (
    <div className="app-scrollbar overflow-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
      <pre>
        <code
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          className={`hljs language-${safeLanguage}`}
        ></code>
      </pre>
    </div>
  );
};

export default FormatCode;
