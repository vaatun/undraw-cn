import type { Registry, RegistryItem } from "@/hooks/use-registry"

export type PackageManager = "pnpm" | "yarn" | "npm"

export function normalizeForSearch(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "")
}

export function filterItems(
  registry: Registry | null,
  searchQuery: string
): RegistryItem[] {
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
}

export function getInstallCommand(
  componentName: string,
  packageManager: PackageManager
): string {
  const commands = {
    pnpm: `pnpm dlx shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL}/r/${componentName}.json`,
    yarn: `yarn shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL}/r/${componentName}.json`,
    npm: `npx shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL}/r/${componentName}.json`,
  }
  return commands[packageManager]
}
