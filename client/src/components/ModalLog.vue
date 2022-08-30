<template>
  <section class="container">
    <header class="header">
      <div class="fs-2 fw-light text-center">{{ formTitle }}</div>
    </header>
    <form
    class="form"
    @submit.prevent="submitForm">
      <template v-for="(data, i) in inputsData">
        <div
        :key="i"
        v-if="data.display"
        :class="[
          'form-floating',
          i === inputsData.length - 1 ? 'mb-5' : 'mb-3',
          'form--wrapper'
        ]">
          <input
          :type="data.type"
          :id="data.id"
          :placeholder="data.label"
          v-model="dataToPost[data.vModel]"
          :class="[
            'form-control',
            'form--wrapper--input',
            renderInputClass(data.error.active),
          ]"
          required="true"
          />
          <label :for="data.id" class="form--wrapper--label">{{ data.label }}</label>
          <div v-if="data.error" class="invalid-feedback">{{ data.error.message }}</div>
        </div>
      </template>
      <div class="form--wrapper">
        <button class="form--wrapper--btn btn btn-primary" type="submit">{{ formTitle }}</button>
      </div>
    </form>
    <footer class="footer border-top">
      <div>{{ formFooterPrefix }} <span @click="switchMode">{{ formFooterBtn }}</span></div>
    </footer>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PasswordValidator from 'password-validator';
import errorMixin from '@/mixins/error';

export default {
  name: 'ModalLog',
  mixins: [errorMixin],
  data() {
    return {
      wantLog: true,
      formSubmit: false,
      dataToPost: {
        username: null,
        email: null,
        password: null,
      },
      inputsData: [
        {
          display: false,
          type: 'text',
          id: 'floatingUsername',
          label: 'Username',
          vModel: 'username',
          error: {
            active: false,
            message: this.$t('auth.errors.username'),
          },
          validator: this.isUsernameValid,
        },
        {
          display: true,
          type: 'email',
          id: 'floatingEmail',
          label: 'Email address',
          vModel: 'email',
          error: {
            active: false,
            message: this.$t('auth.errors.email'),
          },
          validator: this.isEmailValid,
        },
        {
          display: true,
          type: 'password',
          id: 'floatingPassword',
          label: 'Password',
          vModel: 'password',
          error: {
            active: false,
            message: this.$t('auth.errors.password'),
          },
          validator: this.isPasswordValid,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['getUserName']),
    formTitle() {
      return this.wantLog ? this.$tc('auth.title', 1) : this.$tc('auth.title', 0);
    },
    formFooterPrefix() {
      return this.wantLog ? this.$tc('auth.footerPrefix', 0) : this.$tc('auth.footerPrefix', 1);
    },
    formFooterBtn() {
      return this.wantLog ? this.$tc('auth.footerBtn', 0) : this.$tc('auth.footerBtn', 1);
    },
  },
  methods: {
    ...mapActions(['filledUsersData']),
    renderInputClass(hasError) {
      if (!this.formSubmit) return false;
      return hasError ? 'is-invalid' : 'is-valid';
    },
    switchMode() {
      this.wantLog = !this.wantLog;
      this.inputsData[0].display = !this.inputsData[0].display;
    },
    isInputEmty(value) {
      return value.length;
    },
    isUsernameValid(value) {
      if (!this.isInputEmty) return false;
      const schema = new PasswordValidator();
      return schema.has().not().symbols().validate(value);
    },
    isEmailValid(value) {
      if (!this.isInputEmty(value)) return false;
      return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value); // eslint-disable-line
    },
    isPasswordValid(value) {
      if (!this.isInputEmty) return false;
      const schema = new PasswordValidator();
      return schema
        .is().min(8)
        .has()
        .uppercase(1)
        .has()
        .lowercase(1)
        .has()
        .digits(1)
        .has()
        .not()
        .spaces()
        .validate(value);
    },
    async submitForm() {
      try {
        this.formSubmit = true;
        const notError = this.inputsData.every((input, index) => {
          if (!input.display) return true;

          if (!input.validator(this.dataToPost[input.vModel])) {
            this.inputsData[index].error.active = true;
            return false;
          }

          this.inputsData[index].error.active = false;
          return true;
        });

        if (!notError) return false;

        const dataToSend = { ...this.dataToPost };

        if (this.wantLog) {
          delete dataToSend.username;
        }

        await this.filledUsersData({
          route: this.wantLog ? '/login' : '/register',
          userData: { ...dataToSend },
        });
        this.$toasted.success(this.$t('auth.success', { username: this.getUserName }));
        this.$modal.hide('log');
      } catch (error) {
        this.formSubmit = false;
        this.handleErrorApi(error);
      }

      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.container {
  display: flex;
  height: inherit;
  flex-direction: column;
  justify-content: space-between;
  .header {
    align-items: center;
    display: flex;
    height: 8vh;
    justify-content: center;

    div {
      color: $blackColor;
    }
  }
  .form {
    &--wrapper {
      &--input {
        height: 2.8rem;
      }
      &--label {
        padding-top: .6rem;
      }
      &--btn {
        width: 100%;
      }
    }
  }

  .footer {
    align-items: center;
    display: flex;
    height: 8vh;
    justify-content: center;

    div {
      font-size: .85rem;
      font-weight: bold;

      span {
        &:hover {
          opacity: .5;
          cursor: pointer;
        }
        color: $secondColorContent;
      }
    }
  }
}
</style>
