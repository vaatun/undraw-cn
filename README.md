# unDraw CN - shadcn Registry for unDraw Illustrations

<p align="center">
  <img src="docs/assets/readme.svg" alt="unDraw Illustrations" width="600">
</p>

A custom shadcn registry that transforms all 1,362 [unDraw](https://undraw.co) illustrations into customizable React components with TypeScript support.

## Features

- **🎨 Customizable Colors**: Primary colors automatically use your CSS `--color-primary` variable
- **📦 Easy Installation**: Install illustrations using the shadcn CLI
- **⚡ Optimized SVGs**: All illustrations converted to clean React components
- **🔧 Fully Typed**: Complete TypeScript support with proper interfaces
- **🎯 shadcn Compatible**: Works seamlessly with any shadcn/ui project
- **📱 Responsive**: All components are responsive and accessible with built-in titles

## Quick Start

### 1. Configure the Registry

Add the unDraw registry to your `components.json` file:

```json
{
  "registries": {
    "@undraw": "https://undraw-cn.vaatun.com/r/{name}.json"
  }
}
```

### 2. Install Illustrations

Use the shadcn CLI to add any illustration:

```bash
npx shadcn@latest add @undraw/a-whole-year
npx shadcn@latest add @undraw/creative-team
npx shadcn@latest add @undraw/mobile-login
```

### 3. Use in Your Components

Import and use the illustration in your React app:

```tsx
import { AWholeYear } from "@/registry/new-york/illustrations/a-whole-year/a-whole-year";

export function MyComponent() {
  return (
    <div className="flex items-center justify-center p-8">
      <AWholeYear className="w-full max-w-md" />
    </div>
  );
}
```

## Component Props

All illustration components accept standard SVG props:

```tsx
export interface IllustrationProps extends SVGProps<SVGSVGElement> {}

// Usage
<AWholeYear
  className="w-64 h-64"
  style={{ opacity: 0.8 }}
  role="img"
  aria-label="A whole year illustration"
/>;
```

## Color Customization

The primary color in all illustrations automatically uses your CSS variable `--color-primary`. You can customize it globally in your CSS:

```css
:root {
  --color-primary: #5b3d91; /* Your brand color */
}
```

Or use the color picker on the [live demo](https://undraw-cn.vaatun.com) to preview different colors.

## Available Illustrations

Browse and search all 1,362 illustrations at [undraw-cn.vaatun.com](https://undraw-cn.vaatun.com)

## How It Works

This registry uses the shadcn CLI infrastructure:

1. **Source SVGs**: Original unDraw SVG files sourced from [balazser/undraw-svg-collection](https://github.com/balazser/undraw-svg-collection)
2. **Conversion**: The `tools/convert-svgs.js` script converts SVGs to React components:
   - Parses SVG attributes and converts to JSX format
   - Converts kebab-case attributes to camelCase (e.g., `stroke-width` → `strokeWidth`)
   - Handles inline styles and merges CSS attributes
   - Generates TypeScript interfaces for each component
3. **Registry Generation**: Components are registered in `registry.json`
4. **Build Process**: `shadcn build` generates individual JSON files in `public/r/`
5. **Distribution**: Static files are served via Azure Static Web Apps

## Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/vaatun/undraw-cn.git
cd undraw-cn

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### Converting SVGs

To convert unDraw SVGs to React components:

```bash
node tools/convert-svgs.js
```

This will:

- Read SVG files from the configured source directory
- Generate React components in `registry/new-york/illustrations/`
- Update both `registry.json` and `public/r/registry.json`

### Building the Registry

```bash
pnpm registry:build
```

This generates the registry files and serves them under `public/r/`.

### Testing Locally

Test registry items locally:

```bash
# Start development server
pnpm dev

# In another terminal, install from local registry
npx shadcn@latest add http://localhost:3000/r/a-whole-year.json
```

## Project Structure

```
undraw-cn/
├── app/                          # Next.js app directory
├── components/
│   ├── ui/                       # shadcn UI components
│   ├── illustration-card.tsx     # Card component for illustrations
│   ├── site-header.tsx           # Site header with setup guide
│   ├── site-footer.tsx           # Site footer
│   └── ...
├── registry/
│   └── new-york/
│       └── illustrations/        # All illustration components
│           ├── a-whole-year/
│           │   └── a-whole-year.tsx
│           └── ...
├── public/
│   └── r/                        # Built registry JSON files
├── tools/
│   └── convert-svgs.js           # SVG to React converter
├── registry.json                 # Main registry definition
└── components.json               # shadcn configuration
```

## Deployment

The project is deployed on Azure Static Web Apps with automatic deployments from the `main` branch.

### Manual Deployment

```bash
# Build the project
pnpm build

# Deploy to Azure (configured via GitHub Actions)
git push origin main
```

## About unDraw

[unDraw](https://undraw.co) is an open-source illustration project created by [Katerina Limpitsouni](https://twitter.com/ninalimpi) featuring beautiful, customizable SVG illustrations.

### unDraw License

- ✨ Open-source and free to use
- 🎨 Customizable colors
- 📐 SVG format for infinite scalability
- 💼 Commercial use allowed
- 🚫 Don't redistribute unDraw as your own

See [unDraw License](https://undraw.co/license) for full terms.

## Documentation

- [shadcn Registry Documentation](https://ui.shadcn.com/docs/registry)
- [shadcn Namespaces Guide](https://ui.shadcn.com/docs/registry/namespaces)
- [unDraw Official Site](https://undraw.co)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

- **Registry Code**: MIT License
- **unDraw Illustrations**: Open source by Katerina Limpitsouni - free for commercial and personal use
- See [unDraw License](https://undraw.co/license) for illustration usage terms

## Credits

- **Illustrations**: Created by [Katerina Limpitsouni](https://twitter.com/ninalimpi)
- **SVG Source Collection**: [balazser/undraw-svg-collection](https://github.com/balazser/undraw-svg-collection)
- **Registry Infrastructure**: Built on [shadcn/ui](https://ui.shadcn.com)
- **Original unDraw**: [undraw.co](https://undraw.co)

---

Built with ❤️ using Next.js, shadcn/ui, and unDraw

[Live Demo](https://undraw-cn.vaatun.com) · [GitHub](https://github.com/vaatun/undraw-cn)
