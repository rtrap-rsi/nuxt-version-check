import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

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

describe('useChangelog', () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks()
    localStorageMock.clear()

    // Mock global objects
    vi.stubGlobal('localStorage', localStorageMock)
    vi.stubGlobal('$fetch', fetchMock)

    // Mock import.meta.client
    vi.stubGlobal('import', { meta: { client: true } })

    // Import is inside the test to ensure mocks are set up first
    vi.doMock('#imports', () => ({
      ref,
    }))
  })

  it('should initialize with null values', async () => {
    const { useChangelog } = await import('../src/runtime/composables/useChangelog')

    const { changelog, loadedUrl, seenUrl } = useChangelog()

    expect(changelog.value).toBeNull()
    expect(loadedUrl.value).toBeNull()
    expect(seenUrl.value).toBeNull()
  })

  it('should set seenUrl when provided', async () => {
    const { useChangelog } = await import('../src/runtime/composables/useChangelog')

    const { seenUrl, loadChangelog } = useChangelog()

    // Initially seenUrl should be null
    expect(seenUrl.value).toBeNull()

    // After loading a changelog, the seenUrl should be updated
    const url = 'https://example.com/changelog.md'
    await loadChangelog(url)

    expect(seenUrl.value).toBe(url)
  })

  it('should load changelog from URL', async () => {
    // Set up fetch mock to return a Markdown string
    const mockMarkdown = '# Changelog\n\n## v1.0.0\n\n- Initial release'
    fetchMock.mockResolvedValueOnce(mockMarkdown)

    const { useChangelog } = await import('../src/runtime/composables/useChangelog')

    const { changelog, loadedUrl, seenUrl, loadChangelog } = useChangelog()

    // Load the changelog
    const url = 'https://example.com/changelog.md'
    await loadChangelog(url)

    // Verify fetch was called correctly
    expect(fetchMock).toHaveBeenCalledWith(url, {
      responseType: 'text',
      cache: 'no-store',
      baseURL: '',
    })

    // Verify the state was updated
    expect(changelog.value).toBe(mockMarkdown)
    expect(loadedUrl.value).toBe(url)
    expect(seenUrl.value).toBe(url)

    // Verify localStorage was updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith('versionChecker.changelogSeen', url)
  })

  it('should handle fetch errors gracefully', async () => {
    // Set up fetch mock to throw an error
    fetchMock.mockRejectedValueOnce(new Error('Network error'))
    console.warn = vi.fn()

    const { useChangelog } = await import('../src/runtime/composables/useChangelog')

    const { changelog, loadedUrl, loadChangelog } = useChangelog()

    // Load the changelog
    const url = 'https://example.com/changelog.md'
    await loadChangelog(url)

    // Verify fetch was called
    expect(fetchMock).toHaveBeenCalled()

    // Verify the state was not updated
    expect(changelog.value).toBeNull()
    expect(loadedUrl.value).toBeNull()

    // Verify error was logged
    expect(console.warn).toHaveBeenCalled()
  })
})
