---
tags:
  - explorerexclude
---
# Project Showcase — Reference Guide

How to add, edit, and extend cards in `content/Projects.md`. Everything lives
in plain HTML inside that one markdown file — no code changes needed for any
of the below, unless you're adding a brand-new *type* of link (see the last
section).

## Anatomy of a card

```html
<li class="project-card"
    data-title="Project Name"
    data-tags="Unity, C#, Design"
    data-media="attachments/your-file.mp4" data-media-type="video"
    data-link="/Unity-Notes/Some-Folder/Index"
    data-github="https://github.com/OMC03/some-repo"
    data-modpage-link="https://modrinth.com/mod/your-mod"
    data-description="One or two sentences shown in the lightbox.">
</li>
```

Only `data-title` and `data-description` are required. Everything else is
optional and the card adapts:

| Attribute | Optional? | Effect if omitted |
|---|---|---|
| `data-media` / `data-media-type` | Yes | Auto-generates a placeholder tile with the title |
| `data-tags` | Yes | Card just won't appear under any filter chip |
| `data-link` | Yes | No "View project notes" link in the lightbox |
| `data-github` | Yes | No "View on GitHub" link in the lightbox |
| `data-modpage-link` | Yes | No "View Mod Page" link in the lightbox |

**Critical formatting rule:** every `data-*` attribute must sit *before* the
final `>` that closes the `<li ...>` tag. If Obsidian stops syntax-highlighting
an attribute as a keyword and it turns plain white, that's your sign a `>`
closed early somewhere above it — scroll up and check `data-description`,
since its long text makes it the easiest place to accidentally leave off the
trailing `>` in the wrong spot.

## Adding a new panel (project)

Copy an existing `<li class="project-card">...</li>` block, paste it inside
the `<ul class="project-grid">`, and edit the attributes. That's it — no
layout code, no registration anywhere else. New cards join the grid and the
tag filter bar automatically.

## Images vs. GIFs vs. videos

