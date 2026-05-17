<template>
  <main class="auth-page">
    <header class="topbar compact">
      <NuxtLink to="/" class="logo">NetCut</NuxtLink>
      <AuthStatus />
    </header>

    <form class="panel auth-form" @submit.prevent="submit">
      <h1>{{ t('login.title') }}</h1>
      <p class="auth-subtitle">{{ t('login.subtitle') }}</p>

      <label class="field-label" for="login-id">{{ t('login.identifierLabel') }}</label>
      <input id="login-id" v-model="identifier" :placeholder="t('login.identifierPlaceholder')" required autocomplete="username" />

      <label class="field-label" for="login-pw">{{ t('login.passwordLabel') }}</label>
      <input id="login-pw" v-model="password" type="password" :placeholder="t('login.passwordPlaceholder')" required autocomplete="current-password" />

      <div class="auth-actions">
        <button type="submit" :disabled="pending" class="btn-primary">
          {{ pending ? t('login.submitting') : t('login.submit') }}
        </button>
        <a class="ghost" href="/api/auth/github">{{ t('login.github') }}</a>
      </div>

      <p class="auth-link">{{ t('login.noAccount') }} <NuxtLink to="/register">{{ t('login.goRegister') }}</NuxtLink></p>
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

.auth-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 4px;
}

.btn-primary {
  background: var(--accent);
  color: var(--accent-ink);
  border-color: var(--accent);
  font-weight: 600;
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
