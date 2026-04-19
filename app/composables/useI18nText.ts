type Locale = 'zh' | 'en'

type Dict = Record<string, string>

const messages: Record<Locale, Dict> = {
  zh: {
    'common.checking': '检查中...',
    'lang.zh': '中',
    'lang.en': 'EN',
    'auth.logout': '退出',
    'auth.login': '登录',
    'auth.register': '注册',

    'visibility.public_read': '公开查看',
    'visibility.public_edit': '公开编辑',
    'visibility.public_auth_edit': '公开登录后编辑',
    'visibility.private': '私有',

    'expiry.never': '永不过期',
    'expiry.1h': '1 小时',
    'expiry.6h': '6 小时',
    'expiry.24h': '24 小时',
    'expiry.72h': '72 小时',
    'expiry.168h': '168 小时',
    'expiry.keepCurrent': '保持当前过期时间',
    'expiry.after1h': '1 小时后',
    'expiry.after6h': '6 小时后',
    'expiry.after24h': '24 小时后',
    'expiry.after72h': '72 小时后',
    'expiry.after168h': '168 小时后',
    'expiry.clear': '清除过期时间',

    'index.submit': '提交',
    'index.submitting': '提交中...',
    'index.confirmTitle': '保存确认',
    'index.slugPlaceholder': '自定义链接（可选，如 my-note）',
    'index.slugHint': '访问地址将是 /p/你的链接；仅支持 a-z、0-9、_、-，长度 3-48',
    'index.anonVisibilityHint': '未登录仅可选择公开查看',
    'index.cancel': '取消',
    'index.confirmSubmit': '确认提交',
    'index.emptyContent': '正文不能为空',
    'index.createFail': '创建失败',

    'paste.save': '保存',
    'paste.saving': '保存中...',
    'paste.copy': '复制',
    'paste.contentPlaceholder': '正文内容...',
    'paste.loadFail': '加载失败',
    'paste.saveFail': '保存失败',

    'login.title': '登录',
    'login.identifier': '用户名或邮箱',
    'login.password': '密码',
    'login.submit': '登录',
    'login.submitting': '登录中...',
    'login.github': 'GitHub 登录',
    'login.fail': '登录失败',

    'register.title': '注册',
    'register.username': '用户名（3-24）',
    'register.email': '邮箱（可选）',
    'register.password': '密码（至少8位）',
    'register.submit': '注册并登录',
    'register.submitting': '注册中...',
    'register.fail': '注册失败',

    'me.title': '我的粘贴板',
    'me.loading': '加载中...',
    'me.empty': '还没有内容，去首页创建一个。',
    'me.expired': '已过期',
    'me.valid': '有效',
    'me.delete': '删除'
  },
  en: {
    'common.checking': 'Checking...',
    'lang.zh': 'ZH',
    'lang.en': 'EN',
    'auth.logout': 'Logout',
    'auth.login': 'Login',
    'auth.register': 'Register',

    'visibility.public_read': 'Public Read',
    'visibility.public_edit': 'Public Edit',
    'visibility.public_auth_edit': 'Public Auth Edit',
    'visibility.private': 'Private',

    'expiry.never': 'Never expires',
    'expiry.1h': '1 hour',
    'expiry.6h': '6 hours',
    'expiry.24h': '24 hours',
    'expiry.72h': '72 hours',
    'expiry.168h': '168 hours',
    'expiry.keepCurrent': 'Keep current expiration',
    'expiry.after1h': 'After 1 hour',
    'expiry.after6h': 'After 6 hours',
    'expiry.after24h': 'After 24 hours',
    'expiry.after72h': 'After 72 hours',
    'expiry.after168h': 'After 168 hours',
    'expiry.clear': 'Clear expiration',

    'index.submit': 'Submit',
    'index.submitting': 'Submitting...',
    'index.confirmTitle': 'Confirm Save',
    'index.slugPlaceholder': 'Custom link (optional, e.g. my-note)',
    'index.slugHint': 'Result URL will be /p/your-link; allowed: a-z, 0-9, _ and -, length 3-48',
    'index.anonVisibilityHint': 'Anonymous users can only choose Public Read',
    'index.cancel': 'Cancel',
    'index.confirmSubmit': 'Confirm Submit',
    'index.emptyContent': 'Content cannot be empty',
    'index.createFail': 'Create failed',

    'paste.save': 'Save',
    'paste.saving': 'Saving...',
    'paste.copy': 'Copy',
    'paste.contentPlaceholder': 'Content...',
    'paste.loadFail': 'Load failed',
    'paste.saveFail': 'Save failed',

    'login.title': 'Login',
    'login.identifier': 'Username or email',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.submitting': 'Logging in...',
    'login.github': 'GitHub Login',
    'login.fail': 'Login failed',

    'register.title': 'Register',
    'register.username': 'Username (3-24)',
    'register.email': 'Email (optional)',
    'register.password': 'Password (at least 8 chars)',
    'register.submit': 'Register and login',
    'register.submitting': 'Registering...',
    'register.fail': 'Register failed',

    'me.title': 'My Pastes',
    'me.loading': 'Loading...',
    'me.empty': 'No content yet. Create one from home.',
    'me.expired': 'Expired',
    'me.valid': 'Active',
    'me.delete': 'Delete'
  }
}

export function useI18nText() {
  const langCookie = useCookie<Locale>('netcut_lang', { default: () => 'zh' })
  const locale = useState<Locale>('netcut_locale', () => langCookie.value || 'zh')

  watch(
    locale,
    (next) => {
      langCookie.value = next
    },
    { immediate: true }
  )

  function setLocale(next: Locale) {
    locale.value = next
  }

  function t(key: string) {
    return messages[locale.value]?.[key] || key
  }

  return { locale, setLocale, t }
}
