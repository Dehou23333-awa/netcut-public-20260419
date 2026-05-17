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
    'auth.admin': '管理',

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

    'index.submit': '发布',
    'index.submitting': '发布中...',
    'index.confirmTitle': '发布粘贴',
    'index.confirmDesc': '设置可见范围和过期时间，然后发布你的内容。',
    'index.slugLabel': '自定义链接',
    'index.slugPlaceholder': '可选，如 my-note',
    'index.slugHint': '访问地址将为 /p/你的链接；仅支持 a-z、0-9、_、-，长度 3-48',
    'index.visibilityLabel': '可见范围',
    'index.expiryLabel': '过期时间',
    'index.anonVisibilityHint': '未登录仅可选择公开查看',
    'index.cancel': '取消',
    'index.confirmSubmit': '确认发布',
    'index.emptyContent': '正文不能为空',
    'index.createFail': '创建失败',
    'index.newPasteHeading': '新建粘贴',

    'paste.save': '保存',
    'paste.saving': '保存中...',
    'paste.copy': '复制',
    'paste.contentPlaceholder': '正文内容...',
    'paste.loadFail': '加载失败',
    'paste.saveFail': '保存失败',
    'paste.newPaste': '创建新粘贴',

    'login.title': '登录',
    'login.subtitle': '登录以管理你的粘贴内容。',
    'login.identifierLabel': '账号',
    'login.identifierPlaceholder': '用户名或邮箱',
    'login.passwordLabel': '密码',
    'login.passwordPlaceholder': '输入密码',
    'login.submit': '登录',
    'login.submitting': '登录中...',
    'login.github': 'GitHub 登录',
    'login.fail': '登录失败',
    'login.noAccount': '还没有账号？',
    'login.goRegister': '注册',

    'register.title': '注册',
    'register.subtitle': '创建账号以管理你的粘贴内容。',
    'register.usernameLabel': '用户名',
    'register.usernamePlaceholder': '3-24 个字符',
    'register.emailLabel': '邮箱',
    'register.emailPlaceholder': '可选',
    'register.passwordLabel': '密码',
    'register.passwordPlaceholder': '至少 8 个字符',
    'register.submit': '注册并登录',
    'register.submitting': '注册中...',
    'register.fail': '注册失败',
    'register.hasAccount': '已有账号？',
    'register.goLogin': '登录',

    'me.title': '我的粘贴板',
    'me.loading': '加载中...',
    'me.emptyTitle': '还没有内容',
    'me.empty': '去首页创建你的第一个粘贴。',
    'me.createFirst': '创建粘贴',
    'me.retry': '重试',
    'me.expired': '已过期',
    'me.valid': '有效',
    'me.delete': '删除',

    'admin.title': '管理面板',
    'admin.pastes': '粘贴管理',
    'admin.users': '用户管理',
    'admin.loading': '加载中...',
    'admin.owner': '所有者',
    'admin.visibility': '可见性',
    'admin.expired': '已过期',
    'admin.anonymous': '匿名',
    'admin.pasteCount': '粘贴数',
    'admin.delete': '删除',
    'admin.confirm': '确认删除？'

  },
  en: {
    'common.checking': 'Checking...',
    'lang.zh': 'ZH',
    'lang.en': 'EN',
    'auth.logout': 'Logout',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.admin': 'Admin',

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

    'index.submit': 'Publish',
    'index.submitting': 'Publishing...',
    'index.confirmTitle': 'Publish Paste',
    'index.confirmDesc': 'Set visibility and expiration, then publish your content.',
    'index.slugLabel': 'Custom link',
    'index.slugPlaceholder': 'Optional, e.g. my-note',
    'index.slugHint': 'The URL will be /p/your-link; allowed: a-z, 0-9, _ and -, length 3-48',
    'index.visibilityLabel': 'Visibility',
    'index.expiryLabel': 'Expiration',
    'index.anonVisibilityHint': 'Anonymous users can only choose Public Read',
    'index.cancel': 'Cancel',
    'index.confirmSubmit': 'Confirm Publish',
    'index.emptyContent': 'Content cannot be empty',
    'index.createFail': 'Create failed',
    'index.newPasteHeading': 'New Paste',

    'paste.save': 'Save',
    'paste.saving': 'Saving...',
    'paste.copy': 'Copy',
    'paste.contentPlaceholder': 'Content...',
    'paste.loadFail': 'Load failed',
    'paste.saveFail': 'Save failed',
    'paste.newPaste': 'Create new paste',

    'login.title': 'Login',
    'login.subtitle': 'Sign in to manage your pastes.',
    'login.identifierLabel': 'Account',
    'login.identifierPlaceholder': 'Username or email',
    'login.passwordLabel': 'Password',
    'login.passwordPlaceholder': 'Enter password',
    'login.submit': 'Login',
    'login.submitting': 'Logging in...',
    'login.github': 'GitHub Login',
    'login.fail': 'Login failed',
    'login.noAccount': 'Don\'t have an account?',
    'login.goRegister': 'Register',

    'register.title': 'Register',
    'register.subtitle': 'Create an account to manage your pastes.',
    'register.usernameLabel': 'Username',
    'register.usernamePlaceholder': '3-24 characters',
    'register.emailLabel': 'Email',
    'register.emailPlaceholder': 'Optional',
    'register.passwordLabel': 'Password',
    'register.passwordPlaceholder': 'At least 8 characters',
    'register.submit': 'Register and login',
    'register.submitting': 'Registering...',
    'register.fail': 'Register failed',
    'register.hasAccount': 'Already have an account?',
    'register.goLogin': 'Login',

    'me.title': 'My Pastes',
    'me.loading': 'Loading...',
    'me.emptyTitle': 'No pastes yet',
    'me.empty': 'Create your first paste from the home page.',
    'me.createFirst': 'Create a paste',
    'me.retry': 'Retry',
    'me.expired': 'Expired',
    'me.valid': 'Active',
    'me.delete': 'Delete',

    'admin.title': 'Admin Panel',
    'admin.pastes': 'Manage Pastes',
    'admin.users': 'Manage Users',
    'admin.loading': 'Loading...',
    'admin.owner': 'Owner',
    'admin.visibility': 'Visibility',
    'admin.expired': 'Expired',
    'admin.anonymous': 'Anonymous',
    'admin.pasteCount': 'Pastes',
    'admin.delete': 'Delete',
    'admin.confirm': 'Confirm delete?'

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
