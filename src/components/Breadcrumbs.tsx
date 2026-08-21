import { Link } from 'react-router-dom'

type Item = {
  label: string
  href?: string
}

export default function Breadcrumbs({ items }: { items: Item[] }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-foreground font-medium' : ''}>
                {item.label}
              </span>
            )}

            {!isLast && <span>/</span>}
          </div>
        )
      })}
    </nav>
  )
}