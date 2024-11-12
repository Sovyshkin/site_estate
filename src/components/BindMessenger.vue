<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      number: "+7",
      error: "",
      status: "",
      messenger: "",
      chatID: "",
    };
  },
  computed: {
    formatPhoneNumber() {
      return this.number ? this.number.replace(/[^+\d]/g, "") : "";
    },
  },
  methods: {
    updateValue(e) {
      let input = e.target.value.replace(/[^+\d]/g, "");
      if (input.length > 12) {
        input = input.slice(0, 12);
      }
      if (!input.startsWith("+")) {
        input = "+";
      }
      this.number = input;
      e.target.value = this.formatPhoneNumber;
    },
    async bindms() {
      let response = await axios.post(`/bind_messenger`, {
        id: this.id,
        messenger: this.messenger,
        number: this.number,
        username: this.username,
        chatID: this.chatID,
      });
      this.error = response.data.message;
      this.status = response.data.status;
      setTimeout(() => {
        this.error = "";
        this.status = "";
        this.$router.go(-1);
      }, 4000);
    },

    load_info() {
      this.messenger = this.$route.query.messenger;
      this.id = this.$route.query.id;
    },
  },
  mounted() {
    this.load_info();
  },
};
</script>

<template>
  <div class="wrapper">
    <div class="form-box">
      <h2 class="title">Привязка {{ messenger }}</h2>
      <div class="input-box">
        <input v-model="username" type="text" required id="name" />
        <label for="name" class="name">Имя</label>
      </div>
      <div class="input-box">
        <input
          :value="formatPhoneNumber"
          @input="updateValue($event)"
          type="tel"
          size="20"
          maxlength="12"
          required
          id="number"
        />
        <label for="number" class="number">Номер телефона</label>
      </div>
      <div class="input-box" v-if="messenger == 'Telegram'">
        <input v-model="chatID" type="text" required id="name" />
        <label for="name" class="name">чат ID</label>
      </div>
      <div class="telegramBot" v-if="messenger == 'Telegram'">
        <a href="https://t.me/SNEGINFO_BOT" target="_blank">
          <img class="teleg" src="../assets/telegram.png" alt="" />
          <span class="text"
            >Чтобы получать уведомления по вашему объявлению, перейдите в
            телеграм, нажав на иконку и напишите "/start", получите чат ID</span
          >
        </a>
      </div>
      <div class="group mb-3">
        <button
          @click="bindms"
          class="sign-up-btn"
          :disabled="!(username && number)"
        >
          Привязать
        </button>
      </div>
    </div>
    <div v-if="error" class="notification-container">
      <div :class="{ error: status == 400, success: status == 200 }">
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-weight: 550;
}
.notification-container {
  position: fixed;
  bottom: 3%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.success {
  background-color: #87e752;
  border-radius: 15px;
  padding: 7px 12px;
  color: #fff;
}
.error {
  background-color: #ed1c24;
  border-radius: 15px;
  padding: 7px 12px;
  color: #fff;
  font-weight: 550;
}

.telegramBot {
  padding: 10px 3px;
  transition: all 400ms;
}

.telegramBot a {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-direction: row;

  transition: all 400ms;
}

.telegramBot img:hover {
  transform: scale(1.07);
}

.text {
  font-size: 0.8rem !important;
}

.teleg {
  height: 40px !important;
  width: 40px;

  transition: all 400ms;
}
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70vh;
}

.group a {
  width: 100%;
}

.text {
  font-size: small;
  text-align: center;
}

.form-box,
.wrapper-for-register {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #d5d5d5;
  border: 1px solid #d5d5d5;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0px 0 10px 0 #ffffff71;
  flex-basis: 300px;
}

a {
  color: #d5d5d5 !important;
  text-decoration: none;
}
.input-box {
  position: relative;
  margin: 12px 0;
  width: 100%;
  border-bottom: 2px solid #b3b3b3bc;
}

.call {
  padding: 3px 5px;
  width: fit-content;
  border: 1px solid #d5d5d5;
  background: transparent;
  border-radius: 7px;
  color: #d5d5d5;
}

.input-box input {
  position: relative;
  width: 100%;
  height: 50px;
  background: transparent;
  border: none;
  border-radius: 10px;
  outline: none;
  font-size: 16px;
  padding: 0 35px 0 5px;
  color: #fff;
}

input:focus ~ label,
input[type="email"]:focus ~ label,
input:valid ~ label {
  top: 0px;
}

.input-box label {
  /* color: #fff; */
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  font-size: 16px;
  pointer-events: none;
  transition: 0.3s;
}

.title {
  text-align: center;
}

.sign-up {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 10px;
}

.node {
  color: black;
}

.sign-up-btn {
  background-color: transparent;
  border: 1px solid #d5d5d5;
  color: #d5d5d5;
  backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 5px 7px;
}

@media (max-height: 760px) {
  .form-box {
    flex-basis: 90%;
  }

  .input-box input {
    height: 30px;
  }

  .form-box {
    margin: 15px 0;
  }

  input:focus ~ label,
  input[type="email"]:focus ~ label,
  input:valid ~ label {
    top: -7px;
  }
}
</style>
