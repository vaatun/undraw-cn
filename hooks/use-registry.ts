"use client"

import * as React from "react"

export interface RegistryItem {
  name: string
  type: string
  title: string
  files: Array<{
    path: string
    type: string
  }>
}

export interface Registry {
  items: RegistryItem[]
}

export function useRegistry() {
  const [registry, setRegistry] = React.useState<Registry | null>(null)
  const [loading, setLoading] = React.useState(true)

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

  return { registry, loading }
}
