<template>
  <section class="mt-3">
    <v-dialog></v-dialog>
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
              <h5>
                <router-link
                :to="{ name: 'Punchline', params: { id: data._id}}">
                  {{ data.punchline }}
                </router-link>
              </h5>
              <small>{{ $t('user.createdAt') }} {{ formatDate(data.createdAt) }}</small>
            </div>
            <p class="mt-1 mb-1">
              {{ $t('user.likes') }}
              <small class="text-muted">{{ data.likes.length }}</small>
            </p>
            <p
            class="text-danger"
            @click="deletePunchline(data._id, data.punchline, index)">
              <u>{{ $t('user.delete') }}</u>
            </p>
          </div>
        </div>
      </main>
    </template>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Loader from '@/components/Lodaer.vue';
import errorMixin from '@/mixins/error';

export default {
  name: 'User',
  mixins: [errorMixin],
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
      this.handleErrorApi(error);
    }

    return true;
  },
  methods: {
    ...mapActions(['callApiAuth']),
    deletePunchline(id, punchline, index) {
      try {
        this.$modal.show(
          'dialog',
          {
            text: this.$t('user.modal.title', { punchline }),
            buttons: [
              {
                title: this.$t('user.modal.buttons[0]'),
                handler: () => {
                  this.$modal.hide('dialog');
                },
              },
              {
                title: this.$t('user.modal.buttons[1]'),
                handler: async () => {
                  try {
                    await this.callApiAuth({ method: 'delete', route: `/punchlines/${id}` });

                    this.userData.punchlines.splice(index, 1);
                    this.$modal.hide('dialog');
                    this.$toasted.success(this.$t('user.modal.success'));
                  } catch (error) {
                    this.handleErrorApi(error);
                  }
                },
              },
            ],
          },
        );
      } catch (error) {
        this.handleErrorApi(error);
      }
    },
    formatDate(date) {
      const dateObj = new Date(date);
      return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
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
