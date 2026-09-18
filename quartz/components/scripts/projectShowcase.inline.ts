// @ts-nocheck
// Quartz client scripts run in the browser, outside the normal TS build
// context, and must handle Quartz's SPA navigation (the "nav" event fires
// after every page transition, including the first load).
//
// IMPORTANT: data-link and data-media values in the markup are root-relative
// slugs with NO leading slash (e.g. "Unity-Notes/Unity-VR-Notes/Index",
// "attachments/foo.mp4") — never "/Unity-Notes/...". They're resolved against
// the current page's depth at runtime via resolveRelative, exactly like
// Quartz resolves its own internal links. This is what makes the showcase
// work whether the site is hosted at a domain root or under a GitHub Pages
// project subpath like /Unity-Notes-Quartz-Page/.

import { getFullSlug, resolveRelative } from "../../util/path"

function resolveSitePath(path: string): string {
  if (!path) return ""
  // Leave absolute URLs (http://, https://, mailto:, etc.) untouched
  if (/^[a-z]+:/i.test(path) || path.startsWith("//")) return path
  const clean = path.replace(/^\/+/, "")
  return resolveRelative(getFullSlug(window), clean as any)
}

function setupProjectShowcase() {
  const grids = Array.from(document.querySelectorAll(".project-grid"))
  if (grids.length === 0) return

  const cleanups: Array<() => void> = []

  // --- Lightbox (single shared instance for the whole page) ---------------
  let lightbox = document.querySelector(".project-lightbox")
  if (!lightbox) {
    lightbox = document.createElement("div")
    lightbox.className = "project-lightbox"
    lightbox.innerHTML = `
      <div class="project-lightbox-inner">
        <button class="project-lightbox-close" aria-label="Close">&times;</button>
        <div class="project-lightbox-media"></div>
        <div class="project-lightbox-body">
          <h3 class="project-lightbox-title"></h3>
          <div class="project-lightbox-tags"></div>
          <p class="project-lightbox-description"></p>
          <div class="project-lightbox-links"></div>
        </div>
      </div>
    `
    document.body.appendChild(lightbox)
  }

  const lightboxMedia = lightbox.querySelector(".project-lightbox-media")
  const lightboxTitle = lightbox.querySelector(".project-lightbox-title")
  const lightboxTags = lightbox.querySelector(".project-lightbox-tags")
  const lightboxDescription = lightbox.querySelector(".project-lightbox-description")
  const lightboxLinks = lightbox.querySelector(".project-lightbox-links")
  const closeBtn = lightbox.querySelector(".project-lightbox-close")

  function closeLightbox() {
    lightbox.classList.remove("is-open")
    const video = lightboxMedia.querySelector("video")
    if (video) video.pause()
    lightboxMedia.innerHTML = ""
  }

  function openLightbox(card: HTMLElement) {
    const title = card.dataset.title ?? ""
    const description = card.dataset.description ?? ""
    const tags = (card.dataset.tags ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    const notesLink = card.dataset.link ?? ""
    const githubLink = card.dataset.github ?? ""
    const modpageLink = card.dataset.modpageLink ?? ""

    lightboxTitle.textContent = title
    lightboxDescription.textContent = description
    lightboxTags.innerHTML = tags.map((t) => `<span>${t}</span>`).join("")

    const linkParts: string[] = []
    if (notesLink) {
      linkParts.push(`<a href="${resolveSitePath(notesLink)}">View project notes &rarr;</a>`)
    }
    if (githubLink) {
      linkParts.push(`<a href="${githubLink}" target="_blank" rel="noopener">View on GitHub &rarr;</a>`)
    }
    if (modpageLink) {
      linkParts.push(`<a href="${modpageLink}" target="_blank" rel="noopener">View Mod Page &rarr;</a>`)
    }
    lightboxLinks.innerHTML = linkParts.join("")

    lightboxMedia.innerHTML = ""
    const mediaEl = buildMediaElement(card, true)
    if (mediaEl) lightboxMedia.appendChild(mediaEl)

    lightbox.classList.add("is-open")
  }

  closeBtn.addEventListener("click", closeLightbox)
  cleanups.push(() => closeBtn.removeEventListener("click", closeLightbox))

  const onBackdropClick = (e: MouseEvent) => {
    if (e.target === lightbox) closeLightbox()
  }
  lightbox.addEventListener("click", onBackdropClick)
  cleanups.push(() => lightbox.removeEventListener("click", onBackdropClick))

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox()
  }
  document.addEventListener("keydown", onKeydown)
  cleanups.push(() => document.removeEventListener("keydown", onKeydown))

  // --- Media element construction -----------------------------------------
  // Builds (or reuses, for the small hover-preview version) a <video>/<img>
  // from a card's data-media / data-media-type, with a correctly-resolved
  // root-relative src. `large` controls whether it's the lightbox variant.
  function buildMediaElement(card: HTMLElement, large: boolean): HTMLElement | null {
    const src = card.dataset.media
    if (!src) return null
    const type = card.dataset.mediaType === "image" ? "image" : "video"
    const resolvedSrc = resolveSitePath(src)

    if (type === "image") {
      const img = document.createElement("img")
      img.src = resolvedSrc
      img.alt = card.dataset.title ?? ""
      if (!large) img.className = "project-card-media"
      return img
    }

    const video = document.createElement("video")
    video.src = resolvedSrc
    video.muted = !large
    video.loop = true
    video.playsInline = true
    video.preload = "metadata"
    if (card.dataset.poster) {
      video.poster = resolveSitePath(card.dataset.poster)
    }
    if (large) {
      video.controls = true
      video.autoplay = true
    } else {
      video.className = "project-card-media"
    }
    return video
  }

  // --- Per-grid setup: cards, hover preview, placeholders, filters --------
  for (const grid of grids) {
    const cards = Array.from(grid.querySelectorAll(".project-card")) as HTMLElement[]
    const allTags = new Set<string>()

    for (const card of cards) {
      // Populate media (or a placeholder if none was provided)
      if (!card.querySelector(".project-card-media, .project-card-placeholder")) {
        const media = buildMediaElement(card, false)
        if (media) {
          card.prepend(media)
        } else {
          const placeholder = document.createElement("div")
          placeholder.className = "project-card-placeholder"
          placeholder.textContent = card.dataset.title ?? "Coming soon"
          card.prepend(placeholder)
        }
      }

      // Hover / in-view video preview
      const video = card.querySelector("video") as HTMLVideoElement | null
      if (video) {
        const play = () => video.play().catch(() => {})
        const pause = () => {
          video.pause()
          video.currentTime = 0
        }
        card.addEventListener("mouseenter", play)
        card.addEventListener("mouseleave", pause)
        cleanups.push(() => {
          card.removeEventListener("mouseenter", play)
          card.removeEventListener("mouseleave", pause)
        })

        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) play()
              else pause()
            }
          },
          { threshold: 0.6 },
        )
        observer.observe(card)
        cleanups.push(() => observer.disconnect())
      }

      // Click to open lightbox
      const onClick = () => openLightbox(card)
      card.addEventListener("click", onClick)
      card.setAttribute("tabindex", "0")
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          openLightbox(card)
        }
      }
      card.addEventListener("keydown", onKey)
      cleanups.push(() => {
        card.removeEventListener("click", onClick)
        card.removeEventListener("keydown", onKey)
      })

      // Collect tags for the filter bar
      ;(card.dataset.tags ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => allTags.add(t))
    }

    // Build (or reuse) a filter bar immediately before this grid
    if (allTags.size > 1) {
      let filterBar = grid.previousElementSibling
      if (!filterBar || !filterBar.classList.contains("project-filter-bar")) {
        filterBar = document.createElement("div")
        filterBar.className = "project-filter-bar"
        grid.parentElement?.insertBefore(filterBar, grid)
      }
      filterBar.innerHTML = ""

      const makeChip = (label: string, tag: string | null) => {
        const chip = document.createElement("button")
        chip.className = "project-filter-chip"
        chip.textContent = label
        if (tag === null) chip.classList.add("active")
        chip.dataset.tag = tag ?? ""
        const onChipClick = () => {
          filterBar.querySelectorAll(".project-filter-chip").forEach((c) => c.classList.remove("active"))
          chip.classList.add("active")
          for (const card of cards) {
            const cardTags = (card.dataset.tags ?? "").split(",").map((t) => t.trim())
            const show = tag === null || cardTags.includes(tag)
            card.classList.toggle("is-filtered-out", !show)
          }
        }
        chip.addEventListener("click", onChipClick)
        cleanups.push(() => chip.removeEventListener("click", onChipClick))
        return chip
      }

      filterBar.appendChild(makeChip("All", null))
      for (const tag of Array.from(allTags).sort()) {
        filterBar.appendChild(makeChip(tag, tag))
      }
    }
  }

  window.addCleanup(() => cleanups.forEach((fn) => fn()))
}

document.addEventListener("nav", setupProjectShowcase)
