import { visit } from 'unist-util-visit'
import { areChildrenDifferent, importOnceToTree, mdxToAst } from './util.mjs'

let jsxComponent

const toCallout = (tree, jsxPath) => {
  jsxComponent = jsxPath.split('/').pop()

  // TODO: Potentially look into changing blockquote newline behavior to be more like Obsidian. In Obsidian, newlines in a blockquote create separate paragraphs, whereas right now in our code, newlines don't create a new paragraph unless preceded by a blank line.
  visit(tree, 'blockquote', (node, index, parent) => {
    const newChildren = parseAndConvertToCallout(node)

    // Abort if the children are the same or if there is nothing new
    if (
      !areChildrenDifferent(node.children, newChildren) ||
      !newChildren.length
    )
      return

    const calloutNode = createCalloutNode(callout, newChildren)

    // Import the Callout component if needed
    if (isCalloutNode(calloutNode)) {
      importOnceToTree(tree, jsxComponent, jsxPath)
    }

    // Replace the entire node with new children in the parent
    if (parent && typeof index === 'number') {
      parent.children.splice(index, 1, calloutNode)
    }
  })
}

let callout
let calloutSectionNodes

const parseAndConvertToCallout = (node) => {
  callout = null
  calloutSectionNodes = []

  node.children.forEach((child, index) => {
    if (index === 0) {
      processFirstChild(child)
    } else if (callout) {
      calloutSectionNodes.push(child)
    }
  })

  return callout ? calloutSectionNodes : []
}

const processFirstChild = (child) => {
  // TODO: Run this regex through its paces and compare vs. Obsidian.
  const regex = /\[!(?<type>\w+)\]\s*(?<title>.+)?/
  const textChild = child.children.find((c) => c.type === 'text')

  if (textChild) {
    const match = regex.exec(textChild.value)
    if (match) {
      callout = { type: match.groups.type, title: match.groups.title || '' }
    }
  }
}

const createCalloutNode = (callout, children) => {
  const calloutAstArray = mdxToAst(
    `<${jsxComponent} type="${callout.type}" title="${callout.title}" />`,
  )

  // Assuming mdxToAst returns an array, take the first element
  const calloutNode = calloutAstArray[0]
  calloutNode.children = children

  return calloutNode
}

// Check if the node is a Callout node
const isCalloutNode = (node) => {
  return node.type === 'mdxJsxFlowElement' && node.name === jsxComponent
}

export default toCallout
