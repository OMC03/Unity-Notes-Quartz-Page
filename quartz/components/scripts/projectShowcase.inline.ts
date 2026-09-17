// @ts-nocheck
// Quartz client scripts run in the browser, outside the normal TS build
// context, and must handle Quartz's SPA navigation (the "nav" event fires
// after every page transition, including the first load).

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
    // stop any playing video when closing
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
    const link = card.dataset.link ?? ""

    lightboxTitle.textContent = title
    lightboxDescription.textContent = description
    lightboxTags.innerHTML = tags.map((t) => `<span>${t}</span>`).join("")
    lightboxLinks.innerHTML = link
      ? `<a href="${link}">View project notes &rarr;</a>`
      : ""

    lightboxMedia.innerHTML = ""
    const sourceMedia = card.querySelector("video, img")
    if (sourceMedia) {
      const clone = sourceMedia.cloneNode(true) as HTMLElement
      clone.removeAttribute("class")
      if (clone.tagName === "VIDEO") {
        const v = clone as HTMLVideoElement
        v.controls = true
        v.autoplay = true
        v.loop = true
        v.muted = false
      }
      lightboxMedia.appendChild(clone)
    }

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

  // --- Per-grid setup: cards, hover preview, placeholders, filters --------
  for (const grid of grids) {
    const cards = Array.from(grid.querySelectorAll(".project-card")) as HTMLElement[]
    const allTags = new Set<string>()

    for (const card of cards) {
      // Auto-generate a placeholder for projects without media yet
      if (!card.querySelector("video, img, .project-card-placeholder")) {
        const placeholder = document.createElement("div")
        placeholder.className = "project-card-placeholder"
        placeholder.textContent = card.dataset.title ?? "Coming soon"
        card.prepend(placeholder)
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
