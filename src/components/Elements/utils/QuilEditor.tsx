"use client"

import { useEffect, useRef } from "react"
import type QuillNamespace from "quill"

export interface QuillEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  height?: number
}

/**
 * Lightweight wrapper that embeds Quill without relying on
 * react-quill (avoids ReactDOM.findDOMNode issues in React 18).
 */
export default function QuillEditor({
  value,
  onChange,
  placeholder = "Type job description here…",
  height = 300,
}: QuillEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<QuillNamespace | null>(null)

  /* ---------- create Quill once on mount ---------- */
  useEffect(() => {
    let mounted = true

    async function init() {
      const { default: Quill } = await import("quill") // dynamic ESM import
      if (!mounted || !containerRef.current) return

      const toolbar = [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link"],
        ["clean"],
      ]

      quillRef.current = new Quill(containerRef.current, {
        theme: "snow",
        placeholder,
        modules: { toolbar },
      })

      // initial content
      if (value) quillRef.current.clipboard.dangerouslyPasteHTML(value)

      // propagate changes
      quillRef.current.on("text-change", () => {
        onChange(quillRef.current!.root.innerHTML)
      })
    }

    void init()

    return () => {
      mounted = false
      quillRef.current?.off("text-change")
      quillRef.current = null
    }
  }, [])

  /* ---------- keep external value in sync ---------- */
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value
    }
  }, [value])

  return <div ref={containerRef} className="rounded-md border border-gray-300" style={{ height }} />
}
