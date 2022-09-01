<template>
  <header class="header">
    <v-dialog></v-dialog>
    <nav class="header--nav">
      <ul class="header--nav--ul">
        <li v-for="(item, index) in headers" :key="index" class="header--nav--ul--li">
          <router-link v-if="item.link" :to="item.link">
            {{ $tc('nav', index) }}
          </router-link>
          <template v-else>
            <div @click.prevent="headers[index].active = !headers[index].active">
              {{ filledLang }}
            </div>
            <div v-if="item.active" class="is__dropdown">
              <ul class="is__dropdown__ul">
                <li
                @click.prevent="switchLang(dropdownItem.code)"
                v-for="(dropdownItem, y) in item.langDropdown"
                  :key="y" class="is__dropdown__ul__li">
                  {{ dropdownItem.label }}
                </li>
              </ul>
            </div>
          </template>
        </li>
        <li class="header--nav--ul--li">
          <router-link v-if="getUserId" :to="`/user/${getUserId}`">
            {{ getUserName }}
          </router-link>
          <div v-else @click="$modal.show('log')">{{ $t('connexionHeader') }}</div>
        </li>
        <li v-if="isConnected" class="header--nav--ul--li">
          <div @click="logout">{{ $t('btnLogout') }}</div>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import ClickOutside from 'vue-click-outside';
import errorMixin from '@/mixins/error';

export default {
  name: 'HeaderVue',
  mixins: [errorMixin],
  directives: {
    ClickOutside,
  },
  computed: {
    ...mapGetters(['getUserId', 'getUserName', 'isConnected']),
    filledLang() {
      return this.$store.state.lang.find((i) => i.code === this.$i18n.locale).label;
    },
  },
  methods: {
    ...mapActions(['callApiAuth']),
    ...mapMutations(['resetUserData']),
    hideDropdown(index) {
      this.headers[index].active = false;
    },
    switchLang(newLang) {
      this.$root.$i18n.locale = newLang;
    },
    async logout() {
      try {
        this.$modal.show(
          'dialog',
          {
            text: this.$t('modalLogout.text'),
            buttons: [
              {
                title: this.$t('user.modal.buttons[0]'),
                handler: () => {
                  this.$modal.hide('dialog');
                },
              },
              {
                title: this.$t('modalLogout.buttons'),
                handler: async () => {
                  await this.callApiAuth({
                    method: 'delete',
                    route: '/auth/logout',
                  });

                  this.resetUserData();
                  this.$modal.hide('dialog');
                  this.$router.push({ name: 'Home' });
                },
              },
            ],
          },
        );
      } catch (error) {
        this.handleErrorApi(error);
      }
    },
  },
  data() {
    return {
      headers: [
        {
          link: '/',
        },
        {
          link: '/about',
        },
        {
          link: '/ranking',
        },
        {
          langDropdown: this.$store.state.lang,
          active: false,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/_variables.scss';

.is__dropdown {
  background-color: #fff;
  box-shadow: 0 50px 100px -20px  rgba(50, 50, 93, 0.25), 0 30px 60px -30px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 2rem;
  position: absolute;
  top: 2rem;
  z-index: 1000;

  &__ul {
    margin: 0;
    padding: 0;
    list-style-type: none;

    &__li {
      :hover {
        cursor: pointer;
      }

      margin: 4px 0;
      color: #0a2540;
      opacity: .6;
    }
  }
}
.header {
  align-items: center;
  justify-content: center;
  display: flex;
  height: 10vh;

  &--nav {
    &--ul {
      display: flex;
      list-style-type: none;
      padding: 0;
      margin: 0;

      &--li:last-of-type {
        margin: 0;
      }

      &--li:last-of-type {
        &:hover {
          cursor: pointer;
        }

        align-items: center;
        display: flex;

        svg {
          margin-right: .3rem;
        }
      }

      &--li {
        align-items: center;
        display: flex;
        margin-right: 1rem;
        position: relative;

        a,
        div {
          color: $secondColorContent;
          font-weight: bold;
          font-size: .9rem;
          text-decoration: none;
        }

        svg {
          margin-right: .2rem;
        }
      }
    }
  }
}
</style>
