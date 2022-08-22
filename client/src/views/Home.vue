<template>
  <section class="home container">
    <loader v-if="showLoader"></loader>
    <header-vue></header-vue>
    <div class="home--sentence">
      <figure>
        <h1>{{ displayQuote }}</h1>
        <figcaption>{{ displayArtist }}</figcaption>
        <div @click.prevent="filledSentence">{{ $t('refreshSentence') }}</div>
      </figure>
    </div>
    <footer class="home--footer">
      <input
      @keyup.enter="submitPunchline"
      type="text"
      autocomplete="false"
      :placeholder="$t('placeholderLyrics')" />
    </footer>
  </section>
</template>

<script>
import http from '@/utils/http';
import Loader from '@/components/Lodaer.vue';
import HeaderVue from '@/components/HeaderVue.vue';

export default {
  name: 'Home',
  components: {
    Loader,
    HeaderVue,
  },
  data() {
    return {
      sentence: null,
      showLoader: false,
    };
  },
  async mounted() {
    await this.filledSentence();
  },
  computed: {
    displayQuote() {
      if (this.sentence === null) return '';
      if (!this.sentence.quote) return this.$t('lyricsNotFound');
      return this.sentence.quote;
    },
    displayArtist() {
      return this.sentence ? this.sentence.artist : '';
    },
  },
  methods: {
    async fetchPunchline() {
      const resFetch = await http.get('/lyrics');
      return resFetch.data;
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
    submitPunchline() {
      console.log('enter press');
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

    figure {
      margin: 0;
      width: 100%;

      h1 {
        text-align: center;
      }

      figcaption {
        color: $secondColorContent;
        font-weight: bold;
        margin-top: 2rem;
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }

      div {
        &:hover {
          cursor: pointer;
        }

        font-size: .89rem;
        font-family: 'Roboto';
        font-weight: lighter;
        text-decoration: underline;
      }

      @media (max-width: 768px) {
        max-width: 100%;
      }

      @media (min-width: 768px) {
        max-width: 80%;
      }

      @media (min-width: 1200px) {
        max-width: 80%;
      }
    }
  }

  &--footer {
    height: 10vh;
    align-items: center;
    display: flex;
    border-top: .5px solid $secondColorContent;

    input {
      border: none;
      outline: none;
      background-color: transparent;
      color: $secondColorContent;
      width: 100%;
      text-align: center;
      font-size: 1rem;
    }
  }
}
</style>
