<template>
  <section style="height:90vh;" class="d-flex flex-column">
    <loader v-if="!punchline"></loader>
    <template v-else>
      <header class="container">
        <div class="row border-bottom border-secondary mb-2 d-flex flex-direction-row">
          <h1 class="col-12" :class="sizeH1"><em>{{ punchline.punchline }}</em></h1>
          <small class="text-muted mb-2">By
            <strong>
              <router-link :to="{ name: 'User', params: { uid: punchline.author._id }}">
                {{ punchline.author.username }}
              </router-link>
            </strong>
          </small>
        </div>
      </header>
      <main class="container" style="height:100%;">
        <div class="row">
          <p class="col-12 lead">
            Liked by
            <small class="text-muted">
              <strong>{{ punchline.likes.length }}</strong>
            </small>
            Peoples
          </p>
          <p class="col-12 lead">
            Total likes
            <small class="text-muted">
              <strong>{{ totalLikes }}</strong>
            </small>
          </p>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="canvas">
            <div id="totalCounter" class="total-counter"></div>
            <div id="clap" class="clap-container" @click="animateLike" @mouseover="pulse">
              <like></like>
            </div>
            <div id="clicker" class="click-counter">
              <span class="counter"></span>
            </div>
            <div id="sonar-clap" class="clap-container-sonar"></div>
            <div id="particles" class="particles-container">
              <div class="triangle">
                <div class="square"></div>
              </div>
              <div class="triangle">
                <div class="square"></div>
              </div>
              <div class="triangle">
                <div class="square"></div>
              </div>
              <div class="triangle">
                <div class="square"></div>
              </div>
              <div class="triangle">
                <div class="square"></div>
              </div>
            </div>

            <div id="particles-2" class="particles-container">
              <div class="triangle">
                <div class="square"></div>
              </div>
              <div class="triangle">
                <div class="square"></div>
              </div>
              <div class="triangle">
                <div class="square"></div>
              </div>
              <div class="triangle">
                <div class="square"></div>
              </div>
              <div class="triangle">
                <div class="square"></div>
              </div>
            </div>
            <div id="particles-3" class="particles-container">
              <div class="triangle">
                <div class="square"></div>
              </div>
              <div class="triangle">
                <div class="square"></div>
              </div>
              <div class="triangle">
                <div class="square"></div>
              </div>
              <div class="triangle">
                <div class="square"></div>
              </div>
              <div class="triangle">
                <div class="square"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer class="container d-flex align-items-center border-top border-secondary mt-auto">
        <figure class="text-center w-100 mb-0 mt-3">
          <blockquote class="blockquote">
            <p>{{ punchline.lyrics_id.lyrics }}</p>
          </blockquote>
          <figcaption class="blockquote-footer">
            {{ punchline.lyrics_id.artist.name }}
          </figcaption>
        </figure>
      </footer>
    </template>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import debounce from '@/utils/debounce';
import Like from '@/assets/svg/like.svg';
import Loader from '@/components/Lodaer.vue';
import errorMixin from '@/mixins/error';

