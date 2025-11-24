import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">unDraw CN</h1>
          <span className="text-muted-foreground text-sm">shadcn registry</span>
        </div>
        <Link
          href="https://github.com/vaatun/undraw-cn"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          GitHub
        </Link>
      </div>
    </header>
  )
}
