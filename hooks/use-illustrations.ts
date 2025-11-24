"use client"

import * as React from "react"
import type { RegistryItem } from "./use-registry"

interface ComponentData {
  name: string
  type: string
  files: Array<{
    path: string
    content: string
    type: string
  }>
}

export function useIllustrations(filteredItems: RegistryItem[]) {
  const [illustrations, setIllustrations] = React.useState<
    Map<string, ComponentData>
  >(new Map())

  React.useEffect(() => {
    filteredItems.forEach((item) => {
      if (!illustrations.has(item.name)) {
        fetch(`/r/${item.name}.json`)
          .then((res) => res.json())
          .then((data: ComponentData) => {
            setIllustrations((prev) => new Map(prev).set(item.name, data))
          })
          .catch((err) => {
            console.error(`Failed to load ${item.name}:`, err)
          })
      }
    })
  }, [filteredItems, illustrations])

  return illustrations
}
