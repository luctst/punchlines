<template>
  <section class="home container">
    <loader v-if="showLoader"></loader>
    <header-vue></header-vue>
    <div class="home--sentence">
      <h1>
        {{ sentence }}
        <refresh @click="filledSentence"></refresh>
      </h1>
      <input type="text" autocomplete="false" :placeholder="$t('placeholderLyrics')" />
    </div>
    <footer class="home--footer">
      <div>{{ $t('footerContent', { rapper: selected.label }) }}</div>
      <!-- <v-select :options="artistList" v-model="selected"></v-select> -->
    </footer>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import Loader from '@/components/Lodaer.vue';
import HeaderVue from '@/components/HeaderVue.vue';
import Refresh from '@/assets/svg/refresh.svg';

export default {
  name: 'Home',
  components: {
    Loader,
    HeaderVue,
    Refresh,
  },
  data() {
    return {
      sentence: null,
      selected: this.$store.state.artists[0],
      showLoader: false,
    };
  },
  computed: {
    ...mapGetters(['artistList']),
  },
  async mounted() {
    await this.filledSentence();
  },
  methods: {
    async fetchPunchline() {
      const resFetch = await fetch(this.selected.apiUrl);
      const res = await resFetch.json();
      return res.quote;
    },
    async filledSentence() {
      try {
        this.showLoader = true;
        this.sentence = await this.fetchPunchline();
        this.showLoader = false;
      } catch (error) {
        this.$toasted.error(this.$i18n.t('errorApi'));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/_variables.scss';

@keyframes rotate {
  from {
    transform: rotate(-360deg);
  }

  to {
    transform: rotate(360deg);
  }
}
.home {
  height: 100vh;
  max-height: 100vh;

  &--sentence {
    height: 80vh;
    position: relative;
    align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: column;

    h1 {
      text-align: center;
      margin-bottom: 2rem;

      svg {
        animation: rotate 2s linear infinite alternate forwards;

        &:hover {
          cursor: pointer;
        }
      }
    }

    input {
      border: none;
      outline: none;
      background-color: transparent;
      color: $secondColorContent;
      width: 100%;
      text-align: center;
    }
  }

  &--footer {
    div:first-of-type {
      color: $secondColorContent;
      margin: 0 auto;
    }

    height: 10vh;
    align-items: center;
    display: flex;
    border-top: .5px solid $secondColorContent;
  }
}
</style>
