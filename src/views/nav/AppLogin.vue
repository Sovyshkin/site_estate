<script>
import { RouterLink } from "vue-router";
import axios from "axios";
export default {
  components: {
    RouterLink,
  },
  data() {
    return {
      email: ``,
      password: ``,
      passType: "password",
      token: ``,
      error: false,
      status: Number,
      id: "",
      idc: "",
    };
  },
  methods: {
    async submit() {
      let error = await axios.post(`/login`, {
        email: this.email,
        password: this.password,
      });
      this.error = error.data.message;
      this.status = error.data.status;
      this.token = error.data.token;
      this.id = error.data.id;
      if (this.token) {
        document.cookie = `token=${this.token}; max-age=0`;
        document.cookie = `id=${this.id}; max-age=0`;
        document.cookie = `token=${this.token}; max-age=1123200`;
        document.cookie = `id=${this.id}; max-age=1123200`;
      }
      setTimeout(() => {
        if (this.status == 200) {
          location.reload();
        }
      }, 1000);
      setTimeout(() => {
        (this.error = ``), (this.status = ``);
        if (error) {
          (this.email = ``), (this.password = ``);
        }
      }, 3000000);
    },
    start() {
      this.idc = this.getCookieValue("id");
      if (this.idc) {
        this.$router.push({ name: "home" });
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
  },
  mounted() {
    this.start();
  },
};
</script>

<template>
  <div class="wrapper">
    <div class="form-box">
      <h2 class="title">Вход</h2>
      <div class="input-box">
        <input
          v-model="email"
          name="email"
          type="email"
          class="email"
          required
        />
        <label for="">Почта</label>
      </div>
      <div class="input-box pas">
        <input
          v-model="password"
          name="password"
          :type="passType"
          class="password"
          required
        />
        <label for="">Пароль</label>
        <img
          v-if="passType == 'text'"
          class="show"
          src="@/assets/img/show.png"
          alt=""
          @click="this.passType = 'password'"
        />
        <img
          v-if="passType == 'password'"
          class="show"
          src="@/assets/img/hidden.png"
          alt=""
          @click="this.passType = 'text'"
        />
      </div>
      <div class="group mb-3">
        <RouterLink to="/register" class="node"
          >Перейти к регистрации</RouterLink
        >
      </div>
      <div class="sign-up">
        <button type="submit" @click="submit" class="sign-up-btn">Войти</button>
      </div>
    </div>
    <transition name="ant">
      <div v-if="error" class="notification-container">
        <div :class="{ error: status == 400, success: status == 200 }">
          <span>{{ error }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
* {
  font-weight: 550;
}

.ant-enter-active {
  transition: all 0.5s ease;
}
.ant-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.ant-enter,
.ant-leave-to {
  transform: translateX(100px);
  opacity: 0;
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
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70vh;
}

.form-box {
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
  align-items: center;
}

.node {
  color: black;
}

.group a {
  width: 100%;
}

.sign-up-btn {
  background-color: transparent;
  border: 1px solid #d5d5d5;
  color: #d5d5d5;
  backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 5px 7px;
}

.show {
  height: 28px;
  cursor: pointer;
}

.pas {
  display: flex;
  align-items: center;
}

@media (max-height: 780px) {
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
