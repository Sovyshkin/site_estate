<script>
export default {
  props: {
    img: Array,
    name: String,
    phone: String,
    description: String,
    id: Number,
    i: Number,
    done: Boolean,
    status: String,
  },
  methods: {
    open() {
      this.$router.push({
        path: "/taxi-delivery/card",
        query: { id: this.id },
      });
    },
  },
  mounted() {},
};
</script>

<template>
  <div class="card">
    <img
      v-if="img.length > 0"
      class="card-img-top"
      @click="open"
      :src="`http://sneginqd.beget.tech/${Array.from(img)[0]}`"
      alt=""
    />
    <div v-else class="wrap_img">
      <img src="../assets/no_image.png" alt="" class="no_image" @click="open" />
    </div>
    <div class="card-body">
      <h5 class="card-title">
        <span class="title">{{ name }}</span>
        <span class="price">{{ phone }}</span>
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
              <p class="card-text">{{ description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="done" class="done">Снято с публикации</div>
    <div
      class="done status"
      v-if="status"
      :class="{
        gr: status == 'Ждет оплаты',
        yel: status == 'Ждет подтверждения',
      }"
    >
      {{ status }}
    </div>
  </div>
</template>

<style scoped>
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

  transition: all 500ms;
}
.card:hover {
  box-shadow: 0 0 10px 0 var(--mainColor);
  transform: scale(1.05);
}
</style>
