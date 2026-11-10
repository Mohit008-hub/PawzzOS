import { toPng } from "html-to-image";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Repeat2,
  Send,
  ThumbsUp,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Platform, Slide } from "@/lib/carousel";
import { cn } from "@/lib/utils";

import { SlideCard, type SlideTheme } from "./SlideCard";

export function CarouselPreview({
  slides,
  onChange,
  theme,
  platform,
  brand,
  handle,
  caption,
  hashtags,
}: {
  slides: Slide[];
  onChange: (slides: Slide[]) => void;
  theme: SlideTheme;
  platform: Platform;
  brand: string;
  handle: string;
  caption: string;
  hashtags: string[];
}) {
  const [i, setI] = useState(0);
  const [editing, setEditing] = useState(true);
  const [exporting, setExporting] = useState(false);
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);
  const idx = Math.min(i, slides.length - 1);

  const edit = (index: number) => (field: keyof Slide, value: string) => {
    if (!value) return;
    onChange(slides.map((s, k) => (k === index ? { ...s, [field]: value } : s)));
  };

  async function exportAll() {
    setExporting(true);
    try {
      for (let k = 0; k < slides.length; k++) {
        const node = exportRefs.current[k];
        if (!node) continue;
        const url = await toPng(node, { pixelRatio: 2, cacheBust: true, skipFonts: false });
        const a = document.createElement("a");
        a.href = url;
        a.download = `carousel-slide-${k + 1}.png`;
        a.click();
        await new Promise((r) => setTimeout(r, 250));
      }
      toast.success(`Exported ${slides.length} slides as PNG (1080×1350)`);
    } catch (e) {
      console.error(e);
      toast.error("Export failed — try again, or take a screenshot of each slide.");
    } finally {
      setExporting(false);
    }
  }

  const nav = (
    <>
      <button
        aria-label="Previous slide"
        onClick={() => setI(Math.max(0, idx - 1))}
        disabled={idx === 0}
        className="absolute left-2 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground shadow-soft transition disabled:opacity-0"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        aria-label="Next slide"
        onClick={() => setI(Math.min(slides.length - 1, idx + 1))}
        disabled={idx === slides.length - 1}
        className="absolute right-2 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground shadow-soft transition disabled:opacity-0"
      >
        <ChevronRight className="size-5" />
      </button>
    </>
  );

  const slideView = (
    <div className="relative overflow-hidden">
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${idx * 100}%)` }}>
        {slides.map((s, k) => (
          <div key={k} className="w-full shrink-0">
            <SlideCard slide={s} index={k} total={slides.length} theme={theme} brand={brand} handle={handle} editable={editing} onEdit={edit(k)} />
          </div>
        ))}
      </div>
      {nav}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      {/* Phone / feed frame */}
      <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
        {platform === "instagram" ? (
          <>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="grid size-8 place-items-center rounded-full bg-emerald-gradient text-xs font-bold text-primary-foreground">
                {brand.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{handle.replace("@", "")}</p>
                <p className="text-[11px] text-muted-foreground">Sponsored · Ahmedabad</p>
              </div>
              <MoreHorizontal className="size-5 text-muted-foreground" />
            </div>
            {slideView}
            <div className="flex items-center gap-4 px-4 pt-3">
              <Heart className="size-6" />
              <MessageCircle className="size-6" />
              <Send className="size-6" />
              <div className="mx-auto flex gap-1">
                {slides.map((_, k) => (
                  <span key={k} className={cn("size-1.5 rounded-full", k === idx ? "bg-studio" : "bg-border")} />
                ))}
              </div>
              <Bookmark className="size-6" />
            </div>
            <div className="px-4 pb-4 pt-2 text-sm">
              <p className="font-semibold">2,184 likes</p>
              <p className="mt-1 line-clamp-3">
                <span className="font-semibold">{handle.replace("@", "")}</span> {caption}
              </p>
              <p className="mt-1 text-studio">{hashtags.join(" ")}</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3 px-4 py-3">
              <span className="grid size-11 place-items-center rounded-full bg-emerald-gradient font-bold text-primary-foreground">
                {brand.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{brand}</p>
                <p className="text-[11px] text-muted-foreground">Founder · Building animal-care & AI products</p>
                <p className="text-[11px] text-muted-foreground">2h · 🌐</p>
              </div>
            </div>
            <p className="line-clamp-3 px-4 pb-3 text-sm">
              {caption} <span className="text-studio">{hashtags.join(" ")}</span>
            </p>
            {slideView}
            <div className="flex items-center justify-between border-t border-border px-4 py-1 text-xs text-muted-foreground">
              <span>{idx + 1} / {slides.length} pages</span>
              <span>148 reactions · 32 comments</span>
            </div>
            <div className="grid grid-cols-4 border-t border-border text-xs font-semibold text-muted-foreground">
              {[
                [ThumbsUp, "Like"],
                [MessageCircle, "Comment"],
                [Repeat2, "Repost"],
                [Send, "Send"],
              ].map(([Icon, l]) => {
                const I = Icon as typeof ThumbsUp;
                return (
                  <span key={l as string} className="flex items-center justify-center gap-1.5 py-3">
                    <I className="size-4" /> {l as string}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Side panel */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant={editing ? "studio" : "outline"} size="sm" onClick={() => setEditing((e) => !e)}>
            <Pencil /> {editing ? "Inline editing on" : "Enable inline editing"}
          </Button>
          <Button variant="ink" size="sm" onClick={exportAll} disabled={exporting}>
            {exporting ? <Loader2 className="animate-spin" /> : <Download />} Export all slides (PNG)
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {editing ? "Click any headline, body or callout on the slide to edit it. Changes save when you click away." : "Preview mode."}
        </p>
        <div className="grid grid-cols-5 gap-2">
          {slides.map((s, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`Go to slide ${k + 1}`}
              className={cn("overflow-hidden rounded-lg ring-offset-2 ring-offset-background transition", k === idx ? "ring-2 ring-studio" : "opacity-70 hover:opacity-100")}
            >
              <SlideCard slide={s} index={k} total={slides.length} theme={theme} brand={brand} handle={handle} />
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Slide {idx + 1} copy</p>
          <p className="mt-2 font-display text-lg font-bold">{slides[idx]?.headline}</p>
          <p className="mt-1 text-sm text-muted-foreground">{slides[idx]?.body}</p>
          <p className="mt-2 text-xs font-semibold text-studio">Callout: {slides[idx]?.callout}</p>
        </div>
      </div>

      {/* Offscreen full-size render for export (1080×1350 at 2×) */}
      <div aria-hidden className="pointer-events-none fixed -left-[10000px] top-0">
        {slides.map((s, k) => (
          <div key={k} style={{ width: 540 }}>
            <SlideCard
              ref={(el) => {
                exportRefs.current[k] = el;
              }}
              slide={s}
              index={k}
              total={slides.length}
              theme={theme}
              brand={brand}
              handle={handle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
