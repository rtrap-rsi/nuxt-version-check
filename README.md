# 📦 nuxt-version-checker

A minimal Nuxt 3 module that detects if a new version of your app is available and fetches a remote changelog in Markdown format.

**Headless** – no UI, just reactive composables.

---

## ✨ Features

- ✅ Version polling from `/version.json`
- ✅ Loads Markdown changelog from remote URL
- ✅ Exposes `useLatestChangelog()` composable for easy version checking and changelog loading
- ✅ Extensible with `forceUpdate`, `releasedAt`, etc.
- ✅ No dependencies, TypeScript native

---

## 🚀 Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add nuxt-version-checker
```

That's it! You can now use nuxt-version-check in your Nuxt app ✨

## 🚀 Configuration

Check or add the module configuration in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['~/modules/nuxt-version-checker'],
  versionChecker: {
    currentVersion: '1.2.3',
    versionUrl: '/version.json',
    intervalMs: 5 * 60 * 1000,
  },
})
```

---

## 📄 `version.json` Format

```json
{
  "version": "1.2.4",
  "changelogUrl": "/changelog/1.2.4.md",
  "forceUpdate": false,
  "releasedAt": "2025-06-25T08:00:00Z"
}
```

| Field         | Type    | Description |
|---------------|---------|-------------|
| `version`     | string  | Required. New version string |
| `changelogUrl`| string  | Optional. URL to Markdown changelog |
| `forceUpdate` | boolean | Optional. Set to `true` to enforce update |
| `releasedAt`  | string  | Optional. ISO date string |

---

## 🧠 Usage

### `useLatestChangelog()`

```ts
const {
  changelog,
  hasNewChangelog,
  loadChangelog,
  changelogUrl,
  seenUrl,
} = useLatestChangelog()
```

The `useLatestChangelog()` composable automatically:
- Detects when a new version is available
- Checks if the user has seen the latest changelog
- Loads the changelog content when a new unseen version is detected

### Example

```ts
const { changelog, hasNewChangelog } = useLatestChangelog()

// The changelog is automatically loaded when a new version is available
// and the user hasn't seen it yet

// You can use the hasNewChangelog flag to show a notification
watchEffect(() => {
  if (hasNewChangelog.value) {
    // Show notification or modal with changelog.value
  }
})
```

### Advanced Usage

The original composables are still available if you need more control:

#### `useVersionCheck()`

```ts
const {
  newVersionAvailable,
  latestVersion,
  changelogUrl,
  forceUpdate,
  releasedAt,
} = useVersionCheck()
```

#### `useChangelog()`

```ts
const {
  changelog,
  loadChangelog,
  seenUrl,
  loadedUrl,
} = useChangelog()

await loadChangelog('/changelog/1.2.4.md')
```

---

## 📦 Suggested use cases

- Show update banner when new version is deployed
- Display changelog after page reload
- Force update flow with `forceUpdate: true`

---

## 🛡️ License

MIT
