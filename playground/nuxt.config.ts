export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  versionChecker: {
    currentVersion: '1.0.0',
    versionUrl: '/version.json',
    intervalMs: 5 * 60 * 1000,
  },
})
