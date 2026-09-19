"use client";

import type {Key} from "@heroui/react";

import {Display, Moon, Sun} from "@gravity-ui/icons";
import {ToggleButton, ToggleButtonGroup} from "@heroui/react";
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

  if (!isMounted) return <div className="h-8 w-26" />;

  return (
    <ToggleButtonGroup
      disallowEmptySelection
      aria-label="Theme"
      selectedKeys={new Set<Key>([theme ?? "system"])}
      selectionMode="single"
      size="sm"
      onSelectionChange={(keys) => setTheme(String([...keys][0]))}
    >
      <ToggleButton isIconOnly aria-label="Light" id="light">
        <Sun />
      </ToggleButton>
      <ToggleButton isIconOnly aria-label="Dark" id="dark">
        <Moon />
      </ToggleButton>
      <ToggleButton isIconOnly aria-label="System" id="system">
        <Display />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
