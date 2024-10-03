<script>
import axios from "axios";
import { RouterLink } from "vue-router";

export default {
  components: {
    RouterLink,
  },
  data() {
    return {
      inventory: 0,
      hookah: 0,
      transport: 0,
      other: 0,
    };
  },
  methods: {
    async notifications() {
      let response = await axios.post(`/notifications`, {
        nameModel: "rental",
      });

      this.inventory = response.data.inventory;
      this.hookah = response.data.hookah;
      this.transport = response.data.transport;
      this.other = response.data.other;
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
      <RouterLink to="/admin/requests?nameModel=inventory&category=rental">
        <div class="event">
          Инвентарь <br />
          Экипировка
        </div>
        <div v-if="inventory" class="alert">
          {{ inventory }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=hookah&category=rental">
        <div class="event">Кальян</div>
        <div v-if="hookah" class="alert">
          {{ hookah }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=transport&category=rental">
        <div class="event">Транспорт</div>
        <div v-if="transport" class="alert">
          {{ transport }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=other&category=rental">
        <div class="event">Другое</div>
        <div v-if="other" class="alert">
          {{ other }}
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
</style>
