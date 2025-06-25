import type { RemoteVersionData } from '../types'
import { defineNuxtPlugin, useRuntimeConfig, useState } from '#app'

export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig().public.versionCheck
  const currentVersion = config.currentVersion || 'dev'

  const state = useState<RemoteVersionData | null>('versionCheck.data', () => null)

  const checkVersion = async () => {
    try {
      const data = await $fetch<RemoteVersionData>(config.versionUrl, {
        cache: 'no-store',
      })

      if (data.version && data.version !== currentVersion) {
        state.value = data
        localStorage.setItem('versionCheck.latestVersion', data.version)
      }
    }
    catch (err) {
      console.warn('[nuxt-version-check] Errore fetch versione:', err)
    }
  }

  checkVersion()
  setInterval(checkVersion, config.intervalMs)
})
