export default defineNuxtPlugin(() => {
  const { auth, refresh } = useAuthState()
  const router = useRouter()

  refresh()

  router.afterEach(() => {
    if (auth.value.loggedIn) {
      refresh()
    }
  })
})
