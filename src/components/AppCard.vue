<script>
export default {
  props: {
    img: String,
    title: String,
    p: String,
    price: Number,
    i: Number,
    id: Number,
    children: Number,
    adults: Number,
    target: Number,
    nameCard: String,
    fromMyAds: Boolean,
    done: Boolean,
  },
  data() {},
  methods: {
    open() {
      if (this.fromMyAds) {
        this.$router.push({
          path: "/card",
          query: { id: this.id, name: this.nameCard, edit: this.fromMyAds },
        });
      } else {
        this.$router.push({
          path: "/card",
          query: { id: this.id, name: this.nameCard },
        });
      }
    },
    sendVariable() {
      this.$emit("variable", { target: 1, numberid: this.i });
    },
  },
  mounted() {},
};
</script>

<template>
  <div class="card">
    <img
      v-if="img"
      class="card-img-top"
      @click="open"
      :src="'/assets/' + Array.from(img)[0]"
      alt=""
    />
    <div class="card-body">
      <h5 class="card-title">
        <span class="title">{{ title }}</span>
        <span class="price" v-if="price">{{ price }} руб</span>
      </h5>
      <div class="accordion" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingThree">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#collapse` + i"
              aria-expanded="false"
              :aria-controls="`collapse` + i"
            >
              Подробнее
            </button>
          </h2>
          <div
            :id="`collapse` + i"
            class="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <p v-if="children" class="card-text">
                Мест для детей: {{ children }}
              </p>
              <p v-if="adults" class="card-text">
                Мест для взрослых: {{ adults }}
              </p>
              <p class="card-text">{{ p }}</p>
              <button
                class="btn btn-light"
                @click="sendVariable"
                v-if="children"
              >
                Забронировать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="done" class="done">Снято с публикации</div>
  </div>
</template>

<style scoped>
.accordion-body button {
  display: block;
  margin: 0 auto;
  border: none;
  width: 100%;
  padding: 5px 0;
  box-shadow: 0 0 10px 0 #00000037;
}
img {
  width: auto;
  max-height: 180px;
  min-height: 180px;
  object-fit: cover;
  border-radius: 15px 15px 0 0;
}
.price {
  font-size: 13px;
}
h5 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card {
  color: var(--mainColor);
  background-color: transparent;
  cursor: pointer;
  min-height: 290px;
  box-shadow: 0 0 10px 0 black;
  border-radius: 15px;
  position: relative;

  transition: all 400ms;
}
.card:hover {
  box-shadow: 0 0 10px 0 var(--mainColor);
  transform: scale(105%);
}
</style>
