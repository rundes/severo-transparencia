"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  h1: (p: React.ComponentProps<"h1">) => <h1 className="mb-2 mt-4 text-xl font-bold" {...p} />,
  h2: (p: React.ComponentProps<"h2">) => <h2 className="mb-2 mt-4 text-lg font-semibold" {...p} />,
  h3: (p: React.ComponentProps<"h3">) => <h3 className="mb-1 mt-3 font-semibold" {...p} />,
  p: (p: React.ComponentProps<"p">) => <p className="my-2 text-sm leading-relaxed" {...p} />,
  ul: (p: React.ComponentProps<"ul">) => <ul className="my-2 list-disc pl-5 text-sm" {...p} />,
  ol: (p: React.ComponentProps<"ol">) => <ol className="my-2 list-decimal pl-5 text-sm" {...p} />,
  li: (p: React.ComponentProps<"li">) => <li className="my-0.5" {...p} />,
  table: (p: React.ComponentProps<"table">) => (
    <div className="my-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...p} />
    </div>
  ),
  th: (p: React.ComponentProps<"th">) => (
    <th className="border border-neutral-800 bg-neutral-800/50 px-3 py-1.5 text-left font-medium" {...p} />
  ),
  td: (p: React.ComponentProps<"td">) => <td className="border border-neutral-800 px-3 py-1.5" {...p} />,
  strong: (p: React.ComponentProps<"strong">) => <strong className="font-semibold text-white" {...p} />,
  code: (p: React.ComponentProps<"code">) => (
    <code className="rounded bg-neutral-800 px-1 py-0.5 text-xs" {...p} />
  ),
};

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
