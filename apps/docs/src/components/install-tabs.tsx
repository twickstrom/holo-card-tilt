"use client";

import type {Key} from "@heroui/react";

import {Tabs} from "@heroui/react";
import {CodeBlock} from "@heroui-pro/react/code-block";
import {useTheme} from "next-themes";
import {useSyncExternalStore} from "react";

const MANAGERS = [
  {id: "npm", command: "npm install"},
  {id: "pnpm", command: "pnpm add"},
  {id: "yarn", command: "yarn add"},
  {id: "bun", command: "bun add"},
] as const;

const STORAGE_KEY = "package-manager";
const CHANGE_EVENT = "package-manager-change";

// The choice is kept in localStorage so every install block on the site, and later visits, agree.
const subscribe = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

const getSnapshot = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "npm";
  } catch {
    return "npm";
  }
};

const select = (key: Key) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(key));
  } catch {
    // Storage can be unavailable in private windows; the selection then lasts for the visit.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

interface InstallTabsProps {
  /** Packages to install, space separated. */
  packages: string;
}

export function InstallTabs({packages}: InstallTabsProps) {
  const selected = useSyncExternalStore(subscribe, getSnapshot, () => "npm");
  const {resolvedTheme} = useTheme();

  return (
    // Secondary tab styles target `.tabs--secondary > .tabs__list-container`, so the list container
    // stays a direct child of Tabs and the Tabs root doubles as the card.
    <Tabs
      className="border-border bg-surface gap-0 rounded-2xl border p-1"
      selectedKey={selected}
      variant="secondary"
      onSelectionChange={select}
    >
      <Tabs.ListContainer className="border-none px-2">
        <Tabs.List
          aria-label="Package manager"
          className="**:data-[slot=tabs-indicator]:bg-foreground"
        >
          {MANAGERS.map(({id}) => (
            <Tabs.Tab key={id} className="w-auto flex-none px-2.5" id={id}>
              {id}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
      {MANAGERS.map(({command, id}) => (
        <Tabs.Panel key={id} className="mt-0 p-0" id={id}>
          <CodeBlock className="relative my-0 rounded-xl">
            <CodeBlock.Code
              code={`${command} ${packages}`}
              language="bash"
              theme={resolvedTheme === "dark" ? "github-dark" : "github-light"}
            />
            <CodeBlock.CopyButton
              className="absolute top-1/2 right-2 -translate-y-1/2"
              code={`${command} ${packages}`}
            />
          </CodeBlock>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
