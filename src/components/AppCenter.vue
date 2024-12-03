<script>
import { RouterView } from "vue-router";

export default {
  components: { RouterView },
  data() {},
  methods: {
    click_go() {
      this.$router.go(-1);
    },
  },
  mounted() {},
};
</script>

<template>
  <div class="wrapper-main">
    <div class="container">
      <button class="webBack" @click="click_go">
        <img src="../assets/arrow-down-sign-to-navigate.png" alt="" />
      </button>
      <RouterView />
    </div>
  </div>
</template>

<style>
@media (max-width: 420px) {
  .list-events {
    padding: 20px 0 !important;
    position: absolute !important;
    overflow-y: scroll !important;
    display: block !important;
    height: 70vh !important;
  }
}
.webBack {
  background: transparent;
  border: none;
  position: absolute;
  z-index: 14;
  left: 0;
}
.webBack:hover {
  filter: brightness(1000%);
}
.webBack img {
  transform: rotate(90deg);
  width: 30px;
}
.accordion-item {
  background: transparent;
  border: none;
}
.accordion-button {
  border: none;
  background: transparent;
  padding: 0;
  color: var(--mainColor);
}
.accordion-button[aria-expanded="true"] {
  background: transparent;
  color: var(--mainColor);
}
.accordion-button[aria-expanded="true"] .card {
  height: auto !important;
}

.accordion-button:focus {
  box-shadow: none;
  border: none;
}
.accordion-button:not(.collapsed)::after {
  background-image: url("../assets/arrow-down-sign-to-navigate.png");
}
.accordion-button::after {
  background-image: url("../assets/arrow-down-sign-to-navigate.png");
}
img {
  width: auto;
  height: auto;
  border-radius: 5px 5px 0 0;
}
.price {
  font-size: 13px;
}
h5 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/*
.card:hover {
  box-shadow: 0 0 10px 0 var(--mainColor);
  transform: scale(105%);
} */

a {
  width: 70%;
  text-decoration: none;
}
.event {
  width: 100% !important;
}
@media (max-width: 670px) {
  .event {
    text-align: center;
    width: 85%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: medium;
    font-weight: 550;
    padding: 7px 10px;
    color: #d5d5d5;
    border: 1px solid #d5d5d5;
    box-shadow: 0px 0 10px 0 #ffffff71;
    border-radius: 15px;
  }
}

@media (max-width: 507px) {
  .item-event {
    cursor: "";
    margin-bottom: 10px;
    background-color: transparent;
    flex-basis: 47%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.container {
  min-height: 70%;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

::-webkit-scrollbar {
  display: none;
}

@media (max-width: 420px) {
  /* .container {
    display: block;
  } */

  .event {
    height: 75px !important;
  }

  /* .list-events {
    flex-direction: column;
    overflow: scroll;
  } */

  .item-event {
    width: 100%;
  }
}

.wrapper-main {
  height: 80vh;
  width: 100%;
  display: flex;
  align-items: center;
  z-index: 1;
}

@media (max-width: 770px) {
  .container {
    width: 90%;
  }
}

@media (max-width: 450px) {
  .main {
    width: 80%;
  }
}

@media (max-height: 780px) {
  .wrapper-main {
    height: 70vh;
  }

  .container {
    height: 70vh;
    width: 85%;
  }

  .webBack {
    left: -5%;
  }
}

@media (max-height: 710px) {
  .container {
    height: 70vh;
  }
}

@media (max-width: 380px) {
  .container {
    padding: 5px;
  }
}
</style>
