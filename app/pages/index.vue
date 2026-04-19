<template>
  <main class="shell shell-minimal">
    <header class="topbar topbar-minimal">
      <NuxtLink to="/">NetCut</NuxtLink>
      <div class="topbar-actions">
        <button type="button" class="btn-publish" :disabled="submitting" @click="openConfirm">
          {{ submitting ? t('index.submitting') : t('index.submit') }}
        </button>
        <AuthStatus />
      </div>
    </header>

    <div class="hero hero-wysiwyg">
      <MinimalMarkdownInput v-model="contentRawMarkdown" :placeholder="t('paste.contentPlaceholder')" />

      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <dialog ref="confirmDialog" class="confirm-dialog">
      <form method="dialog" class="confirm-body" @submit.prevent="createPaste">
        <h2>{{ t('index.confirmTitle') }}</h2>
        <input v-model="title" :placeholder="t('index.titlePlaceholder')" maxlength="120" required />
        <GlassSelect v-model="visibility" :options="visibilityOptions" :disabled="!isLoggedIn" />
        <p v-if="!isLoggedIn" class="muted">{{ t('index.anonVisibilityHint') }}</p>
        <GlassSelect v-model="expireInHours" :options="expireOptions" />
        <div class="row controls-tight">
          <button type="button" class="ghost" @click="closeConfirm">{{ t('index.cancel') }}</button>
          <button type="submit" :disabled="submitting">
            {{ submitting ? t('index.submitting') : t('index.confirmSubmit') }}
          </button>
        </div>
      </form>
    </dialog>
  </main>
</template>

<script setup lang="ts">
const { refresh, auth } = useAuthState()
const { t } = useI18nText()

const title = ref('')
const contentRawMarkdown = ref('')
const visibility = ref<'public_edit' | 'public_auth_edit' | 'public_read' | 'private'>('public_read')
const expireInHours = ref<number | ''>('')
const submitting = ref(false)
const error = ref('')
const confirmDialog = ref<HTMLDialogElement | null>(null)
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

const expireOptions = computed<Array<{ label: string; value: number | '' }>>(() => [
  { label: t('expiry.never'), value: '' },
  { label: t('expiry.1h'), value: 1 },
  { label: t('expiry.6h'), value: 6 },
  { label: t('expiry.24h'), value: 24 },
  { label: t('expiry.72h'), value: 72 },
  { label: t('expiry.168h'), value: 168 }
])

onMounted(() => {
  refresh()
})

watch(
  () => auth.value.loggedIn,
  (loggedIn) => {
    if (!loggedIn) {
      visibility.value = 'public_read'
    }
  }
)

async function copyRaw() {
  await navigator.clipboard.writeText(contentRawMarkdown.value)
}

function openConfirm() {
  if (!contentRawMarkdown.value.trim()) {
    error.value = t('index.emptyContent')
    return
  }

  error.value = ''
  confirmDialog.value?.showModal()
}

function closeConfirm() {
  confirmDialog.value?.close()
}

async function createPaste() {
  if (!title.value.trim() || !contentRawMarkdown.value.trim()) {
    error.value = t('index.missingTitleOrContent')
    return
  }

  submitting.value = true
  error.value = ''

  try {
    if (!isLoggedIn.value) {
      visibility.value = 'public_read'
    }

    const data = await $fetch<{ paste: { id: string } }>('/api/pastes', {
      method: 'POST',
      body: {
        title: title.value,
        contentRawMarkdown: contentRawMarkdown.value,
        visibility: visibility.value,
        expireInHours: expireInHours.value === '' ? null : Number(expireInHours.value)
      }
    })

    closeConfirm()
    await navigateTo(`/p/${data.paste.id}`)
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.statusMessage || t('index.createFail')
  } finally {
    submitting.value = false
  }
}
</script>
