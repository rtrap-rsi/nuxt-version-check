import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'
import type { RemoteVersionData } from '~/src/types'

describe('useLatestChangelog', () => {
  const mockVersionState = ref<RemoteVersionData | null>(null)
  const mockChangelogState = ref<string | null>(null)
  const mockLoadedUrl = ref<string | null>(null)
  const mockSeenUrl = ref<string | null>(null)

  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString()
      }),
      clear: () => {
        store = {}
      },
    }
  })()

  // Mock $fetch
  const fetchMock = vi.fn()

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks()
    mockVersionState.value = null
    mockChangelogState.value = null
    mockLoadedUrl.value = null
    mockSeenUrl.value = null
    localStorageMock.clear()

    // Mock global objects
    vi.stubGlobal('localStorage', localStorageMock)
    vi.stubGlobal('$fetch', fetchMock)
    vi.stubGlobal('import', { meta: { client: true } })

    // Mock the composables
    vi.doMock('../src/runtime/composables/useVersionCheck', () => ({
      useVersionCheck: vi.fn(() => ({
        newVersionAvailable: computed(() => !!mockVersionState.value?.version),
        latestVersion: computed(() => mockVersionState.value?.version ?? null),
        changelogUrl: computed(() => mockVersionState.value?.changelogUrl ?? null),
        forceUpdate: computed(() => mockVersionState.value?.forceUpdate ?? false),
        releasedAt: computed(() => mockVersionState.value?.releasedAt ?? null),
      })),
    }))

    vi.doMock('../src/runtime/composables/useChangelog', () => ({
      useChangelog: vi.fn(() => ({
        changelog: mockChangelogState,
        loadedUrl: mockLoadedUrl,
        seenUrl: mockSeenUrl,
        loadChangelog: vi.fn(async (url: string) => {
          mockChangelogState.value = 'Mocked changelog content'
          mockLoadedUrl.value = url
          mockSeenUrl.value = url
        }),
      })),
    }))

    // Import is inside the test to ensure mocks are set up first
    vi.doMock('#imports', () => ({
      computed,
      watchEffect: vi.fn(fn => fn()),
    }))
  })

  it('should initialize with correct values', async () => {
    const { useLatestChangelog } = await import('../src/runtime/composables/useLatestChangelog')

    const { hasNewChangelog, changelog } = useLatestChangelog()

    expect(hasNewChangelog.value).toBe(false)
    expect(changelog.value).toBeNull()
  })

  it('should not detect new changelog when URL has been seen', async () => {
    // Set up a mock state with version data
    mockVersionState.value = {
      version: '1.2.3',
      changelogUrl: 'https://example.com/changelog.md',
    }

    // Set the seen URL to match the changelog URL
    mockSeenUrl.value = 'https://example.com/changelog.md'

    const { useLatestChangelog } = await import('../src/runtime/composables/useLatestChangelog')

    const { hasNewChangelog } = useLatestChangelog()

    // Should not detect new changelog because URL has been seen
    expect(hasNewChangelog.value).toBe(false)
  })

  it('should manually load changelog', async () => {
    // Set up a mock state with version data
    mockVersionState.value = {
      version: '1.2.3',
      changelogUrl: 'https://example.com/changelog.md',
    }

    const { useLatestChangelog } = await import('../src/runtime/composables/useLatestChangelog')

    const { loadChangelog, changelog } = useLatestChangelog()

    // Manually load the changelog
    await loadChangelog('https://example.com/custom-changelog.md')

    // Should have loaded the changelog
    expect(changelog.value).toBe('Mocked changelog content')
  })
})
