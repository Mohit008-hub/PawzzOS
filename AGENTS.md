<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Three top-level tabs are separate routes (`/`, `/education`, `/content-studio`) sharing the header/footer in `__root.tsx`; keeps each tab linkable and with its own head metadata.
- Provider directory data and filter logic live in `src/lib/providers.ts` as pure functions with tests in `src/test/providers.test.ts`; UI only calls `filterProviders` / `nearestEmergency`.
- AI carousel generation runs through `createServerFn` in `src/lib/carousel.functions.ts`, which lazy-imports `src/lib/ai/gateway.server.ts`; keeps the AI key and prompts server-only.
- Server functions return `{ ok: false, error, status }` instead of throwing for AI failures so the UI can show a friendly message.
- Carousel slides are rendered by `SlideCard` with themes defined as `.slide-theme-*` CSS classes in `styles.css`; PNG export uses html-to-image on an offscreen 540px render at 2× (1080×1350).
