# v-ssr-gen

Vue 3 SSR component generator CLI tool. Create Vue SSR components with proper structure in seconds.

## ⚠️ Requirements

- Node.js ≥ 14.0.0
- Vue.js ^3.5.13

## 🚀 Quick Start

```bash
# Using npx (recommended)
npx v-ssr-gen -n myComponent

# Or install globally
npm install -g v-ssr-gen
v-ssr-gen -n myComponent
```

## 📦 Installation

```bash
# Global installation
npm install -g v-ssr-gen

# Local installation
npm install --save-dev v-ssr-gen
```

## 🛠️ Usage

```bash
# Generate TypeScript component (default)
v-ssr-gen -n userProfile

# Generate JavaScript component
v-ssr-gen -n userProfile -l js
```

### Options

| Flag | Alias | Description | Default | Required |
|------|-------|-------------|---------|----------|
| --name | -n | Component name | - | Yes |
| --language | -l | Language (ts/js) | ts | No |

### Examples

```bash
# TypeScript component (default)
v-ssr-gen -n userProfile

# JavaScript component
v-ssr-gen -n userProfile -l js

# With full flags
v-ssr-gen --name userProfile --language ts
```

## 📁 Output Structure

```
user-profile/
├── userProfile.component.[ts|js]  # Component logic
├── userProfile.component.html     # Template
└── userProfile.component.style.html  # Styles
```

## 🎯 Naming Convention

✅ **Valid Names**:
- `userProfile`
- `navigationMenu`
- `dataTable`

❌ **Invalid Names** (automatically converted):
- `user-profile` → `userProfile`
- `UserProfile` → `userProfile`
- `user_profile` → `userProfile`

## 🔍 Vue Compatibility

This generator creates components specifically for Vue 3 (version ^3.5.13) SSR projects. The generated components use Vue 3's composition API and TypeScript by default.

## 📄 License

MIT