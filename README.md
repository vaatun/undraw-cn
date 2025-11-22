# unDraw React Component Registry

<p align="center">
  <img src="docs/assets/readme.svg" alt="unDraw Illustrations" width="600">
</p>

A shadcn-compatible registry that transforms beautiful [unDraw](https://undraw.co) illustrations into customizable React components for your projects.

## What is this?

This project converts the entire unDraw illustration library into React components that can be easily added to any React/Next.js project using the shadcn CLI. Each illustration is a standalone component with customizable colors that seamlessly integrate with your design system.

### Features

- **🎨 Customizable Colors**: All illustrations support color customization to match your brand
- **📦 Easy Installation**: Install illustrations using the familiar `shadcn` CLI
- **⚡ Optimized SVGs**: Tiny file sizes with infinite scalability
- **🔧 Fully Typed**: TypeScript support out of the box
- **🎯 shadcn Compatible**: Works with any project using shadcn/ui

## Installation

### Prerequisites

Your project must be initialized with shadcn/ui. If you haven't already:

```bash
npx shadcn@latest init
```

### Adding Illustrations

Install any unDraw illustration as a React component:

```bash
npx shadcn@latest add @undraw/[illustration-name]
```

For example:

```bash
npx shadcn@latest add @undraw/search
npx shadcn@latest add @undraw/creative-team
npx shadcn@latest add @undraw/mobile-login
```

## Usage

Once installed, import and use illustrations like any other React component:

```tsx
import { SearchIllustration } from "@/components/undraw/search";

export function MyComponent() {
  return (
    <div>
      <SearchIllustration className="w-full max-w-md" />
    </div>
  );
}
```

## How It Works

This registry uses the shadcn CLI infrastructure to distribute components:

- Each illustration is defined in `registry.json` with its files and dependencies
- The `shadcn build` command builds the registry
- Components are served as static files under `public/r/[name].json`
- The shadcn CLI automatically resolves and installs components with their dependencies

## About unDraw

[unDraw](https://undraw.co) is an open-source illustration project created by [Katerina Limpitsouni](https://twitter.com/ninalimpi) featuring beautiful, customizable SVG illustrations for any idea you can imagine.

### Original unDraw Features

- ✨ Open-source and free to use
- 🎨 Customizable colors
- 📐 SVG format for infinite scalability
- 🚀 Perfect for landing pages, apps, and products
- 📱 Responsive and timeless design
- 💼 Commercial use allowed (just don't copy unDraw itself!)

This registry simply makes these illustrations easier to integrate into React projects using the shadcn ecosystem.

## Development

> [!IMPORTANT]
> This template uses Tailwind v4. For Tailwind v3, see [registry-template-v3](https://github.com/shadcn-ui/registry-template-v3).

### Building the Registry

```bash
npx shadcn build
```

This generates the registry files and serves them under `public/r/`.

### Testing Locally

You can test registry items locally by running the Next.js development server:

```bash
npm run dev
```

Then install components using:

```bash
npx shadcn@latest add http://localhost:3000/r/[component-name].json
```

## Documentation

- [shadcn Registry Documentation](https://ui.shadcn.com/docs/registry)
- [unDraw Official Site](https://undraw.co)

## License

- **Registry Code**: MIT License
- **unDraw Illustrations**: Open source by Katerina Limpitsouni - free for commercial and personal use
- See [unDraw License](https://undraw.co/license) for illustration usage terms

## Credits

- **Illustrations**: Created by [Katerina Limpitsouni](https://twitter.com/ninalimpi)
- **Registry Template**: Built on [shadcn/ui](https://ui.shadcn.com) registry infrastructure
- **Original unDraw**: [undraw.co](https://undraw.co)

---

© 2025 · Built with ❤️ using shadcn and unDraw
