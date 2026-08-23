/**
 * Single source of truth for the app's typography stacks.
 *
 * Latin comes from IBM Plex Sans, Thai falls through to Anuphan (Plex has no Thai
 * glyphs), code uses JetBrains Mono. Keep this in sync with the `--font-*`
 * custom properties in `src/index.css` and the Google Fonts link in
 * `index.html`.
 */
export const FONT_SANS =
	'"IBM Plex Sans", "Anuphan", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'

export const FONT_MONO =
	'"JetBrains Mono", "Anuphan", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

/**
 * Shared Monaco defaults so every code editor in the app renders with the same
 * face and metrics. Spread this into an `<Editor options={...} />` and override
 * per-instance as needed.
 */
export const MONACO_EDITOR_OPTIONS = {
	fontFamily: FONT_MONO,
	fontSize: 14,
	lineHeight: 1.6,
	fontLigatures: false,
} as const
