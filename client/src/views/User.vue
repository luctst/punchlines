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
        <p
        v-if="!userData.punchlines.length"
        class="lead mt-2 text-muted">{{ $t('user.noPunchlines ')}}
        </p>
        <div v-else class="list-group mt-3">
          <div
          v-for="(data, index) in userData.punchlines"
          :key="index"
          class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
              <h5>{{ data.punchline }}</h5>
              <small>Created at {{ formatDate(data.createdAt) }}</small>
            </div>
            <p class="mt-1 mb-1">
              Likes
              <small class="text-muted">{{ data.likes.length }}</small>
            </p>
            <p class="text-danger" @click="deletePunchline(data._id)"><u>Delete</u></p>
          </div>
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
    deletePunchline(id) {
      
    },
    formatDate(date) {
      const dateObj = new Date(date);
      return `${dateObj.getDay()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin-bottom: 0;
}
.list-group-item {
  background-color: transparent;
}
.text-danger {
  &:hover {
    cursor: pointer;
  }
}
</style>
