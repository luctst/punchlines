<template>
  <main class="container">
    <section>
      <div v-for="(content, index) in c" :key="index">{{ content }}</div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'About',
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
      font-weight: lighter;
      max-width: 60%;
      margin-bottom: 1rem;

      @media (max-width: 768px) {
        font-size: 1.5rem;
        line-height: 2.5rem;
      }

      @media (min-width: 768px) {
        font-size: 2rem;
        line-height: 2.7rem;
      }
    }
  }
}
</style>
