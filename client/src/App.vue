<template>
    <section id="app--wrapper">
      <router-view/>
      <modal name="log">
        <section class="container">
          <header class="header">
            <div>Log in</div>
          </header>
        </section>
      </modal>
    </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  mounted() {
    if (!this.getJwt) return false;
    return true;
  },
  computed: {
    ...mapGetters(['getJwt']),
  },
};
</script>
