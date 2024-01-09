import toCallout from './callout.mjs'
import toEmbed from './embed.mjs'
import toHighlight from './highlight.mjs'
import toLink from './link.mjs'

// TODO: Do not run for anything in /projects; allow specification of folder where Obsidian .md files are located.
// NOTE: Handles Obsidian syntax in .md files only.

// TODO: Return transformer.
export default function obsidian(options = {}) {
  return (tree, file) => {
    // TODO: Can we also allow .mdx?
    if (file.extname !== '.md') {
      // TODO: Figure out logging.
      // console.debug('obsidian transformer not running; not a .md file')
      return
    }

    // console.debug('obsidian transformer running...')

    // TODO: What about recursion?
    // TODO: Make this more efficient.
    // TODO: ofm prefix.
    toCallout(tree, options.calloutPath)
    toEmbed(tree, options.embedPath, file)
    toLink(tree, options.linkPath)
    toHighlight(tree, options.highlightPath)
  }
}
