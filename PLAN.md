# Plan: Modern Linting, Formatting & Typechecking Setup

## Goal

Replace the current minimal ESLint + markdownlint-cli setup with a modern pipeline:
Prettier (formatting) + ESLint 9 flat config (code quality) + markdownlint-cli2 (Markdown) + vue-tsc (typechecking) + Husky/lint-staged (pre-commit hooks).

All changes are inside `portfolio/`.

---

## Step 1: Remove legacy packages

Uninstall packages that are unnecessary with ESLint 9 flat config:

```bash
npm uninstall @rushstack/eslint-patch @vue/eslint-config-standard markdownlint-cli
```

## Step 2: Install new packages

```bash
# ESLint ecosystem
npm install --save-dev @eslint/js globals @vue/eslint-config-prettier

# Formatting
npm install --save-dev prettier

# Markdown linting (replacement)
npm install --save-dev markdownlint-cli2

# Typechecking (gradual, JSDoc-based)
npm install --save-dev typescript vue-tsc @types/node

# Pre-commit hooks
npm install --save-dev husky lint-staged
```

## Step 3: Rewrite `eslint.config.mjs`

- Add `@eslint/js` recommended rules as a base
- Use `globals` package instead of manual global definitions
- Remove formatting rules (`vue/max-attributes-per-line`, `vue/singleline-html-element-content-newline`) — Prettier handles these
- Add `@vue/eslint-config-prettier/skip-formatting` as the last config entry
- Keep `vue/multi-word-component-names: off` (needed for single-word VitePress components)

## Step 4: Create `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf",
  "vueIndentScriptAndStyle": false,
  "singleAttributePerLine": false,
  "overrides": [
    {
      "files": ["*.md"],
      "options": {
        "proseWrap": "preserve",
        "printWidth": 80
      }
    }
  ]
}
```

## Step 5: Create `.prettierignore`

Exclude build output, generated files, and data files:

```
node_modules
.vitepress/dist
.vitepress/cache
.vitepress/theme/seo.js
public/sitemap.xml
public/robots.txt
seo/generated-schemas.json
seo/health-report.json
seo/metrics.json
package-lock.json
```

## Step 6: Create `.markdownlint-cli2.jsonc`

Replace markdownlint-cli with markdownlint-cli2 config:

```jsonc
{
  "config": {
    "default": true,
    "MD033": false,
    "MD024": { "siblings_only": true },
    "MD013": false,
    "MD041": false,
  },
  "ignores": ["node_modules", ".vitepress/dist", ".vitepress/cache"],
}
```

- `MD033: false` — allow inline HTML (needed for Vue components in Markdown)
- `MD013: false` — disable line length (Prettier handles wrapping)
- `MD041: false` — allow frontmatter before first heading

## Step 7: Create `tsconfig.json` for typechecking

Enable `checkJs` so `vue-tsc` can typecheck plain JS files via JSDoc annotations.
Uses `tsconfig.json` (not `jsconfig.json`) because `vue-tsc` expects it.
`skipLibCheck: true` avoids errors in third-party `.d.ts` files.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowJs": true,
    "checkJs": true,
    "noEmit": true,
    "strict": false,
    "jsx": "preserve",
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./.vitepress/*"]
    }
  },
  "include": [".vitepress/**/*.js", ".vitepress/**/*.vue", "scripts/**/*.js"],
  "exclude": ["node_modules", ".vitepress/dist", ".vitepress/cache"]
}
```

## Step 8: Set up Husky + lint-staged

```bash
npx husky init
```

Configure `.husky/pre-commit` to run `npx lint-staged`.

Add `lint-staged` config to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,mjs,cjs,vue}": ["eslint --fix", "prettier --write"],
    "*.md": ["markdownlint-cli2 --fix", "prettier --write"],
    "*.{json,css,yml,yaml}": ["prettier --write"]
  }
}
```

## Step 9: Update npm scripts in `package.json`

```json
{
  "scripts": {
    "docs:dev": "vitepress dev --host",
    "docs:build": "npm run seo:generate && vitepress build",
    "docs:preview": "vitepress preview --host",
    "lint": "npm run lint:js && npm run lint:md",
    "lint:js": "eslint .",
    "lint:md": "markdownlint-cli2 '**/*.md' '#node_modules' '#.vitepress/dist'",
    "lint:fix": "npm run lint:js:fix && npm run lint:md:fix",
    "lint:js:fix": "eslint . --fix",
    "lint:md:fix": "markdownlint-cli2 --fix '**/*.md' '#node_modules' '#.vitepress/dist'",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "vue-tsc --noEmit",
    "seo:generate": "node scripts/generate-seo.js",
    "seo:check": "npm run seo:generate && cat seo/health-report.json",
    "seo:images": "node scripts/seo-image-optimizer.js",
    "seo:monitor": "node scripts/seo-monitor.js",
    "seo:full": "npm run seo:generate && npm run seo:images && npm run seo:monitor",
    "prepare": "cd .. && husky portfolio/.husky"
  }
}
```

Changes:

- `lint:js` — removed `--ext` flag (flat config handles file matching)
- `lint:md` — switched to `markdownlint-cli2` syntax (`#` prefix for ignores)
- Added `format`, `format:check`, `typecheck`, `prepare` scripts
- Removed `test` placeholder script

## Step 10: Run formatting and verify

```bash
npm run format          # format all files with Prettier
npm run lint            # verify linting passes
npm run typecheck       # run typechecking (expect some errors initially — non-blocking)
npm run docs:build      # verify build still works
```

## Step 11: Update `.gitignore`

Add `.eslintcache` to `portfolio/.gitignore` if not already present.

---

## Files Created/Modified

| File                                 | Action                                       |
| ------------------------------------ | -------------------------------------------- |
| `portfolio/eslint.config.mjs`        | Rewrite                                      |
| `portfolio/.prettierrc`              | Create                                       |
| `portfolio/.prettierignore`          | Create                                       |
| `portfolio/.markdownlint-cli2.jsonc` | Create                                       |
| `portfolio/tsconfig.json`            | Create                                       |
| `portfolio/package.json`             | Update scripts, deps, add lint-staged config |
| `portfolio/.husky/pre-commit`        | Create (via `npx husky init`)                |
| `portfolio/.gitignore`               | Minor update                                 |

## Packages Removed

- `@rushstack/eslint-patch`
- `@vue/eslint-config-standard`
- `markdownlint-cli`

## Packages Added

- `@eslint/js`, `globals`, `@vue/eslint-config-prettier`
- `prettier`
- `markdownlint-cli2`
- `typescript`, `vue-tsc`, `@types/node`
- `husky`, `lint-staged`
- `glob` (was missing — required by `scripts/generate-seo.js`)
