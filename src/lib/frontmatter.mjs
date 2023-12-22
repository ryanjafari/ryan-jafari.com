import yaml from 'js-yaml'
import { visit } from 'unist-util-visit'
import { mdxToAst } from './util.mjs'

// TODO: Be sure to remove YAML node?
// TODO: Do not run for anything in /projects
// Handles frontmatter for both .mdx and .md files
export default function frontmatter() {
  // TODO: Ensure either .mdx or .md
  return (tree) => {
    let data = null

    visit(tree, 'yaml', (node, index, parent) => {
      data = yaml.load(node.value)
    })

    // TODO: Escape quick if data is null

    if (data && Object.keys(data).length > 0) {
      const { layout, ...entryFields } = data

      // TODO: Remember that image imports should go up at the top alongside this.
      const importLayout = mdxToAst(
        `import { ${layout} } from '@/components/${layout}'`,
      )

      const entry = mdxToAst(
        `export const entry = ${JSON.stringify(entryFields)}`,
      )

      const { date, ...metadataFields } = entryFields

      const metadata = mdxToAst(
        `export const metadata = ${JSON.stringify(metadataFields)}`,
      )

      const exportLayout = mdxToAst(
        `export default (props) => (<${layout} entry={entry} {...props} />)`,
      )

      const nodes = [importLayout, entry, metadata, exportLayout].flat()

      nodes.reverse().forEach((node) => tree.children.unshift(node))
    }
  }
}
