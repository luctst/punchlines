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
    updateJwt(state, newJwt) {
      state.usersData.jwt = newJwt;
    },
    resetUserData(state) {
      state.usersData = null;
    },
  },
  actions: {
    async callApiAuth({ commit, state }, payload) {
      let res;
      const methodLowerCase = payload.method.toLowerCase();
      const skipAuth = Object.prototype.hasOwnProperty.call(payload, 'skipAuth') ? payload.skipAuth : false;
      const headers = {};

      if (!skipAuth) {
        headers.headers = {
          Authorization: `Bearer ${state.usersData.jwt}`,
        };
      }

      if (methodLowerCase !== 'get' && methodLowerCase !== 'delete') {
        res = await http[methodLowerCase](payload.route, { ...payload.body }, { ...headers });
      } else {
        res = await http[methodLowerCase](payload.route, { ...headers });
      }

      if (res.data.token) commit('updateJwt', res.data.token);
      return res.data;
    },
    async filledUsersData({ commit }, payload) {
      const newUser = await http.post(`/auth${payload.route}`, payload.userData);
      commit('filledUsersData', newUser.data.userData);
    },
    async refreshSession({ commit }) {
      const res = await http.get('/auth/refresh_token');
      commit('filledUsersData', res.data.userData);
    },
  },
  getters: {
    isConnected(state) {
      return state.usersData !== null;
    },
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