export default {
  name: 'Punchline',
  mixins: [errorMixin],
  components: {
    Loader,
    Like,
  },
  data() {
    return {
      punchline: null,
      likes: 0,
      watchDebounce: false,
    };
  },
  computed: {
    ...mapGetters(['getUserId']),
    sizeH1() {
      return this.punchline.punchline.length >= 25 ? 'display-5' : 'display-3';
    },
    totalLikes() {
      return this.punchline.likes.reduce(
        (prev, next) => prev + next.liked,
        0,
      );
    },
    likeAuthorIndex() {
      return this.punchline.likes.length
        ? this.punchline.likes.findIndex((l) => l.author === this.getUserId)
        : 0;
    },
  },
  async mounted() {
    try {
      this.punchline = (await this.callApiAuth({
        method: 'get',
        route: `/punchlines/${this.$route.params.id}`,
      })).punchline;
      this.likes = this.countLikes();
      return true;
    } catch (error) {
      this.handleErrorApi(error);
    }

    return true;
  },
  watch: {
    likes: debounce(async function (newVal) {
      try {
        if (!this.watchDebounce) return false;

        const res = await this.callApiAuth({
          method: 'patch',
          route: `/punchlines/${this.$route.params.id}/likes`,
          body: {
            author_id: this.punchline.author._id,
            likes: newVal,
          },
        });

        if (!this.punchline.likes.length) {
          this.punchline.likes.push({
            _id: res.liked_id,
            author: this.getUserId,
            liked: res.author_likes,
          });
          return true;
        }

        this.punchline.likes[this.likeAuthorIndex].liked = res.author_likes;
        return true;
      } catch (error) {
        this.handleErrorApi(error);
      }

      return true;
    }, 5000),
  },
  methods: {
    ...mapActions(['callApiAuth']),
    countLikes() {
      return this.punchline.likes.length
        ? this.punchline.likes.find((l) => l.author === this.getUserId).liked
        : 0;
    },
    pulse() {
      const sonarClap = document.getElementById('sonar-clap');
      sonarClap.classList.add('hover-active');
      setTimeout(() => {
        sonarClap.classList.remove('hover-active');
      }, 2000);
    },
    animateLike() {
      const minDeg = 1;
      const maxDeg = 72;
      const particlesClasses = [
        {
          class: 'pop-top',
        },
        {
          class: 'pop-top-left',
        },
        {
          class: 'pop-top-right',
        },
        {
          class: 'pop-bottom-right',
        },
        {
          class: 'pop-bottom-left',
        },
      ];

      function runAnimationCycle(el, className) {
        if (el && !el.classList.contains(className)) {
          el.classList.add(className);
        } else {
          el.classList.remove(className);
          void el.offsetWidth; // eslint-disable-line
          el.classList.add(className);
        }
      }

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      function addRandomParticlesRotation(particlesName, mnDeg, mxDeg) {
        const particles = document.getElementById(particlesName);
        const randomRotationAngle = `${getRandomInt(mnDeg, mxDeg)}deg`;
        particles.style.transform = `rotate(${randomRotationAngle})`;
      }

      const upClickCounter = () => {
        this.watchDebounce = true;
        const clickCounter = document.getElementById('clicker');
        const totalClickCounter = document.getElementById('totalCounter');

        this.likes += 1;
        clickCounter.children[0].innerText = `+${this.likes}`;

        if (clickCounter.classList.contains('first-active')) {
          runAnimationCycle(clickCounter, 'active');
        } else {
          runAnimationCycle(clickCounter, 'first-active');
        }
        runAnimationCycle(totalClickCounter, 'fader');
        return true;
      };

      function runParticleAnimationCycle(el, className, duration) {
        if (el && !el.classList.contains(className)) {
          el.classList.add(className);
          setTimeout(() => {
            el.classList.remove(className);
          }, duration);
        }
      }

      function animateParticles(particles, dur) {
        addRandomParticlesRotation(particles.id, minDeg, maxDeg);
        particlesClasses.forEach((el, i) => {
          runParticleAnimationCycle(particles.children[i], el.class, dur);
        });
        particles.classList.add('animating');
        setTimeout(() => {
          particles.classList.remove('animating');
        }, dur);
      }

      document.getElementById('clap').onmouseover = () => {
        const sonarClap = document.getElementById('sonar-clap');
        sonarClap.classList.add('hover-active');
        setTimeout(() => {
          sonarClap.classList.remove('hover-active');
        }, 2000);
      };

      document.getElementById('clap').onclick = () => {
        if (this.likes >= 100) {
          this.$toasted.error(this.$t('punchline.tooManyLikes'));
          return false;
        }

        const clap = document.getElementById('clap');
        const particles = document.getElementById('particles');
        const particles2 = document.getElementById('particles-2');
        const particles3 = document.getElementById('particles-3');
        clap.classList.add('clicked');
        upClickCounter();

        runAnimationCycle(clap, 'scale');

        if (!particles.classList.contains('animating')) {
          animateParticles(particles, 700);
        } else if (!particles2.classList.contains('animating')) {
          animateParticles(particles2, 700);
        } else if (!particles3.classList.contains('animating')) {
          animateParticles(particles3, 700);
        }

        return true;
      };
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/_variables.scss';
$default-clap-color: $mainColor;

.canvas {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 300px;
  position: relative;

  .total-counter {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    position: absolute;
    margin-top: -45px;
    color: gray;
    font-family: sans-serif;
    font-size: 16px;
  }

  .total-counter.fader {
    animation: fade-in 1400ms forwards;
  }

  .clap-container {
    background-color: $secondColor;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 5rem;
    height: 5rem;
    border: 1px solid rgba(0, 0, 0, .15);
    border-radius: 50%;
    z-index: 2;
    cursor: pointer;

    svg {
      background-color: $secondColor;
      height: 40px;
      width: 40px;
    }

    .clap-icon {
      font-size: 30px;
      color: $default-clap-color;
      width: 30px;
      height: 30px;
    }
  }

  .clap-container:hover {
    border: 1px solid $default-clap-color;
  }

  .clap-container.scale {
    animation: scaleAndBack 700ms forwards;
  }

  .click-counter {
    background-color: $default-clap-color;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 35px;
    position: absolute;
    top: 132px;
    border-radius: 50%;
    z-index: 1;

    .counter {
      font-family: sans-serif;
      font-size: 14px;
      color: #fff;
    }
  }

  .click-counter.first-active {
    animation: first-bump-in 1s forwards;
  }

  .click-counter.active {
    animation: bump-in 1s forwards;
  }

  .clap-container-sonar {
    width: 60px;
    height: 60px;
    background: $default-clap-color;
    border-radius: 50%;
    position: absolute;
    opacity: 0;
    z-index: 0;
  }

  .hover-active {
    animation: sonar-wave 2s forwards;
  }

  .particles-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    position: absolute;

    /* border: 1px solid gray; */
    /* z-index: 3; */
    .triangle {
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 10px solid red;
      border-bottom: 4px solid transparent;
      position: absolute;

      .square {
        width: 5px;
        height: 5px;
        background: $default-clap-color;
        position: absolute;
        left: -15px;
        top: 0;
      }
    }

    .pop-top {
      animation: pop-top 1s forwards;
    }

    .pop-top-left {
      animation: pop-top-left 1s forwards;
    }

    .pop-top-right {
      animation: pop-top-right 1s forwards;
    }

    .pop-bottom-right {
      animation: pop-bottom-right 1s forwards;
    }

    .pop-bottom-left {
      animation: pop-bottom-left 1s forwards;
    }
  }
}

// * * * Animations * * * //
@keyframes sonar-wave {
  0% {
    opacity: 0.7;
  }

  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

// * * * Pop Animations * * * //
@keyframes pop-top {
  0% {
    transform: translate(0, 0) rotate(0);
    opacity: 0.4;
  }

  100% {
    transform: translate(0, -100px) rotate(0);
    opacity: 0;
  }
}

@keyframes pop-top-left {
  0% {
    transform: translate(0, 0) rotate(-55deg);
    opacity: 0.4;
  }

  100% {
    transform: translate(-100px, -50px) rotate(-55deg);
    opacity: 0;
  }
}

@keyframes pop-top-right {
  0% {
    transform: translate(0, 0) rotate(55deg);
    opacity: 0.4;
  }

  100% {
    transform: translate(100px, -50px) rotate(55deg);
    opacity: 0;
  }
}

@keyframes pop-bottom-right {
  0% {
    transform: translate(0, 0) rotate(135deg);
    opacity: 0.4;
  }

  100% {
    transform: translate(70px, 80px) rotate(135deg);
    opacity: 0;
  }
}

@keyframes pop-bottom-left {
  0% {
    transform: translate(0, 0) rotate(-135deg);
    opacity: 0.4;
  }

  100% {
    transform: translate(-70px, 80px) rotate(-135deg);
    opacity: 0;
  }
}

@keyframes first-bump-in {
  0% {
    transform: translateY(-65px);
    opacity: 1;
  }

  50% {
    transform: translateY(-80px);
    opacity: 1;
  }

  100% {
    transform: translateY(-100px);
    opacity: 0;
  }
}

@keyframes bump-in {
  0% {
    transform: translateY(-80px) scale(0.9);
    opacity: 1;
  }

  50% {
    transform: translateY(-80px) scale(1);
    opacity: 1;
  }

  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

@keyframes scaleAndBack {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.15);
  }

  100% {
    transform: scale(1);
  }
}
</style>
