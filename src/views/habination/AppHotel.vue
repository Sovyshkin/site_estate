<script>
import { RouterLink } from "vue-router";
import AppCard from "/src/components/AppCard.vue";
import axios from "axios";
export default {
  components: {
    AppCard,
    RouterLink,
  },
  data() {
    return {
      INFO: [],
      category: "",
      admin: "",
      expired: false,
      name: this.$route.query.name,
      title: "",
      datefrom: "",
      dateto: "",
      minprice: "",
      maxprice: "",
      floor: "",
      lease_term: "",
      total_area: "",
      sleeping_rooms: "",
      sleeping_places: "",
      children_bed: "",
      double_places: "",
      single_spaces: "",
      additional_sleeping_places: "",
      bathrooms: "",
      bathrooms_showers: "",
      drying_for_inventory: "",
      wifi: false,
      warm_floor: false,
      dishwasher: false,
      parking_cars: "",
      mall: false,
      kazan: false,
      bath_territory: false,
      pool: false,
      poolAllYear: false,
      poolOnlySummer: false,
      poolOpen: false,
      poolClose: false,
      poolHeating: false,
      transfer_city: "",
      transfer_mountain: "",
      live_whith_animals: "",
      filters: 0,
      id: "",
    };
  },
  mounted() {
    this.loadCategory();
    this.check_admin();
    this.loadInfo();
  },
  methods: {
    loadCategory() {
      if (this.$route.path.includes("habitation")) {
        this.category = "habitation";
      }
    },

    async check_admin() {
      this.id = this.getCookieValue("id");
      let response = await axios.post(`/check_admin`, {
        id: this.id,
      });
      console.log(this.id);
      this.admin = response.data.admin;
    },

    async loadInfo() {
      if (this.category == "habitation") {
        let response = await axios.post(`/habitation`, {
          id: this.getCookieValue("id"),
          category: "habitation",
          name: this.$route.query.name,
        });
        this.INFO = response.data.cards.reverse();
        this.admin = response.data.admin;
        this.expired = response.data.expired;
        if (this.expired) {
          this.$router.push({ path: `/login` });
        }
      }
      if (this.$route.path == `/event/items`) {
        let events = await axios.post(`/event`, {
          id: this.getCookieValue("id"),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = events.data.cards.reverse();
        this.admin = events.data.admin;
        this.expired = events.data.expired;
      }
      if (this.$route.path == `/rental/items`) {
        let rental = await axios.post(`/rental`, {
          id: this.getCookieValue("id"),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = rental.data.cards.reverse();
        this.admin = rental.data.admin;
        this.expired = rental.data.expired;
      }
      if (this.$route.path == `/forChildren/items`) {
        let forChildren = await axios.post(`/forChildren`, {
          id: this.getCookieValue("id"),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = forChildren.data.cards.reverse();
        this.admin = forChildren.data.admin;
        this.expired = forChildren.data.expired;
      }
      if (this.$route.path == `/instructor-tours/items`) {
        let InstructorTours = await axios.post(`/instructor-tours`, {
          id: this.getCookieValue("id"),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = InstructorTours.data.cards.reverse();
        this.admin = InstructorTours.data.admin;
        this.expired = InstructorTours.data.expired;
      }
      if (this.$route.path == `/ads/items`) {
        let ads = await axios.post(`/ads`, {
          id: this.getCookieValue("id"),
          category: this.$route.path.slice(1, -6),
          name: this.$route.query.name,
        });
        this.INFO = ads.data.cards.reverse();
        this.admin = ads.data.admin;
        this.expired = ads.data.expired;
      }
    },

    getCookieValue(name) {
      const cookies = document.cookie.split("; ");
      let res;
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        if (cookie.slice(0, 2) == name) {
          res = cookie.replace(name + "=", "");
        }
      }
      return res;
    },

    open(id) {
      this.$router.push({
        path: "/card",
        query: { id: id, name: this.$route.path.slice(1, -6) },
      });
    },
    async createNumber(i) {
      let response = await axios.post(`/create-number`, {
        title: this.title,
        adults: this.adults,
        children: this.children,
        description: this.description,
        hotel: this.$route.query.id,
        value: this.value,
        price: this.price,
        floor: this.workbook[i]["Этажей"],
        lease_term: this.workbook[i]["Минимальный срок аренды, суток"],
        total_area: this.workbook[i]["общая площадь, кв м"],
        sleeping_rooms: this.workbook[i]["спальных комнат"],
        sleeping_places: this.workbook[i]["спальных мест основных"],
        children_bed: this.workbook[i]["Детская кровать"],
        double_places: this.workbook[i]["двуспальные места"],
        single_spaces: this.workbook[i]["односпальные места"],
        additional_sleeping_places:
          this.workbook[i]["дополнительные спальные места"],
        bathrooms: this.workbook[i]["санузлов"],
        bathrooms_showers: this.workbook[i]["ванных/душевых"],
        drying_for_inventory: this.workbook[i]["сушилка для инвентаря"],
        wifi: this.workbook[i]["Wi-Fi"],
        warm_floor: this.workbook[i]["Тёплый пол"],
        dishwasher: this.workbook[i]["посудомойка"],
        parking_cars: this.workbook[i]["парковка, машин"],
        mall: this.workbook[i]["мангал"],
        kazan: this.workbook[i]["казан"],
        bath_territory: this.workbook[i]["баня на территории"],
        pool: this.workbook[i]["Бассейн Летом/зимой"],
        transfer_city: this.workbook[i]["Трансфер с городов"],
        transfer_mountain: this.workbook[i]["Трансфер на гору"],
        live_whith_animals: this.workbook[i]["Можно проживать с животными"],
        additionally: this.workbook[i]["дополнительно"],
      });
      if (response.data.status == 200) {
        this.title = ``;
        this.adults = ``;
        this.children = ``;
        this.description = ``;
        this.value = ``;
        this.price = ``;
        this.buttonTarg = 1;
        setTimeout(() => {
          this.buttonTarg = 0;
        }, 1000);
      }
    },

    async search() {
      let response = await axios.post(`/search_habitation`, {
        params: {
          title: this.title,
          floor: this.floor,
          lease_term: this.lease_term,
          total_area: this.total_area,
          sleeping_rooms: this.sleeping_rooms,
          sleeping_places: this.sleeping_places,
          children_bed: this.children_bed,
          double_places: this.double_places,
          single_spaces: this.single_spaces,
          additional_sleeping_places: this.additional_sleeping_places,
          bathrooms: this.bathrooms,
          bathrooms_showers: this.bathrooms_showers,
          drying_for_inventory: this.drying_for_inventory,
          wifi: this.wifi,
          warm_floor: this.warm_floor,
          dishwasher: this.dishwasher,
          parking_cars: this.parking_cars,
          mall: this.mall,
          kazan: this.kazan,
          bath_territory: this.bath_territory,
          pool: this.pool,
          poolAllYear: this.poolAllYear,
          poolOnlySummer: this.poolOnlySummer,
          poolOpen: this.poolOpen,
          poolClose: this.poolClose,
          poolHeating: this.poolHeating,
          transfer_city: this.transfer_city,
          transfer_mountain: this.transfer_mountain,
          live_whith_animals: this.live_whith_animals,
        },
        datefrom: this.datefrom,
        dateto: this.dateto,
        minprice: this.minprice,
        maxprice: this.maxprice,
      });
      this.INFO = response.data.INFO;
      this.filters = 0;
    },

    async reset() {
      this.title = "";
      this.datefrom = "";
      this.dateto = "";
      this.minprice = "";
      this.maxprice = "";
      this.floor = "";
      this.lease_term = "";
      this.total_area = "";
      this.sleeping_rooms = "";
      this.sleeping_places = "";
      this.children_bed = "";
      this.double_places = "";
      this.single_spaces = "";
      this.additional_sleeping_places = "";
      this.bathrooms = "";
      this.bathrooms_showers = "";
      this.drying_for_inventory = "";
      this.wifi = "";
      this.warm_floor = "";
      this.dishwasher = "";
      this.parking_cars = "";
      this.mall = "";
      this.kazan = "";
      this.bath_territory = "";
      this.pool = "";
      this.poolAllYear = "";
      this.poolOnlySummer = "";
      this.poolOpen = "";
      this.poolClose = "";
      this.poolHeating = "";
      this.transfer_city = "";
      this.transfer_mountain = "";
      this.live_whith_animals = "";
      await this.loadInfo();
    },
  },
};
</script>

<template>
  <div class="info_open" ref="modal" :class="{ 'd-none': filters == 0 }">
    <header class="title_info">
      <h2>Фильтры</h2>
      <button
        type="button"
        @click="filters = 0"
        class="btn-close"
        aria-label="Close"
      ></button>
    </header>
    <main class="main_info">
      <div class="group">
        <label for="title">Название:</label>
        <input type="text" name="" id="title" v-model="title" required />
      </div>
      <div class="group">
        <label for="datefrom">с</label>
        <input type="date" id="datefrom" v-model="datefrom" />
      </div>
      <div class="group">
        <label for="dateto">по</label>
        <input type="date" id="dateto" v-model="dateto" />
      </div>
      <div class="group">
        <label for="min_price">Минимальная цена</label>
        <input v-model="minprice" type="number" name="" id="min_price" />
      </div>
      <div class="group">
        <label for="max_price">Максимальная цена</label>
        <input v-model="maxprice" type="number" name="" id="max_price" />
      </div>
      <div class="group">
        <label for="floor">Этажей:</label>
        <input type="number" name="" id="floor" v-model="floor" required />
      </div>
      <div class="group">
        <label for="lease_term">Минимальный срок аренды, суток:</label>
        <input
          type="number"
          name=""
          id="lease_term"
          v-model="lease_term"
          required
        />
      </div>
      <div class="group">
        <label for="total_area">Общая площадь, кв м:</label>
        <input
          type="number"
          name=""
          id="total_area"
          v-model="total_area"
          required
        />
      </div>
      <div class="group">
        <label for="sleeping_rooms">Спальных комнат:</label>
        <input
          type="number"
          name=""
          id="sleeping_rooms"
          v-model="sleeping_rooms"
          required
        />
      </div>
      <div class="group">
        <label for="sleeping_places">Спальных мест основных:</label>
        <input
          type="number"
          name=""
          id="sleeping_places"
          v-model="sleeping_places"
          required
        />
      </div>
      <div class="group">
        <label for="children_bed">Детская кровать:</label>
        <input
          type="number"
          name=""
          id="children_bed"
          v-model="children_bed"
          required
        />
      </div>
      <div class="group">
        <label for="double_places">Двуспальные места:</label>
        <input
          type="number"
          name=""
          id="double_places"
          v-model="double_places"
          required
        />
      </div>
      <div class="group">
        <label for="single_spaces">Односпальные места:</label>
        <input
          type="number"
          name=""
          id="single_spaces"
          v-model="single_spaces"
          required
        />
      </div>
      <div class="group">
        <label for="additional_sleeping_places"
          >Дополнительные спальные места:</label
        >
        <input
          type="number"
          name=""
          id="additional_sleeping_places"
          v-model="additional_sleeping_places"
        />
      </div>
      <div class="group">
        <label for="bathrooms">Санузлов:</label>
        <input
          type="number"
          name=""
          id="bathrooms"
          v-model="bathrooms"
          required
        />
      </div>
      <div class="group">
        <label for="bathrooms_showers">Ванных/Душевых:</label>
        <input
          type="number"
          name=""
          id="bathrooms_showers"
          v-model="bathrooms_showers"
          required
        />
      </div>
      <div class="group">
        <label for="parking_cars">Парковка, машин:</label>
        <input
          type="number"
          name=""
          id="parking_cars"
          v-model="parking_cars"
          required
        />
      </div>
      <div class="group">
        <label for="transfer_city">Трансфер из городов:</label>
        <input
          type="text"
          name=""
          id="transfer_city"
          v-model="transfer_city"
          required
        />
      </div>
      <div class="group">
        <label for="transfer_mountain">Трансфер на гору:</label>
        <input
          type="text"
          name=""
          id="transfer_mountain"
          v-model="transfer_mountain"
          required
        />
      </div>
      <div class="group-check">
        <label class="lb-group" for="drying_for_inventory">
          Сушилка для инвентаря
        </label>
        <input
          type="checkbox"
          name=""
          id="drying_for_inventory"
          v-model="drying_for_inventory"
          required
        />
      </div>
      <div class="group-check">
        <label class="lb-group" for="wifi">Wi-Fi</label>
        <input type="checkbox" name="" id="wifi" v-model="wifi" required />
      </div>
      <div class="group-check">
        <label class="lb-group" for="warm_floor">Тёплый пол</label>
        <input
          type="checkbox"
          name=""
          id="warm_floor"
          v-model="warm_floor"
          required
        />
      </div>
      <div class="group-check">
        <label class="lb-group" for="dishwasher">Посудомойка</label>
        <input
          type="checkbox"
          name=""
          id="dishwasher"
          v-model="dishwasher"
          required
        />
      </div>
      <div class="group-check">
        <label class="lb-group" for="mall">Мангал</label>
        <input type="checkbox" name="" id="mall" v-model="mall" required />
      </div>
      <div class="group-check">
        <label class="lb-group" for="kazan">Казан</label>
        <input type="checkbox" name="" id="kazan" v-model="kazan" required />
      </div>
      <div class="group-check">
        <label class="lb-group" for="bath_territory">Баня на территории</label>
        <input
          type="checkbox"
          name=""
          id="bath_territory"
          v-model="bath_territory"
          required
        />
      </div>
      <div class="group">
        <span>Бассейн</span>
        <ul class="list-pool">
          <li class="item-pool">
            <label class="lb-group" for="pool">Нет</label>
            <input type="checkbox" v-model="pool" id="pool" />
          </li>
          <li class="item-pool">
            <label class="lb-group" for="poolAllYear">Есть весь год</label>
            <input type="checkbox" v-model="poolAllYear" id="poolAllYear" />
          </li>
          <li class="item-pool">
            <label class="lb-group" for="poolOnlySummer"
              >Только в летний период</label
            >
            <input
              type="checkbox"
              v-model="poolOnlySummer"
              id="poolOnlySummer"
            />
          </li>
          <li class="item-pool">
            <label class="lb-group" for="poolOpen">Открытый</label>
            <input type="checkbox" v-model="poolOpen" id="poolOpen" />
          </li>
          <li class="item-pool">
            <label class="lb-group" for="poolClose">Крытый</label>
            <input type="checkbox" v-model="poolClose" id="poolClose" />
          </li>
          <li class="item-pool">
            <label class="lb-group" for="poolHeating">С подогревом</label>
            <input type="checkbox" v-model="poolHeating" id="poolHeating" />
          </li>
        </ul>
      </div>
      <div class="group-check">
        <label class="lb-group" for="live_whith_animals">
          Проживание с животными:
        </label>
        <input
          type="checkbox"
          name=""
          id="live_whith_animals"
          v-model="live_whith_animals"
          required
        />
      </div>
    </main>
    <div class="button-wrapper">
      <button @click="search" class="btn btn-primary btn-search">
        Показать
      </button>
      <button
        class="btn btn-light btn-cancel"
        type="button"
        @click="this.filters = 0"
      >
        Закрыть
      </button>
    </div>
  </div>
  <div class="hotel-wrapper" v-if="!filters">
    <div
      v-if="this.$route.query.publish != 'undefined'"
      class="cols create-card"
    >
      <RouterLink
        :to="
          `/create-card?name=` +
          $route.query.name +
          `&category=${this.category}`
        "
        class="publish"
      >
        Опубликовать объявление
      </RouterLink>
    </div>
    <div class="filter">
      <input
        type="text"
        name="search"
        v-model="title"
        id=""
        class="search"
        placeholder="Название"
      />
      <button @click="this.filters = 1" class="btn btn-info">Фильтры</button>
      <button @click="search" class="btn btn-primary btn-search">
        Показать
      </button>
      <span @click="reset" class="reset">Сбросить</span>
    </div>
    <div class="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2">
      <div v-for="(cardInfo, index) in INFO" class="cols" :key="index">
        <AppCard
          :i="index"
          :title="cardInfo.title"
          :img="cardInfo.img"
          :price="cardInfo.price"
          :p="cardInfo.p"
          :id="cardInfo.id"
          :nameCard="cardInfo.category"
        />
      </div>
    </div>
    <div v-if="INFO.length == 0 || !INFO" class="empty">
      <img src="../../assets/empty.png" alt="" /><span>Пусто...</span>
    </div>
  </div>
</template>

<style scoped>
input[type="file"] {
  display: none !important;
}

label {
  cursor: pointer;
}

.reset {
  cursor: pointer;
  text-decoration: underline;
  color: #5bc0eb;
}

.info_open {
  border-radius: 15px;
  height: 70vh;
  padding: 15px;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  overflow-x: hidden;
  overflow-y: scroll;
}

.title_info {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close {
  position: absolute;
  top: 5%;
  right: 1%;
}

.main_info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.button-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.group {
  display: flex;
  flex-direction: column;
}

.group-check {
  display: flex;
  align-items: center;
  gap: 5px;
}

.list-pool {
  list-style-type: none;
  margin-left: 20px;
}

.item-pool {
  display: flex;
  gap: 10px;
  font-size: 0.8rem;
}

.item-pool input {
  box-shadow: none !important;
}
.lb-group {
  width: auto;
  border: none;
  display: block;
}

.filter {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.search {
  border: none;
  border-radius: 10px;
  padding: 6px;
  max-width: 130px;
  box-shadow: 0 0 8px 0 #2c363f;
}

.btn-primary,
.btn-info,
.btn-cancel {
  box-shadow: 0 0 8px 0 #2c363f;
}

.price {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #fff;
}
.price label {
  cursor: pointer;
}

.group input {
  border: none;
  border-radius: 10px;
  padding: 7px 5px;
  box-shadow: 0 0 8px 0 #2c363f;
}

.price input {
  max-width: 70px;
  border: none;
  border-radius: 10px;
  padding: 3px 4px;
  box-shadow: 0 0 8px 0 #2c363f;
}
.container {
  align-items: flex-start !important;
}
.create-card {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.create-card .group label,
a {
  text-align: center;
}

.publish:hover {
  transform: scale(1.06);
}

.excel {
  cursor: pointer;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1.7rem;
  color: #fff;
  height: 55vh;
}

.empty img {
  height: 70px;
}
.cross {
  border: 4px dotted var(--mainColor);
  min-height: 290px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

.cross:hover {
  box-shadow: 0 0 10px 0 var(--mainColor);
  transform: scale(105%);
}
.line {
  transform: rotate(0deg) !important;
  width: 20% !important;
}
.line:last-child {
  transform: rotate(90deg) !important;
  display: block;
}
.cross .line:last-child {
  display: block;
}
.row {
  width: 100%;
  height: auto;
}
.cols {
  padding: 10px;
}
.hotel-wrapper {
  height: 70vh;
  padding: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  overflow-x: hidden;
  overflow-y: scroll;
}
.hotel-wrapper::-webkit-scrollbar {
  width: 0;
}

@media (max-width: 490px) {
  .create-card .group {
    align-items: stretch;
  }
}

@media (max-width: 770px) {
  .create-card .group {
    align-items: stretch;
    max-height: 60px;
  }
  .create-card .group label {
    font-size: 0.8rem;
    line-height: 15px;
  }
}
</style>
