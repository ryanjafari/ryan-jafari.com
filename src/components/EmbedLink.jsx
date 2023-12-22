export function EmbedLink({ title, html }) {
  return html ? (
    <div className="border-l-2 border-blue-500 pl-6 not-italic">
      <p className="font-bold">{title}</p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  ) : (
    { title }
  )
}
