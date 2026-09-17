import { QuartzComponent, QuartzComponentConstructor } from "./types"
import style from "./styles/projectShowcase.scss"
// @ts-ignore
import script from "./scripts/projectShowcase.inline"

// This component intentionally renders nothing. Its only job is to register
// the showcase's CSS and client-side behavior (hover video preview, lightbox,
// tag filtering) globally so it's available on any page that contains a
// `.project-grid` block — which you write directly as raw HTML inside a
// markdown file (e.g. content/projects.md).
const ProjectShowcase: QuartzComponent = () => null

ProjectShowcase.css = style
ProjectShowcase.afterDOMLoaded = script

export default (() => ProjectShowcase) satisfies QuartzComponentConstructor
