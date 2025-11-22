"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { OpenInV0Button } from "@/components/open-in-v0-button"
import { UnderConstruction } from "@/registry/new-york/illustrations/under-construction/under-construction"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type PackageManager = "pnpm" | "yarn" | "npm"

export default function Home() {
  const [primaryColor, setPrimaryColor] = React.useState<string>("#e76f51")
  const [packageManager, setPackageManager] = React.useState<PackageManager>("pnpm")
  const [copied, setCopied] = React.useState(false)

  const handleColorChange = React.useCallback((color: string) => {
    setPrimaryColor(color)
    document.documentElement.style.setProperty("--primary", color)
  }, [])

  const getInstallCommand = (componentName: string) => {
    const commands = {
      pnpm: `pnpm dlx shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL}/r/${componentName}.json`,
      yarn: `yarn shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL}/r/${componentName}.json`,
      npm: `npx shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL}/r/${componentName}.json`,
    }
    return commands[packageManager]
  }

  const copyCommand = async (componentName: string) => {
    const command = getInstallCommand(componentName)
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">unDraw Illustrations Registry</h1>
          <p className="text-muted-foreground">
            Beautiful, customizable React components for unDraw illustrations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="primary-color" className="text-sm font-medium">Primary Color:</label>
          <input
            type="color"
            id="primary-color"
            value={primaryColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="h-8 w-16 cursor-pointer rounded border border-border"
          />
          <span className="text-xs text-muted-foreground font-mono">{primaryColor}</span>
        </div>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              Under Construction
            </h2>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="h-8 gap-2">
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span className="text-xs">{packageManager}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-xs"
                    onClick={() => {
                      setPackageManager("pnpm")
                      copyCommand("under-construction")
                    }}
                  >
                    pnpm dlx shadcn@latest add...
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-xs"
                    onClick={() => {
                      setPackageManager("yarn")
                      copyCommand("under-construction")
                    }}
                  >
                    yarn dlx shadcn@latest add...
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-xs"
                    onClick={() => {
                      setPackageManager("npm")
                      copyCommand("under-construction")
                    }}
                  >
                    npx shadcn@latest add...
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <OpenInV0Button name="under-construction" className="w-fit" />
            </div>
          </div>
          <div className="flex items-center justify-center min-h-[400px] relative">
            <UnderConstruction className="w-full max-w-md"/>
          </div>
        </div>
      </main>
    </div>
  )
}
