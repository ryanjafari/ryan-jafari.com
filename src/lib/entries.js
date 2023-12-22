import glob from 'fast-glob'

async function importEntry(entryFilename, entryType) {
  let { entry } = await import(`../app/${entryType}/${entryFilename}`)

  return {
    slug: entryFilename.replace(/(\/page)?\.(md|mdx)$/, ''),
    ...entry,
  }
}

// TODO: `let` vs `const` here?
export async function getAllEntries(entryType) {
  let entryFilenames = await glob('*/page.{md,mdx}', {
    cwd: `./src/app/${entryType}`,
  })

  let entries = await Promise.all(
    entryFilenames.map((entryFilename) =>
      importEntry(entryFilename, entryType),
    ),
  )

  return entries.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
