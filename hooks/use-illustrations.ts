"use client"

import * as React from "react"
import type { RegistryItem } from "./use-registry"

export function useIllustrations(filteredItems: RegistryItem[]) {
  const [illustrations, setIllustrations] = React.useState<
    Map<string, React.ComponentType<{ className?: string }>>
  >(new Map())

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

  return illustrations
}
