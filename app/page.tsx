"use client"

import * as React from "react"
import { Check, Copy, Search } from "lucide-react"
import { OpenInV0Button } from "@/components/open-in-v0-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type PackageManager = "pnpm" | "yarn" | "npm"

interface RegistryItem {
  name: string
  type: string
  title: string
  files: Array<{
    path: string
    type: string
  }>
}

interface Registry {
  items: RegistryItem[]
}

export default function Home() {
  const [primaryColor, setPrimaryColor] = React.useState<string>("#e76f51")
  const [packageManager, setPackageManager] = React.useState<PackageManager>("pnpm")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [registry, setRegistry] = React.useState<Registry | null>(null)
  const [illustrations, setIllustrations] = React.useState<Map<string, React.ComponentType<any>>>(new Map())
  const [loading, setLoading] = React.useState(true)

  // Fetch registry on mount
  React.useEffect(() => {
    fetch("/r/registry.json")
      .then((res) => res.json())
      .then((data) => {
        setRegistry(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load registry:", err)
        setLoading(false)
      })
  }, [])

  const handleColorChange = React.useCallback((color: string) => {
    setPrimaryColor(color)
    document.documentElement.style.setProperty("--primary", color)
  }, [])

  // Normalize string for search: remove dashes, spaces, convert to lowercase
  const normalizeForSearch = (str: string) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, "")
  }

  // Filter illustrations based on search query
  const filteredItems = React.useMemo(() => {
    if (!registry) return []
    if (!searchQuery.trim()) return registry.items.slice(0, 10)

    const normalized = normalizeForSearch(searchQuery)
    return registry.items
      .filter((item) => {
        const normalizedName = normalizeForSearch(item.name)
        const normalizedTitle = normalizeForSearch(item.title)
        return normalizedName.includes(normalized) || normalizedTitle.includes(normalized)
      })
      .slice(0, 10)
  }, [registry, searchQuery])

  // Dynamically import illustrations as needed
  React.useEffect(() => {
    filteredItems.forEach((item) => {
      if (!illustrations.has(item.name)) {
        import(`@/registry/new-york/illustrations/${item.name}/${item.name}`)
          .then((mod) => {
            const componentKey = Object.keys(mod).find(
              (key) => key !== "default" && typeof mod[key] === "function"
            )
            if (componentKey) {
              setIllustrations((prev) => new Map(prev).set(item.name, mod[componentKey]))
            }
          })
          .catch((err) => {
            console.error(`Failed to load ${item.name}:`, err)
          })
      }
    })
  }, [filteredItems, illustrations])

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
    setCopiedId(componentName)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">unDraw Illustrations Registry</h1>
          <p className="text-muted-foreground">
            Beautiful, customizable React components for unDraw illustrations.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="primary-color" className="text-sm font-medium">
              Primary Color:
            </label>
            <input
              type="color"
              id="primary-color"
              value={primaryColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="h-8 w-16 cursor-pointer rounded border border-border"
            />
            <span className="text-xs text-muted-foreground font-mono">{primaryColor}</span>
          </div>
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search illustrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </header>
      <main className="flex flex-col flex-1 gap-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">Loading illustrations...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">
              {searchQuery ? "No illustrations found matching your search." : "No illustrations available."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {filteredItems.map((item) => {
              const Component = illustrations.get(item.name)
              return (
                <div key={item.name} className="flex flex-col gap-4 border rounded-lg p-4 min-h-[400px] relative">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm text-muted-foreground sm:pl-3">{item.title}</h2>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 gap-2">
                            {copiedId === item.name ? (
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
                            onClick={() => {
                              setPackageManager("pnpm")
                              copyCommand(item.name)
                            }}
                          >
                            pnpm dlx shadcn@latest add...
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-xs"
                            onClick={() => {
                              setPackageManager("yarn")
                              copyCommand(item.name)
                            }}
                          >
                            yarn dlx shadcn@latest add...
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-xs"
                            onClick={() => {
                              setPackageManager("npm")
                              copyCommand(item.name)
                            }}
                          >
                            npx shadcn@latest add...
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <OpenInV0Button name={item.name} className="w-fit" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center flex-1 relative">
                    {Component ? (
                      <Component className="w-full max-w-md" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <p className="text-xs text-muted-foreground">Loading...</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
