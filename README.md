# 📦 nuxt-version-check

A minimal Nuxt 3 module that detects if a new version of your app is available and fetches a remote changelog in Markdown format.

**Headless** – no UI, just reactive composables.

---

## ✨ Features

- ✅ Version polling from `/version.json`
- ✅ Loads Markdown changelog from remote URL
- ✅ Exposes `useVersionCheck()` and `useChangelog()` composables
- ✅ Extensible with `forceUpdate`, `releasedAt`, etc.
- ✅ No dependencies, TypeScript native

---

## 🚀 Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add nuxt-version-check
```

That's it! You can now use nuxt-version-check in your Nuxt app ✨

## 🚀 Configuration

Check or add the module configuration in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['~/modules/nuxt-version-check'],
  versionCheck: {
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

### `useVersionCheck()`

```ts
const {
  newVersionAvailable,
  latestVersion,
  changelogUrl,
  forceUpdate,
  releasedAt,
} = useVersionCheck()
```

### `useChangelog()`

```ts
const {
  changelog,
  loadChangelog,
  seenUrl,
  loadedUrl,
} = useChangelog()

await loadChangelog('/changelog/1.2.4.md')
```

### Example

```ts
const { newVersionAvailable, changelogUrl } = useVersionCheck()
const { changelog, loadChangelog, seenUrl } = useChangelog()

watchEffect(async () => {
  if (
    process.client &&
    newVersionAvailable.value &&
    changelogUrl.value &&
    changelogUrl.value !== seenUrl.value
  ) {
    await loadChangelog(changelogUrl.value)
    // show changelog.value
  }
})
```

---

## 📦 Suggested use cases

- Show update banner when new version is deployed
- Display changelog after page reload
- Force update flow with `forceUpdate: true`

---

## 🛡️ License

MIT
