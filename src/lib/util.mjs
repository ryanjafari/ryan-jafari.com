// TODO: Make sure only shared stuff is exported. Organize file into public/private sections.
// TODO: If something is used by only one file, move it into that file.
// TODO: Explore using a utility to build JSX from syntax-tree or other mdast
// associated library?

import { fromMarkdown } from 'mdast-util-from-markdown'
import { mdxFromMarkdown } from 'mdast-util-mdx'
import { mdxjs } from 'micromark-extension-mdxjs'

import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

const markdownToHTML = (markdown) => {
  return remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .processSync(markdown)
    .toString()
}

const mdxToAst = (mdx) => {
  const tree = fromMarkdown(mdx, {
    extensions: [mdxjs()],
    mdastExtensions: [mdxFromMarkdown()],
  })

  return tree.children
}

const toJSIdentifier = (str) => {
  // Replace any non-alphanumeric character, excluding underscore, with an underscore
  let identifier = str.replace(/[^a-zA-Z0-9_]/g, '_')

  // If the resulting string starts with a number, prepend it with a prefix
  if (/^[0-9]/.test(identifier)) {
    identifier = 'id_' + identifier
  }

  return identifier
}

const buildImport = (identifierCandidate, path) => {
  const identifierString = toJSIdentifier(identifierCandidate)

  return mdxToAst(`import { ${identifierString} } from '${path}'`)[0]
}

const buildDefaultImport = (identifierCandidate, path) => {
  const identifierString = toJSIdentifier(identifierCandidate)

  return mdxToAst(`import ${identifierString} from '${path}'`)[0]
}

const isImportAlreadyPresent = (tree, importValue) => {
  // TODO: Check `name` field matches as well.
  return tree.children.some(
    (node) =>
      node.type === 'mdxjsEsm' &&
      node.data.estree.body[0].source &&
      node.data.estree.body[0].source.value &&
      node.data.estree.body[0].source.value.includes(importValue),
  )
}

const getRoot = (nodePath) => {
  let root = nodePath
  while (root.name != 'root') {
    root = root.parentPath
  }
  return root.value
}

const importOnce = (nodePath, identifier, literal) => {
  const root = getRoot(nodePath)

  if (!isImportAlreadyPresent(root, literal)) {
    const componentImport = buildImport(identifier, literal)
    root.children.push(componentImport)
  }
}

const importOnceToTree = (tree, identifier, path, isDefault = false) => {
  // const name = path.split('/').pop()

  let componentImport

  if (!isImportAlreadyPresent(tree, path)) {
    if (isDefault) {
      componentImport = buildDefaultImport(identifier, path)
    } else {
      componentImport = buildImport(identifier, path)
    }
    tree.children.push(componentImport)
    // tree.children.unshift(createHighlightImport())
  }
}

// Helper function to check if children arrays are different
const areChildrenDifferent = (children1, children2) => {
  if (children1.length !== children2.length) {
    return true
  }

  // If lengths are equal, compare each element
  for (let i = 0; i < children1.length; i++) {
    if (!areNodesEqual(children1[i], children2[i])) {
      return true
    }
  }

  // No differences found
  return false
}

// Function to compare two nodes
const areNodesEqual = (node1, node2) => {
  // Simple comparison logic, you might need to adjust this based on your data structure
  return JSON.stringify(node1) === JSON.stringify(node2)
}

export {
  areChildrenDifferent,
  buildDefaultImport,
  buildImport,
  importOnce,
  importOnceToTree,
  isImportAlreadyPresent,
  markdownToHTML,
  mdxToAst,
}
