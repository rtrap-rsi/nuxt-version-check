import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
  currentVersion: string
  versionUrl: string
  intervalMs: number
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-version-checker',
    configKey: 'versionChecker',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    currentVersion: '',
    versionUrl: '/version.json',
    intervalMs: 5 * 60 * 1000, // 5 minutes
  },
  setup(options, nuxt) {
    nuxt.options.runtimeConfig.public.versionChecker = options

    const resolver = createResolver(import.meta.url)
    addPlugin(resolver.resolve('./runtime/plugin.client'))
    addImportsDir(resolver.resolve('./runtime/composables'))
  },
})
