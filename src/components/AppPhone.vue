<script>
import { RouterLink } from "vue-router";

export default {
  components: { RouterLink },
  data() {},
  methods() {},
  mounted() {},
};
</script>

<template>
  <div class="list-item">
    <router-link to="/emergency">
      <img class="icon" src="../assets/911.png" alt="" />
      <span class="list-item-name">Экстренная служба</span>
    </router-link>
  </div>
</template>

<style scoped>
.icon {
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

.list-item:hover,
.list-item:active,
.list-item:focus {
  color: var(--highlight);
  transform: translateY(-10px);
  .list-item-name {
    transform: translateY(37px);
    opacity: 1;
  }
}

.list-item-name {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  position: absolute;
  transform: translate(0, 42px);
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

  .list-item:hover,
  .list-item:active,
  .list-item:focus {
    .list-item-name {
      transform: translateY(17px);
    }
  }

  .list-item:hover,
  .list-item:active,
  .list-item:focus {
    color: var(--highlight);
    transform: translateY(-6px);
    .list-item-name {
      transform: translateY(32px);
      opacity: 1;
    }
  }
}

@media (max-height: 720px) {
  .icon {
    height: 40px;
  }

  .list-item:hover,
  .list-item:active,
  .list-item:focus {
    color: var(--highlight);
    transform: translateY(-10px);
    .list-item-name {
      transform: translateY(29px);
      opacity: 1;
    }
  }
}
</style>
