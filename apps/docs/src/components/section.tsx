import type {ReactNode} from "react";

interface SectionProps {
  children: ReactNode;
  description?: ReactNode;
  id: string;
  title: string;
}

export function Section({children, description, id, title}: SectionProps) {
  return (
    <section className="flex scroll-mt-24 flex-col gap-6" id={id}>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description ? <p className="text-muted max-w-2xl">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function SubSection({children, description, title}: Omit<SectionProps, "id">) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-medium">{title}</h3>
        {description ? <p className="text-muted max-w-2xl">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
