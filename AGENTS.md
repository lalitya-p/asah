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

## Prototype architecture
- Keep prototype state in a shared browser-storage provider, read after hydration; approved device-only data must stay separate from production services.
- Preserve the shared context identity in Vite hot data during preview updates so mounted providers and refreshed consumers cannot become disconnected.
- Keep age classification, daily quotas, and completion edits in pure domain functions with concrete rule tests so dates and per-child limits remain consistent.
- Use a static sample activity catalog and explicitly selected concern scenarios; caregiver observations must never infer clinical status.
- Use leaf TanStack routes inside the root shared shell; each page owns its metadata and the service worker caches the web shell for offline reading.
- Translate presentation strings through the shared language provider and dictionary; keep stored activity IDs, observations, roles, filters, quotas and dates language-independent so switching never changes family records.
- Development-area moments are saved as Completion records with language-independent notice index and area IDs, so History and Development read one shared log.
- Keep household inventory and material eligibility in pure domain functions; store canonical item IDs and explicit substitutes so language changes and custom labels never alter matching.
- Keep one central route gate in the root shell that resolves session, confirmation, onboarding, child setup, or app in that order; individual pages must not check access or render onboarding themselves.
- Keep family-space records (active session, onboarding step and draft, children, role, inventory) in the shared account store so progress survives refresh, sign out, and reopening the browser; sign out must hide data from the UI without erasing it, and erasing must remove the space itself.
- Attach generated step illustrations by canonical activity ID and one-based step number so both languages share the same instructional pictures.
- Replay garden growth from chronologically sorted Completion records in a read-only browser timeline; reuse the live plant-stage logic so playback never changes family data or growth thresholds.

- Layout is mobile-only everywhere: wide screens show the phone layout inside a centered ~430px frame; no separate desktop layout.
- Inside the fixed-height phone frame, both app and public-screen shells must own vertical scrolling with a zero minimum height so onboarding remains reachable without moving the bottom navigation.
