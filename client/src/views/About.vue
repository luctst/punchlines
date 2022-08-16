<template>
  <main class="container">
    <header-vue></header-vue>
    <section>
      <div v-for="(content, index) in c" :key="index">{{ content }}</div>
    </section>
  </main>
</template>

<script>
import HeaderVue from '@/components/HeaderVue.vue';

export default {
  name: 'About',
  components: {
    HeaderVue,
  },
  computed: {
    c() {
      return this.$i18n.t('about');
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  section {
    margin-top: 1rem;

    div {
      font-size: 2rem;
      font-weight: lighter;
      max-width: 60%;
      margin-bottom: 1rem;
      line-height: 2.7rem;
    }
  }
}
</style>
