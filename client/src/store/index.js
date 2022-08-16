import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    artists: [
      {
        label: 'Kanye West',
        apiUrl: 'https://api.kanye.rest/',
      },
    ],
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
    artistList(state) {
      return state.artists;
    },
  },
});
