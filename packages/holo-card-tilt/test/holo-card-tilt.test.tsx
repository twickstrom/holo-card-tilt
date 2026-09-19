import {act} from "react";
import {createRoot} from "react-dom/client";
import {renderToString} from "react-dom/server";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {HoloCardTilt} from "../src/index.js";

(globalThis as {IS_REACT_ACT_ENVIRONMENT?: boolean}).IS_REACT_ACT_ENVIRONMENT = true;

const FRAME = 1000 / 60;

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

const mount = async (ui: React.ReactNode) => {
  await act(async () => root.render(ui));

  const element = container.querySelector<HTMLElement>('[data-slot="holo-card-tilt"]')!;

  element.getBoundingClientRect = () =>
    ({left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0}) as DOMRect;

  return element;
};

const pointer = (element: HTMLElement, type: string, clientX = 0, clientY = 0) => {
  // React listens for pointerover/pointerout to synthesize enter/leave.
  const native = {pointerenter: "pointerover", pointerleave: "pointerout"}[type] ?? type;

  element.dispatchEvent(new MouseEvent(native, {bubbles: true, clientX, clientY}));
};

const frames = (count: number) => vi.advanceTimersByTime(FRAME * count);

beforeEach(() => {
  vi.useFakeTimers({
    toFake: [
      "setTimeout",
      "clearTimeout",
      "requestAnimationFrame",
      "cancelAnimationFrame",
      "performance",
    ],
  });
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  document.documentElement.removeAttribute("data-reduce-motion");
  vi.useRealTimers();
});

