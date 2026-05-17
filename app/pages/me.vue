<template>
  <main class="shell">
    <header class="topbar">
      <NuxtLink to="/" class="logo">NetCut</NuxtLink>
      <AuthStatus />
    </header>

    <section class="panel">
      <h1>{{ t('me.title') }}</h1>

      <div v-if="loading" class="loading-state">
        <p class="muted">{{ t('me.loading') }}</p>
      </div>

      <div v-else-if="loadError" class="error-state">
        <p class="error">{{ loadError }}</p>
        <button class="ghost" @click="load">{{ t('me.retry') }}</button>
      </div>

      <div v-else-if="!items.length" class="empty-state">
        <p class="empty-title">{{ t('me.emptyTitle') }}</p>
        <p class="muted">{{ t('me.empty') }}</p>
        <NuxtLink to="/" class="btn-primary">{{ t('me.createFirst') }}</NuxtLink>
      </div>

      <ul v-else class="list">
        <li v-for="item in items" :key="item.id" class="list-item">
          <div class="list-item-main">
            <NuxtLink :to="`/p/${item.id}`" class="list-item-link">/p/{{ item.id }}</NuxtLink>
            <div class="list-item-meta">
              <span class="meta-badge">{{ item.visibility }}</span>
              <span class="meta-dot">·</span>
              <span :class="['meta-status', item.expired ? 'expired' : 'active']">
                {{ item.expired ? t('me.expired') : t('me.valid') }}
              </span>
            </div>
          </div>
          <button type="button" class="ghost btn-delete" @click="remove(item.id)">
            {{ t('me.delete') }}
          </button>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: async () => {
    const me = await $fetch<{ loggedIn: boolean }>('/api/auth/me')
    if (!me.loggedIn) {
      return navigateTo('/login')
    }
  }
})

type Item = {
  id: string
  visibility: string
  expired: boolean
}

const { t } = useI18nText()
const loading = ref(true)
const items = ref<Item[]>([])
const loadError = ref('')

async function load() {
  loading.value = true
  loadError.value = ''
  try {
    const data = await $fetch<{ pastes: Item[] }>('/api/pastes/mine')
    items.value = data.pastes
  } catch {
    loadError.value = 'Failed to load pastes'
  } finally {
    loading.value = false
  }
}

async function remove(id: string) {
  await $fetch(`/api/pastes/${id}`, { method: 'DELETE' })
  await load()
}

onMounted(() => {
  load()
})
</script>

<style scoped>
.logo {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.loading-state,
.error-state {
  text-align: center;
  padding: 32px 0;
}

.empty-state {
  text-align: center;
  padding: 48px 16px;
}

.empty-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--ink);
}

.list-item-main {
  min-width: 0;
  flex: 1;
}

.list-item-link {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  word-break: break-all;
}

.list-item-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 0.8rem;
  color: var(--muted);
}

.meta-badge {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.meta-dot {
  color: var(--line);
}

.meta-status.active {
  color: var(--success);
  font-weight: 500;
}

.meta-status.expired {
  color: var(--danger);
  font-weight: 500;
}

.btn-delete {
  flex-shrink: 0;
}

.btn-primary {
  display: inline-block;
  padding: 10px 20px;
  background: var(--accent);
  color: var(--accent-ink);
  border: 1px solid var(--accent);
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 150ms ease;
  margin-top: 16px;
}

.btn-primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  color: var(--accent-ink);
}
</style>
