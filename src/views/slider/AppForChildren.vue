<script>
import { RouterLink } from "vue-router";

export default {
  components: {
    RouterLink,
  },
  data() {},
  methods() {},
  mounted() {},
};
</script>

<template>
  <ul class="list-events">
    <li class="item-event">
      <RouterLink to="/forChildren/items?name=childrenRooms">
        <div class="event">Детские комнаты</div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/forChildren/items?name=nanny">
        <div class="event">Няня</div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/forChildren/items?name=otherEntertainment">
        <div class="event">Другие развлечения</div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/forChildren/items?name=instructor">
        <div class="event">Инструктор</div>
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
.list-events {
  width: 80%;
  height: 100%;
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
  margin-bottom: 15px;
  background-color: transparent;
  flex-basis: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.event {
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

@media (max-width: 995px) {
  .item-event {
    line-height: 1;
    font-size: 13px;
    cursor: pointer;
    margin-bottom: 10px;
    background-color: transparent;
    flex-basis: 47%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@media (max-width: 670px) {
  .event {
    text-align: center;
    width: 85%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 13px;
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
    flex-basis: 51%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@media (max-width: 330px) {
  .item-event {
    cursor: pointer;
    margin-bottom: 10px;
    background-color: transparent;
    flex-basis: 51%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@media (max-height: 780px) {
  .list-events {
    height: 70vh !important;
  }
}
</style>
