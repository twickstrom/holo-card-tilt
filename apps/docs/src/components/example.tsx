import type {ReactNode} from "react";

import {Code} from "./code";

interface ExampleProps {
  children: ReactNode;
  code: string;
}

export function Example({children, code}: ExampleProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="border-border dark:bg-surface/60 flex min-h-72 flex-wrap items-center justify-center gap-8 rounded-3xl border p-8">
        {children}
      </div>
      <Code code={code} />
    </div>
  );
}
