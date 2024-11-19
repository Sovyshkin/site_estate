<script>
import axios from "axios";

export default {
  data() {
    return {
      bans: 0,
      massage: 0,
      restaurants: 0,
      nightClubs: 0,
      hoofing: 0,
      karaoke: 0,
      ratrak: 0,
      helicopter: 0,
      zoos: 0,
    };
  },
  methods: {
    async notifications() {
      let response = await axios.post(`/notifications`, {
        nameModel: "events",
      });

      this.bans = response.data.bans;
      this.massage = response.data.massage;
      this.restaurants = response.data.restaurants;
      this.nightClubs = response.data.nightClubs;
      this.hoofing = response.data.hoofing;
      this.karaoke = response.data.karaoke;
      this.ratrak = response.data.ratrak;
      this.helicopter = response.data.helicopter;
      this.zoos = response.data.zoos;
    },
  },
  mounted() {
    this.notifications();
  },
};
</script>

<template>
  <ul class="list-events">
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=bans&category=events">
        <div class="event">
          Бани <br />
          Сауны <br />
          Бассейны
        </div>
        <div v-if="bans" class="alert">
          {{ bans }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=massage&category=events">
        <div class="event">
          Массаж <br />
          СПА
        </div>
        <div v-if="massage" class="alert">
          {{ massage }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=restaurants&category=events">
        <div class="event">
          Рестораны <br />
          Кафе
        </div>
        <div v-if="restaurants" class="alert">
          {{ restaurants }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=nightClubs&category=events">
        <div class="event">Ночные клубы</div>
        <div v-if="nightClubs" class="alert">
          {{ nightClubs }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=hoofing&category=events">
        <div class="event">Кальянные</div>
        <div v-if="hoofing" class="alert">
          {{ hoofing }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=karaoke&category=events">
        <div class="event">Караоке</div>
        <div v-if="karaoke" class="alert">
          {{ karaoke }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=ratrak&category=events">
        <div class="event">
          Ратрак <br />
          Снегоход
        </div>
        <div v-if="ratrak" class="alert">
          {{ ratrak }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=helicopter&category=events">
        <div class="event">
          Вертолёт <br />
          Параплан
        </div>
        <div v-if="helicopter" class="alert">
          {{ helicopter }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=zoos&category=events">
        <div class="event">
          Зоопарки <br />
          Музеи
        </div>
        <div v-if="zoos" class="alert">
          {{ zoos }}
        </div>
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
a {
  position: relative;
}
.alert {
  position: absolute;
  top: 5%;
  right: 3%;
  padding: 2px;
  background-color: #ed1c24;
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-weight: 550;
}
.list-events {
  width: 100%;
  height: 100%;
  list-style-type: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
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
    overflow: scroll;
    display: grid;
  }
}
</style>
