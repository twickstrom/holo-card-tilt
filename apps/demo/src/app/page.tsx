import {Playground} from "@/components/playground";
import {ThemeSwitch} from "@/components/theme-switch";

export default function Page() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pt-10 pb-16">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">holo-card-tilt</h1>
          <p className="text-muted">Adjust the props and move your pointer over the card.</p>
        </div>
        <ThemeSwitch />
      </header>
      <Playground />
    </main>
  );
}
