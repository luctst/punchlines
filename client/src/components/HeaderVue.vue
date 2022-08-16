<template>
  <header class="header">
    <nav class="header--nav">
      <ul class="header--nav--ul">
        <li v-for="(item, index) in headers" :key="index" class="header--nav--ul--li">
          <router-link v-if="item.link" :to="item.link">
            {{ $tc('nav', index) }}
          </router-link>
          <template v-else>
            <lang></lang>
            <div @click.prevent="headers[index].active = !headers[index].active">
              {{ filledLang }}
            </div>
            <div
            v-if="item.active"
            class="is__dropdown">
              <ul class="is__dropdown__ul">
                <li
                @click.prevent="switchLang(dropdownItem.code)"
                v-for="(dropdownItem, y) in item.langDropdown"
                :key="y"
                class="is__dropdown__ul__li">
                  {{ dropdownItem.label }}
                </li>
              </ul>
            </div>
          </template>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import Lang from '@/assets/svg/lang.svg';
import ClickOutside from 'vue-click-outside';

export default {
  name: 'HeaderVue',
  components: {
    Lang,
  },
  directives: {
    ClickOutside,
  },
  computed: {
    filledLang() {
      return this.$store.state.lang.find((i) => i.code === this.$i18n.locale).label;
    },
  },
  methods: {
    hideDropdown(index) {
      this.headers[index].active = false;
    },
    switchLang(newLang) {
      this.$root.$i18n.locale = newLang;
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
        // {
        //   link: 'ranking',
        // },
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
        margin-right: 1rem;
        position: relative;

        a,
        div {
          color: $secondColorContent;
          font-weight: bold;
          font-size: .9rem;
          text-decoration: none;
        }
      }
    }
  }
}
</style>
