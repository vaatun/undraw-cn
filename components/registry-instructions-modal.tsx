"use client"

import * as React from "react"
import { Copy, Check, BookOpen } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function RegistryInstructionsModal() {
  const [copiedStep, setCopiedStep] = React.useState<string | null>(null)

  const copyToClipboard = async (text: string, step: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const configExample = `{
  "registries": {
    "@undraw": "${process.env.NEXT_PUBLIC_BASE_URL || "https://undraw-cn.vaatun.com"}/r/{name}.json"
  }
}`

  const installExample = "npx shadcn@latest add @undraw/a-whole-year"

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="h-4 w-4" />
          Setup Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Add unDraw as a Custom Registry</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Configure shadcn to install unDraw illustrations directly into your project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4 overflow-x-hidden">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                1
              </div>
              <h3 className="font-semibold">Configure your registry</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-8">
              Add the unDraw registry to your <code className="px-1 py-0.5 bg-muted rounded text-xs">components.json</code> file:
            </p>
            <div className="relative pl-8 pr-2">
              <pre className="bg-muted p-4 pr-12 rounded-lg text-[10px] sm:text-xs overflow-x-auto max-w-full">
                <code>{configExample}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={() => copyToClipboard(configExample, "config")}
              >
                {copiedStep === "config" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                2
              </div>
              <h3 className="font-semibold">Install illustrations</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-8">
              Use the shadcn CLI to add any illustration from the unDraw registry:
            </p>
            <div className="relative pl-8 pr-2">
              <pre className="bg-muted p-4 pr-12 rounded-lg text-[10px] sm:text-xs overflow-x-auto max-w-full">
                <code>{installExample}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={() => copyToClipboard(installExample, "install")}
              >
                {copiedStep === "install" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                3
              </div>
              <h3 className="font-semibold">Use in your components</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-8">
              Import and use the illustration component in your React app:
            </p>
            <div className="pl-8 pr-2">
              <pre className="bg-muted p-4 rounded-lg text-[10px] sm:text-xs overflow-x-auto max-w-full">
                <code>{`import { AWholeYear } from "@/registry/new-york/illustrations/a-whole-year/a-whole-year"

export function MyComponent() {
  return (
    <AWholeYear className="w-full max-w-md" />
  )
}`}</code>
              </pre>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t pt-4 space-y-2">
            <h4 className="text-sm font-semibold">Features</h4>
            <ul className="text-sm text-muted-foreground space-y-1 pl-4">
              <li className="list-disc">All illustrations are React components with TypeScript support</li>
              <li className="list-disc">Customizable with className and standard SVG props</li>
              <li className="list-disc">Primary color automatically uses your CSS variable <code className="px-1 py-0.5 bg-muted rounded text-xs">--color-primary</code></li>
              <li className="list-disc">Fully responsive and accessible with built-in titles</li>
            </ul>
          </div>

          <div className="border-t pt-4 space-y-2">
            <h4 className="text-sm font-semibold">Learn More</h4>
            <p className="text-sm text-muted-foreground break-words">
              For more information about custom registries and advanced configuration, visit the{" "}
              <a
                href="https://ui.shadcn.com/docs/registry/namespaces"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                shadcn namespaces documentation
              </a>
              .
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
