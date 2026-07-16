"use client";

import { memo } from "react";

import { useConfig } from "@/contexts/config-context";
import { cn } from "@/lib/utils";
import type { VideoTemplate } from "@/types/schema";

interface TemplateOption {
  description: string;
  label: string;
  value: VideoTemplate;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    description: "A clean, familiar avatar stack.",
    label: "Classic",
    value: "classic",
  },
  {
    description: "Followers connect across a living star map.",
    label: "Constellation",
    value: "constellation",
  },
  {
    description: "Avatars circle a bold milestone counter.",
    label: "Orbit",
    value: "orbit",
  },
];

const TemplateThumbnail = ({ template }: { template: VideoTemplate }) => {
  if (template === "classic") {
    return (
      <div className="flex h-16 items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-950">
        <div className="flex -space-x-2">
          {["bg-blue-400", "bg-amber-400", "bg-pink-400", "bg-violet-400"].map(
            (color) => (
              <span
                key={color}
                className={cn(
                  "size-6 rounded-full border-2 border-white dark:border-slate-900",
                  color
                )}
              />
            )
          )}
        </div>
      </div>
    );
  }

  if (template === "constellation") {
    return (
      <div className="relative h-16 overflow-hidden bg-[radial-gradient(circle_at_center,#312e81,#09090b_72%)]">
        <span className="absolute left-[18%] top-[24%] size-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]" />
        <span className="absolute left-[48%] top-[48%] size-3 rounded-full bg-violet-300 shadow-[0_0_10px_#c4b5fd]" />
        <span className="absolute right-[16%] top-[20%] size-2 rounded-full bg-blue-300 shadow-[0_0_8px_#93c5fd]" />
        <span className="absolute bottom-[18%] left-[28%] size-2 rounded-full bg-fuchsia-300 shadow-[0_0_8px_#f0abfc]" />
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full text-indigo-300/70"
          viewBox="0 0 100 50"
        >
          <path
            d="M18 12 L48 24 L84 10 M48 24 L28 41"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative flex h-16 items-center justify-center overflow-hidden bg-linear-to-br from-orange-100 via-rose-100 to-violet-200 dark:from-zinc-950 dark:via-rose-950 dark:to-violet-950">
      <span className="absolute h-12 w-24 rounded-[50%] border border-violet-500/50" />
      <span className="absolute h-7 w-16 rounded-[50%] border border-rose-500/60" />
      <span className="z-10 size-5 rounded-full bg-zinc-900 shadow-lg dark:bg-white" />
      <span className="absolute left-[24%] top-[20%] size-2.5 rounded-full bg-orange-400" />
      <span className="absolute bottom-[18%] right-[22%] size-2.5 rounded-full bg-violet-500" />
    </div>
  );
};

export const TemplateSelector = memo(() => {
  const { setTemplate, template } = useConfig();

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm leading-none font-medium select-none">
        Video template
      </legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {TEMPLATE_OPTIONS.map((option) => {
          const isSelected = template === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              className={cn(
                "overflow-hidden rounded-xl border bg-background text-left outline-none transition-[border-color,box-shadow,transform] duration-150 ease-out motion-reduce:transition-none",
                "hover:-translate-y-0.5 hover:border-foreground/30 motion-reduce:hover:translate-y-0",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                isSelected
                  ? "border-foreground ring-1 ring-foreground/15"
                  : "border-border"
              )}
              onClick={() => setTemplate(option.value)}
            >
              <TemplateThumbnail template={option.value} />
              <span className="block space-y-0.5 p-2.5">
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span className="block text-xs leading-4 text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
});

TemplateSelector.displayName = "TemplateSelector";
