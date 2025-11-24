import Link from "next/link"
import { Github } from "lucide-react"
import { RegistryInstructionsModal } from "@/components/registry-instructions-modal"

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Top row: Title and primary branding */}
        <div className="flex items-center justify-between gap-4 mb-3 sm:mb-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-lg sm:text-xl font-bold whitespace-nowrap">unDraw CN</h1>
            </Link>
            <span className="text-muted-foreground text-xs sm:text-sm">
              <span className="hidden sm:inline">shadcn registry • </span>
              by&nbsp;
              <Link
                href="https://www.vaatun.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold transition-colors hover:text-[#2E284C]"
              >
                Vaatun
              </Link>
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/about"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              About
            </Link>
            <RegistryInstructionsModal />
            <Link
              href="https://github.com/vaatun/undraw-cn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
