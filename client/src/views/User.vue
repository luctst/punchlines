<template>
  <section></section>
</template>

<script>
import { mapGetters } from 'vuex';
import http from '@/utils/http';

export default {
  name: 'User',
  computed: {
    ...mapGetters(['getJwt']),
  },
  async mounted() {
    try {
      if (!this.getJwt) return this.$router.push({ name: 'Home' });
      await http.get(
        `/user/${this.$route.params.uid}`,
        {
          headers: {
            Authorization: `Bearer ${this.getJwt}`,
          },
        },
      );
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
};
</script>
