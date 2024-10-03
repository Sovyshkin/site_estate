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
      <RouterLink to="/event/items?name=bans">
        <div class="event">
          Бани <br />
          Сауны <br />
          Бассейны
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/event/items?name=massage">
        <div class="event">
          Массаж <br />
          СПА
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/event/items?name=restaurants">
        <div class="event">
          Рестораны <br />
          Кафе
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/event/items?name=nightClubs">
        <div class="event">Ночные клубы</div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/event/items?name=hoofing">
        <div class="event">Кальянные</div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/event/items?name=karaoke">
        <div class="event">Караоке</div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/event/items?name=ratrak">
        <div class="event">
          Ратрак <br />
          Снегоход
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/event/items?name=helicopter">
        <div class="event">
          Вертолёт <br />
          Параплан
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/event/items?name=zoos">
        <div class="event">
          Зоопарки <br />
          Музеи
        </div>
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
  margin-bottom: 10px;
  background-color: transparent;
  flex-basis: 33%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.event {
  text-align: center;
  cursor: pointer;
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
  .list-events {
    padding: 20px 0;
    position: absolute;
    overflow: scroll;
  }

  .event {
    height: 100px;
  }
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
    font-size: 15px;
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
}

@media (max-width: 420px) {
  .list-events {
    padding: 20px 0;
    position: absolute;
    overflow-y: scroll;
    display: block;
    height: 400px;
  }
}

@media (max-height: 780px) {
  .list-events {
    height: 70vh !important;
  }
}
</style>
