"use client";

import {Display, Moon, Sun} from "@gravity-ui/icons";
import {Segment} from "@heroui-pro/react";
import {useTheme} from "next-themes";
import {useSyncExternalStore} from "react";

const subscribe = () => () => {};

export function ThemeSwitch() {
  const {setTheme, theme} = useTheme();
  // The stored theme is only known in the browser, so the control renders after hydration.
  const isMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!isMounted) return <div className="h-8 w-24" />;

  return (
    <Segment
      aria-label="Theme"
      selectedKey={theme ?? "system"}
      size="sm"
      onSelectionChange={(key) => setTheme(String(key))}
    >
      <Segment.Item aria-label="Light" id="light">
        <Sun />
      </Segment.Item>
      <Segment.Item aria-label="Dark" id="dark">
        <Moon />
      </Segment.Item>
      <Segment.Item aria-label="System" id="system">
        <Display />
      </Segment.Item>
    </Segment>
  );
}
