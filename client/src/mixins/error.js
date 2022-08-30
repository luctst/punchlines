export default {
  methods: {
    handleErrorApi(error, vm) {
      const vueInstance = vm || this;
      let errorMessage;

      if (error.response) {
        if (error.response.status === 401) {
          return vueInstance.$router.push({ name: 'Home' });
        }

        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.message;
      }

      vueInstance.$toasted.error(errorMessage);
      return true;
    },
  },
};
