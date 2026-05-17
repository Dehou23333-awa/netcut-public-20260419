<template>
  <main class="auth-page">
    <header class="topbar compact">
      <NuxtLink to="/" class="logo">NetCut</NuxtLink>
      <AuthStatus />
    </header>

    <form class="panel auth-form" @submit.prevent="submit">
      <h1>{{ t('register.title') }}</h1>
      <p class="auth-subtitle">{{ t('register.subtitle') }}</p>

      <label class="field-label" for="reg-username">{{ t('register.usernameLabel') }}</label>
      <input id="reg-username" v-model="username" :placeholder="t('register.usernamePlaceholder')" required autocomplete="username" />

      <label class="field-label" for="reg-email">{{ t('register.emailLabel') }}</label>
      <input id="reg-email" v-model="email" type="email" :placeholder="t('register.emailPlaceholder')" autocomplete="email" />

      <label class="field-label" for="reg-pw">{{ t('register.passwordLabel') }}</label>
      <input id="reg-pw" v-model="password" type="password" :placeholder="t('register.passwordPlaceholder')" required autocomplete="new-password" />

      <button type="submit" :disabled="pending" class="btn-primary">
        {{ pending ? t('register.submitting') : t('register.submit') }}
      </button>

      <p class="auth-link">{{ t('register.hasAccount') }} <NuxtLink to="/login">{{ t('register.goLogin') }}</NuxtLink></p>
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

<style scoped>
.logo {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.auth-subtitle {
  margin: -8px 0 4px;
  font-size: 0.95rem;
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

.btn-primary {
  background: var(--accent);
  color: var(--accent-ink);
  border-color: var(--accent);
  font-weight: 600;
  margin-top: 4px;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.auth-link {
  margin: 0;
  font-size: 0.88rem;
  color: var(--muted);
  text-align: center;
}

.auth-link a {
  color: var(--accent);
  font-weight: 600;
}

.auth-link a:hover {
  color: var(--accent-hover);
}
</style>
