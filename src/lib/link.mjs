import fs from 'fs'
import path from 'path'

import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'

import { areChildrenDifferent, importOnceToTree, mdxToAst } from './util.mjs'

let jsxComponent

const toLink = (tree, jsxPath) => {
  jsxComponent = jsxPath.split('/').pop()

  visit(tree, 'paragraph', (node) => {
    const newChildren = parseAndReplaceLinks(node)

    // Abort if the children are the same or if there is nothing new
    if (
      !areChildrenDifferent(node.children, newChildren) ||
      !newChildren.length
    )
      return

    // Import the Link component if needed
    if (containsLinkNode(newChildren)) {
      importOnceToTree(tree, jsxComponent, jsxPath)
    }

    node.children = newChildren
  })
}

let processedNodes

const parseAndReplaceLinks = (node) => {
  processedNodes = []

  node.children.forEach(processChild)

  return processedNodes
}

const processChild = (child) => {
  if (child.type === 'text') {
    processedNodes.push(...processTextNode(child.value))
  } else {
    processedNodes.push(child)
  }
}

const processTextNode = (text) => {
  let match
  const regex = /(?<!\!)\[\[([^\]]+?)(?:#([^\]|]+?))?(?:\|([^\]]+?))?\]\]/g
  const parts = []
  let lastOffset = 0

  while ((match = regex.exec(text)) !== null) {
    // Add text before the link
    if (lastOffset !== match.index) {
      parts.push(u('text', text.slice(lastOffset, match.index)))
    }

    // Create and add the link node
    parts.push(createLinkNode(match))

    lastOffset = match.index + match[0].length
  }

  // Add any remaining text after the last link
  if (lastOffset < text.length) {
    parts.push(u('text', text.slice(lastOffset)))
  }

  return parts
}

const createLinkNode = (match) => {
  // const projectRoot = process.env.PUBLIC_URL
  // const searchDirectory = `${projectRoot}/articles`
  const [full, link, section, text] = match

  const href = findMatchingRoute(link)
  const label = text || link

  const componentElements = mdxToAst(
    `<${jsxComponent} href="${
      href ? (section ? `${href}#${section}` : href) : '#'
    }" label="${href ? label : full}" />`,
  )

  return componentElements[0]
}

// TODO: Organize (sort) functions.

const findMatchingRoute = (incomingPath) => {
  // Remove any word followed by '/src/' and 'app/' prefixes if they exist
  let sanitizedPath = incomingPath.replace(/^\w+\/src\/app\//, '')

  // The base directory for the markdown pages
  const appDirectory = path.join(process.cwd(), 'src', 'app')

  // Append '.md' to check for a file
  let pagePathMd = path.join(appDirectory, `${sanitizedPath}.md`)

  // Check if the corresponding .md file exists
  if (fs.existsSync(pagePathMd)) {
    // If it does, convert it to a relative link
    const relativeLink = sanitizedPath.replace(/\/page$/, '')

    // Return the relative link from the base public URL
    return `/${relativeLink}`
  } else {
    // Handle the case where no match is found
    return null
  }
}

// Check if any child is a Link node
const containsLinkNode = (children) => {
  return children.some(
    (child) =>
      child.type === 'mdxJsxFlowElement' && child.name === jsxComponent,
  )
}

export default toLink
