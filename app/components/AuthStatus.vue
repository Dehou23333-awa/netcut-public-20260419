<template>
  <div class="auth-status">
    <template v-if="pending">
      <span class="auth-status-text muted">{{ t('common.checking') }}</span>
    </template>
    <template v-else-if="auth.loggedIn">
      <NuxtLink v-if="auth.user?.isAdmin" to="/admin" class="auth-link">{{ t('auth.admin') }}</NuxtLink>
      <NuxtLink to="/me" class="auth-link auth-username">@{{ auth.user?.username }}</NuxtLink>
      <button type="button" class="ghost auth-btn" @click="logout">{{ t('auth.logout') }}</button>
    </template>
    <template v-else>
      <NuxtLink to="/login" class="auth-link">{{ t('auth.login') }}</NuxtLink>
      <NuxtLink to="/register" class="auth-link-primary">{{ t('auth.register') }}</NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
const { auth, pending, logout } = useAuthState()
const { t } = useI18nText()
</script>

<style scoped>
.auth-status {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 0.88rem;
}

.auth-status-text {
  font-size: 0.88rem;
}

.auth-link {
  font-size: 0.88rem;
  color: var(--muted);
  transition: color 150ms ease;
}

.auth-link:hover {
  color: var(--ink);
}

.auth-username {
  font-weight: 600;
  color: var(--ink);
}

.auth-link-primary {
  font-size: 0.88rem;
  padding: 6px 14px;
  background: var(--accent);
  color: var(--accent-ink);
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 150ms ease;
}

.auth-link-primary:hover {
  background: var(--accent-hover);
  color: var(--accent-ink);
}

.auth-btn {
  font-size: 0.82rem;
  padding: 4px 10px;
}
</style>
