import type { RemoteVersionData } from '../../types'
import { computed, useState } from '#imports'

export const useVersionCheck = () => {
  const data = useState<RemoteVersionData | null>('versionChecker.data')

  return {
    data,
    newVersionAvailable: computed(() => !!data.value?.version),
    latestVersion: computed(() => data.value?.version ?? null),
    changelogUrl: computed(() => data.value?.changelogUrl ?? null),
    forceUpdate: computed(() => data.value?.forceUpdate ?? false),
    releasedAt: computed(() => data.value?.releasedAt ?? null),
  }
}