| File type | `data-media-type` | Notes |
|---|---|---|
| `.png` / `.jpg` | `"image"` | Static |
| `.gif` | `"image"` | Animates natively, loops forever, no hover needed |
| `.mp4` | `"video"` (or omit — it's the default) | Muted, plays on hover/scroll-into-view; full sound + controls in the lightbox |

Drop the actual file in `content/attachments/`, and reference it as
`attachments/filename.ext` (no leading slash).

## Tags & the filter bar

- `data-tags` is a comma-separated list, e.g. `"Unity, C#, AI"`.
- The filter bar (All / tag chips) builds itself automatically from whatever
  tags exist across the cards on the page — nothing to configure.
- It only appears once there's more than one distinct tag on the page.
- Tag names are case-sensitive for matching, so keep spelling/casing
  consistent across cards (e.g. always `"Unity"`, not sometimes `"unity"`).

## Links: Notes, GitHub, and Mod Page

All three are independent — set any combination (none, one, two, or all
three) and only the ones present show up in the lightbox:

- `data-link` — a **root-relative path** to a Quartz note (no domain, must
  start with `/`), e.g. `/Unity-Notes/Unity-VR-Notes/Index`. This is resolved
  correctly no matter how deep the current page is nested.
- `data-github` — a **full URL** to an external repo, opens in a new tab.
- `data-modpage-link` — a **full URL** to a published mod page (Modrinth,
  CurseForge, etc.), opens in a new tab. Useful for the Minecraft mod once
  it's published — just leave it off until then.

No repo/mod page yet? Just leave the attribute off — add it later with zero
other changes.

## Adding a new link type (beyond notes/GitHub/mod page)

The pattern above is easy to repeat for a fourth link type (an itch.io page,
a devlog, whatever) — it just takes one small code change alongside the
markdown change:

1. **In `content/Projects.md`:** add the attribute to a card, e.g.
   `data-itch-link="https://yourname.itch.io/game"`.
2. **In `quartz/components/scripts/projectShowcase.inline.ts`:** inside
   `openLightbox`, add a line reading that attribute and pushing a link if
   it's present — same shape as the existing `githubLink`/`modpageLink` lines.

The one thing to get right: the HTML attribute `data-itch-link` becomes
`card.dataset.itchLink` in the script — the browser camel-cases everything
after each hyphen. So `data-mod-page-link` → `dataset.modPageLink`, while
`data-modpage-link` (no hyphen before "page") → `dataset.modpageLink`. Whatever
you choose, the attribute name in the markdown and the `dataset.___` property
in the script must match exactly.

## Where the underlying code lives (rarely needs touching)

- `quartz/components/ProjectShowcase.tsx` — registers the CSS/JS globally, renders nothing itself
- `quartz/components/styles/projectShowcase.scss` — all grid/card/lightbox styling, theme-aware via Quartz's CSS variables
- `quartz/components/scripts/projectShowcase.inline.ts` — hover preview, lightbox, tag filtering, link building
- `quartz/components/index.ts` — must export `ProjectShowcase` (import **and** the line in the `export { }` block)
- `quartz.layout.ts` — `sharedPageComponents.afterBody` must include `Component.ProjectShowcase()`

You should only need to open these if you want to change *behavior* (e.g. a
different hover animation), *styling* (e.g. card colors/spacing), or add a
new link type as described above — adding, editing, or removing projects
never requires touching them.

## Custom domain setup (DNS + GitHub Pages)

This site is served from `hunterdevop.com` instead of the default
`omc03.github.io`. Notes in case anything needs to be touched again later —
DNS registrar, GitHub repo settings, and deploy workflow all had to agree.

### Required DNS records

At the registrar (GoDaddy, in this case), the domain needs exactly:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `hunterdevop.com` (or `omc03.github.io`) |

Those four IPs are GitHub Pages' own servers — they don't change per-site.

**Known pitfall:** registrars (GoDaddy especially) often have a separate
**Domain Forwarding** feature — distinct from the DNS Records tab — that's
sometimes on by default when a domain is purchased. If it's active alongside
the GitHub A records above, the domain ends up with extra, conflicting A
records (in this case `15.197.225.128` and `3.33.251.168`, GoDaddy's
forwarding IPs) and the site loops with `ERR_TOO_MANY_REDIRECTS`. Fix: find
the Forwarding tab in the registrar's DNS management and delete the
forwarding rule entirely, rather than editing it. The DNS Records tab should
end up with *only* the five records in the table above (plus whatever NS/SOA
records the registrar manages itself).

### GitHub repo settings

In **Settings → Pages**, the "Custom domain" field must contain
`hunterdevop.com`, and show a green "DNS check successful." If the domain was
ever misconfigured (like the forwarding issue above), GitHub can silently
clear this field as a safety measure — if the site 404s despite DNS looking
correct, check here first and re-enter/re-save the domain if it's blank.

### The GitHub Actions Error (why the domain kept 404ing)

This repo deploys via a custom GitHub Actions workflow
(`.github/workflows/deploy.yaml`), not GitHub's legacy "deploy from a
branch" method. That distinction matters a lot for custom domains:

- With **branch-based** deploys, GitHub automatically writes and maintains a
  `CNAME` file in the published branch for you whenever you save a custom
  domain in Settings.
- With **Actions-based** deploys (this repo), GitHub never touches the build
  output — so `npx quartz build` has no reason to know about the custom
  domain, and never produces a `CNAME` file. The result: DNS resolves fine,
  the Pages settings show the domain as configured, but every deployed build
  still lacks the file that actually claims the hostname — so GitHub's edge
  servers return a bare `HTTP Status: 404 (not found)` for it.

**Fix (already applied):** the workflow has an explicit step that writes the
file into the build output before it's uploaded:

```yaml
- name: Build Quartz
  run: npx quartz build
- name: Add CNAME for custom domain
  run: echo "hunterdevop.com" > public/CNAME
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: public
```

If the custom domain ever needs to change, or a fresh clone/repo ever loses
this workflow step, this is the line to re-add — nothing else in Quartz's own
build process will do it automatically.

### Enforce HTTPS

The "Enforce HTTPS" checkbox in Settings → Pages stays greyed out until
GitHub can consistently see the domain resolving to its own servers *and*
being claimed by the deployed content (i.e., both the DNS records and the
`CNAME` file above have to be correct at the same time). Once both are in
place, it typically becomes available within a few minutes to a few hours
as GitHub provisions the certificate.

