<script>
import { RouterLink } from "vue-router";
import axios from "axios";

export default {
  components: {
    RouterLink,
  },
  data() {
    return {
      NEWS: ``,
      admin: false,
    };
  },
  methods: {
    async loadNews() {
      await axios
        .post(`/news`, {
          id: this.getCookieValue("id"),
        })
        .then((e) => {
          this.NEWS = e.data.news;
          this.admin = e.data.admin;
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

    async deleteNews(id) {
      await axios.post(`/delete_news`, {
        id: id,
      });
      this.loadNews();
    },
  },
  mounted() {
    this.loadNews();
  },
};
</script>

<template>
  <div class="wrapperNews">
    <div v-if="admin" class="create-news">
      <RouterLink to="/create-news" class="publish"
        >Опубликовать новость</RouterLink
      >
    </div>
    <div class="accordion" id="accordionExample">
      <div class="accordion-item" v-for="(news, i) in NEWS" :key="i">
        <h2 class="accordion-header" :id="'heading' + i">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#collapse' + i"
            aria-expanded="true"
            :aria-controls="'collapse' + i"
          >
            {{ news.title }}
            <div class="divDelete">
              <button
                class="btn btn-danger btn-delete"
                v-if="admin"
                @click="deleteNews(news.id)"
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
            {{ news.content }}
          </div>
        </div>
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
  justify-content: end;
  align-items: center;
  margin-right: 10px;
  z-index: 10;
}

.wrapperNews {
  margin-top: 10px;
  width: 100%;
  height: 65vh;
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
  transform: none !important;
}

.accordion-button:focus,
.accordion-button:hover {
  box-shadow: none;
  border: none;
  transform: none !important;
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

@media (max-height: 780px) {
  .wrapperNews {
    min-height: 100%;
  }
}
</style>
