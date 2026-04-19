<template>
  <main class="auth-page">
    <header class="topbar compact">
      <NuxtLink to="/">NetCut</NuxtLink>
      <AuthStatus />
    </header>

    <form class="panel auth-form" @submit.prevent="submit">
      <h1>{{ t('login.title') }}</h1>
      <input v-model="identifier" :placeholder="t('login.identifier')" required />
      <input v-model="password" type="password" :placeholder="t('login.password')" required />

      <div class="row">
        <button type="submit" :disabled="pending">{{ pending ? t('login.submitting') : t('login.submit') }}</button>
        <a class="ghost" href="/api/auth/github">{{ t('login.github') }}</a>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </main>
</template>

<script setup lang="ts">
const { t } = useI18nText()
const identifier = ref('')
const password = ref('')
const pending = ref(false)
const error = ref('')
const { refresh } = useAuthState()

async function submit() {
  pending.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        identifier: identifier.value,
        password: password.value
      }
    })
    await refresh()
    await navigateTo('/')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.statusMessage || t('login.fail')
  } finally {
    pending.value = false
  }
}
</script>
