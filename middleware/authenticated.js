export default function ({ store, route, redirect }) {
  if (!store.getters.isAuthenticated) {
    redirect('/signin')
  }
}
