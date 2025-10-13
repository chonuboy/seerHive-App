import type React from "react";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { toast } from "react-toastify";

interface TagInputProps {
  title: string;
  placeholder: string;
  name: string;
  tags: string[] | null;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  error?: string | string[] | null;
  handleToggleDropdown?: () => void;
  masterProps?: any;
}

export const TagInput: React.FC<TagInputProps> = ({
  title,
  placeholder,
  tags,
  onAddTag,
  name,
  onRemoveTag,
  error,
  masterProps,
}) => {
  const [input, setInput] = useState("");
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);

  const handleAddTag = () => {
    if (!input.trim()) {
      toast.error("Please Enter a Value", {
        position: "top-center",
      });
      return;
    }
    onAddTag(input.trim());
    setInput("");
  };

  return (
    <div className="pb-6">
      <label className="font-semibold text-xl">{title}</label>

      <div className="flex md:flex-row flex-col md:items-center gap-2 relative">
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
          className="w-full flex items-center gap-2 py-3 border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
        />

        <button
          type="button"
          onClick={() => setIsDropDownVisible(!isDropDownVisible)}
          className="text-gray-400 focus:outline-none md:absolute  top-4 right-16"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        {isDropDownVisible && (
          <div className="absolute top-full left-0 right-0 -mt-0 bg-white border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
            {/* Filter options based on input */}
            {masterProps &&
              masterProps
                .filter((item: any) =>
                  item
                    .toLowerCase()
                    .includes(input.toLowerCase())
                )
                .map((item: any) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setInput(item);
                      setIsDropDownVisible(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    {item}
                  </button>
                ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddTag}
          className="flex-1 sm:flex-none py-1.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-300 font-medium px-4 text-sm shadow-sm md:absolute right-0 top-3"
        >
          Add
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {tags && tags.length > 0 && (
        <div className="mt-2 space-y-2 animate-fadeIn">
          <div className="flex flex-wrap items-center gap-6">
            {tags.map((tag, index) => (
              <Tag key={index} text={tag} onRemove={() => onRemoveTag(tag)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface TagProps {
  text: string;
  onRemove: () => void;
}

const Tag: React.FC<TagProps> = ({ text, onRemove }) => {
  return (
    <span className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium mt-2">
      {text}
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-2 -top-2"
      >
        <X className="w-5 h-5 text-gray-500 hover:bg-gray-500 hover:text-white transition-all duration-100 bg-white rounded-full border-2 border-gray-500" />
      </button>
    </span>
  );
};

interface SingleInputProps {
  title: string;
  placeholder: string;
  name: string;
  value: string | number | null | readonly string[] | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | string[] | null;
}

export const SingleInput: React.FC<SingleInputProps> = ({
  title,
  placeholder,
  value,
  onChange,
  onBlur,
  name,
  error,
}) => (
  <div className="space-y-6 pb-6">
    <label className="font-semibold text-xl">{title}</label>
    <input
      type="text"
      className="flex items-center gap-2 border-b-2 w-full border-gray-300 focus-within:border-cyan-500 transition-colors"
      placeholder={placeholder}
      value={value ?? ""}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);
