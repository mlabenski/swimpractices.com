export const state = () => ({
  notifications: []
});

export const mutations = {
  ADD_NOTIFICATION(state, notification) {
    state.notifications.push(notification);
  },
  REMOVE_NOTIFICATION(state, notificationToRemove) {
    state.notifications = state.notifications.filter(
      notification => notification.id !== notificationToRemove.id
    );
  }
};

export const actions = {
  async addNotification({ commit }, {message, type}) {
    commit('ADD_NOTIFICATION', {
      id: new Date().getTime(),
      message,
      type
    });
  },
};
