<template>
  <div class="container">
    <h1>Nuxt Version Checker Module Playground</h1>

    <div
      v-if="hasNewChangelog || (latestVersion && latestVersion !== currentVersion)"
      class="update-banner"
    >
      <h2>New Version Available: {{ latestVersion }}</h2>
      <p
        v-if="forceUpdate"
        class="force-update"
      >
        This update is required!
      </p>
      <p v-if="releasedAt">
        Released on: {{ new Date(releasedAt).toLocaleString() }}
      </p>

      <div
        v-if="changelog"
        class="changelog"
      >
        <h3>Changelog:</h3>
        <div v-html="renderedChangelog" />
      </div>

      <button @click="loadChangelogManually">
        Load Changelog
      </button>
    </div>

    <div
      v-else
      class="current-version"
    >
      <p>You are using the latest version: {{ currentVersion }}</p>
    </div>

    <div class="debug-info">
      <h3>Debug Information:</h3>
      <pre>hasNewChangelog: {{ hasNewChangelog }}</pre>
      <pre>latestVersion: {{ latestVersion }}</pre>
      <pre>changelogUrl: {{ changelogUrl }}</pre>
      <pre>forceUpdate: {{ forceUpdate }}</pre>
      <pre>releasedAt: {{ releasedAt }}</pre>
      <pre>seenUrl: {{ seenUrl }}</pre>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Get the current version from the module configuration
const currentVersion = '1.0.0'

// Use the new composable from the module
const {
  changelog,
  hasNewChangelog,
  loadChangelog,
  changelogUrl,
  seenUrl,
} = useLatestChangelog()

// For additional information, we can still use useVersionCheck
const {
  latestVersion,
  forceUpdate,
  releasedAt,
} = useVersionCheck()

// Convert markdown to HTML (simple implementation)
const renderedChangelog = computed(() => {
  if (!changelog.value) return ''

  // This is a very basic markdown renderer
  // In a real app, you would use a proper markdown library
  return changelog.value
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*)\*/g, '<em>$1</em>')
    .replace(/- (.*)/g, '<li>$1</li>')
    .replace(/\n/g, '<br>')
})

// Function to manually load the changelog
const loadChangelogManually = async () => {
  if (changelogUrl.value) {
    await loadChangelog(changelogUrl.value)
  }
}
</script>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.update-banner {
  background-color: #f0f8ff;
  border: 1px solid #add8e6;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
}

.force-update {
  color: red;
  font-weight: bold;
}

.changelog {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin: 15px 0;
}

.debug-info {
  margin-top: 30px;
  padding: 15px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
