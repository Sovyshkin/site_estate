<script>
import axios from "axios";
import { RouterLink } from "vue-router";

export default {
  components: {
    RouterLink,
  },
  data() {
    return {
      hotel: 0,
      cottage: 0,
      flat: 0,
      room: 0,
      hostel: 0,
      longterm: 0,
    };
  },
  methods: {
    async notifications() {
      let response = await axios.post(`/notifications`, {
        nameModel: "habitation",
      });

      this.hotel = response.data.hotel;
      this.cottage = response.data.cottage;
      this.flat = response.data.flat;
      this.room = response.data.room;
      this.hostel = response.data.hostel;
      this.longterm = response.data.longterm;
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
      <RouterLink to="/admin/requests?nameModel=hotels&category=habitation">
        <div class="event">Гостиницы</div>
        <div v-if="hotel" class="alert">
          {{ hotel }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=cottage&category=habitation">
        <div class="event">
          Коттеджи <br />
          Дома <br />
          Шале
        </div>
        <div v-if="cottage" class="alert">
          {{ cottage }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=flat&category=habitation">
        <div class="event">Квартиры</div>
        <div v-if="flat" class="alert">
          {{ flat }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=rooms&category=habitation">
        <div class="event">Комнаты</div>
        <div v-if="room" class="alert">
          {{ room }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=hostel&category=habitation">
        <div class="event">Хостел</div>
        <div v-if="hostel" class="alert">
          {{ hostel }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=longterm&category=habitation">
        <div class="event">На длительный срок</div>
        <div v-if="longterm" class="alert">
          {{ longterm }}
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
  cursor: pointer;
  margin-bottom: 10px;
  background-color: transparent;
  flex-basis: 33%;
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
    flex-basis: 47%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
