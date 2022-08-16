<template>
  <div></div>
</template>

<style lang="scss" scoped>
@keyframes move {
  to {
    opacity: 1;
    transform: scale3d(0.5, 0.5, 1);
  }
}

div::before {
  content: '';
  position: absolute;
  z-index: 100000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #eeeeee;
  opacity: .8;
}

div::after {
  content: '';
  position: absolute;
  z-index: 100000;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  margin: -30px 0 0 -30px;
  pointer-events: none;
  border-radius: 50%;
  opacity: 0.4;
  background: #5081fb;
  animation: move 0.7s linear infinite alternate forwards;
}
</style>
