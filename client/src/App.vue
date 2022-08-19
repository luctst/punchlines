<template>
  <section id="app--wrapper">
    <router-view />
    <modal name="log" height="60%">
      <modal-log></modal-log>
    </modal>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import ModalLog from '@/components/ModalLog.vue';

export default {
  name: 'App',
  components: {
    ModalLog,
  },
  mounted() {
    if (!this.getJwt) return false;
    return true;
  },
  computed: {
    ...mapGetters(['getJwt']),
  },
};
</script>
