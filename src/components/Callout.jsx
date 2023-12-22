import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

export function Callout({ type, title, children }) {
  return (
    <div className="rounded-3xl bg-yellow-50 p-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            aria-hidden="true"
            className="h-5 w-5 text-yellow-400"
          />
        </div>
        <div className="ml-3">
          <div className="not-prose">
            <p className="text-sm font-medium leading-5 text-yellow-800">
              {title}
            </p>
          </div>
          {children}
          {/* <div
            className="mt-2 text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
          ></div> */}
        </div>
      </div>
    </div>
  )
}
