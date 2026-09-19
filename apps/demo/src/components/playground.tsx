"use client";

import type {Key} from "@heroui/react";
import type {HoloCardTiltVariants} from "holo-card-tilt";

import {Card, Chip, Label, ListBox, Select, Slider, Surface, Switch} from "@heroui/react";
import {HoloCardTilt} from "holo-card-tilt";
import {useState} from "react";

const VARIANTS = ["glare", "spotlight", "sheen"] as const;
const COLORS = ["default", "accent", "success", "warning", "danger"] as const;
const TILTS = ["none", "sm", "md", "lg"] as const;
const SHADOWS = ["none", "sm", "md", "lg"] as const;

interface OptionSelectProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

function OptionSelect<T extends string>({label, onChange, options, value}: OptionSelectProps<T>) {
  return (
    <Select
      fullWidth
      value={value}
      variant="secondary"
      onChange={(key: Key | Key[] | null) => {
        if (typeof key === "string") onChange(key as T);
      }}
    >
      <Label>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item key={option} id={option} textValue={option}>
              {option}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

interface RangeProps {
  isDisabled?: boolean;
  label: string;
  maxValue: number;
  minValue: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

function Range({label, onChange, ...props}: RangeProps) {
  return (
    <Slider {...props} onChange={(value) => onChange(value as number)}>
      <Label>{label}</Label>
      <Slider.Output className="tabular-nums" />
      <Slider.Track>
        <Slider.Fill />
        <Slider.Thumb />
      </Slider.Track>
    </Slider>
  );
}

export function Playground() {
  const [variant, setVariant] = useState<NonNullable<HoloCardTiltVariants["variant"]>>("glare");
  const [color, setColor] = useState<NonNullable<HoloCardTiltVariants["color"]>>("default");
  const [tilt, setTilt] = useState<NonNullable<HoloCardTiltVariants["tilt"]>>("md");
  const [shadow, setShadow] = useState<NonNullable<HoloCardTiltVariants["shadow"]>>("md");
  const [scaleFactor, setScaleFactor] = useState(1.05);
  const [glareIntensity, setGlareIntensity] = useState(1);
  const [shadowIntensity, setShadowIntensity] = useState(1);
  const [stiffness, setStiffness] = useState(0.2);
  const [damping, setDamping] = useState(0.8);
  const [isDisabled, setIsDisabled] = useState(false);
  const [shouldBlockScroll, setShouldBlockScroll] = useState(true);
  const [isActive, setIsActive] = useState(false);

  const code = [
    "<HoloCardTilt",
    '  className="w-80 rounded-3xl"',
    variant !== "glare" && `  variant="${variant}"`,
    color !== "default" && `  color="${color}"`,
    tilt !== "md" && `  tilt="${tilt}"`,
    shadow !== "none" && `  shadow="${shadow}"`,
    scaleFactor !== 1 && `  scaleFactor={${scaleFactor}}`,
    glareIntensity !== 1 && `  glareIntensity={${glareIntensity}}`,
    shadow !== "none" && shadowIntensity !== 1 && `  shadowIntensity={${shadowIntensity}}`,
    (stiffness !== 0.2 || damping !== 0.8) &&
      `  springOptions={{stiffness: ${stiffness}, damping: ${damping}}}`,
    !shouldBlockScroll && "  shouldBlockScroll={false}",
    isDisabled && "  isDisabled",
    ">",
    "  <HoloCardTilt.Rotator>",
    "    <Card>…</Card>",
    "    <HoloCardTilt.Glare />",
    "  </HoloCardTilt.Rotator>",
    "</HoloCardTilt>",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-6">
        <div className="border-border dark:bg-surface/60 relative grid min-h-96 flex-1 place-items-center rounded-3xl border p-8">
          <Chip
            className="absolute top-4 left-4"
            color={isActive ? "success" : "default"}
            size="sm"
            variant="soft"
          >
            {isActive ? "Active" : "At rest"}
          </Chip>
          <HoloCardTilt
            className="w-80 rounded-3xl"
            color={color}
            glareIntensity={glareIntensity}
            isDisabled={isDisabled}
            scaleFactor={scaleFactor}
            shadow={shadow}
            shadowIntensity={shadowIntensity}
            shouldBlockScroll={shouldBlockScroll}
            springOptions={{damping, stiffness}}
            tilt={tilt}
            variant={variant}
            onActiveChange={setIsActive}
          >
            <HoloCardTilt.Rotator>
              <Card className="rounded-3xl">
                <Card.Header>
                  <Card.Title>Move your pointer</Card.Title>
                  <Card.Description>
                    The card rotates toward the pointer while a glare and shadow follow it.
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="bg-surface-secondary h-32 rounded-2xl" />
                </Card.Content>
              </Card>
              <HoloCardTilt.Glare />
            </HoloCardTilt.Rotator>
          </HoloCardTilt>
        </div>
        <pre className="bg-surface-secondary overflow-x-auto rounded-3xl p-6 font-mono text-sm leading-6">
          <code>{code}</code>
        </pre>
      </div>

      <Surface className="shadow-surface flex flex-col gap-5 self-start rounded-3xl p-6">
        <OptionSelect label="Variant" options={VARIANTS} value={variant} onChange={setVariant} />
        <OptionSelect label="Color" options={COLORS} value={color} onChange={setColor} />
        <OptionSelect label="Tilt" options={TILTS} value={tilt} onChange={setTilt} />
        <OptionSelect label="Shadow" options={SHADOWS} value={shadow} onChange={setShadow} />
        <Range
          label="Scale factor"
          maxValue={1.3}
          minValue={0.9}
          step={0.01}
          value={scaleFactor}
          onChange={setScaleFactor}
        />
        <Range
          label="Glare intensity"
          maxValue={3}
          minValue={0}
          step={0.1}
          value={glareIntensity}
          onChange={setGlareIntensity}
        />
        <Range
          isDisabled={shadow === "none"}
          label="Shadow intensity"
          maxValue={6}
          minValue={0}
          step={0.1}
          value={shadowIntensity}
          onChange={setShadowIntensity}
        />
        <Range
          label="Spring stiffness"
          maxValue={1}
          minValue={0.01}
          step={0.01}
          value={stiffness}
          onChange={setStiffness}
        />
        <Range
          label="Spring damping"
          maxValue={1}
          minValue={0.05}
          step={0.01}
          value={damping}
          onChange={setDamping}
        />
        <Switch isSelected={shouldBlockScroll} onChange={setShouldBlockScroll}>
          <Switch.Content className="w-full justify-between">
            Block scroll on touch
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Content>
        </Switch>
        <Switch isSelected={isDisabled} onChange={setIsDisabled}>
          <Switch.Content className="w-full justify-between">
            Disabled
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Content>
        </Switch>
      </Surface>
    </div>
  );
}
