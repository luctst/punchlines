<template>
  <section class="home container">
    <v-dialog></v-dialog>
    <loader v-if="!sentence"></loader>
    <template v-else>
      <div class="home--sentence">
        <blockquote class="blockquote">
          <h1 class="mb-0 text-center">
            <router-link :to="{ name: 'Lyric', params: { id: sentence.id } }">
              {{ displayQuote }}
            </router-link>
          </h1>
          <footer class="blockquote-footer mt-3">
            <cite title="Source Title">{{ displayArtist }}</cite>
          </footer>
        </blockquote>
        <div @click.prevent="filledSentence">{{ $t('refreshSentence') }}</div>
      </div>
      <footer class="home--footer">
        <input @keyup.enter="submitPunchline" type="text" autocomplete="false" v-model="lyrics"
          :placeholder="$t('placeholderLyrics')" />
      </footer>
    </template>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import http from '@/utils/http';
import Loader from '@/components/Lodaer.vue';
import errorMixin from '@/mixins/error';

export default {
  name: 'Home',
  mixins: [errorMixin],
  components: {
    Loader,
  },
  data() {
    return {
      sentence: null,
      lyrics: null,
    };
  },
  async mounted() {
    await this.filledSentence();
  },
  computed: {
    ...mapGetters(['isConnected', 'getUserId']),
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
    ...mapActions(['callApiAuth']),
    async fetchPunchline() {
      const resFetch = await http.get('/lyrics');
      return resFetch.data;
    },
    async filledSentence() {
      try {
        this.sentence = await this.fetchPunchline();
      } catch (error) {
        this.$toasted.error(this.$i18n.t('errorApi'));
      }
    },
    async submitPunchline() {
      try {
        if (!this.isConnected) {
          this.$modal.show('log');
          return false;
        }

        if (!this.lyrics) return false;
        const res = await this.callApiAuth({
          route: '/punchlines',
          method: 'post',
          body: { punchline: this.lyrics, author: this.getUserId, lyrics_id: this.sentence.id },
        });
        this.$modal.show(
          'dialog',
          {
            title: this.$t('punchlineForm.success'),
            text: this.$t('punchlineForm.contentSuccess'),
            buttons: [
              {
                title: this.$t('punchlineForm.buttons[0]'),
                handler: () => {
                  this.$modal.hide('dialog');
                },
              },
              {
                title: this.$t('punchlineForm.buttons[1]'),
                handler: () => {
                  this.$router.push({ name: 'Punchline', params: { id: res.punchline_id } });
                },
              },
            ],
          },
        );

        this.lyrics = null;
        return true;
      } catch (error) {
        this.handleErrorApi(error);
      }

      return true;
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

    div {
      &:hover {
        cursor: pointer;
      }

      font-size: .89rem;
      font-family: 'Roboto';
      font-weight: lighter;
      text-decoration: underline;
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
