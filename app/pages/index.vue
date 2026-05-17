<template>
  <main class="shell shell-minimal">
    <header class="topbar topbar-minimal">
      <NuxtLink to="/" class="logo">NetCut</NuxtLink>
      <div class="topbar-actions">
        <button type="button" class="btn-publish" :disabled="submitting" @click="openConfirm">
          {{ submitting ? t('index.submitting') : t('index.submit') }}
        </button>
        <AuthStatus />
      </div>
    </header>

    <section class="hero hero-wysiwyg">
      <MinimalMarkdownInput v-model="contentRawMarkdown" :placeholder="t('paste.contentPlaceholder')" />
      <p v-if="error" class="error">{{ error }}</p>
    </section>

    <dialog ref="confirmDialog" class="confirm-dialog">
      <form method="dialog" class="confirm-body" @submit.prevent="createPaste">
        <h2>{{ t('index.confirmTitle') }}</h2>
        <p class="confirm-desc">{{ t('index.confirmDesc') }}</p>

        <label class="field-label" for="paste-slug">{{ t('index.slugLabel') }}</label>
        <input id="paste-slug" v-model="customSlug" :placeholder="t('index.slugPlaceholder')" maxlength="48" />
        <p class="field-hint">{{ t('index.slugHint') }}</p>

        <label class="field-label">{{ t('index.visibilityLabel') }}</label>
        <GlassSelect v-model="visibility" :options="visibilityOptions" :disabled="!isLoggedIn" />
        <p v-if="!isLoggedIn" class="field-hint">{{ t('index.anonVisibilityHint') }}</p>

        <label class="field-label">{{ t('index.expiryLabel') }}</label>
        <GlassSelect v-model="expireInHours" :options="expireOptions" />

        <div class="confirm-actions">
          <button type="button" class="ghost" @click="closeConfirm">{{ t('index.cancel') }}</button>
          <button type="submit" :disabled="submitting" class="btn-primary">
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

const customSlug = ref('')
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
  if (!contentRawMarkdown.value.trim()) {
    error.value = t('index.emptyContent')
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
        customSlug: customSlug.value,
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

<style scoped>
.logo {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.editor-label {
  margin: 0 0 4px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
}

.confirm-desc {
  margin: -8px 0 0;
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.5;
}

.field-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 6px;
}

.field-hint {
  margin: -4px 0 0;
  font-size: 0.8rem;
  color: var(--muted);
  line-height: 1.4;
}

.confirm-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-primary {
  background: var(--accent);
  color: var(--accent-ink);
  border-color: var(--accent);
  font-weight: 600;
}

.btn-primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}
</style>
