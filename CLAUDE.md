# unDraw CN - Project Documentation

## Project Overview

**unDraw CN** is a custom shadcn registry that converts all 1,362 [unDraw](https://undraw.co) illustrations into installable React components with TypeScript support. The project serves as a decentralized component registry using the shadcn CLI infrastructure.

### Key Information

- **Live URL**: https://undraw-cn.vaatun.com
- **GitHub**: https://github.com/vaatun/undraw-cn
- **Registry Namespace**: `@undraw`
- **Total Illustrations**: 1,362 components
- **Tech Stack**: Next.js 15.5.2, React 19, TypeScript, Tailwind CSS v4
- **Deployment**: Azure Static Web Apps
- **Package Manager**: pnpm

## Architecture

### High-Level Flow

```
SVG Source Files → Conversion Script → React Components → Registry JSON → shadcn CLI → User Project
```

1. **Source SVGs**: Original unDraw SVG files from [balazser/undraw-svg-collection](https://github.com/balazser/undraw-svg-collection)
2. **Conversion**: `tools/convert-svgs.js` converts SVGs to React TSX components
3. **Registry**: Components registered in `registry.json`
4. **Build**: `shadcn build` generates individual JSON files in `public/r/`
5. **Distribution**: Users install via `npx shadcn@latest add @undraw/[name]`

### Directory Structure

```
undraw-cn/
├── app/                                    # Next.js 15 App Router
│   ├── page.tsx                           # Main page with illustration gallery
│   ├── layout.tsx                         # Root layout
│   └── globals.css                        # Global styles with Tailwind v4
├── components/
│   ├── ui/                                # shadcn UI components
│   │   ├── button.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── dialog.tsx
│   │   └── input.tsx
│   ├── illustration-card.tsx              # Card for displaying illustrations
│   ├── search-controls.tsx                # Search and color picker
│   ├── site-header.tsx                    # Header with setup modal
│   ├── site-footer.tsx                    # Footer with links
│   ├── registry-instructions-modal.tsx    # Setup guide modal
│   └── open-in-v0-button.tsx             # v0.dev integration button
├── hooks/
│   ├── use-registry.ts                    # Fetches registry.json
│   └── use-illustrations.ts               # Fetches individual component JSONs
├── lib/
│   ├── utils.ts                           # cn() utility
│   └── registry-utils.ts                  # Filtering, search, install commands
├── registry/
│   └── new-york/
│       └── illustrations/                 # All 1,362 illustration components
│           ├── a-whole-year/
│           │   └── a-whole-year.tsx
│           ├── creative-team/
│           │   └── creative-team.tsx
│           └── ...                        # 1,360 more illustrations
├── public/
│   └── r/                                 # Built registry JSON files
│       ├── registry.json                  # Main registry index
│       ├── a-whole-year.json             # Individual component JSON
│       └── ...                            # 1,361 more JSONs
├── tools/
│   └── convert-svgs.js                    # SVG → React converter
├── .github/
│   └── workflows/
│       └── azure-static-web-apps-*.yml   # CI/CD pipeline
├── registry.json                          # Main registry definition
├── components.json                        # shadcn configuration
└── package.json                           # Dependencies and scripts
```

## Core Components

### 1. SVG Conversion Script (`tools/convert-svgs.js`)

**Purpose**: Converts unDraw SVG files to React TypeScript components

**Key Functions**:

```javascript
// Converts kebab-case to PascalCase for component names
function toPascalCase(str) { /* ... */ }

// Converts CSS properties to camelCase
function toCamelCase(str) { /* ... */ }

// Parses inline style attributes to JSX objects
function parseStyleAttribute(styleString) { /* ... */ }

// Converts SVG attributes to React camelCase
function convertSVGAttributes(content) {
  // stroke-width → strokeWidth
  // stroke-miterlimit → strokeMiterlimit
  // fill-opacity → fillOpacity
  // etc.
}

// Merges isolation attributes into style declarations
function convertCSSAttributes(content) {
  // isolation="isolate" → style={{isolation: "isolate"}}
}

// Generates React component with TypeScript
function generateComponent(fileName, svgContent) { /* ... */ }

// Generates registry entry for each component
function generateRegistryEntry(fileName) { /* ... */ }
```

**Input**: SVG files from [balazser/undraw-svg-collection](https://github.com/balazser/undraw-svg-collection) (`/Users/sudomakes/code/undraw-svg-collection/svgs`)
**Output**:
- React components in `registry/new-york/illustrations/[name]/[name].tsx`
- Updated `registry.json` and `public/r/registry.json`

**Example Output Component**:

```tsx
import { cn } from "@/lib/utils"
import { type SVGProps } from "react"

export interface AWholeYearProps extends SVGProps<SVGSVGElement> {}

export const AWholeYear = (props: AWholeYearProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1097.59 694.62"
      {...props}
      className={cn("w-full h-auto", props.className)}
      role="img"
    >
      <title>A Whole Year</title>
      {/* SVG content */}
    </svg>
  )
}
```

### 2. Frontend Application

#### Main Page (`app/page.tsx`)

**State Management**:
- `primaryColor`: Current color selection (default: #e76f51)
- `packageManager`: Selected package manager (pnpm/yarn/npm)
- `copiedId`: Tracks which component's install command was copied
- `searchQuery`: User's search input

**Data Flow**:
```
useRegistry() → fetches /r/registry.json → filteredItems
                                              ↓
useIllustrations(filteredItems) → fetches /r/[name].json for each → illustrations Map
```

**Key Features**:
- Real-time search and filtering
- Color picker with CSS variable update
- Package manager selection
- Copy-to-clipboard for install commands
- Responsive grid layout

#### Illustration Loading (`hooks/use-illustrations.ts`)

```typescript
export function useIllustrations(filteredItems: RegistryItem[]) {
  const [illustrations, setIllustrations] = useState<Map<string, ComponentData>>(new Map())

  useEffect(() => {
    filteredItems.forEach((item) => {
      if (!illustrations.has(item.name)) {
        fetch(`/r/${item.name}.json`)  // Fetch individual component JSON
          .then(res => res.json())
          .then(data => {
            setIllustrations(prev => new Map(prev).set(item.name, data))
          })
      }
    })
  }, [filteredItems, illustrations])

  return illustrations
}
```

#### Illustration Rendering (`components/illustration-card.tsx`)

**SVG Extraction**:
```typescript
const svgContent = useMemo(() => {
  if (!componentData) return null
  const mainFile = componentData.files.find(f => f.type === "registry:ui")
  if (!mainFile) return null

  // Extract SVG from component code using regex
  const svgMatch = mainFile.content.match(/<svg[\s\S]*?<\/svg>/i)
  return svgMatch ? svgMatch[0] : null
}, [componentData])

// Render using dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: svgContent }} />
```

### 3. Registry Configuration

#### Registry Entry Format (`registry.json`)

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "undraw-cn",
  "homepage": "https://undraw-cn.vaatun.com",
  "items": [
    {
      "name": "a-whole-year",
      "type": "registry:component",
      "title": "A Whole Year",
      "files": [
        {
          "path": "registry/new-york/illustrations/a-whole-year/a-whole-year.tsx",
          "type": "registry:component"
        }
      ]
    }
    // ... 1,361 more items
  ]
}
```

#### User Configuration (`components.json` in user's project)

```json
{
  "registries": {
    "@undraw": "https://undraw-cn.vaatun.com/r/{name}.json"
  }
}
```

## Build Process

### Development Build

```bash
pnpm dev                    # Start Next.js dev server on localhost:3000
```

### Registry Build

```bash
pnpm registry:build         # Runs: shadcn build
```

**What it does**:
1. Reads `registry.json`
2. For each item, creates a JSON file in `public/r/[name].json`
3. Each JSON contains the full component code and metadata
4. Main index at `public/r/registry.json`

### Production Build

```bash
pnpm build                  # Next.js production build
```

**Output**: `.next/` directory with optimized static site

## Deployment

### Azure Static Web Apps

**Configuration**: `.github/workflows/azure-static-web-apps-*.yml`

**Automatic Deployment**:
1. Push to `main` branch
2. GitHub Actions triggers
3. Builds Next.js site
4. Deploys to Azure Static Web Apps
5. Available at https://undraw-cn.vaatun.com

**Environment Variables**:
- `NEXT_PUBLIC_BASE_URL`: Set to production URL for install commands

## Key Features

### 1. Custom Registry Instructions Modal

Located in `components/registry-instructions-modal.tsx`, provides:
- Step-by-step setup guide
- Copy-to-clipboard for code snippets
- Link to shadcn namespaces documentation
- Responsive design with overflow handling

### 2. Color Customization

All illustrations use CSS variable `var(--color-primary)`:

```css
/* globals.css */
:root {
  --color-primary: #e76f51;
}
```

Updated dynamically via JavaScript:
```typescript
document.documentElement.style.setProperty("--primary", color)
```

### 3. Search and Filtering

**Normalization** (`lib/registry-utils.ts`):
```typescript
function normalizeForSearch(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "")
}
```

Searches both name and title fields, returns max 10 results.

### 4. Package Manager Support

Generates install commands for:
- **pnpm**: `pnpm dlx shadcn@latest add [url]`
- **yarn**: `yarn dlx shadcn@latest add [url]`
- **npm**: `npx shadcn@latest add [url]`

## Important Technical Details

### SVG Attribute Conversion

The conversion script handles:

1. **Kebab-case to camelCase**:
   - `stroke-width` → `strokeWidth`
   - `stroke-miterlimit` → `strokeMiterlimit`
   - `fill-opacity` → `fillOpacity`
   - `clip-path` → `clipPath`

2. **Isolation attribute merging**:
   - `isolation="isolate"` → merged into `style={{isolation: "isolate"}}`
   - Extends existing styles instead of overwriting

3. **Style attribute conversion**:
   - `style="fill: red"` → `style={{fill: "red"}}`

### Registry Resolution

When a user runs:
```bash
npx shadcn@latest add @undraw/creative-team
```

shadcn CLI:
1. Looks up `@undraw` in user's `components.json`
2. Resolves to `https://undraw-cn.vaatun.com/r/creative-team.json`
3. Fetches the JSON
4. Extracts files and writes to user's project
5. Installs in `registry/new-york/illustrations/creative-team/`

## Common Tasks

### Adding New Illustrations

1. Add SVG files to source directory
2. Run conversion script: `node tools/convert-svgs.js`
3. Build registry: `pnpm registry:build`
4. Commit and push to deploy

### Testing Installation Locally

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2: Install from local registry
npx shadcn@latest add http://localhost:3000/r/creative-team.json
```

### Updating Dependencies

```bash
pnpm update                 # Update all dependencies
pnpm install                # Clean install
```

## Dependencies

### Core Dependencies

```json
{
  "next": "15.5.2",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@radix-ui/react-dropdown-menu": "^2.1.4",
  "@radix-ui/react-dialog": "^1.1.15",
  "lucide-react": "^0.475.0",
  "tailwindcss": "^4.1.8"
}
```

### Build Tools

```json
{
  "@types/node": "^22.10.5",
  "@types/react": "^19.0.6",
  "typescript": "^5.7.3"
}
```

## Troubleshooting

### Issue: Illustrations not loading

**Check**:
1. Registry JSON files exist in `public/r/`
2. Development server is running
3. Browser console for fetch errors

### Issue: SVG conversion fails

**Check**:
1. Source SVG directory path in `tools/convert-svgs.js`
2. SVG files are valid XML
3. File permissions

### Issue: Install command not working

**Check**:
1. User has configured `@undraw` in their `components.json`
2. Registry URL is correct and accessible
3. shadcn CLI is up to date: `npx shadcn@latest --version`

## Best Practices

1. **Always run conversion script** after updating SVG source files
2. **Build registry** before testing installation
3. **Use pnpm** as the primary package manager
4. **Test locally** before pushing to production
5. **Keep registry.json** in sync with actual component files

## Related Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [shadcn Registry Guide](https://ui.shadcn.com/docs/registry)
- [shadcn Namespaces](https://ui.shadcn.com/docs/registry/namespaces)
- [unDraw Official Site](https://undraw.co)
- [SVG Source Collection](https://github.com/balazser/undraw-svg-collection)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com)

## Future Enhancements

Potential improvements:
- [ ] Add illustration categories/tags
- [ ] Implement server-side search
- [ ] Add illustration preview on hover
- [ ] Support for custom color palettes (beyond primary)
- [ ] Batch installation of multiple illustrations
- [ ] Download as standalone SVG option
- [ ] Integration with Figma plugin
- [ ] Analytics for popular illustrations
