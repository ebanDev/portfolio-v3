# Portfolio v3

Eban Rami's personal portfolio website built with Nuxt 3 and Tailwind CSS.

## Features

- Content-driven pages using `@nuxt/content`
- Tailwind CSS styling (via `@tailwindcss/vite`)

## Tech Stack

- Nuxt 3
- TypeScript
- Tailwind CSS
- `@nuxt/content` for Markdown content

## Project Setup

Install dependencies and start the dev server:

```bash
bun install
bun dev
```

### Build for Production

```bash
bun run build
bun run preview
```

## Content Structure

- `content/index.md`: homepage content
- `content/articles/*.md`: article content pages
- `content.config.ts`: content collections configuration

## Configuration

- `nuxt.config.ts`: main Nuxt configuration (modules, CSS, Vite plugins)
- `tsconfig.json`: TypeScript configuration

## Directory Structure

```
.
├── assets/              # Global styles
├── components/          # Vue components (ModeSwitcher, AvatarStack, CardList)
├── content/             # Markdown content (index & articles)
├── pages/               # Nuxt page components
├── public/              # Public assets & images
├── nuxt.config.ts       # Nuxt configuration
├── content.config.ts    # Content collections configuration
├── package.json
├── tsconfig.json
└── README.md
```

## License

AGPL-3.0

## Author

Eban Rami
