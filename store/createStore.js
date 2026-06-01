import * as root from './index'
import * as auth from './auth'
import practices from './practices'
import * as notifications from './notifications'

export function createRootStore () {
  return {
    state: root.state,
    mutations: root.mutations,
    actions: root.actions,
    getters: root.getters,
    modules: {
      auth: {
        namespaced: true,
        state: auth.state,
        getters: auth.getters,
        mutations: auth.mutations,
        actions: auth.actions,
      },
      practices: {
        namespaced: true,
        ...practices,
      },
      notifications: {
        namespaced: true,
        state: notifications.state,
        mutations: notifications.mutations,
        actions: notifications.actions,
      },
    },
  }
}
