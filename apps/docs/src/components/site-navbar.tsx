"use client";

import {LogoGithub} from "@gravity-ui/icons";
import {Navbar} from "@heroui-pro/react";

import {ThemeSwitch} from "./theme-switch";
import {GITHUB_URL, NPM_URL, SECTIONS} from "@/lib/site";

export function SiteNavbar() {
  return (
    <Navbar maxWidth="xl" shouldBlockScroll={false}>
      <Navbar.Header>
        <Navbar.MenuToggle className="md:hidden" />
        <Navbar.Brand>
          <a className="font-semibold" href="#top">
            HoloCardTilt
          </a>
        </Navbar.Brand>
        <Navbar.Content className="hidden gap-0 md:flex">
          {SECTIONS.map(({id, label}) => (
            <Navbar.Item key={id} href={`#${id}`}>
              {label}
            </Navbar.Item>
          ))}
        </Navbar.Content>
        <Navbar.Spacer />
        <Navbar.Content className="gap-2">
          <Navbar.Item className="hidden sm:flex" href={NPM_URL}>
            npm
          </Navbar.Item>
          <Navbar.Item aria-label="GitHub repository" href={GITHUB_URL}>
            <LogoGithub data-slot="icon" />
          </Navbar.Item>
          <ThemeSwitch />
        </Navbar.Content>
      </Navbar.Header>
      <Navbar.Menu>
        {SECTIONS.map(({id, label}) => (
          <Navbar.MenuItem key={id} href={`#${id}`}>
            {label}
          </Navbar.MenuItem>
        ))}
      </Navbar.Menu>
    </Navbar>
  );
}
