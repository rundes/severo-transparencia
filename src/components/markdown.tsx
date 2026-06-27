"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  h1: (p: React.ComponentProps<"h1">) => (
    <h1 className="font-display mb-3 mt-5 text-2xl font-semibold tracking-tight text-ink first:mt-0" {...p} />
  ),
  h2: (p: React.ComponentProps<"h2">) => (
    <h2 className="font-display mb-2 mt-6 text-xl font-semibold tracking-tight text-ink" {...p} />
  ),
  h3: (p: React.ComponentProps<"h3">) => (
    <h3 className="mb-1 mt-4 text-sm font-semibold uppercase tracking-[0.08em] text-ink-soft" {...p} />
  ),
  p: (p: React.ComponentProps<"p">) => <p className="my-2.5 text-[0.95rem] leading-relaxed text-ink-soft" {...p} />,
  ul: (p: React.ComponentProps<"ul">) => <ul className="my-2.5 list-disc pl-5 text-[0.95rem] text-ink-soft marker:text-ink-faint" {...p} />,
  ol: (p: React.ComponentProps<"ol">) => <ol className="my-2.5 list-decimal pl-5 text-[0.95rem] text-ink-soft marker:text-ink-faint" {...p} />,
  li: (p: React.ComponentProps<"li">) => <li className="my-1" {...p} />,
  a: (p: React.ComponentProps<"a">) => <a className="text-accent-ink underline underline-offset-2 hover:text-accent" {...p} />,
  blockquote: (p: React.ComponentProps<"blockquote">) => (
    <blockquote className="my-3 border-l-2 border-rule-strong pl-4 italic text-ink-faint" {...p} />
  ),
  table: (p: React.ComponentProps<"table">) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full text-sm" {...p} />
    </div>
  ),
  thead: (p: React.ComponentProps<"thead">) => <thead className="border-b border-rule-strong" {...p} />,
  tbody: (p: React.ComponentProps<"tbody">) => <tbody className="divide-y divide-rule" {...p} />,
  th: (p: React.ComponentProps<"th">) => (
    <th className="py-2 pr-4 text-left text-[0.7rem] font-medium uppercase tracking-[0.08em] text-ink-faint" {...p} />
  ),
  td: (p: React.ComponentProps<"td">) => <td className="py-2 pr-4 align-top text-ink-soft" {...p} />,
  strong: (p: React.ComponentProps<"strong">) => <strong className="font-semibold text-ink" {...p} />,
  code: (p: React.ComponentProps<"code">) => (
    <code className="rounded bg-paper-2 px-1.5 py-0.5 text-[0.85em] text-ink" {...p} />
  ),
};

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
