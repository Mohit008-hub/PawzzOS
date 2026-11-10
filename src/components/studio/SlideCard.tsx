import { forwardRef } from "react";

import type { Slide } from "@/lib/carousel";
import { cn } from "@/lib/utils";

export type SlideTheme = "emerald" | "sunset" | "ink";

type Props = {
  slide: Slide;
  index: number;
  total: number;
  theme: SlideTheme;
  brand: string;
  handle: string;
  editable?: boolean;
  onEdit?: (field: keyof Slide, value: string) => void;
  className?: string;
};

/** A single 4:5 carousel slide. Fixed design size (540×675) scaled by its container. */
export const SlideCard = forwardRef<HTMLDivElement, Props>(function SlideCard(
  { slide, index, total, theme, brand, handle, editable, onEdit, className },
  ref,
) {
  const cover = index === 0;
  const last = index === total - 1;
  const edit = (field: keyof Slide) =>
    editable
      ? {
          contentEditable: true,
          suppressContentEditableWarning: true,
          spellCheck: false,
          onBlur: (e: React.FocusEvent<HTMLElement>) => onEdit?.(field, e.currentTarget.innerText.trim()),
          className: "outline-none rounded-md transition focus:ring-2 focus:ring-current/40 hover:bg-current/5 cursor-text",
        }
      : { className: "" };

  const h = edit("headline");
  const b = edit("body");
  const c = edit("callout");

  return (
    <div
      ref={ref}
      className={cn(`slide-theme-${theme} slide-surface relative flex aspect-[4/5] w-full flex-col overflow-hidden p-[7%]`, className)}
      style={{ containerType: "inline-size" }}
    >
      <div className="flex items-center justify-between" style={{ fontSize: "3.2cqw" }}>
        <span className="flex items-center gap-[1.5cqw] font-semibold">
          <span className="slide-accent-bg grid size-[6cqw] place-items-center rounded-full font-display font-extrabold" style={{ fontSize: "3cqw" }}>
            {brand.charAt(0)}
          </span>
          {brand}
        </span>
        <span className="slide-muted-text font-display font-bold tabular-nums">
          {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {!cover && <div className="slide-rule mb-[4cqw] h-[1cqw] w-[12cqw] rounded-full" />}
        <h3
          {...h}
          className={cn("font-display font-extrabold leading-[1.02] tracking-tight", h.className)}
          style={{ fontSize: cover ? "9.6cqw" : "7.4cqw" }}
        >
          {slide.headline}
        </h3>
        <p
          {...b}
          className={cn("slide-muted-text mt-[4cqw] leading-snug", b.className)}
          style={{ fontSize: cover ? "4.4cqw" : "4.2cqw" }}
        >
          {slide.body}
        </p>
      </div>

      <div className="flex items-end justify-between gap-[3cqw]">
        <span
          {...c}
          className={cn("slide-accent-bg inline-block max-w-[70%] rounded-full px-[3.5cqw] py-[1.6cqw] font-bold", c.className)}
          style={{ fontSize: "3.4cqw" }}
        >
          {slide.callout}
        </span>
        <span className="slide-muted-text font-medium" style={{ fontSize: "3cqw" }}>
          {last ? handle : "swipe →"}
        </span>
      </div>

      <div className="absolute inset-x-[7%] bottom-[3%] flex gap-[1cqw]">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={cn("h-[0.6cqw] flex-1 rounded-full", i <= index ? "slide-rule" : "slide-rule opacity-25")} />
        ))}
      </div>
    </div>
  );
});
