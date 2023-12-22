// TODO: Perhaps add the abiity to add colors to these icons later.
export function ProjectBullet({ icon: Icon, text, href }) {
  return (
    // TODO: `clsx`
    <p
      className={`relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition ${
        href
          ? 'hover:text-blue-500 dark:hover:text-blue-400'
          : 'group-hover:text-blue-500 dark:group-hover:text-blue-400'
      } dark:text-zinc-200`}
    >
      <Icon className="h-6 w-6 flex-none" />
      {href ? (
        <a
          href={href}
          className="ml-2"
        >
          {text}
        </a>
      ) : (
        <span className="ml-2">{text}</span>
      )}
    </p>
  )
}
