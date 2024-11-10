let {
  sequelize,
  NewsModel,
  UserModel,
  CardModel,
  HotelModel,
  NumberModel,
} = require("./modules/models");
const bcrypt = require("bcryptjs");

const THE_FUCKING_CURE = async () => {
  // await sequelize.drop();
  await sequelize.sync({
    alter: true,
  });
  console.log("tables synchronized.");

  console.log("created card...");
  let hashPassword = bcrypt.hashSync("admin123", 7);
  let user1 = await UserModel.findOne({
    where: {
      username: "Admin",
      surname: "Adminov",
      email: "example@example.com",
    },
  });
  if (!user1) {
    const newUser = await UserModel.create({
      username: "Admin",
      surname: "Adminov",
      email: "example@example.com",
      phone: "+79042065393",
      password: hashPassword,
      role: "ADMIN",
      balance: 10000,
      messengers: "[]",
    });
    await newUser.save();
  }

  let user2 = await UserModel.findOne({
    where: {
      username: "Vadim",
      surname: "Adminov",
      email: "zankov.vadik@yandex.ru",
    },
  });
  if (!user2) {
    let hashPassword2 = bcrypt.hashSync("admin123", 7);
    const newUser2 = await UserModel.create({
      username: "Vadim",
      surname: "Adminov",
      email: "zankov.vadik@yandex.ru",
      phone: "+79228334948",
      password: hashPassword2,
      role: "USER",
      balance: 1000,
      messengers: "[]",
    });
    await newUser2.save();
  }

  let new1 = await NewsModel.findOne({
    where: {
      title: "example new",
      content: "some content",
    },
  });

  if (!new1) {
    const newNew = await NewsModel.create({
      title: "example new",
      content: "some content",
    });
    await newNew.save();
  }
  console.log("done.");
};

THE_FUCKING_CURE();
