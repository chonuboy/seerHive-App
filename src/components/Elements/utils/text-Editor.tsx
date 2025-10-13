import React, { useState, useRef, useCallback } from "react";
import JoditEditor from "jodit-react";

export const TextEditor = React.memo(() => {
  const [content, setContent] = useState("");
  const [showContent, setShowContent] = useState(false);
  const editorRef = useRef(null);

  const config = {
    height: 500,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    placeholder: "Type your content here...",
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    readonly: false,
    buttons:
      "bold,ul,ol,superscript,subscript,spellcheck,speechRecognize,paste,indent,preview",
    buttonsMD:
      "bold,ul,ol,superscript,subscript,spellcheck,speechRecognize,paste,indent,preview",
    buttonsXS:
      "bold,ul,ol,superscript,subscript,spellcheck,speechRecognize,paste,indent,preview",
    buttonsSM:
      "bold,ul,ol,superscript,subscript,spellcheck,speechRecognize,paste,indent,preview",
  };

  const handleButtonClick = () => {
    console.log(content.replace(/style="[^"]*"/g, ""));
    setShowContent(true);
  };

  return (
    <div className="w-full mx-auto">
      <JoditEditor
        ref={editorRef}
        value={content}
        config={config}
        onBlur={(newContent) => {
          setContent(newContent);
        }}
      />
      <button
        onClick={handleButtonClick}
        className="bg-blue-500 text-white px-4 py-1 rounded-md mt-4"
      >
        Submit
      </button>
    </div>
  );
});
