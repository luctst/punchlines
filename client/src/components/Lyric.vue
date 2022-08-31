<template>
  <section>
    <loader v-if="!lyric"></loader>
    <template v-else>
      <header class="container">
        <div class="row border-bottom border-secondary mb-2 d-flex flex-direction-row">
          <h1 class="col-12" :class="sizeH1"><em>{{ lyric.lyrics }}</em></h1>
          <small class="text-muted mb-2">By
            <strong>{{ lyric.artist.name }}</strong>
          </small>
        </div>
      </header>
    </template>
  </section>
</template>

<script>
import { mapActions } from 'vuex';
import Loader from '@/components/Lodaer.vue';
import errorMixin from '@/mixins/error';

export default {
  name: 'Lyric',
  mixins: [errorMixin],
  components: {
    Loader,
  },
  data() {
    return {
      lyric: null,
    };
  },
  computed: {
    sizeH1() {
      return this.lyric.lyrics.length >= 25 ? 'display-5' : 'display-3';
    },
  },
  async mounted() {
    try {
      this.lyric = (await this.callApiAuth({
        method: 'get',
        route: `/lyrics/${this.$route.params.id}`,
        skipAuth: true,
      })).lyric;
    } catch (error) {
      this.handleErrorApi(error);
    }
  },
  methods: {
    ...mapActions(['callApiAuth']),
  },
};
</script>
