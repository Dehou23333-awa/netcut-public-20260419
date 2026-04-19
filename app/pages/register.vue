<template>
  <main class="auth-page">
    <header class="topbar compact">
      <NuxtLink to="/">NetCut</NuxtLink>
      <AuthStatus />
    </header>

    <form class="panel auth-form" @submit.prevent="submit">
      <h1>{{ t('register.title') }}</h1>
      <input v-model="username" :placeholder="t('register.username')" required />
      <input v-model="email" :placeholder="t('register.email')" />
      <input v-model="password" type="password" :placeholder="t('register.password')" required />

      <button type="submit" :disabled="pending">{{ pending ? t('register.submitting') : t('register.submit') }}</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </main>
</template>

<script setup lang="ts">
const { t } = useI18nText()
const username = ref('')
const email = ref('')
const password = ref('')
const pending = ref(false)
const error = ref('')
const { refresh } = useAuthState()

async function submit() {
  pending.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        username: username.value,
        email: email.value || undefined,
        password: password.value
      }
    })
    await refresh()
    await navigateTo('/')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.statusMessage || t('register.fail')
  } finally {
    pending.value = false
  }
}
</script>
