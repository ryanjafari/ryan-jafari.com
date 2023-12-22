import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Fragment } from 'react'
import { Button } from './Button'

// TODO: Implement hard linking to modals.
export function Modal({ open, onClose, image }) {
  // TODO: Implement keyboard shuffling through images.
  return (
    <Transition.Root
      as={Fragment}
      show={open}
    >
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0">
          <div className="flex h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {/* TODO: Need a loading indicator behind the image here? */}
              <Dialog.Panel className="h-[90vh] w-[90vw] rounded-lg bg-white shadow-xl ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20">
                <div className="absolute right-4 top-4 z-10">
                  {/* TODO: There was some kind of warning appearing on click of this button. https://stackoverflow.com/questions/39152877/consider-marking-event-handler-as-passive-to-make-the-page-more-responsive */}
                  <Button
                    className="group"
                    onClick={onClose}
                    variant="secondary"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50"
                    />
                  </Button>
                </div>
                <div className="relative h-full">
                  <Image
                    alt={image.alt}
                    className="rounded-lg"
                    fill={true}
                    src={image.src}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                {/* TODO: How to extract from "Dialog Title" and "Button"? Either don't or create component. Using `clsx` is OK. */}
                <div className="relative bottom-12 rounded-b-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  {/* TODO: Tooltip here. */}
                  <Dialog.Title
                    as="h2"
                    className="truncate font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    {image.alt}
                  </Dialog.Title>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
