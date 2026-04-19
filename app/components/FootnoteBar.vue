<template>
  <footer class="footnote-bar" aria-label="site footnote">
    <div class="footnote-inner">
      <div class="footnote-lang" aria-label="language switch">
        <button
          type="button"
          class="ghost footnote-lang-btn"
          :class="{ active: locale === 'zh' }"
          @click="setLocale('zh')"
        >
          {{ t('lang.zh') }}
        </button>
        <button
          type="button"
          class="ghost footnote-lang-btn"
          :class="{ active: locale === 'en' }"
          @click="setLocale('en')"
        >
          {{ t('lang.en') }}
        </button>
      </div>
      <p class="footnote-copy">@2026 NetCut</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { locale, setLocale, t } = useI18nText()
</script>
