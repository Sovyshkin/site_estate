<script>
import { RouterLink } from "vue-router";

export default {
  components: {
    RouterLink,
  },
  data() {
    return {
      id: "",
    };
  },
  methods: {},
  mounted() {},
};
</script>

<template>
  <ul class="list-events">
    <li class="item-event">
      <RouterLink to="/info">
        <div class="event">
          Информация
          <img src="../../assets/event_info.avif" alt="" />
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/transfer-taksi">
        <div class="event transfer">
          Трансфер/Такси
          <img src="../../assets/event_transfer.jpeg" alt="" />
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/habitation">
        <div class="event habitation">
          Проживание
          <img src="https://trisovy.ru/images/pages/3/thumbs/3.jpg" alt="" />
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/rental">
        <div class="event">
          Прокат
          <img src="../../assets/event_rental.jpeg" alt="" />
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/forChildren">
        <div class="event transfer">
          Детям
          <img src="../../assets/event_children.jpeg" alt="" />
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/instructor-tours">
        <div class="event">
          Инструктор/Туры
          <img src="../../assets/event_instructor.jpeg" alt="" />
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/events">
        <div class="event">
          Развлечения
          <img src="../../assets/event_events.jpg" alt="" />
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/news">
        <div class="event transfer">
          Новости
          <img src="../../assets/event_news.jpeg" alt="" />
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/ads">
        <div class="event">
          Объявления
          <img src="../../assets/event_ads.jpeg" alt="" />
        </div>
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
.list-events {
  width: 100%;
  height: 70vh;
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.item-event {
  cursor: pointer;
  margin-bottom: 10px;
  background-color: transparent;
  flex-basis: 33%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.event {
  position: relative;
  text-align: center;
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 125px;
  font-size: large;
  font-weight: 550;
  padding: 7px 10px;
  color: #d5d5d5;
  border: 1px solid #d5d5d5;
  box-shadow: 0px 0 10px 0 #ffffff71;
  border-radius: 15px;
  transition: all 400ms;
}

.event:hover {
  border: 1px solid black;
  box-shadow: 0px 0 10px 0 black;
}

.event img {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  border-radius: 15px;
  opacity: 0;
  transition: all 500ms;
}

.event:hover img {
  opacity: 1;
}

.transfer {
  transition: all 500ms;
}

.transfer:hover {
  color: black;
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
    cursor: pointer;
    margin-bottom: 10px;
    background-color: transparent;
    flex-basis: 47%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .list-events {
    display: block;
    overflow-y: scroll;
  }
}
</style>
