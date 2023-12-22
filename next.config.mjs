import { nodeTypes } from '@mdx-js/mdx'
import nextMDX from '@next/mdx'

import rehypePrism from '@mapbox/rehype-prism'
import rehypeRaw from 'rehype-raw'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'

import frontmatter from './src/lib/frontmatter.mjs'
import obsidian from './src/lib/obsidian.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx', 'md'],
}

const obsidianOptions = {
  calloutPath: '@/components/Callout',
  embedPath: '@/components/EmbedLink',
  linkPath: '@/components/InternalLink',
  highlightPath: '@/components/Highlight',
}

const withMDX = nextMDX({
  // NOTE: Both .md and .mdx files are supported by default:
  extension: /\.mdx?$/,
  options: {
    // TODO: remarkRehype, remarkMdx and others?
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      frontmatter,
      [obsidian, obsidianOptions],
    ],
    // NOTE: We need rehype-raw for the Obsidian plugin to render HTML properly.
    rehypePlugins: [
      // function debugASTPlugin() {
      //   return (tree) => {
      //     console.log(JSON.stringify(tree, null, 2))
      //   }
      // },
      rehypePrism,
      [rehypeRaw, { passThrough: [...nodeTypes, 'mark'] }], // Add 'mark' to the passThrough array
    ],
  },
})

export default withMDX(nextConfig)
