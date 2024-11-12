<script>
export default {
  data() {
    return {
      trigger: 0,
    };
  },
  methods: {
    click() {
      if (this.trigger == 1) {
        this.trigger = 0;
      } else {
        this.trigger = 1;
      }
    },

    hide() {
      setTimeout(() => {
        this.trigger = 0;
      }, 800);
    },
  },
};
</script>

<template>
  <div :class="{ active: this.trigger == '1' }" class="wrapper-for-slider">
    <!-- <nav>
        <ul class="list-nav">
            <RouterLink to="/info" @click="trigger = 0"><li class="list-item-nav">ИНФО</li></RouterLink>
            <RouterLink to="/transfer-taksi" @click="trigger = 0"><li class="list-item-nav">Трансфер/Такси</li></RouterLink>
            <RouterLink to="/habitation" @click="trigger = 0"><li class="list-item-nav">Проживание</li></RouterLink>
            <RouterLink to="/rental" @click="trigger = 0"><li class="list-item-nav">Прокат</li></RouterLink>
            <RouterLink to="/events" @click="trigger = 0"><li class="list-item-nav">Развлечения</li></RouterLink>
            <RouterLink to="/forChildren" @click="trigger = 0"><li class="list-item-nav">Детям</li></RouterLink>
            <RouterLink to="/instructor-tours" @click="trigger = 0"><li class="list-item-nav">Инструктор/Туры</li></RouterLink>
            <RouterLink to="/news" @click="trigger = 0"><li class="list-item-nav">Новости</li></RouterLink>
            <RouterLink to="/ads" @click="trigger = 0"><li class="list-item-nav">Объявления</li></RouterLink>
        </ul>
    </nav> -->
    <div class="navbar">
      <li class="list-item">
        <router-link to="/info" @click="hide">
          <img class="icon" src="../assets/info.png" alt="" />
          <span class="list-item-name">Инфо</span>
        </router-link>
      </li>
      <li class="list-item" @click="hide">
        <router-link to="/transfer">
          <img class="bed" src="../assets/bus.png" alt="" />
          <span class="list-item-name">Трансфер/Такси</span>
        </router-link>
      </li>
      <li class="list-item" @click="hide">
        <router-link to="/habitation">
          <img class="bed" src="../assets/bed.png" alt="" />
          <span class="list-item-name">Проживание</span>
        </router-link>
      </li>
      <li class="list-item" @click="hide">
        <router-link to="/rental">
          <img class="bed" src="../assets/rent.png" alt="" />
          <span class="list-item-name">Прокат</span>
        </router-link>
      </li>
      <li class="list-item" @click="hide">
        <router-link to="/events">
          <img class="bed" src="../assets/events.png" alt="" />
          <span class="list-item-name">Развлечения</span>
        </router-link>
      </li>
      <li class="list-item" @click="hide">
        <router-link to="/forChildren">
          <img class="bed" src="../assets/children.png" alt="" />
          <span class="list-item-name">Детям</span>
        </router-link>
      </li>
      <li class="list-item" @click="hide">
        <router-link to="/instructor-tours">
          <img class="bed" src="../assets/instructor.png" alt="" />
          <span class="list-item-name">Инструктор/Туры</span>
        </router-link>
      </li>
      <li class="list-item" @click="hide">
        <router-link to="/news">
          <img class="bed" src="../assets/news.png" alt="" />
          <span class="list-item-name">Новости</span>
        </router-link>
      </li>
      <li class="list-item" @click="hide">
        <router-link to="/ads">
          <img class="bed" src="../assets/ads.png" alt="" />
          <span class="list-item-name">Объявления</span>
        </router-link>
      </li>
    </div>
  </div>
  <div class="wrap-line" @click="click">
    <div v-if="trigger" class="line line-2"></div>
    <div class="line line-1"></div>
    <div v-if="!trigger" class="line line-2"></div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&display=swap");

:root {
  --highlight: #fff;
}

* {
  box-sizing: border-box;
}

.img {
  height: 60px;
}

.icon {
  height: 33px;
}

.bed {
  height: 40px;
}

.car {
  height: 50px;
}

.wrapper-for-nav {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.navbar {
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  gap: 40px;
}

.list-item {
  list-style-type: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  position: relative;
  color: #555;
  transform: translateY(0);
  transition: transform 0.5s ease, opacity 0.2s ease;
  cursor: pointer;
}

.list-item-name {
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
  position: absolute;
  transform: translate(0, 35px);
  transition: transform 0.5s ease, opacity 0.2s ease;
  opacity: 1;
}

.list-item:hover,
.list-item:active,
.list-item:focus {
  color: var(--highlight);
  transform: translateY(-6px);
  .list-item-name {
    transform: translateY(35px);
    opacity: 1;
  }
}

a,
a:hover {
  color: var(--highlight);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

@media (max-width: 350px) {
  .navbar {
    align-items: center;
    padding-bottom: 20px;
    gap: 20px;
  }

  .list-item {
    flex-basis: auto;
  }

  .list-item:hover,
  .list-item:active,
  .list-item:focus {
    .list-item-name {
      transform: translateY(25px);
    }
  }

  .list-item:hover,
  .list-item:active,
  .list-item:focus {
    color: var(--highlight);
    transform: translateY(-6px);
    .list-item-name {
      transform: translateY(40px);
      opacity: 1;
    }
  }
}

a {
  width: 100%;
}
.wrapper-for-slider {
  width: fit-content;
  position: absolute;
  left: 30px;
  transform: translate(-400px);
  transition: all 500ms;
  z-index: 3;
}
.active {
  transform: translate(0);
  transition: all 500ms;
}

.wrap-line {
  width: 20px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 5px;
  top: calc(50% - 35px);
  gap: 2px;
  height: auto;
  cursor: pointer;
  z-index: 3;
}

.wrap-line:active .wrapper-for-slider {
  transform: translate(0);
  transition: all 500ms;
}
.line {
  width: 3px;
  height: 70px;
  background-color: #fff;
}
.line-2 {
  height: 50px;
}

@media (max-height: 780px) {
  .navbar {
    gap: 30px;
  }
}

@media (max-height: 820px) {
  .wrapper-for-slider {
    backdrop-filter: blur(10px);
    padding: 21px;
    border-radius: 15px;
    border: 1px solid #fff;
    top: 1%;
  }
}
</style>
