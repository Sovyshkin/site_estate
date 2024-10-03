<script>
import { RouterLink } from "vue-router";

export default {
  components: { RouterLink },
  data() {},
  methods() {},
  mounted() {},
};
</script>

<template>
  <ul class="list-events">
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=found&category=ads">
        <div class="event">Найдено</div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=lost&category=ads">
        <div class="event">Потеряно</div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=selling&category=ads">
        <div class="event">
          Продам <br />
          Сдам в аренду
        </div>
      </RouterLink>
    </li>
    <li class="item-event">
      <RouterLink to="/admin/requests?nameModel=willbuy&category=ads">
        <div class="event">
          Куплю <br />
          Возьму в аренду
        </div>
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
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
