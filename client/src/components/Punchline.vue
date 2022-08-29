<template>
  <section style="height:90vh;" class="d-flex flex-column">
    <loader v-if="!punchline"></loader>
    <template v-else>
      <header class="container">
        <div class="row border-bottom border-secondary mb-2 d-flex flex-direction-row">
          <h1 class="col-12 display-2"><em>{{ punchline.punchline }}</em></h1>
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
              <strong>10</strong>
            </small>
          </p>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="canvas">
            <div id="clap" class="clap-container" @click="animateLike">
              <like></like>
            </div>
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
import { mapActions } from 'vuex';
import Like from '@/assets/svg/like.svg';
import Loader from '@/components/Lodaer.vue';

export default {
  name: 'Punchline',
  components: {
    Loader,
    Like,
  },
  data() {
    return {
      punchline: null,
    };
  },
  async mounted() {
    try {
      this.punchline = (await this.callApiAuth({
        method: 'get',
        route: `/punchlines/${this.$route.params.id}`,
      })).punchline;
    } catch (error) {
      let errorMessage;

      if (error.response) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.message;
      }

      this.$toasted.error(errorMessage);
    }
  },
  methods: {
    ...mapActions(['callApiAuth']),
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

      // function runAnimationCycle(el, className) {
      //   if (el && !el.classList.contains(className)) {
      //     el.classList.add(className);
      //   } else {
      //     el.classList.remove(className);
      //     el.offsetWidth;
      //     // Trigger a reflow in between removing and adding the class name
      //     el.classList.add(className);
      //   }
      // }

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      function addRandomParticlesRotation(particlesName, mndeg, mxdeg) {
        const particles = document.getElementById(particlesName);
        const randomRotationAngle = `${getRandomInt(mndeg, mxdeg)}deg`;
        particles.style.transform = `rotate(${randomRotationAngle})`;
      }

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
        // for (let i = 0; i < particlesClasses.length; i++) {
        //   runParticleAnimationCycle(particles.children[i], particlesClasses[i].class, dur);
        // }
        // Boolean functionality only to activate particles2, particles3 when needed
        particles.classList.add('animating');
        setTimeout(() => {
          particles.classList.remove('animating');
        }, dur);
      }

      document.getElementById('clap').onclick = function cl() {
        const clap = document.getElementById('clap');
        const particles = document.getElementById('particles');
        const particles2 = document.getElementById('particles-2');
        const particles3 = document.getElementById('particles-3');
        clap.classList.add('clicked');

        if (!particles.classList.contains('animating')) {
          animateParticles(particles, 700);
        } else if (!particles2.classList.contains('animating')) {
          animateParticles(particles2, 700);
        } else if (!particles3.classList.contains('animating')) {
          animateParticles(particles3, 700);
        }
      };
    },
  },
};
</script>

<style lang="scss">
$default-clap-color: #03a87c;
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
.canvas {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 300px;
  position: relative;

  .clap-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 60px;
    height: 60px;
    border: 1px solid rgba(0, 0, 0, .15);
    border-radius: 50%;
    z-index: 2;
    background: transparent;
    cursor: pointer;

    svg {
      height: 28px;
      width: 28px;
    }

    .clap-icon {
      font-size: 30px;
      color: $default-clap-color;
      width: 30px;
      height: 30px;
    }
  }

  .particles-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    position: absolute;

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
</style>
