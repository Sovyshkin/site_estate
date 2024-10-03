<script>
import { RouterLink } from "vue-router";

export default {
  components: {
    RouterLink,
  },
  data() {
    return {
      active: 0,
      token: document.cookie,
      id: "",
    };
  },
  methods: {
    request() {
      this.id = this.getCookieValue("id");
    },

    getCookieValue(name) {
      const cookies = document.cookie.split("; ");
      let res;
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        if (cookie.slice(0, 2) == name) {
          res = cookie.replace(name + "=", "");
        }
      }
      return res;
    },

    click() {
      this.active == 1 ? (this.active = 0) : (this.active = 1);
    },
    close() {
      if (this.active == 1) {
        this.active = 0;
      }
    },
  },
  watch: {
    token(newtoken) {
      if (newtoken.includes("token=")) {
        this.token = newtoken;
      }
    },
  },

  mounted() {
    this.request();
  },
};
</script>

<template>
  <div class="wrapper-for-nav">
    <div class="navbar">
      <li class="list-item">
        <router-link to="/">
          <img class="logo" src="../assets/img/logo.png" alt="" />
          <span class="list-item-name">Главная</span>
        </router-link>
      </li>
      <li class="list-item">
        <router-link to="/transfer">
          <img class="car" src="../assets/img/bus.png" alt="" />
          <span class="list-item-name">Забронировать трансфер</span>
        </router-link>
      </li>
      <li class="list-item">
        <router-link to="/habitation">
          <img class="bed" src="../assets/img/bed.png" alt="" />
          <span class="list-item-name">Забронировать место</span>
        </router-link>
      </li>
      <li @custom-event="request" class="list-item" v-if="!id">
        <RouterLink to="/register">
          <img class="icon" src="../assets/img/register.png" alt="" />
          <span class="list-item-name">Регистрация</span>
        </RouterLink>
      </li>
      <li @custom-event="request" class="list-item" v-if="id">
        <RouterLink to="/profile">
          <img class="icon" src="../assets/img/profile.png" alt="" />
          <span class="list-item-name">Профиль</span>
        </RouterLink>
      </li>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&display=swap");

:root {
  --highlight: #fff;
}

* {
  box-sizing: border-box;
}

.logo {
  height: 60px;
}

.icon {
  height: 40px;
}

.bed {
  height: 50px;
}

.car {
  height: 60px;
  padding-bottom: 10px;
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
  width: 100%;
  max-width: 500px;
  gap: 70px;
}

.list-item {
  list-style-type: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: #555;
  transform: translateY(0);
  transition: transform 0.5s ease, opacity 0.2s ease;
  cursor: pointer;
}

.list-item-name {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  position: absolute;
  transform: translate(0, 50px);
  transition: transform 0.5s ease, opacity 0.2s ease;
  opacity: 0;
}

.list-item:hover {
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (max-width: 450px) {
  .navbar {
    align-items: center;
    padding-bottom: 20px;
    gap: 25px;
  }

  .list-item {
    flex-basis: auto;
  }

  .list-item:hover {
    .list-item-name {
      transform: translateY(25px);
    }
  }

  .list-item:hover {
    color: var(--highlight);
    transform: translateY(-6px);
    .list-item-name {
      transform: translateY(40px);
      opacity: 1;
    }
  }
}

@media (max-width: 350px) {
  .car {
    height: 45px;
  }

  .bed {
    height: 35px;
  }

  .icon {
    height: 35px;
  }

  .logo {
    height: 40px;
  }
}

@media (max-height: 810px) {
  .navbar {
    padding: 0;
    margin: 0;
    padding-top: 7px;
  }
}
</style>
