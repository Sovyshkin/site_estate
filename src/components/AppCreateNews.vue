<script>
import axios from "axios";

export default {
  data() {
    return {
      success: false,
      message: "",
      title: "",
      content: "",
    };
  },
  methods: {
    async createNews() {
      let response = await axios.post(`/create_news`, {
        title: this.title,
        content: this.content,
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
      placeholder="заголовок"
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
    <div class="create-news" v-if="success">{{ message }}</div>
    <button v-else class="publish" @click="createNews">Опубликовать</button>
  </div>
</template>

<style scoped>
.titleInput {
  padding: 5px 7px;
  background-color: transparent;
  border: 1px solid #d5d5d5;
  box-shadow: 0px 0 10px 0 #ffffff71;
  border-radius: 15px;
  width: 50%;
  color: #fff;

  transition: all 500ms ease;
}

.titleInput::placeholder {
  text-align: center;
  color: #fff;
}

.contentTextarea {
  padding: 10px 15px;
  background-color: transparent;
  border: 1px solid #d5d5d5;
  box-shadow: 0px 0 10px 0 #ffffff71;
  border-radius: 15px;
  width: 60%;
  color: #fff;

  transition: all 500ms ease;
}

.contentTextarea:hover,
.titleInput:hover,
.contentTextarea:active,
.contentTextarea:focus,
.titleInput:active,
.titleInput:focus {
  box-shadow: 0px 0 10px 0 black;
  border: none;
  outline: none;
}

.contentTextarea::placeholder {
  font-size: large;
  text-align: center;
  color: #fff;
}

.create-news {
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #62a87c;
  border-radius: 10px;
  color: #62a87c;
  font-weight: 600;

  transition: all 500ms;
}

.create-news:hover {
  transform: scale(1.06);
}

textarea {
  width: 90%;
  resize: none;
  height: 500px;
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
