<template>
  <div class="auth-status">
    <template v-if="pending">{{ t('common.checking') }}</template>
    <template v-else-if="auth.loggedIn">
      <NuxtLink to="/me">@{{ auth.user?.username }}</NuxtLink>
      <button type="button" class="ghost" @click="logout">{{ t('auth.logout') }}</button>
    </template>
    <template v-else>
      <NuxtLink to="/login">{{ t('auth.login') }}</NuxtLink>
      <NuxtLink to="/register">{{ t('auth.register') }}</NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
const { auth, pending, refresh, logout } = useAuthState()
const { t } = useI18nText()

onMounted(() => {
  if (!auth.value.user) {
    refresh()
  }
})
</script>
