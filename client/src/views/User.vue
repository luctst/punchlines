<template>
  <section class="mt-3">
    <loader v-if="!userData"></loader>
    <template v-else>
      <header class="header container">
        <div class="row mb-2 border-bottom border-secondary">
          <h1 class="col-12 display-1">{{ userData.username }}</h1>
        </div>
        <div class="row mt-5">
          <p class="col-12 lead">Email:
            <small class="text-muted">{{ userData.email }}</small>
          </p>
        </div>
        <div class="row">
          <p class="lead">Score:
            <small class="text-muted">{{ userData.score }}</small>
          </p>
        </div>
      </header>
      <main class="container mt-5">
        <div class="row">
          <h2 class="col-12">{{ $t('user.title') }}:</h2>
        </div>
      </main>
    </template>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Loader from '@/components/Lodaer.vue';

export default {
  name: 'User',
  components: {
    Loader,
  },
  data() {
    return {
      userData: null,
    };
  },
  computed: {
    ...mapGetters(['getJwt']),
  },
  async mounted() {
    try {
      if (!this.getJwt) return this.$router.push({ name: 'Home' });
      const res = await this.callApiAuth(
        {
          route: `/user/${this.$route.params.uid}`,
          method: 'get',
        },
      );

      this.userData = { ...res.user };
    } catch (error) {
      let errorMessage;

      if (error.response) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.message;
      }

      this.$toasted.error(errorMessage);
    }

    return true;
  },
  methods: {
    ...mapActions(['callApiAuth']),
  },
};
</script>

<style lang="scss" scoped>
p {
  margin-bottom: 0;
}
</style>
