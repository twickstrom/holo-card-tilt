"use client";

import {CodeBlock} from "@heroui-pro/react/code-block";
import {useTheme} from "next-themes";

interface CodeProps {
  code: string;
  language?: string;
  title?: string;
}

export function Code({code, language = "tsx", title}: CodeProps) {
  const {resolvedTheme} = useTheme();

  return (
    <CodeBlock>
      <CodeBlock.Header>
        <span className="text-muted text-xs">{title ?? language}</span>
        <CodeBlock.CopyButton code={code} />
      </CodeBlock.Header>
      <CodeBlock.Code
        code={code}
        language={language}
        theme={resolvedTheme === "dark" ? "github-dark" : "github-light"}
      />
    </CodeBlock>
  );
}
