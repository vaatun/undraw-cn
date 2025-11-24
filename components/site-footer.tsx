import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Main attribution */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Built with shadcn/ui • Illustrations from unDraw
            </p>
            <span className="hidden sm:inline text-xs sm:text-sm text-muted-foreground">•</span>
            <div className="flex items-center text-xs sm:text-sm">
              by&nbsp;
              <Link
                href="https://www.vaatun.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold transition-colors"
              >
                Vaatun
              </Link>
            </div>
          </div>

          {/* GitHub link */}
          <Link
            href="https://github.com/vaatun/undraw-cn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
          >
            View on GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}
