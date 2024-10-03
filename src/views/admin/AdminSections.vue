<script>
import { RouterLink } from "vue-router";
import axios from "axios";

export default {
  components: {
    RouterLink,
  },
  data() {
    return {
      transfer: 0,
      habitation: 0,
      rental: 0,
      forChildren: 0,
      instructorTours: 0,
      events: 0,
      payments: 0,
    };
  },
  methods: {
    async notifications() {
      let response = await axios.post(`/notifications`, {
        nameModel: "all",
      });

      this.transfer = response.data.transfer;
      this.habitation = response.data.habitation;
      this.rental = response.data.rental;
      this.forChildren = response.data.forChildren;
      this.instructorTours = response.data.instructorTours;
      this.events = response.data.events;
      this.payments = response.data.payments;
    },
  },
  mounted() {
    this.notifications();
  },
};
</script>

<template>
  <ul class="list-events">
    <!-- <div class="wrapper-for-payments">
      <router-link to="/request_payments"
        >Выплаты
        <div v-if="payments" class="alert">
          {{ payments }}
        </div>
      </router-link>
    </div> -->
    <li class="item-event">
      <RouterLink to="/admin/transfer-taksi">
        <div class="event">Трансфер/Такси</div>
        <div v-if="transfer" class="alert">
          {{ transfer }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/habitation">
        <div class="event">Проживание</div>
        <div v-if="habitation" class="alert">
          {{ habitation }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/rental">
        <div class="event">Прокат</div>
        <div v-if="rental" class="alert">
          {{ rental }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/for-children">
        <div class="event">Детям</div>
        <div v-if="forChildren" class="alert">
          {{ forChildren }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/instructor-tours">
        <div class="event">Инструктор/Туры</div>
        <div v-if="instructorTours" class="alert">
          {{ instructorTours }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/events">
        <div class="event">Развлечения</div>
        <div v-if="events" class="alert">
          {{ events }}
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

.wrapper-for-payments {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: fit-content;
  margin-bottom: 20px;
}

.wrapper-for-payments a {
  border: 1px solid #d5d5d5;
  min-width: 140px;
  width: 15%;
  padding: 7px;
  border-radius: 8px;
  box-shadow: 0px 0 10px 0 #ffffff71;

  transition: all 400ms;
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

.event:hover,
.wrapper-for-payments a:hover {
  border: 1px solid black;
  box-shadow: 0px 0 10px 0 black;
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
}
</style>
