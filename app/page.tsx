"use client"

import * as React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SearchControls } from "@/components/search-controls"
import { IllustrationCard } from "@/components/illustration-card"
import { useRegistry } from "@/hooks/use-registry"
import { useIllustrations } from "@/hooks/use-illustrations"
import {
  type PackageManager,
  filterItems,
  getInstallCommand,
} from "@/lib/registry-utils"

export default function Home() {
  const [primaryColor, setPrimaryColor] = React.useState<string>("#5B3D91")
  const [packageManager, setPackageManager] = React.useState<PackageManager>("pnpm")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const { registry, loading } = useRegistry()

  const handleColorChange = React.useCallback((color: string) => {
    setPrimaryColor(color)
    document.documentElement.style.setProperty("--primary", color)
  }, [])

  const filteredItems = React.useMemo(
    () => filterItems(registry, searchQuery),
    [registry, searchQuery]
  )

  const illustrations = useIllustrations(filteredItems)

  const copyCommand = async (componentName: string) => {
    const command = getInstallCommand(componentName, packageManager)
    await navigator.clipboard.writeText(command)
    setCopiedId(componentName)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex flex-col min-h-svh">
      <SiteHeader />

      <div className="max-w-6xl mx-auto flex flex-col flex-1 w-full px-4 py-8 gap-8">
        <SearchControls
          primaryColor={primaryColor}
          onColorChange={handleColorChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex flex-col flex-1 gap-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <p className="text-muted-foreground">Loading illustrations...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No illustrations found matching your search."
                  : "No illustrations available."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {filteredItems.map((item) => (
                <IllustrationCard
                  key={item.name}
                  name={item.name}
                  title={item.title}
                  component={illustrations.get(item.name)}
                  packageManager={packageManager}
                  onPackageManagerChange={setPackageManager}
                  onCopy={copyCommand}
                  isCopied={copiedId === item.name}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}
