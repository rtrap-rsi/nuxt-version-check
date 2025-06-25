import type { RemoteVersionData } from '../types'
import { defineNuxtPlugin, useRuntimeConfig, useState } from '#app'

export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig().public.versionChecker

  const state = useState<RemoteVersionData | null>('versionChecker.data', () => null)

  const checkVersion = async () => {
    try {
      const data = await $fetch<RemoteVersionData>(config.versionUrl, {
        cache: 'no-store',
      })

      const latestVersion = localStorage.getItem('versionChecker.latestVersion')

      if (data.version && (!latestVersion || data.version !== latestVersion)) {
        state.value = data
        localStorage.setItem('versionChecker.latestVersion', data.version)
      }
    }
    catch (err) {
      console.warn('[nuxt-version-checker] Errore fetch versione:', err)
    }
  }

  checkVersion()
  setInterval(checkVersion, config.intervalMs)
})
