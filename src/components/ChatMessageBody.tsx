"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-2.5 text-[17px] leading-relaxed last:mb-0 sm:text-lg sm:leading-relaxed">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-50">{children}</strong>
  ),
  em: ({ children }) => <em className="italic opacity-95">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-2.5 list-disc space-y-2 ps-5 text-[17px] marker:text-[#ff7a18] sm:text-lg">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2.5 list-decimal space-y-2 ps-5 text-[17px] marker:font-semibold marker:text-[#ff7a18] sm:text-lg">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed [&>p]:mb-0">{children}</li>
  ),
  h1: ({ children }) => (
    <h3 className="mb-2 mt-4 text-lg font-bold tracking-tight text-[#ff9f5a] first:mt-0 sm:text-xl">
      {children}
    </h3>
  ),
  h2: ({ children }) => (
    <h3 className="mb-2 mt-4 text-lg font-bold tracking-tight text-[#ff9f5a] first:mt-0 sm:text-xl">
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-3 text-lg font-bold tracking-tight text-[#ff9f5a] first:mt-0 sm:text-xl">
      {children}
    </h3>
  ),
  hr: () => <hr className="my-3 border-zinc-700/80" />,
  blockquote: ({ children }) => (
    <blockquote className="my-2.5 border-s-2 border-[#ff7a18]/60 ps-3 text-base text-zinc-300 sm:text-lg">
      {children}
    </blockquote>
  ),
  a: ({ children }) => (
    <span className="font-medium text-[#ff9f5a]">{children}</span>
  ),
  code: ({ children }) => (
    <code className="rounded bg-zinc-800/90 px-1.5 py-0.5 font-mono text-[15px] text-[#ffb380] sm:text-base">
      {children}
    </code>
  ),
};

type Props = {
  content: string;
  variant: "user" | "assistant";
};

/**
 * `dir="auto"` lets the browser set RTL for Arabic / Hebrew and LTR for Latin
 * based on the first strong directional character.
 */
export function ChatMessageBody({ content, variant }: Props) {
  if (variant === "user") {
    return (
      <div dir="auto">
        <p className="whitespace-pre-wrap text-[17px] font-medium leading-relaxed sm:text-lg">
          {content}
        </p>
      </div>
    );
  }

  return (
    <div
      dir="auto"
      className="text-[17px] leading-relaxed text-zinc-100 sm:text-lg sm:leading-relaxed"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
