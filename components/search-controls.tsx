"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchControlsProps {
  primaryColor: string
  onColorChange: (color: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function SearchControls({
  primaryColor,
  onColorChange,
  searchQuery,
  onSearchChange,
}: SearchControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">unDraw Illustrations Registry</h2>
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
            onChange={(e) => onColorChange(e.target.value)}
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  )
}