describe("HoloCardTilt", () => {
  it("renders the same markup on the server with no runtime variables", () => {
    const html = renderToString(
      <HoloCardTilt color="accent" shadow="lg" tilt="sm" variant="sheen">
        <HoloCardTilt.Rotator>
          content
          <HoloCardTilt.Glare />
        </HoloCardTilt.Rotator>
      </HoloCardTilt>,
    );

    expect(html).toContain('data-slot="holo-card-tilt"');
    expect(html).toContain("holo-card-tilt--sheen");
    expect(html).toContain("holo-card-tilt--accent");
    expect(html).toContain("holo-card-tilt--tilt-sm");
    expect(html).toContain("holo-card-tilt--shadow-lg");
    expect(html).toContain("holo-card-tilt__rotator");
    expect(html).toContain("holo-card-tilt__glare");
    expect(html).not.toContain("--holo-card-tilt-x");
  });

  it("maps props to CSS variables and merges className", async () => {
    const element = await mount(
      <HoloCardTilt
        shadow
        className="rounded-3xl"
        glareHue={120}
        shadowIntensity={2.5}
        tiltFactor={2}
      >
        <HoloCardTilt.Rotator />
      </HoloCardTilt>,
    );

    expect(element.classList.contains("rounded-3xl")).toBe(true);
    expect(element.classList.contains("holo-card-tilt--shadow-md")).toBe(true);
    expect(element.style.getPropertyValue("--holo-card-tilt-factor-x")).toBe("2");
    expect(element.style.getPropertyValue("--holo-card-tilt-factor-y")).toBe("2");
    expect(element.style.getPropertyValue("--holo-card-tilt-glare-hue")).toBe("120");
    expect(element.style.getPropertyValue("--holo-card-tilt-shadow-intensity")).toBe("2.5");
  });

  it("activates on pointer enter, follows the pointer, and returns to rest", async () => {
    const onActiveChange = vi.fn();
    const element = await mount(
      <HoloCardTilt exitDelay={50} scaleFactor={1.1} onActiveChange={onActiveChange}>
        <HoloCardTilt.Rotator />
      </HoloCardTilt>,
    );

    pointer(element, "pointerenter", 200, 0);
    vi.advanceTimersByTime(0);
    frames(240);

    expect(element.getAttribute("data-active")).toBe("true");
    expect(element.style.getPropertyValue("--holo-card-tilt-x")).toBe("1");
    expect(element.style.getPropertyValue("--holo-card-tilt-y")).toBe("0");
    expect(element.style.getPropertyValue("--holo-card-tilt-opacity")).toBe("1");
    expect(element.style.getPropertyValue("--holo-card-tilt-scale")).toBe("1.1");
    expect(onActiveChange).toHaveBeenLastCalledWith(true);

    pointer(element, "pointerleave");
    vi.advanceTimersByTime(50);
    frames(1200);

    expect(element.hasAttribute("data-active")).toBe(false);
    expect(element.style.getPropertyValue("--holo-card-tilt-x")).toBe("0.5");
    expect(element.style.getPropertyValue("--holo-card-tilt-opacity")).toBe("0");
    expect(onActiveChange).toHaveBeenLastCalledWith(false);
  });

  it("waits for enterDelay and cancels if the pointer leaves first", async () => {
    const element = await mount(
      <HoloCardTilt enterDelay={300}>
        <HoloCardTilt.Rotator />
      </HoloCardTilt>,
    );

    pointer(element, "pointerenter", 100, 50);
    vi.advanceTimersByTime(200);
    pointer(element, "pointerleave");
    vi.advanceTimersByTime(1000);

    expect(element.hasAttribute("data-active")).toBe(false);
  });

  it("stays at rest when disabled", async () => {
    const element = await mount(
      <HoloCardTilt isDisabled>
        <HoloCardTilt.Rotator />
      </HoloCardTilt>,
    );

    pointer(element, "pointerenter", 200, 0);
    vi.advanceTimersByTime(0);
    frames(60);

    expect(element.getAttribute("data-disabled")).toBe("true");
    expect(element.hasAttribute("data-active")).toBe(false);
  });

  it('stays at rest under data-reduce-motion="true"', async () => {
    document.documentElement.setAttribute("data-reduce-motion", "true");

    const element = await mount(
      <HoloCardTilt>
        <HoloCardTilt.Rotator />
      </HoloCardTilt>,
    );

    pointer(element, "pointerenter", 200, 0);
    vi.advanceTimersByTime(0);
    frames(60);

    expect(element.hasAttribute("data-active")).toBe(false);
  });

  it('lets data-reduce-motion="false" override the OS setting', async () => {
    const matchMedia = vi.fn().mockReturnValue({matches: true});

    vi.stubGlobal("matchMedia", matchMedia);
    document.documentElement.setAttribute("data-reduce-motion", "false");

    const element = await mount(
      <HoloCardTilt>
        <HoloCardTilt.Rotator />
      </HoloCardTilt>,
    );

    pointer(element, "pointerenter", 200, 0);
    vi.advanceTimersByTime(0);
    frames(60);

    expect(element.getAttribute("data-active")).toBe("true");
    expect(matchMedia).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("stays at rest when the OS prefers reduced motion", async () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({matches: true}));

    const element = await mount(
      <HoloCardTilt>
        <HoloCardTilt.Rotator />
      </HoloCardTilt>,
    );

    pointer(element, "pointerenter", 200, 0);
    vi.advanceTimersByTime(0);
    frames(60);

    expect(element.hasAttribute("data-active")).toBe(false);
    vi.unstubAllGlobals();
  });

  it("blocks page scroll on touch by default and can opt out", async () => {
    const blocking = await mount(
      <HoloCardTilt>
        <HoloCardTilt.Rotator />
      </HoloCardTilt>,
    );

    expect(blocking.classList.contains("holo-card-tilt--block-scroll")).toBe(true);

    const scrolling = await mount(
      <HoloCardTilt shouldBlockScroll={false}>
        <HoloCardTilt.Rotator />
      </HoloCardTilt>,
    );

    expect(scrolling.classList.contains("holo-card-tilt--block-scroll")).toBe(false);
  });
});
