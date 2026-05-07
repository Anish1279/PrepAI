"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Editor, { loader } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";

const CodeEditor = ({ onValueChange, language }) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const editorLanguage = useMemo(() => normalizeEditorLanguage(language), [language]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    defineEditorTheme(monaco);
    monaco.editor.setTheme("myCustomTheme");
    updateModelLanguage(editor, monaco, editorLanguage);
  };

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      updateModelLanguage(editorRef.current, monacoRef.current, editorLanguage);
    }
  }, [editorLanguage]);

  const handleEditorChange = (code) => {
    onValueChange(code ?? "");
  };

  const extractCode = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      onValueChange(code);
    }
  };

  useEffect(() => {
    loader.init().then((monaco) => {
      defineEditorTheme(monaco);
      monaco.editor.setTheme("myCustomTheme");
    });
  }, []);

  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-2">
        <Editor
          height="min(64vh, 720px)"
          width="100%"
          language={editorLanguage}
          defaultValue=""
          theme="myCustomTheme"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
        />
      </div>
      <div className="flex justify-end">
        <div className="flex gap-4">
          <Button onClick={extractCode} className="mt-4" variant="outline">
            Save Code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;

function updateModelLanguage(editor, monaco, language) {
  const model = editor.getModel();

  if (model) {
    monaco.editor.setModelLanguage(model, language);
  }
}

function defineEditorTheme(monaco) {
  monaco.editor.defineTheme("myCustomTheme", {
    base: "hc-black",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#030712",
      "editor.foreground": "#cbd5e1",
      "editor.lineHighlightBackground": "#0f172a",
      "editorCursor.foreground": "#22d3ee",
      "editorIndentGuide.background": "#1f2937",
      "editor.selectionBackground": "#155e75",
      "editorLineNumber.foreground": "#475569",
      "editorGutter.background": "#030712",
    },
  });
}

function normalizeEditorLanguage(language) {
  const normalized = String(language ?? "javascript").trim().toLowerCase();
  const aliases = {
    "c++": "cpp",
    cpp: "cpp",
    "c#": "csharp",
    csharp: "csharp",
    js: "javascript",
    javascript: "javascript",
    py: "python",
    python: "python",
    java: "java",
    ts: "typescript",
    typescript: "typescript",
  };

  return aliases[normalized] ?? normalized.replace(/\s+/g, "");
}
