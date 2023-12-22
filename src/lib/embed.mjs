import fs from 'fs'
import path from 'path'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'
import {
  areChildrenDifferent,
  importOnceToTree,
  markdownToHTML,
  mdxToAst,
} from './util.mjs'

let jsxComponent

const toEmbed = (tree, jsxPath, file) => {
  jsxComponent = jsxPath.split('/').pop()

  visit(tree, 'paragraph', (node, index, parent) => {
    const newChildren = parseAndEmbedFile(node, file.dirname)

    // Abort if the children are the same or if there is nothing new
    if (
      !areChildrenDifferent(node.children, newChildren) ||
      !newChildren.length
    )
      return

    // TODO: Refactor this image stuff.
    const imageNodes = findAllImageNodes(newChildren)

    // Import the images if needed
    if (imageNodes.length > 0) {
      imageNodes.forEach((imageNode) => {
        const [src, , path] = imageNode.attributes
        const fileNameNoExt = src.value.value
        const filePath = path.value
        importOnceToTree(tree, fileNameNoExt, filePath, true)
      })
    }

    // Import the Embed component if needed
    if (containsEmbedNode(newChildren)) {
      importOnceToTree(tree, jsxComponent, jsxPath)
    }

    // Replace the entire node with new children in the parent
    if (parent && typeof index === 'number') {
      parent.children.splice(index, 1, ...newChildren)
    }
  })
}

let processedNodes

const parseAndEmbedFile = (node, pageDir) => {
  processedNodes = []

  node.children.forEach((child) => processChild(child, pageDir))

  return processedNodes
}

const processChild = (child, pageDir) => {
  const embed_regex = /!\[\[([a-zA-ZÀ-ÿ0-9-'?%.():&,+/€!_ ]+)\]\]/g

  const type = child.type
  const value = child.value
  const result = embed_regex.exec(value)

  if (type === 'text' && result) {
    const embedNode = createNodeForEmbed(result, pageDir)
    processedNodes.push(embedNode)
  } else {
    // Keep the original child if it's not a match:
    processedNodes.push(child)
  }
}

const createNodeForEmbed = (regexResults, pageDir) => {
  const [, partialPath] = regexResults
  const fullPath = findFile(partialPath, pageDir)

  if (fullPath && fullPath.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
    // The file exists and it's an image.
    return createImageNode(fullPath)
  } else if (fullPath && fullPath.match(/\.md$/)) {
    // The file exists and it's a markdown doc.
    return createEmbedNode(fullPath)
  } else {
    // The file either doesn't exist or it's not an image or markdown doc.
    return createEmbedNode(null)
  }
}

const findAllImageNodes = (children) => {
  return children.filter(
    (child) => child.type === 'mdxJsxFlowElement' && child.name === 'Image',
  )
}

// Check if there is a child that is an Embed node
const containsEmbedNode = (children) => {
  return children.some(
    (child) =>
      child.type === 'mdxJsxFlowElement' && child.name === jsxComponent,
  )
}

const createImageNode = (filePath) => {
  // TODO: toJSIdentifier? Camel/Pascal case?
  const fileNameNoExt = path.parse(filePath).name

  return mdxToAst(
    `<Image src={${fileNameNoExt}} alt="${fileNameNoExt}" path="${filePath}" />`,
  )[0]
}

const createEmbedNode = (filePath, embedText = '') => {
  let title
  let html

  if (filePath) {
    // TODO: Helper for .split('/').pop()?
    // TODO: Just pass filePath to helpers.
    const fileNameWithExt = filePath.split('/').pop()
    const fileNameNoExt = path.parse(fileNameWithExt).name
    const file = fs.readFileSync(filePath, 'utf8')
    title = fileNameNoExt
    html = markdownToHTML(file)
  } else {
    title = embedText
    html = null
  }

  return u('mdxJsxFlowElement', {
    name: jsxComponent,
    attributes: [
      u('mdxJsxAttribute', { name: 'title', value: title }),
      u('mdxJsxAttribute', { name: 'html', value: html }),
    ],
    children: [],
  })
}

const findFile = (partialPath, pageDir) => {
  let fullPath

  // Check if the partialPath is implicitly relative (doesn't contain '/src/app/' and isn't an absolute path)
  if (!partialPath.includes('/src/app/') && !path.isAbsolute(partialPath)) {
    // Resolve the full path using the current directory
    fullPath = path.resolve(pageDir, partialPath)
  } else {
    // Remove any initial word followed by a forward slash
    const sanitizedPath = partialPath.replace(/^\w+\//, '')

    // Combine the current directory with the sanitized path
    fullPath = path.join(process.cwd(), sanitizedPath)
  }

  // Append '.md' if extension isn't present
  if (!fullPath.match(/\.[a-zA-Z0-9]+$/)) {
    fullPath += '.md'
  }

  if (fs.existsSync(fullPath)) {
    return fullPath
  } else {
    return null
  }
}

export default toEmbed
