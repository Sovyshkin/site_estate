<script>
import axios from "axios";

export default {
  data() {
    return {
      success: false,
      message: "",
      title: "",
      content: "",
      price: "",
      edit: false,
      id: "",
    };
  },
  methods: {
    async createSkipass() {
      let response = await axios.post(`/create_skipass`, {
        title: this.title,
        content: this.content,
        price: this.price,
      });
      this.success = response.data.success;
      this.message = response.data.message;
      if (this.success) {
        setTimeout(() => {
          this.success = false;
          this.message = "";
          this.$router.go(-1);
        }, 1500);
      }
    },

    async loadEdit() {
      this.id = this.$route.query.id;
      this.edit = this.$route.query.edit;
      if (this.edit) {
        let response = await axios.post(`/find_skipass`, {
          id: this.id,
        });
        let skipass = response.data.skipass;
        if (skipass) {
          this.title = skipass.title;
          this.content = skipass.content;
          this.price = skipass.price;
        }
      }
    },

    async editSkipass() {
      let response = await axios.post(`/edit_skipass`, {
        title: this.title,
        content: this.content,
        price: this.price,
        id: this.id,
      });
      this.success = response.data.success;
      this.message = response.data.message;
      if (this.success) {
        setTimeout(() => {
          this.success = false;
          this.message = "";
          this.$router.go(-1);
        }, 1500);
      }
    },
  },

  mounted() {
    this.loadEdit();
  },
};
</script>

<template>
  <div class="wrapperNews mt-1 mb-1">
    <input
      v-model="title"
      type="text"
      name="title"
      class="titleInput"
      id=""
      placeholder="название"
    />

    <textarea
      v-model="content"
      name="content"
      id=""
      class="contentTextarea"
      placeholder="контент"
      cols="50"
      rows="10"
    ></textarea>

    <input
      type="number"
      placeholder="цена"
      v-model="price"
      class="priceInput"
      name="price"
    />
    <div v-if="!edit">
      <div class="create-news" v-if="success">{{ message }}</div>
      <button v-if="!success" class="create-news" @click="createSkipass">
        Опубликовать
      </button>
    </div>
    <div v-else>
      <div v-if="success" class="create-news">{{ message }}</div>
      <button v-if="!success" class="create-news" @click="editSkipass">
        Сохранить
      </button>
    </div>
  </div>
</template>

<style scoped>
* {
  color: #fff;
}

.titleInput,
.priceInput {
  padding: 5px 7px;
  background-color: transparent;
  border: 1px solid #d5d5d5;
  box-shadow: 0px 0 10px 0 #ffffff71;
  border-radius: 15px;
  width: 50%;
}

.priceInput {
  width: 30% !important;
}

.titleInput::placeholder,
.priceInput::placeholder {
  text-align: center;
  font-weight: 500;
  color: black;

  opacity: 0.8;
}

.contentTextarea {
  padding: 10px 15px;
  background-color: transparent;
  border: 1px solid #d5d5d5;
  box-shadow: 0px 0 10px 0 #ffffff71;
  border-radius: 15px;
  width: 60%;
}

.contentTextarea::placeholder {
  font-size: large;
  text-align: center;
  font-weight: 500;
  color: black;
  opacity: 0.6;
}

.create-news {
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #62a87c;
  border-radius: 10px;
  color: #62a87c;
  font-weight: 600;

  transition: scale 500ms;
}

.create-news:hover {
  scale: 1.06;
}

textarea {
  width: 90%;
  resize: none;
  height: 420px;
}

.wrapperNews {
  width: 100%;
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 65vh;
}

@media (max-width: 768px) {
  .contentTextarea {
    width: 80%;
  }
}
</style>
