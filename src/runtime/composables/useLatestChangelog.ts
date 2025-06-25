import { useVersionCheck } from './useVersionCheck'
import { useChangelog } from './useChangelog'
import { computed, watchEffect } from '#imports'

export const useLatestChangelog = () => {
  const { newVersionAvailable, changelogUrl } = useVersionCheck()
  const { changelog, loadChangelog, seenUrl } = useChangelog()

  // Flag to indicate if there's a new unseen changelog
  const hasNewChangelog = computed(() => {
    if (!import.meta.client) return false

    return (
      newVersionAvailable.value
      && changelogUrl.value
      && changelogUrl.value !== seenUrl.value
    )
  })

  // Automatically load the changelog when it's available and unseen
  watchEffect(async () => {
    if (import.meta.client
      && hasNewChangelog.value
      && changelogUrl.value
    ) {
      await loadChangelog(changelogUrl.value)
    }
  })

  return {
    // The latest changelog content
    changelog,

    // Flag indicating if there's a new unseen changelog
    hasNewChangelog,

    // Method to manually load the changelog
    loadChangelog,

    // Additional properties that might be useful
    changelogUrl,
    seenUrl,
  }
}
