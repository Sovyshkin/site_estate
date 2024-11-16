<script>
import { RouterLink } from "vue-router";
import axios from "axios";

export default {
  components: {
    RouterLink,
  },
  data() {
    return {
      skipass: ``,
      admin: false,
      id: "",
    };
  },
  methods: {
    async loadInfo() {
      let response = await axios.post(`/skipass`);
      this.skipass = response.data.skipass;
    },

    async check_admin() {
      this.id = this.getCookieValue("id");
      let response = await axios.post(`/check_admin`, {
        id: this.id,
      });
      this.admin = response.data.admin;
    },

    async delete_skipass(id) {
      await axios.post(`/delete_skipass`, {
        id: id,
      });
      this.loadInfo();
    },

    async edit_skipass(id) {
      this.$router.push({
        name: "skipasscreate",
        query: { id: id, edit: true },
      });
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
  },
  mounted() {
    this.check_admin();
    this.loadInfo();
  },
};
</script>

<template>
  <div class="wrapperNews">
    <div class="create-news">
      <RouterLink v-if="id" to="/skipass/create"
        >Опубликовать ски-пасс</RouterLink
      >
      <RouterLink v-if="!id" to="/register">Опубликовать ски-пасс</RouterLink>
    </div>
    <div class="accordion" id="accordionPanelsStayOpenExample">
      <div class="accordion-item" v-for="(item, i) in skipass" :key="i">
        <h2 class="accordion-header" :id="'heading' + i">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#collapse' + i"
            aria-expanded="true"
            :aria-controls="'collapse' + i"
          >
            {{ item.title }}
            <div class="divDelete">
              <button v-if="admin" class="edit" @click="edit_skipass(item.id)">
                Редактировать
              </button>
              <button
                v-if="admin"
                class="delete"
                @click="delete_skipass(item.id)"
              >
                Удалить
              </button>
            </div>
          </button>
        </h2>
        <div
          :id="'collapse' + i"
          class="accordion-collapse collapse"
          :aria-labelledby="'heading' + i"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            {{ item.content }}
          </div>
        </div>
      </div>
      <div v-if="skipass.length == 0 || !skipass" class="empty">
        <img src="../../assets/empty.png" alt="" /><span>Пусто...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-news {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: sticky;
  margin-top: 10px;
  margin-bottom: 10px;
}

.divDelete {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 5px;
  gap: 10px;
  z-index: 10;
}

.delete,
.edit {
  width: fit-content;
  background: transparent;
  color: #ee2e31;
  border: 1px solid #ee2e31;
  border-radius: 10px;
  padding: 5px 10px;
  z-index: 1000000;

  transition: all 400ms;
}

.edit {
  color: #fff;
  border: 1px solid #fff;
}

.delete:hover,
.edit:hover {
  transform: scale(1.07);
}

a {
  width: fit-content;
  padding: 5px 10px;
  border-radius: 10px;
  /* position: absolute; */
  /* top: 10px;
  right: 10px; */
  background: transparent;
  border: 1px solid var(--mainColor);
  color: var(--mainColor);

  transition: scale 500ms;
}

a:hover {
  scale: 1.05;
}

.wrapperNews {
  margin-top: 10px;
  width: 100%;
  height: 70vh;
  overflow-y: scroll;
}

.accordion-body {
  color: var(--mainColor);
}

.wrapperNews::-webkit-scrollbar {
  width: 0;
}

.accordion-item {
  background: transparent;
  border: 1px solid var(--mainColor);
}

.accordion-button {
  border: none;
  padding: 10px !important;
  background: transparent;
  color: var(--mainColor);
  z-index: 9;
}

.accordion-button:focus {
  box-shadow: none;
  border: none;
}

.accordion-button::after {
  background-image: url("/src/assets/arrow-down-sign-to-navigate.png");
  transform: rotate(0);
}

.accordion-button:not(.collapsed)::after {
  background-image: url("/src/assets/arrow-down-sign-to-navigate.png");
  transform: rotate(-180deg);
}

@media screen and (width <=600px) {
  .delete {
    width: fit-content;
    position: absolute;
    background: transparent;
    color: #ee2e31;
    border: 1px solid #ee2e31;
    border-radius: 10px;
    padding: 5px 10px;
    z-index: 1000000;
    font-size: small;
  }
}
</style>
