<template>
  <main class="shell">
    <header class="topbar">
      <NuxtLink to="/" class="logo">NetCut</NuxtLink>
      <AuthStatus />
    </header>

    <section class="panel">
      <h1>{{ t('admin.title') }}</h1>

      <div class="tabs">
        <button
          type="button"
          :class="{ active: tab === 'pastes' }"
          @click="tab = 'pastes'"
        >
          {{ t('admin.pastes') }}
        </button>
        <button
          type="button"
          :class="{ active: tab === 'users' }"
          @click="tab = 'users'"
        >
          {{ t('admin.users') }}
        </button>
      </div>

      <template v-if="tab === 'pastes'">
        <div v-if="loadingPastes" class="panel-state">
          <p class="muted">{{ t('admin.loading') }}</p>
        </div>
        <div v-else-if="pastesError" class="panel-state">
          <p class="error">{{ pastesError }}</p>
          <button class="ghost" @click="loadPastes">{{ t('me.retry') }}</button>
        </div>
        <div v-else-if="!pastes.length" class="panel-state">
          <p class="muted">No pastes found.</p>
        </div>
        <ul v-else class="list">
          <li v-for="item in pastes" :key="item.id" class="list-item">
            <div class="list-item-main">
              <NuxtLink :to="`/p/${item.id}`" class="list-item-link">/p/{{ item.id }}</NuxtLink>
              <div class="list-item-meta">
                <span>{{ t('admin.owner') }}: {{ item.ownerName || t('admin.anonymous') }}</span>
                <span class="meta-dot">·</span>
                <span>{{ item.visibility }}</span>
                <span class="meta-dot">·</span>
                <span :class="item.expired ? 'meta-expired' : 'meta-active'">
                  {{ item.expired ? t('admin.expired') : 'Active' }}
                </span>
              </div>
            </div>
            <button type="button" class="ghost btn-delete" @click="deletePaste(item.id)">
              {{ deletePasteIds.has(item.id) ? '...' : t('admin.delete') }}
            </button>
          </li>
        </ul>
      </template>

      <template v-if="tab === 'users'">
        <div v-if="loadingUsers" class="panel-state">
          <p class="muted">{{ t('admin.loading') }}</p>
        </div>
        <div v-else-if="usersError" class="panel-state">
          <p class="error">{{ usersError }}</p>
          <button class="ghost" @click="loadUsers">{{ t('me.retry') }}</button>
        </div>
        <div v-else-if="!users.length" class="panel-state">
          <p class="muted">No users found.</p>
        </div>
        <ul v-else class="list">
          <li v-for="user in users" :key="user.id" class="list-item">
            <div class="list-item-main">
              <div class="user-row">
                <span class="user-name">{{ user.username }}</span>
                <span v-if="user.isAdmin" class="badge">Admin</span>
              </div>
              <div class="list-item-meta">
                <span>{{ user.email || 'No email' }}</span>
                <span class="meta-dot">·</span>
                <span>{{ t('admin.pasteCount') }}: {{ user.pasteCount }}</span>
              </div>
            </div>
            <button
              type="button"
              class="ghost btn-delete"
              :disabled="user.id === currentUserId"
              @click="deleteUser(user.id)"
            >
              {{ deleteUserIds.has(user.id) ? '...' : t('admin.delete') }}
            </button>
          </li>
        </ul>
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: async () => {
    const me = await $fetch<{ loggedIn: boolean; user: { isAdmin: boolean } | null }>('/api/auth/me')
    if (!me.loggedIn) {
      return navigateTo('/login')
    }
    if (!me.user?.isAdmin) {
      return navigateTo('/')
    }
    return true
  }
})

type PasteItem = {
  id: string
  visibility: string
  expired: boolean
  ownerName: string | null
  updatedAt: string
}

type UserItem = {
  id: string
  username: string
  email: string | null
  isAdmin: boolean
  pasteCount: number
}

const { t } = useI18nText()
const { auth } = useAuthState()
const currentUserId = computed(() => auth.value.user?.id)

const tab = ref<'pastes' | 'users'>('pastes')

const loadingPastes = ref(true)
const pastes = ref<PasteItem[]>([])
const pastesError = ref('')
const deletePasteIds = ref(new Set<string>())

const loadingUsers = ref(true)
const users = ref<UserItem[]>([])
const usersError = ref('')
const deleteUserIds = ref(new Set<string>())

async function loadPastes() {
  loadingPastes.value = true
  pastesError.value = ''
  try {
    const data = await $fetch<{ pastes: PasteItem[] }>('/api/admin/pastes')
    pastes.value = data.pastes
  } catch {
    pastesError.value = 'Failed to load pastes'
  } finally {
    loadingPastes.value = false
  }
}

async function loadUsers() {
  loadingUsers.value = true
  usersError.value = ''
  try {
    const data = await $fetch<{ users: UserItem[] }>('/api/admin/users')
    users.value = data.users
  } catch {
    usersError.value = 'Failed to load users'
  } finally {
    loadingUsers.value = false
  }
}

async function deletePaste(id: string) {
  if (!confirm(t('admin.confirm'))) return
  deletePasteIds.value.add(id)
  try {
    await $fetch(`/api/admin/pastes/${id}`, { method: 'DELETE' })
    pastes.value = pastes.value.filter((p) => p.id !== id)
  } catch {
    // ignore
  } finally {
    deletePasteIds.value.delete(id)
  }
}

async function deleteUser(id: string) {
  if (!confirm(t('admin.confirm'))) return
  deleteUserIds.value.add(id)
  try {
    await $fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    users.value = users.value.filter((u) => u.id !== id)
  } catch {
    // ignore
  } finally {
    deleteUserIds.value.delete(id)
  }
}

onMounted(() => {
  loadPastes()
  loadUsers()
})
</script>

<style scoped>
.logo {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.tabs button {
  padding: 8px 16px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--muted);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 150ms ease;
  box-shadow: none;
}
.tabs button:hover {
  border-color: var(--ink);
  color: var(--ink);
}
.tabs button.active {
  background: var(--ink);
  color: var(--bg);
  border-color: var(--ink);
  box-shadow: none;
}

.panel-state {
  text-align: center;
  padding: 32px 0;
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
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
  font-size: 0.8rem;
  color: var(--muted);
}

.meta-dot {
  color: var(--line);
}

.meta-active {
  color: var(--success);
  font-weight: 500;
}

.meta-expired {
  color: var(--danger);
  font-weight: 500;
}

.btn-delete {
  flex-shrink: 0;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-weight: 600;
  font-size: 1rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 6px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
</style>
