import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'

import { areChildrenDifferent, importOnceToTree } from './util.mjs'

let jsxComponent

const toHighlight = (tree, jsxPath) => {
  jsxComponent = jsxPath.split('/').pop()

  visit(tree, 'paragraph', (node) => {
    const newChildren = parseAndHighlightText(node)

    // Abort if the children are the same or if there is nothing new
    if (
      !areChildrenDifferent(node.children, newChildren) ||
      !newChildren.length
    )
      return

    // Import the Highlight component if needed
    if (containsHighlightNode(newChildren)) {
      importOnceToTree(tree, jsxComponent, jsxPath)
    }

    node.children = newChildren
  })
}

let inHighlight
let processedNodes
let highlightSectionNodes

const parseAndHighlightText = (node) => {
  inHighlight = false
  processedNodes = []
  highlightSectionNodes = []

  node.children.forEach((child) => processChild(child))

  // Close any unclosed highlight at the end of the node
  if (inHighlight) {
    processedNodes.push(createHighlightNode(highlightSectionNodes))
  }

  return processedNodes
}

const processChild = (child) => {
  if (child.type === 'text') {
    processTextNode(child.value)
  } else {
    processNonTextNode(child)
  }
}

const processTextNode = (text) => {
  text.split(/(==)/).forEach((part) => {
    if (part === '==') {
      handleToggleHighlight()
    } else {
      handleTextPart(part)
    }
  })
}

const handleToggleHighlight = () => {
  if (inHighlight) {
    processedNodes.push(createHighlightNode(highlightSectionNodes))
    highlightSectionNodes = []
  }
  toggleHighlight()
}

const createHighlightNode = (children) => {
  return u('mdxJsxTextElement', {
    name: jsxComponent,
    attributes: [],
    children,
  })
}

const toggleHighlight = () => {
  inHighlight = !inHighlight
}

const handleTextPart = (part) => {
  if (inHighlight) {
    highlightSectionNodes.push(u('text', part))
  } else {
    processedNodes.push(u('text', part))
  }
}

const processNonTextNode = (child) => {
  if (inHighlight) {
    highlightSectionNodes.push(child)
  } else {
    processedNodes.push(child)
  }
}

// Check if any child is a Highlight node
const containsHighlightNode = (children) => {
  return children.some(
    (child) =>
      child.type === 'mdxJsxTextElement' && child.name === jsxComponent,
  )
}

export default toHighlight
