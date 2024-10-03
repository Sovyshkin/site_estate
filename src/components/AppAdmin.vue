<script>
import { RouterLink } from "vue-router";
import { mapGetters, mapActions } from "vuex";

export default {
  components: { RouterLink },
  computed: mapGetters(["notifs"]),
  data() {
    return {};
  },
  methods: mapActions(["getNotifications"]),
  mounted() {
    this.getNotifications("reqAll");
  },
};
</script>

<template>
  <div class="list-item">
    <router-link to="/admin/sections">
      <img class="icon" src="../assets/img/letter.png" alt="" />
      <span class="list-item-name">Запросы</span>
    </router-link>
    <div class="alert" v-if="notifs">{{ notifs }}</div>
  </div>
</template>

<style scoped>
a {
  position: relative;
}

.alert {
  position: absolute;
  top: -10px;
  right: -17px;
  padding: 2px;
  background-color: #ed1c24;
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-weight: 550;
}
.icon {
  padding-top: 8px;
  height: 50px;
}

.list-item {
  padding-bottom: 30px;
  list-style-type: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: #555;
  transform: translateY(0);
  transition: transform 0.5s ease, opacity 0.2s ease;
  cursor: pointer;
}

.list-item:hover {
  color: var(--highlight);
  transform: translateY(-10px);
  .list-item-name {
    transform: translateY(45px);
    opacity: 1;
  }
}

.list-item-name {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  position: absolute;
  transform: translate(0, 50px);
  transition: transform 0.5s ease, opacity 0.2s ease;
  opacity: 0;
}

a,
a:hover {
  color: var(--highlight);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (max-width: 350px) {
  .navbar {
    align-items: center;
    padding-bottom: 20px;
    gap: 20px;
  }

  .list-item {
    flex-basis: auto;
  }

  .list-item:hover {
    .list-item-name {
      transform: translateY(25px);
    }
  }

  .list-item:hover {
    color: var(--highlight);
    transform: translateY(-6px);
    .list-item-name {
      transform: translateY(40px);
      opacity: 1;
    }
  }
}

@media (max-height: 810px) {
  .icon {
    height: 42px;
  }
}
</style>
