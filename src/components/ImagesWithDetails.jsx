'use client'

import React, { useCallback, useState } from 'react'

import { Modal } from './Modal'

export function ImagesWithDetails({ children }) {
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState({})

  const handleImageClick = useCallback((src, alt) => {
    setSelectedImage({
      src: src,
      alt: alt,
    })
    setModalOpen(true)
  }, [])

  const handleModalClose = useCallback(() => {
    setModalOpen(false)
  }, [])

  return (
    <div className="not-prose mt-8">
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 xl:gap-x-8"
      >
        {React.Children.map(children, (child) => {
          const mergedProps = {
            ...child.props,
            // TODO: Use `clsx` to add incoming className from child and the below, e.g. clsx(childClassName, 'pointer-events-none...'). Use it even if it's combined with the empty string to sort via Prettier.
            className:
              'pointer-events-none object-cover group-hover:opacity-75',
            priority: true,
          }

          // TODO: Destroy child after clone?
          const imageElement = React.cloneElement(child, mergedProps)
          const imageFilename = extractFilename(imageElement.props.src)
          const imageScreenReader = `View larger version of ${imageFilename}`
          const imageDimensions = extractFileDimensions(imageElement.props.src)

          return (
            <li
              key={imageFilename}
              className="relative"
            >
              <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-white ring-1 ring-zinc-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20 dark:focus-within:ring-blue-400">
                {imageElement}
                <button
                  type="button"
                  className="absolute inset-0 focus:outline-none"
                  onClick={() =>
                    handleImageClick(
                      imageElement.props.src,
                      imageElement.props.alt,
                    )
                  }
                >
                  <span className="sr-only">{imageScreenReader}</span>
                </button>
              </div>
              {/* TODO: Ensure 3D-touch tooltips work. */}
              <p className="group mt-2 block">
                <span className="absolute -left-1.5 block scale-95 rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 opacity-0 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition group-hover:z-30 group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                  {imageFilename}
                </span>
                {/* NOTE: Will show the imageFilename underneath the tooltip. */}
                <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {imageFilename}
                </span>
              </p>
              {/* NOTE: Will show the imageDimensions underneath the tooltip. */}
              <p className="pointer-events-none block text-sm font-medium text-gray-500">
                {imageDimensions}
              </p>
            </li>
          )
        })}
      </ul>
      {
        // TODO: Currently, a modal is a child of the `<ImageWithDetails>`
        // element (obviously). It was thought that if two of these elements
        // were used on a single article/project page (`<EntryLayout>`) it would
        // cause duplicate modals on the page. The reality is that this won't
        // happen because as soon as `onClose` is invoked by either using the
        // 'X' icon or clicking off the modal, the modal and its dependencies
        // are removed from the DOM, making way for any other modal/dependencies
        // without duplicates in the DOM. So we're okay. Also, we're only ever
        // going to realistically use one `<ImageWithDetails>`.
        //
        // However, there still is the possibility of duplicates in React's
        // shadow DOM. So optionally, we can move the modal to `<EntryLayout>`
        // later to have a single modal in one place, but this isn't super
        // important. We'd also need to conditionally render based on the
        // presence of `<ImageWithDetails>`, which is a pain. Create an optional
        // issue in our issue tracker/project management software later.
        <Modal
          open={isModalOpen}
          onClose={handleModalClose}
          image={selectedImage}
        />
      }
    </div>
  )
}

function extractFilename(module) {
  const path = module.src
  const filename = path.split('/').pop()
  return filename.replace(/\.[a-f0-9]{8}\.(png|jpg)$/, '.$1')
}

function extractFileDimensions(module) {
  const width = module.width
  const height = module.height
  return `${width} × ${height}`
}
