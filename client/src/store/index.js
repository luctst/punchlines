import Vue from 'vue';
import Vuex from 'vuex';

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
  },
  actions: {
  },
  getters: {
    getJwt(state) {
      return state.usersData ? state.usersData.jwt : false;
    },
    getUserName(state) {
      return state.usersData ? state.usersData.username : false;
    },
  },
});
