<template>
  <main class="shell shell-minimal">
    <header class="topbar topbar-minimal">
      <NuxtLink to="/">NetCut</NuxtLink>
      <div class="topbar-actions">
        <button v-if="canEdit" type="button" class="btn-publish" :disabled="saving" @click="save">
          {{ saving ? t('paste.saving') : t('paste.save') }}
        </button>
        <AuthStatus />
      </div>
    </header>

    <div class="hero hero-wysiwyg">
      <div class="content-area">
        <MinimalMarkdownInput v-if="canEdit" v-model="contentRawMarkdown" :placeholder="t('paste.contentPlaceholder')" />
        <VditorReadonlyPreview v-else :markdown="contentRawMarkdown" class="preview-wysiwyg" />
      </div>

      <div v-if="canEdit" class="controls-collapse">
        <GlassSelect v-model="visibility" :options="visibilityOptions" :disabled="!canEdit || !isLoggedIn" />

        <GlassSelect v-model="expireInHours" :options="expireOptions" :disabled="!canEdit" />
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const { auth, refresh } = useAuthState()
const { t } = useI18nText()

const contentRawMarkdown = ref('')
const visibility = ref<'public_edit' | 'public_auth_edit' | 'public_read' | 'private'>('public_read')
const expireInHours = ref<number | '' | 0>('')
const canEdit = ref(false)
const saving = ref(false)
const error = ref('')
const isLoggedIn = computed(() => auth.value.loggedIn)

const visibilityOptions = computed(() => {
  const base: Array<{ label: string; value: 'public_read' | 'public_edit' | 'public_auth_edit' | 'private' }> = [
    { label: t('visibility.public_read'), value: 'public_read' }
  ]

  if (isLoggedIn.value) {
    base.push(
      { label: t('visibility.public_edit'), value: 'public_edit' },
      { label: t('visibility.public_auth_edit'), value: 'public_auth_edit' },
      { label: t('visibility.private'), value: 'private' }
    )
  }

  return base
})

const expireOptions = computed<Array<{ label: string; value: number | '' | 0 }>>(() => [
  { label: t('expiry.keepCurrent'), value: '' },
  { label: t('expiry.after1h'), value: 1 },
  { label: t('expiry.after6h'), value: 6 },
  { label: t('expiry.after24h'), value: 24 },
  { label: t('expiry.after72h'), value: 72 },
  { label: t('expiry.after168h'), value: 168 },
  { label: t('expiry.clear'), value: 0 }
])

useHead(() => ({
  title: route.params.id ? `${String(route.params.id)} - NetCut` : 'NetCut'
}))

async function load() {
  error.value = ''
  try {
    const data = await $fetch<{
      paste: {
        contentRawMarkdown: string
        visibility: 'public_edit' | 'public_auth_edit' | 'public_read' | 'private'
      }
      permissions: {
        canEdit: boolean
      }
    }>(`/api/pastes/${route.params.id}`)

    contentRawMarkdown.value = data.paste.contentRawMarkdown
    visibility.value = data.paste.visibility
    canEdit.value = data.permissions.canEdit
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.statusMessage || t('paste.loadFail')
  }
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    if (!isLoggedIn.value) {
      visibility.value = 'public_read'
    }

    await $fetch(`/api/pastes/${route.params.id}`, {
      method: 'PATCH',
      body: {
        contentRawMarkdown: contentRawMarkdown.value,
        visibility: visibility.value,
        expireInHours:
          expireInHours.value === ''
            ? undefined
            : expireInHours.value === 0
              ? null
              : Number(expireInHours.value)
      }
    })
    await load()
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.statusMessage || t('paste.saveFail')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  refresh()
  load()
})

watch(
  () => auth.value.loggedIn,
  (loggedIn) => {
    if (!loggedIn) {
      visibility.value = 'public_read'
    }
  }
)
</script>
