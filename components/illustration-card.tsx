"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { OpenInV0Button } from "@/components/open-in-v0-button"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type PackageManager = "pnpm" | "yarn" | "npm"

interface ComponentData {
  name: string
  type: string
  files: Array<{
    path: string
    content: string
    type: string
  }>
}

interface IllustrationCardProps {
  name: string
  title: string
  componentData: ComponentData | undefined
  packageManager: PackageManager
  onPackageManagerChange: (pm: PackageManager) => void
  onCopy: (name: string) => void
  isCopied: boolean
}

export function IllustrationCard({
  name,
  title,
  componentData,
  packageManager,
  onPackageManagerChange,
  onCopy,
  isCopied,
}: IllustrationCardProps) {
  const handleCopy = (pm: PackageManager) => {
    onPackageManagerChange(pm)
    onCopy(name)
  }

  // Extract SVG content from the component data
  const svgContent = React.useMemo(() => {
    if (!componentData) return null

    const mainFile = componentData.files.find(f => f.type === "registry:ui")
    if (!mainFile) return null

    // Extract SVG from the component code
    const svgMatch = mainFile.content.match(/<svg[\s\S]*?<\/svg>/i)
    return svgMatch ? svgMatch[0] : null
  }, [componentData])

  return (
    <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[400px] relative">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground sm:pl-3">{title}</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 gap-2">
                {isCopied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span className="text-xs">{packageManager}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-xs"
                onClick={() => handleCopy("pnpm")}
              >
                pnpm dlx shadcn@latest add...
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs"
                onClick={() => handleCopy("yarn")}
              >
                yarn dlx shadcn@latest add...
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs"
                onClick={() => handleCopy("npm")}
              >
                npx shadcn@latest add...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <OpenInV0Button name={name} className="w-fit" />
        </div>
      </div>
      <div className="flex items-center justify-center flex-1 relative">
        {svgContent ? (
          <div
            className="w-full max-w-md"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-xs text-muted-foreground">Loading...</p>
          </div>
        )}
      </div>
    </div>
  )
}
