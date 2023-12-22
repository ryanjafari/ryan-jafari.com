import Link from 'next/link'

export function InternalLink({ href, label }) {
  return href === '#' ? (
    <span className="bg-red-50 text-red-700">{label}</span>
  ) : (
    <Link href={href}>{label}</Link>
  )
}
