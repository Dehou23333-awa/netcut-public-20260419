<template>
  <main class="shell">
    <header class="topbar">
      <NuxtLink to="/">NetCut</NuxtLink>
      <AuthStatus />
    </header>

    <section class="panel">
      <h1>{{ t('me.title') }}</h1>
      <p v-if="loading">{{ t('me.loading') }}</p>
      <p v-else-if="!items.length" class="muted">{{ t('me.empty') }}</p>
      <ul v-else class="list">
        <li v-for="item in items" :key="item.id" class="list-item">
          <div>
            <NuxtLink :to="`/p/${item.id}`">{{ item.title }}</NuxtLink>
            <p class="muted">{{ item.visibility }} · {{ item.expired ? t('me.expired') : t('me.valid') }}</p>
          </div>
          <button type="button" class="ghost" @click="remove(item.id)">{{ t('me.delete') }}</button>
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
  title: string
  visibility: string
  expired: boolean
}

const { t } = useI18nText()
const loading = ref(true)
const items = ref<Item[]>([])

async function load() {
  loading.value = true
  try {
    const data = await $fetch<{ pastes: Item[] }>('/api/pastes/mine')
    items.value = data.pastes
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
