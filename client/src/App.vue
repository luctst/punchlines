<template>
  <section id="app--wrapper">
    <header-vue></header-vue>
    <router-view />
    <modal name="log" height="60%">
      <modal-log></modal-log>
    </modal>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import HeaderVue from '@/components/HeaderVue.vue';
import ModalLog from '@/components/ModalLog.vue';

export default {
  name: 'App',
  components: {
    HeaderVue,
    ModalLog,
  },
  async mounted() {
    try {
      if (this.getJwt) return true;
      await this.refreshSession();
    } catch (error) {
      if (error.response) return false;
      return this.$toasted.error(error.message);
    }

    return true;
  },
  computed: {
    ...mapGetters(['getJwt']),
  },
  methods: {
    ...mapActions(['refreshSession']),
  },
};
</script>
