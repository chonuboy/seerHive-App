"use client";

import type React from "react";
import { useState } from "react";
import type { FieldConfig } from "@/lib/invoice";
import { Plus, Trash2 } from "lucide-react";

interface FieldRendererProps {
  field: FieldConfig;
  value: string | string[];
  onChange?: (id: string, value: string | string[]) => void;
  readonly?: boolean;
  className?: string;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  readonly = false,
  className,
}) => {
  const [newListItem, setNewListItem] = useState("");

  const listValue = Array.isArray(value) ? value : field.listItems || [];
  const stringValue = typeof value === "string" ? value : "";

  const sanitizeStyle = (styleObj: Record<string, any> = {}) => {
    const validStyles: Record<string, any> = {};
    for (const [key, value] of Object.entries(styleObj)) {
      if (value == null || value === "") continue;

      // Convert kebab-case -> camelCase
      const reactKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

      validStyles[reactKey] = value;
    }
    return validStyles;
  };

  const handleListItemAdd = () => {
    if (!newListItem.trim() || !onChange) return;

    const currentItems = Array.isArray(value) ? value : [];
    const newItems = [...currentItems, newListItem.trim()];
    onChange(field.id, newItems);
    setNewListItem("");
  };

  const handleListItemRemove = (index: number) => {
    if (!onChange) return;

    const currentItems = Array.isArray(value) ? value : [];
    const newItems = currentItems.filter((_, i) => i !== index);
    onChange(field.id, newItems);
  };

  const handleListItemUpdate = (index: number, newValue: string) => {
    if (!onChange) return;

    const currentItems = Array.isArray(value) ? value : [];
    const newItems = [...currentItems];
    newItems[index] = newValue;
    onChange(field.id, newItems);
  };

  if (readonly) {
    // Display mode - show styled text/values only
    return (
      <div
        className={`mb-4 ${className || ""}`}
        style={sanitizeStyle(field.containerStyle)}
      >
        <label
          className="block text-sm font-medium text-gray-600 mb-1"
          style={sanitizeStyle(field.labelStyle)}
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {field.type === "list" || field.type === "ordered-list" ? (
          <div className="min-h-[2rem]" style={sanitizeStyle(field.styleDisplay)}>
            {listValue.length > 0 ? (
              field.type === "ordered-list" ? (
                <ol className="list-decimal list-inside space-y-1">
                  {listValue.map((item, index) => (
                    <li key={index} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="list-disc list-inside space-y-1">
                  {listValue.map((item, index) => (
                    <li key={index} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </div>
        ) : (
          <div
            className="min-h-[2rem] flex items-center"
            style={sanitizeStyle(field.styleDisplay)}
          >
            {stringValue || "-"}
          </div>
        )}
      </div>
    );
  }

  // Edit mode - show form inputs
  const baseInputClasses =
    "border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md px-3 py-2";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (onChange) {
      onChange(field.id, e.target.value);
    }
  };

  const getInputStyles = () => {
    const inputStyles = { ...field.styleForm };
    // Remove container-level properties from input styles
    delete inputStyles.width;
    delete inputStyles.height;
    delete inputStyles.margin;
    delete inputStyles.textAlign;
    delete inputStyles.display;
    delete inputStyles.flexDirection;
    delete inputStyles.gap;
    delete inputStyles.alignItems;
    delete inputStyles.minHeight;
    delete inputStyles.backgroundColor;
    delete inputStyles.color;
    delete inputStyles.fontWeight;
    delete inputStyles.fontSize;
    return sanitizeStyle(inputStyles);
  };

  const getContainerStyles = () => {
    return sanitizeStyle(field.containerStyle) || {};
  };

  return (
    <div className={`mb-4 ${className || ""}`} style={getContainerStyles()}>
      <label
        htmlFor={field.id}
        className="block text-sm font-medium text-gray-900 mb-2"
        style={sanitizeStyle(field.labelStyle)}
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.type === "list" || field.type === "ordered-list" ? (
        <div className="space-y-2">
          {listValue.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleListItemUpdate(index, e.target.value)}
                className={`${baseInputClasses} flex-1`}
                placeholder={`${
                  field.type === "ordered-list" ? `${index + 1}.` : "•"
                } Enter item`}
                style={getInputStyles()}
              />
              <button
                type="button"
                onClick={() => handleListItemRemove(index)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newListItem}
              onChange={(e) => setNewListItem(e.target.value)}
              placeholder={`Add new ${
                field.type === "ordered-list" ? "numbered" : "bullet"
              } item`}
              className={`${baseInputClasses} flex-1`}
              onKeyPress={(e) => e.key === "Enter" && handleListItemAdd()}
              style={getInputStyles()}
            />
            <button
              type="button"
              onClick={handleListItemAdd}
              disabled={!newListItem.trim()}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : field.type === "textarea" ? (
        <textarea
          id={field.id}
          value={stringValue}
          onChange={handleChange}
          placeholder={field.placeholder}
          className={`${baseInputClasses} w-full h-full resize-none`}
          style={getInputStyles()}
          rows={3}
        />
      ) : (
        <input
          id={field.id}
          type={field.type}
          value={stringValue}
          onChange={handleChange}
          placeholder={field.placeholder}
          className={`${baseInputClasses} w-full h-full`}
          style={getInputStyles()}
        />
      )}
    </div>
  );
};
