import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Built with shadcn/ui • Illustrations from unDraw
        </p>
        <Link
          href="https://github.com/vaatun/undraw-cn"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View on GitHub
        </Link>
      </div>
    </footer>
  )
}
