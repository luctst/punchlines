import Vue from 'vue';
import Vuex from 'vuex';
import http from '@/utils/http';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    usersData: null,
    lang: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Français',
        code: 'fr',
      },
    ],
  },
  mutations: {
    filledUsersData(state, userData) {
      state.usersData = { ...userData };
    },
  },
  actions: {
    async filledUsersData({ commit }, payload) {
      const newUser = await http.post(`/auth${payload.route}`, payload.userData);
      commit('filledUsersData', newUser.data.userData);
    },
  },
  getters: {
    getJwt(state) {
      return state.usersData ? state.usersData.jwt : false;
    },
    getUserName(state) {
      return state.usersData ? state.usersData.username : false;
    },
    getUserId(state) {
      return state.usersData ? state.usersData._id : false;
    },
  },
});
