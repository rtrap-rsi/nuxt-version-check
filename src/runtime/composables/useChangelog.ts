import { ref } from '#imports'

export const useChangelog = () => {
  const changelog = ref<string | null>(null)
  const loadedUrl = ref<string | null>(null)
  const seenUrl = ref<string | null>(null)

  if (import.meta.client) {
    seenUrl.value = localStorage.getItem('versionChecker.changelogSeen')
  }

  const loadChangelog = async (url: string): Promise<void> => {
    try {
      const text = await $fetch<string>(url, {
        responseType: 'text',
        cache: 'no-store',
        baseURL: '',
      })
      changelog.value = text
      loadedUrl.value = url
      localStorage.setItem('versionChecker.changelogSeen', url)
      seenUrl.value = url
    }
    catch (e) {
      console.warn('[nuxt-version-checker] Errore fetch changelog:', e)
    }
  }

  return {
    changelog,
    loadedUrl,
    seenUrl,
    loadChangelog,
  }
}
