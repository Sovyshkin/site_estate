<script>
import axios from "axios";

export default {
  data() {
    return {
      childrenRooms: 0,
      nanny: 0,
      otherEntertainment: 0,
      instructor: 0,
    };
  },
  methods: {
    async notifications() {
      let response = await axios.post(`/notifications`, {
        nameModel: "forChildren",
      });

      this.childrenRooms = response.data.childrenRooms;
      this.nanny = response.data.nanny;
      this.otherEntertainment = response.data.otherEntertainment;
      this.instructor = response.data.instructor;
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
      <RouterLink
        to="/admin/requests?nameModel=childrenRooms&category=forChildren"
      >
        <div class="event">Детские комнаты</div>
        <div v-if="childrenRooms" class="alert">
          {{ childrenRooms }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=nanny&category=forChildren">
        <div class="event">Няня</div>
        <div v-if="nanny" class="alert">
          {{ nanny }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink
        to="/admin/requests?nameModel=otherEntertainment&category=forChildren"
      >
        <div class="event">Другие развлечения</div>
        <div v-if="otherEntertainment" class="alert">
          {{ otherEntertainment }}
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink
        to="/admin/requests?nameModel=instructor&category=forChildren"
      >
        <div class="event">Инструктор</div>
        <div v-if="instructor" class="alert">
          {{ instructor }}
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
