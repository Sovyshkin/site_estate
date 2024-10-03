<script>
import { RouterLink, RouterView } from "vue-router";

export default {
  data() {
    return {};
  },
  methods: {
    async renderMap() {
      ymaps.ready(init); // когда апи готово, инициализируемя карту
      var customMap; // объявим переменную для карты
      async function init() {
        // функция инициализации
        customMap = new ymaps.Map("customMap", {
          // создадим карту выведем ее в див с id="customMap"
          center: [52.940511, 87.917713], // центра карты
          behaviors: ["default", "scrollZoom"], // скроллинг колесом
          zoom: 13, // масштаб карты
          controls: ["zoomControl", "fullscreenControl"], // элементы управления
        });

        customMap.controls.remove("geolocationControl"); // удаляем геолокацию
        customMap.controls.remove("searchControl"); // удаляем поиск
        customMap.controls.remove("trafficControl"); // удаляем контроль трафика
        customMap.controls.remove("typeSelector"); // удаляем тип
        customMap.controls.remove("fullscreenControl"); // удаляем кнопку перехода в полноэкранный режим
        customMap.controls.remove("zoomControl"); // удаляем контрол зуммирования
        customMap.controls.remove("rulerControl"); // удаляем контрол правил
      }
    },
  },
  mounted() {
    this.renderMap();
  },
};
</script>

<template>
  <div id="customMap" class="map"></div>
</template>

<style scoped>
.map {
  width: 90%;
  height: 70vh;
  border: 1px solid #fff;
  box-shadow: 0px 0 10px 0 #ffffff71;
}
</style>
