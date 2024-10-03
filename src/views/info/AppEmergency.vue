<script>
export default {
  data() {
    return {
      emergency: [
        { text: "Спасатели", number: "+7-903-985-99-48" },
        { text: "Скорая помощь", number: "(384-73) 3-33-03" },
        { text: "Скорая Шерегеш", number: "+7-913-337-42-67" },
        { text: "Пожарная часть", number: "(384-73) 3-31-22, 01" },
        { text: "МЧС", number: "(384-73) 3-31-12, 01" },
        {
          text: "Отдел ГО и ЧС администрации Таштагольского р-на",
          number: "(384-73) 3-34-20",
        },
        { text: "Полиция", number: "(384-73) 3-02-02" },
        { text: "Полиция Шерегеш", number: "+7-913-428-66-40" },
      ],
    };
  },
  methods: {},
  mounted() {},
};
</script>

<template>
  <div class="wrapper">
    <div class="wrapper-for-content">
      <div class="content">
        <div class="box" v-for="item in emergency" :key="item">
          <div class="text">{{ item.text }}:</div>
          <div class="number">{{ item.number }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  color: var(--mainColor);
}

.content {
  width: 100%;
  padding: 20px 40px;
  border: 1px solid #fff;
  border-radius: 15px;
  box-shadow: 0px 0 10px 0 #ffffff71;
}

.title {
  width: 100%;
  text-align: center;
  color: var(--mainColor);
  font-size: large;
  font-weight: 600;
  position: absolute;
  top: 2%;
}

.text,
.number {
  font-weight: 600;
  width: 50%;

  transition: color 400ms;
}

.text:hover,
.number:hover {
  color: black;
}

@media (max-width: 420px) {
  .content {
    padding: 20px 10px;
  }
}

@media (max-width: 770px) {
  .wrapper-for-content {
    width: 90%;
  }
}

@media (max-width: 380px) {
  .wrapper-for-content {
    width: 83%;
  }
}

@media (max-height: 680px) {
  .content {
    height: 70vh;
  }
}
</style>
