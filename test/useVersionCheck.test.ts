import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'
import type { RemoteVersionData } from '~/src/types'

describe('useVersionCheck', () => {
  const mockState = ref<RemoteVersionData | null>(null)

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks()
    mockState.value = null

    // Mock useState to return our controlled state
    vi.doMock('#imports', () => ({
      computed,
      useState: vi.fn(() => mockState),
    }))
  })

  it('should initialize with null values', async () => {
    const { useVersionCheck } = await import('../src/runtime/composables/useVersionCheck')

    const {
      newVersionAvailable,
      latestVersion,
      changelogUrl,
      forceUpdate,
      releasedAt,
    } = useVersionCheck()

    expect(newVersionAvailable.value).toBe(false)
    expect(latestVersion.value).toBeNull()
    expect(changelogUrl.value).toBeNull()
    expect(forceUpdate.value).toBe(false)
    expect(releasedAt.value).toBeNull()
  })

  it('should return version data when available', async () => {
    // Set up a mock state with version data
    mockState.value = {
      version: '1.2.3',
      changelogUrl: 'https://example.com/changelog.md',
      forceUpdate: true,
      releasedAt: '2023-01-01T00:00:00Z',
    }

    const { useVersionCheck } = await import('../src/runtime/composables/useVersionCheck')

    const {
      newVersionAvailable,
      latestVersion,
      changelogUrl,
      forceUpdate,
      releasedAt,
    } = useVersionCheck()

    expect(newVersionAvailable.value).toBe(true)
    expect(latestVersion.value).toBe('1.2.3')
    expect(changelogUrl.value).toBe('https://example.com/changelog.md')
    expect(forceUpdate.value).toBe(true)
    expect(releasedAt.value).toBe('2023-01-01T00:00:00Z')
  })

  it('should handle partial version data', async () => {
    // Set up a mock state with partial version data
    mockState.value = {
      version: '1.2.3',
      // No changelogUrl, forceUpdate, or releasedAt
    }

    const { useVersionCheck } = await import('../src/runtime/composables/useVersionCheck')

    const {
      newVersionAvailable,
      latestVersion,
      changelogUrl,
      forceUpdate,
      releasedAt,
    } = useVersionCheck()

    expect(newVersionAvailable.value).toBe(true)
    expect(latestVersion.value).toBe('1.2.3')
    expect(changelogUrl.value).toBeNull()
    expect(forceUpdate.value).toBe(false)
    expect(releasedAt.value).toBeNull()
  })

  it('should expose the raw data', async () => {
    // Set up a mock state with version data
    const versionData: RemoteVersionData = {
      version: '1.2.3',
      changelogUrl: 'https://example.com/changelog.md',
    }
    mockState.value = versionData

    const { useVersionCheck } = await import('../src/runtime/composables/useVersionCheck')

    const { data } = useVersionCheck()

    expect(data.value).toEqual(versionData)
  })
})
