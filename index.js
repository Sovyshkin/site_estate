// библиотеки
const express = require(`express`);
const session = require("express-session");
const fileUpload = require("express-fileupload");

const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const path = require("path");
const fs = require("fs").promises;
const { readFile } = require("fs").promises;
const mkdirp = require("mkdirp");
const nodemailer = require("nodemailer");

const TelegramApi = require("node-telegram-bot-api");
const tokenBot = "6512089922:AAFHGNPPZSJY2V0__DSzML7ic-iytlqoDXs";

// let bot = false;

let bot = new TelegramApi(tokenBot, { polling: true });

bot.on(`message`, (msg) => {
  let text = msg.text;
  let chatID = msg.chat.id;
  if (text == "/start") {
    bot.sendMessage(chatID, `ваш чат ID: ${chatID}`);
  }
});

// модули самого бэкенда
const {
  sequelize,
  NewsModel,
  UserModel,
  CardModel,
  CardTransfer,
  CardService,
  HotelModel,
  NumberModel,
  LiftModel,
  SkipassModel,
  RequestPaymentModel,
  RequestsModel,
  ReqBrone,
} = require("./modules/models");
const { secret } = require(`./config`);

const { tryBook, addNumber } = require(`./modules/booking`);

const { initPayment, awaitPayment } = require(`./modules/payments`);
const { name } = require("dayjs/locale/ru");
const internal = require("stream");
const { default: axios } = require("axios");
const { SMSRu } = require("node-sms-ru");

const sms = new SMSRu("F2117CBA-89E3-7C23-1C4F-61E1F9338C54");
const tokenWeather = "43d1dd24e6e8440ed00a7e156e16a7a9";
const { OpenWeatherAPI } = require("openweather-api-node");

let weather = new OpenWeatherAPI({
  key: tokenWeather,
  locationName: "New York",
  units: "imperial",
});

const dayjs = require("dayjs");

// const gismeteo = new Gismeteo({ lang: "ru", unit_temp: "C" });

let app = express();
let port = 3005;

app.listen(port, function () {
  console.log(`http://localhost:${port}`);
});

var corsOptions = {
  origin: "http://localhost:8080",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
// Подключаем middleware для сессий
app.use(
  session({ secret: "secret-key", resave: false, saveUninitialized: true })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Раздача статики

// Настройка POST-запроса — JSON
app.use(express.json());
app.use(fileUpload());
// Настройка POST-запроса
app.use(express.urlencoded({ extended: true }));

let generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, secret, { expiresIn: "336h" });
};

let verifyc = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") next();

    try {
      let token = req.headers.authorization;
      // if(token){
      //   return res.json({message: token})
      // }
      if (!token) return res.json({ message: "Пользователь не авторизован" });

      let { role: userRoles } = jwt.verify(token, secret);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) hasRole = true;
      });
      if (!hasRole) return res.json({ message: "У вас нет доступа" });
      next();
    } catch (err) {
      return res.json({ message: "Пользователь не авторизован" });
    }
  };
};
let ADMINVERIFY = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      let token = req.headers.authorization;
      // if(token){
      //   return res.json({message: token})
      // }
      if (!token) {
        return res.json({ message: "Пользователь не авторизован" });
      }
      let { role: userRoles } = jwt.verify(token, secret);
      userRoles.forEach((role) => {
        if (role == "ADMIN") {
          return res.json({ admin: true });
        }
      });
      next();
    } catch (err) {
      return res.json({ message: "Пользователь не авторизован" });
    }
  };
};

app.use(express.static("dist/assets"));

// фикс вылета на перезагрузке
app.route("/*").get(function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});
app.get("/", async function (req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const { CronJob } = require("cron");

const job = new CronJob(
  "0 */6 * * *", // cronTime
  async function () {
    try {
      console.log("Запрос отправляется");
      let tokenOpen = "8710460576eb8f2c7ab3af83310b746e";
      let response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=52.940511&lon=87.917713&appid=${tokenOpen}&units=metric&lang=RU`
      );
      console.log(response.data);
      const data = response.data.list;

      const filePath = path.join(__dirname, "data.json");
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));

      console.log("Данные успешно сохранены в файл data.json");
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error.message);
    }
  }, // onTick
  null, // onComplete
  true, // start
  "America/Los_Angeles" // timeZone
);

app.post(`/filter`, async function (req, res) {
  let { namefilter, cityfrom, cityto, datefrom, passenger } = req.body;
  let filter;
  let Array = [];
  console.log(cityfrom);
  filter = await CardTransfer.findAll({
    where: {
      cityfrom: cityfrom,
      cityto: cityto,
      datefrom: datefrom,
      verified: true,
      done: false,
    },
  });
  filter.forEach((element) => {
    if (passenger <= element.passenger) {
      Array.push(element);
    }
  });

  if (!filter) {
    res.send({ message: "В этот промежуток поездок нет" });
    return;
  }
  res.send({ Array });
});

app.post(`/transfer`, async function (req, res) {
  try {
    let { id, book, places, clientID } = req.body;
    console.log(id, book, places);
    let admin = false;
    let msg, status;
    if (book && id) {
      let transfer = await CardTransfer.findOne({ where: { id: id } });
      console.log(transfer);
      if (transfer.boardedPlaces >= transfer.passenger) {
        return res.send({
          message: "На эту поездку больше не осталось свободных мест",
          status: 400,
        });
      }
      if (transfer.boardedPlaces + places <= transfer.passenger) {
        transfer.boardedPlaces += places;
        msg =
          "Ваши места забронированы, дождитесь подтверждения поездки от водителя";
        status = 200;
      }
      await transfer.save();
      res.send({ transfer, admin, message: msg, status });
      return;
    }
    if (id && !book) {
      let transfer = await CardTransfer.findOne({ where: { id: id } });
      let reqs = await ReqBrone.findAll({ where: { cardID: id, done: false } });
      let user = await UserModel.findOne({ where: { id: transfer.userID } });
      let phone;
      if (clientID) {
        let request = await ReqBrone.findOne({
          where: { cardID: id, clientID: clientID, userID: user.id },
        });
        if (request) {
          if (request.status == "Оплачено") {
            phone = user.phone;
          }
        }
      }
      res.send({ transfer, admin, countReqs: reqs.length, phone });
      return;
    }
    let transfer = await CardTransfer.findAll({ where: { done: false } });
    transfer.reverse();
    res.send({ transfer, admin });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/transfer_edit`, async function (req, res) {
  try {
    let { id } = req.body;
    if (id) {
      let card = await CardTransfer.findOne({ where: { id } });
      res.send({ card });
    } else {
      res.send({ success: false, message: "Объявление не найдено" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/news`, async function (req, res) {
  let admin;
  let { id } = req.body;
  let user;
  if (id) {
    user = await UserModel.findOne({ id: id });
    if (user.role == "ADMIN") {
      admin = true;
    } else {
      admin = false;
    }
  }
  let news = await NewsModel.findAll();

  res.send({ news, admin });
});

app.get(`/habitation`, async function (req, res) {
  try {
    let { name, category } = req.query;
    let cards;
    let admin = false;
    let token = req.headers.authorization;
    let { role: userRoles } = jwt.verify(token, secret);

    if (name) {
      cards = await HotelModel.findAll({
        where: {
          category: category,
          subcategory: name,
          verified: true,
          done: false,
        },
      });

      if (token) {
        userRoles.forEach((role) => {
          if (role == "ADMIN") {
            admin = true;
          }
        });
      }
    }

    res.send({ expired: false, cards, admin });
  } catch (e) {
    console.log(e);
    res.send({ expired: "1" });
  }
});

app.post(`/habitation`, async function (req, res) {
  try {
    let { name, category, id } = req.body;
    let cards;
    let admin = false;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
      if (user.role == "ADMIN") {
        admin = true;
      }
    }
    if (name) {
      cards = await HotelModel.findAll({
        where: {
          category: category,
          subcategory: name,
          verified: true,
          done: false,
        },
      });
    }

    res.send({ expired: false, cards, admin });
  } catch (e) {
    console.log(e);
    res.send({ expired: "1" });
  }
});

let timeId;

app.post(`/upload`, async function (req, res) {
  try {
    let { id, model, category } = req.query;
    console.log(id, model, category);
    if (!req.files) {
      console.log("no files sent!");
      return res.send({ message: "Файл не найден" });
    }
    let files = req.files;
    let imgName = [];
    if (files.files.length) {
      for (let i = 0; i < files.files.length; i++) {
        let file = files.files[i];
        console.log(file);
        let date = new Date();
        let time = date.getTime();
        let filename = `img_${time}.jpg`;
        imgName.push(filename);

        let mediaPath = path.join(__dirname, `dist/assets/`);
        let imgPath = path.join(mediaPath, filename);

        // Создание директории, если она не существует
        if (!fs.access(mediaPath)) {
          await mkdirp(mediaPath);
        }

        // Запись файла
        await new Promise((resolve, reject) => {
          file.mv(imgPath, function (err) {
            if (err) {
              console.log("ERROR OCCURED WHEN SAVING FILE:", err);
              reject(err);
            } else {
              console.log("Saved!");
              resolve();
            }
          });
        });
      }
    } else {
      let file = req.files.files;
      let date = new Date();
      let time = date.getTime();
      let filename = `img_${time}.jpg`;
      imgName.push(filename);

      let mediaPath = path.join(__dirname, `dist/assets/`);
      let imgPath = path.join(mediaPath, filename);

      // Запись файла
      await new Promise((resolve, reject) => {
        file.mv(imgPath, function (err) {
          if (err) {
            console.log("ERROR OCCURED WHEN SAVING FILE:", err);
            reject(err);
          } else {
            console.log("Saved!");
            resolve();
          }
        });
      });
    }
    if (model == "taxi") {
      let card = await CardService.findOne({ where: { id: id } });
      card.img = imgName;
      await card.save();
      return res.send({ message: "Успешно", status: "200" });
    } else if (model == "transfer") {
      let transfer = await CardTransfer.findOne({ where: { id: id } });
      transfer.img = imgName;
      await transfer.save();
      return res.send({ message: "Успешно", status: "200" });
    } else {
      if (category == `habitation`) {
        let card = await HotelModel.findOne({ where: { id: id } });
        card.img = imgName;
        await card.save();
        return res.send({ message: "Успешно", status: "200" });
      } else if (category != `habitation`) {
        let card = await CardModel.findOne({ where: { id: id } });
        card.img = imgName;
        await card.save();
        return res.send({ message: "Успешно", status: "200" });
      }
      let card = await HotelModel.findOne({ where: { id: id } });
      card.img = imgName;
      await card.save();
      return res.send({ message: "Изображение загружено", status: "200" });
    }
  } catch (e) {
    console.log(e);
  }
});

app.post(`/upload_one`, async function (req, res) {
  let { id, model, category } = req.query;
  /*
  try{
    console.log('inited upload, id is: ', id);
    return res.send({ message: `inited upload, id: ${id}`, status: '200' }); }
  catch(e) { 
    console.log(`Ошибка id: ${e}`);
    return res.send({ message: `Ошибка id: ${e}`, status: '400' }); 
  }
  */
  if (req.files) {
    let file = req.files.file;
    let imgName = [];
    let date = new Date();
    let time = date.getTime();
    let filename = `img_${time}.jpg`;
    imgName.push(filename);

    let mediaPath = path.join(__dirname, `dist/assets/`);
    let imgPath = path.join(mediaPath, filename);

    // Создание директории, если она не существует
    if (!fs.access(mediaPath)) {
      await mkdirp(mediaPath);
    }

    // Запись файла
    await new Promise((resolve, reject) => {
      file.mv(imgPath, function (err) {
        if (err) {
          console.log("ERROR OCCURED WHEN SAVING FILE:", err);
          reject(err);
        } else {
          console.log("Saved!");
          resolve();
        }
      });
    });
    if (model == "taxi") {
      let card = await CardService.findOne({ where: { id: id } });
      card.img = imgName;
      await card.save();
      return res.send({ message: "Успешно", status: "200" });
    } else if (model == "transfer") {
      let transfer = await CardTransfer.findOne({ where: { id: id } });
      transfer.img = imgName;
      await transfer.save();
      return res.send({ message: "Успешно", status: "200" });
    } else {
      if (category == `habitation`) {
        let card = await HotelModel.findOne({ where: { id: id } });
        card.img = imgName;
        await card.save();
        return res.send({ message: "Успешно", status: "200" });
      } else if (category != `habitation`) {
        let card = await CardModel.findOne({ where: { id: id } });
        card.img = imgName;
        await card.save();
        return res.send({ message: "Успешно", status: "200" });
      }
      let card = await HotelModel.findOne({ where: { id: id } });
      card.img = imgName;
      await card.save();
      return res.send({ message: "Изображение загружено", status: "200" });
    }
  }
});

app.post(`/create-card`, async function (req, res) {
  try {
    let {
      title,
      edit,
      subcategory,
      id,
      phone,
      region,
      city,
      numberHouse,
      street,
      email,
      price,
      p,
      userID,
      img,
      category,
      floor,
      lease_term,
      total_area,
      sleeping_rooms,
      sleeping_places,
      children_bed,
      double_places,
      single_spaces,
      additional_sleeping_places,
      bathrooms,
      bathrooms_showers,
      drying_for_inventory,
      wifi,
      warm_floor,
      dishwasher,
      parking_cars,
      mall,
      kazan,
      bath_territory,
      pool,
      transfer_city,
      transfer_mountain,
      live_whith_animals,
      additionally,
      poolAllYear,
      poolOnlySummer,
      poolOpen,
      poolClose,
      poolHeating,
    } = req.body;
    if (category == `habitation`) {
      if (edit) {
        console.log(1);
        let card = await HotelModel.findOne({ where: { id: id } });
        card.title = title;
        card.price = price;
        card.region = region;
        card.city = city;
        card.street = street;
        card.numberHouse = numberHouse;
        card.phone = phone;
        card.img = img;
        card.p = p;
        card.email = email;
        card.verified = false;
        card.floor = floor;
        card.lease_term = lease_term;
        card.total_area = total_area;
        card.sleeping_rooms = sleeping_rooms;
        card.sleeping_places = sleeping_places;
        card.children_bed = children_bed;
        card.double_places = double_places;
        card.single_spaces = single_spaces;
        card.additional_sleeping_places = additional_sleeping_places;
        card.bathrooms = bathrooms;
        card.bathrooms_showers = bathrooms_showers;
        card.drying_for_inventory = drying_for_inventory;
        card.wifi = wifi;
        card.warm_floor = warm_floor;
        card.dishwasher = dishwasher;
        card.parking_cars = parking_cars;
        card.mall = mall;
        card.kazan = kazan;
        card.bath_territory = bath_territory;
        card.pool = pool;
        card.poolAllYear = poolAllYear;
        card.poolOnlySummer = poolOnlySummer;
        card.poolOpen = poolOpen;
        card.poolClose = poolClose;
        card.poolHeating = poolHeating;
        card.transfer_city = transfer_city;
        card.transfer_mountain = transfer_mountain;
        card.live_whith_animals = live_whith_animals;
        card.additionally = additionally;
        await card.save();
        console.log(card);
        return res.json({ status: "200", message: "Успешно" });
      } else {
        try {
          let card = await HotelModel.build({
            img: [],
            category: category,
            subcategory: subcategory,
            title: title,
            phone: phone,
            region: region,
            city: city,
            street: street,
            numberHouse: numberHouse,
            price: price,
            p: p,
            email: email,
            userID: userID,
            nameCard: "no",
            verified: false,
            floor: floor,
            lease_term: lease_term,
            total_area: total_area,
            sleeping_rooms: sleeping_rooms,
            sleeping_places: sleeping_places,
            children_bed: children_bed,
            double_places: double_places,
            single_spaces: single_spaces,
            additional_sleeping_places: additional_sleeping_places,
            bathrooms: bathrooms,
            bathrooms_showers: bathrooms_showers,
            drying_for_inventory: drying_for_inventory,
            wifi: wifi,
            warm_floor: warm_floor,
            dishwasher: dishwasher,
            parking_cars: parking_cars,
            mall: mall,
            kazan: kazan,
            bath_territory: bath_territory,
            pool: pool,
            poolAllYear: poolAllYear,
            poolOnlySummer: poolOnlySummer,
            poolOpen: poolOpen,
            poolClose: poolClose,
            poolHeating: poolHeating,
            transfer_city: transfer_city,
            transfer_mountain: transfer_mountain,
            live_whith_animals: live_whith_animals,
            additionally: additionally,
            done: false,
          });
          console.log("saving card...");
          try {
            card.save().then((e) => {
              try {
                console.log("binding id...");
                timeId = card.id;
              } catch (e) {
                console.log(`Ошибка создания timeId: ${e} `);
                return res.send({
                  message: `Ошибка создания timeId: ${e} `,
                  status: "400",
                });
              }

              console.log("done.");
              return res.send({
                //message: `Создание карты завершено, timeId: ${timeId}`,
                message: "Запрос на публикацию успешно отправлен!",
                status: "200",
                timeId: timeId,
              });
            });
          } catch (e) {
            console.log(`сохранение не работает: ${e} `);
            return res.send({
              message: `сохранение не работает: ${e} `,
              status: "400",
            });
          }
        } catch (e) {
          console.log(`Ошибка создания карточки: ${e} `);
          return res.send({
            message: `Ошибка создания карточки: ${e} `,
            status: "400",
          });
        }
      }
    } else {
      if (edit) {
        let card = await CardModel.findOne({ where: { id: id } });
        card.title = title;
        card.region = region;
        card.city = city;
        card.street = street;
        card.numberHouse = numberHouse;
        card.phone = phone;
        card.email = email;
        card.img = img;
        card.verified = false;
        await card.save();
        console.log(card);
        return res.json({ status: "200" });
      }
      try {
        console.log("building card...");
        let card = await CardModel.build({
          img: [],
          category: category,
          subcategory: subcategory,
          userID: userID,
          title: title,
          phone: phone,
          region: region,
          city: city,
          street: street,
          numberHouse: numberHouse,
          email: email,
          nameCard: "no",
          verified: false,
          floor: floor,
          lease_term: lease_term,
          total_area: total_area,
          sleeping_rooms: sleeping_rooms,
          sleeping_places: sleeping_places,
          children_bed: children_bed,
          double_places: double_places,
          single_spaces: single_spaces,
          additional_sleeping_places: additional_sleeping_places,
          bathrooms: bathrooms,
          bathrooms_showers: bathrooms_showers,
          drying_for_inventory: drying_for_inventory,
          wifi: wifi,
          warm_floor: warm_floor,
          dishwasher: dishwasher,
          parking_cars: parking_cars,
          mall: mall,
          kazan: kazan,
          bath_territory: bath_territory,
          pool: pool,
          transfer_city: transfer_city,
          transfer_mountain: transfer_mountain,
          live_whith_animals: live_whith_animals,
          additionally: additionally,
          done: false,
        });
        console.log("saving card...");
        try {
          card.save().then((e) => {
            try {
              console.log("binding id...");
              timeId = card.id;
            } catch (e) {
              console.log(`Ошибка создания timeId: ${e} `);
              return res.send({
                message: `Ошибка создания timeId: ${e} `,
                status: "400",
              });
            }

            console.log("done.");
            return res.send({
              //message: `Создание карты завершено, timeId: ${timeId}`,
              message: "Успешно",
              status: "200",
              timeId: timeId,
            });
          });
        } catch (e) {
          console.log(`сохранение не работает: ${e} `);
          return res.send({
            message: `сохранение не работает: ${e} `,
            status: "400",
          });
        }
      } catch (e) {
        console.log(`Ошибка создания карточки: ${e} `);
        return res.send({
          message: `Ошибка создания карточки: ${e} `,
          status: "400",
        });
      }
    }
  } catch (e) {
    console.log(`Ошибка: ${e}`);
    return res.send({ message: `Ошибка: ${e}`, status: "400" });
  }
});

app.get(`/getUsers`, verifyc(["ADMIN"]), async function (req, res) {
  try {
    let users = await User.find({});
    res.json({ users });
  } catch (e) {
    console.log(e);
  }
});

app.post(`/registration`, async function (req, res) {
  try {
    let { username, surname, email, number, password } = req.body;
    let candidateEmail = await UserModel.findOne({ where: { email: email } });
    let candidatePhone = await UserModel.findOne({ where: { phone: number } });

    if (candidatePhone) {
      return res.json({
        message: "Пользователь с таким номером телефона уже существует",
        status: "400",
      });
    }
    if (candidateEmail) {
      return res.json({
        message: "Пользователь с такой почтой уже существует",
        status: "400",
      });
    }
    let hashPassword = bcrypt.hashSync(password, 7);
    let newUser = await UserModel.create({
      username,
      surname,
      email,
      phone: number,
      password: hashPassword,
      role: "USER",
      balance: 0,
      messengers: "[]",
      paid: "[]",
    });
    console.log(newUser);
    await newUser.save();
    return res.json({
      message: "Пользователь успешно зарегистрирован",
      status: "200",
    });
  } catch (err) {
    res.json({ message: "Registration error", err });
  }
});
app.post(`/login`, async function (req, res) {
  try {
    let { email, password } = req.body;

    let user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.json({
        message: `Пользователь с почтой ${email} не найден`,
        status: 400,
      });
    }

    let validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.json({ message: "Введен неверный пароль", status: 400 });
    }
    let token = generateAccessToken(user.id, [user.role]);
    return res.json({ token, message: "Успешно", status: 200, id: user.id });
  } catch (err) {
    res.json({ message: "Login error" });
  }
});
app.post(`/deleteCard`, async function (req, res) {
  try {
    let { id, name, real } = req.body;
    let card;
    if (real) {
      if (name == `habitation`) {
        card = await HotelModel.findOne({ where: { id: id } });
      } else {
        card = await CardModel.findOne({ where: { id: id } });
      }
      card.destroy();
      res.send({ status: "200" });
    } else {
      if (name == `habitation`) {
        card = await HotelModel.findOne({ where: { id: id } });
      } else {
        card = await CardModel.findOne({ where: { id: id } });
      }
      card.done = true;
      await card.save();
      res.send({ status: "200" });
    }
  } catch (e) {
    res.send({ message: "Ошибка" });
  }
});

app.post(`/card`, async function (req, res) {
  try {
    let { id, name, view, clientID } = req.body;
    let card;
    let number;
    let reqs = [];
    console.log(id, name, view);
    if (name == `habitation`) {
      if (view) {
        card = await HotelModel.findOne({
          where: { id: id, verified: false },
        });
        number = await NumberModel.findAll({
          where: { HotelModelId: id, done: false },
        });
      } else {
        card = await HotelModel.findOne({
          where: { id: id },
        });
        number = await NumberModel.findAll({
          where: { HotelModelId: id, done: false },
        });
      }
      if (card) {
        if (clientID == card.userID) {
          reqs = await ReqBrone.findAll({ where: { cardID: id, done: false } });
        }
      }
    } else {
      console.log("info", name, id);
      card = await CardModel.findOne({
        where: { id: id },
      });
      if (card) {
        if (clientID == card.userID) {
          reqs = await ReqBrone.findAll({ where: { cardID: id, done: false } });
        }
      }
    }
    let client = await UserModel.findOne({ where: { id: clientID } });
    let paid = false;
    if (client) {
      if (client.paid) {
        paid = client.paid.find((item) => item.name == name && item.id == id);
      }
      console.log(paid);
    }
    let user = await UserModel.findOne({ where: { id: card.userID } });
    let phone;
    if (clientID) {
      let request = await ReqBrone.findOne({
        where: { cardID: id, clientID: clientID, userID: user.id },
      });
      if (request) {
        if (request.status == "Оплачено") {
          phone = user.phone;
        }
      }
    }
    res.send({ card, number, view, countReqs: reqs.length, paid, phone });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/instructor-tours`, async function (req, res) {
  try {
    let { name, category, id } = req.body;
    let cards;
    let admin = false;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
      if (user.role == "ADMIN") {
        admin = true;
      } else {
        admin = false;
      }
    }

    if (name) {
      cards = await CardModel.findAll({
        where: {
          category: category,
          subcategory: name,
          verified: true,
          done: false,
        },
      });
    }
    res.send({ expired: false, cards, admin });
  } catch (e) {
    console.log(e);
  }
});

app.post(`/forChildren`, async function (req, res) {
  try {
    let { name, category, id } = req.body;

    let cards;
    let admin = false;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
      if (user.role == "ADMIN") {
        admin = true;
      } else {
        admin = false;
      }
    }

    if (name) {
      cards = await CardModel.findAll({
        where: {
          category: category,
          subcategory: name,
          verified: true,
          done: false,
        },
      });
    }
    res.send({ expired: false, cards, admin });
  } catch (e) {
    console.log(e);
  }
});

app.post(`/rental`, async function (req, res) {
  try {
    let { name, category, id } = req.body;
    let cards;
    let admin = false;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
      if (user.role == "ADMIN") {
        admin = true;
      } else {
        admin = false;
      }
    }

    if (name) {
      cards = await CardModel.findAll({
        where: {
          category: category,
          subcategory: name,
          verified: true,
          done: false,
        },
      });
    }
    res.send({ expired: false, cards, admin });
  } catch (e) {
    console.log(e);
  }
});

app.post(`/event`, async function (req, res) {
  try {
    let { name, category, id } = req.body;

    let cards;
    let admin = false;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
      if (user.role == "ADMIN") {
        admin = true;
      } else {
        admin = false;
      }
    }

    if (name) {
      console.log("event Здесь", name, category);
      cards = await CardModel.findAll({
        where: {
          category: category,
          subcategory: name,
          verified: true,
          done: false,
        },
      });
    }
    res.send({ expired: false, cards, admin });
  } catch (e) {
    console.log(e);
  }
});
app.post(`/ads`, async function (req, res) {
  try {
    let { name, category, id } = req.body;
    let cards;
    let admin = false;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
      if (user.role == "ADMIN") {
        admin = true;
      } else {
        а;
        admin = false;
      }
    }
    if (name) {
      cards = await CardModel.findAll({
        where: {
          category: category,
          subcategory: name,
          verified: true,
          done: false,
        },
      });
    }
    res.send({ expired: false, cards, admin });
  } catch (e) {
    console.log(e);
  }
});

app.get(`/create_roles`, async function (req, res) {
  let user = new Role({ value: "USER" });
  await user.save();
  let admin = new Role({ value: "ADMIN" });
  await admin.save();
  res.redirect(`back`);
});

app.post(`/create_news`, async function (req, res) {
  try {
    let { title, content } = req.body;
    let news = await NewsModel.create({
      title,
      content,
    });
    await news.save();
    return res.send({
      message: "Новость успешно создана",
      success: true,
      status: 200,
    });
  } catch (err) {
    res.send({ message: "Ошибка создания новости", success: false, err });
  }
});

app.post(`/delete_news`, async function (req, res) {
  try {
    let id = req.body.id;
    let newsDelete = await NewsModel.findOne({ where: { id: id } });
    console.log(newsDelete, id);
    await newsDelete.destroy();
    res.json({ message: "Удаление прошло успешно", status: 200 });
  } catch (err) {
    res.json({ message: "Ошибка удаления новости", err });
  }
});

app.post(`/clone_transfer`, async function (req, res) {
  try {
    let {
      name,
      region,
      regionTo,
      cityfrom,
      cityto,
      datefrom,
      timefrom,
      car,
      typeCar,
      passenger,
      price_sit,
      komm,
      length,
      point,
      userID,
      edit,
      id,
      img,
    } = req.body;
    let card = await CardTransfer.create({
      name: name,
      region: region,
      regionTo: regionTo,
      cityfrom: cityfrom,
      cityto: cityto,
      datefrom: datefrom,
      komm: komm,
      timefrom: timefrom,
      price_sit: price_sit,
      car: car,
      typeCar: typeCar,
      passenger: passenger,
      length: length,
      userID: userID,
      verified: false,
      point: point,
      boardedPlaces: 0,
      img: img,
      done: false,
    });
    await card.save();
    res.send({ message: "Успешно", status: 200, success: true });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/create_transfer`, async function (req, res) {
  try {
    let {
      name,
      region,
      regionTo,
      cityfrom,
      cityto,
      datefrom,
      timefrom,
      car,
      typeCar,
      passenger,
      price_sit,
      komm,
      length,
      point,
      userID,
      edit,
      id,
    } = req.body;
    try {
      if (edit) {
        if (id) {
          console.log(region);
          let card = await CardTransfer.findOne({ where: { id } });
          card.name = name;
          card.region = region;
          card.cityfrom = cityfrom;
          card.cityto = cityto;
          card.datefrom = datefrom;
          card.timefrom = timefrom;
          card.car = car;
          card.typeCar = typeCar;
          card.passenger = passenger;
          card.price_sit = price_sit;
          card.komm = komm;
          card.length = length;
          card.point = point;
          card.regionTo = regionTo;
          await card.save();
          try {
            card.save().then((e) => {
              try {
                console.log("binding id...");
                timeId = card.id;
              } catch (e) {
                console.log(`Ошибка создания timeId: ${e} `);
                return res.send({
                  message: `Ошибка создания timeId: ${e} `,
                  status: "400",
                  show: false,
                });
              }

              console.log("done.");
              return res.send({
                //message: `Создание карты завершено, timeId: ${timeId}`,
                message: timeId,
                error: "Сохранение прошло успешно",
                status: "200",
                success: true,
                show: true,
              });
            });
          } catch (e) {
            console.log(`сохранение не работает: ${e} `);
            return res.send({
              message: `сохранение не работает: ${e} `,
              status: "400",
              show: false,
            });
          }
        } else {
          res.send({ success: false, error: "Ошибка", status: 400 });
        }
      } else {
        console.log("building card...");
        let card = await CardTransfer.build({
          name: name,
          region: region,
          regionTo: regionTo,
          cityfrom: cityfrom,
          cityto: cityto,
          datefrom: datefrom,
          komm: komm,
          timefrom: timefrom,
          price_sit: price_sit,
          car: car,
          typeCar: typeCar,
          passenger: passenger,
          length: length,
          userID: userID,
          verified: true,
          point: point,
          boardedPlaces: 0,
          img: [],
          done: false,
        });
        console.log("saving card...");
        try {
          card.save().then((e) => {
            try {
              console.log("binding id...");
              timeId = card.id;
            } catch (e) {
              console.log(`Ошибка создания timeId: ${e} `);
              return res.send({
                message: `Ошибка создания timeId: ${e} `,
                status: "400",
                show: false,
              });
            }

            console.log("done.");
            return res.send({
              //message: `Создание карты завершено, timeId: ${timeId}`,
              message: timeId,
              error: "Запрос успешно добавлен",
              status: "200",
              success: true,
              show: true,
            });
          });
        } catch (e) {
          console.log(`сохранение не работает: ${e} `);
          return res.send({
            message: `сохранение не работает: ${e} `,
            status: "400",
            show: false,
          });
        }
      }
    } catch (e) {
      console.log(`Ошибка создания карточки: ${e} `);
      return res.send({
        message: `Ошибка создания карточки: ${e} `,
        status: "400",
        show: false,
      });
    }
  } catch (err) {
    res.send({
      message: "Ошибка создания трансфера",
      show: false,
      err,
      success: false,
    });
  }
});

app.post(`/delete_transfer`, async function (req, res) {
  try {
    let { id, real } = req.body;
    if (real) {
      let transfer = await CardTransfer.findOne({ where: { id } });
      await transfer.destroy();
      res.send({ status: 200, success: true, message: "Успешно" });
    } else {
      if (id) {
        let transfer = await CardTransfer.findOne({ where: { id } });
        transfer.done = true;
        await transfer.save();
        res.send({ status: 200, success: true, message: "Успешно" });
      } else {
        res.send({ success: 400, message: "Ошибка удаления трансфера" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/create_service`, async function (req, res) {
  try {
    let { name, phone, description, userID } = req.body;
    try {
      console.log("building card...");
      let card = await CardService.build({
        img: [],
        name: name,
        phone: phone,
        description: description,
        userID: userID,
        verified: false,
        done: false,
      });
      console.log("saving card...");
      try {
        card.save().then((e) => {
          try {
            console.log("binding id...");
            timeId = card.id;
          } catch (e) {
            console.log(`Ошибка создания timeId: ${e} `);
            return res.send({
              message: `Ошибка создания timeId: ${e} `,
              status: "400",
            });
          }

          console.log("done.");
          return res.send({
            //message: `Создание карты завершено, timeId: ${timeId}`,
            message: timeId,
            error: "Запрос успешно добавлен",
            status: "200",
            success: true,
          });
        });
      } catch (e) {
        console.log(`сохранение не работает: ${e} `);
        return res.send({
          message: `сохранение не работает: ${e} `,
          status: "400",
        });
      }
    } catch (e) {
      console.log(`Ошибка создания карточки: ${e} `);
      return res.send({
        message: `Ошибка создания карточки: ${e} `,
        status: "400",
      });
    }
  } catch (err) {
    res.send({
      message: "Ошибка создания услуги",
      show: false,
      err,
      success: false,
    });
  }
});

app.post(`/services`, async function (req, res) {
  let { id } = req.body;
  let admin = false;
  let user;
  if (id) {
    user = await UserModel.findOne({ where: { id } });
    if (user.role == "ADMIN") {
      admin = true;
    } else {
      admin = false;
    }
  }
  let services = await CardService.findAll({ where: { done: false } });
  res.send({ services, admin });
});

app.post(`/service-card`, async function (req, res) {
  try {
    let { id, userID } = req.body;
    let edit = false;
    let card = await CardService.findOne({ where: { id: id } });
    if (card) {
      if (card.userID == userID) {
        edit = true;
      }
    }
    res.send({ card, edit });
  } catch (err) {
    res.send({ message: "Такой услуги не найдено", show: false, err });
  }
});

app.post(`/delete_service`, async function (req, res) {
  try {
    let { id } = req.body;
    let service = await CardService.findOne({ id });
    if (service) {
      service.done = true;
      await service.save();
      res.send({ status: 200, message: "Успешно" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/trybook`, async function (req, res) {
  let { phone, fromdate, todate, id, number } = req.body;
  let singleHotel = await HotelModel.findByPk(id, { include: ["NumberModel"] });
  console.log(singleHotel);
  let gottaBook = singleHotel.NumberModel[number];
  let checkin = new Date(fromdate);
  let checkout = new Date(todate);
  let response = await tryBook(gottaBook, checkin, checkout, phone);
  res.send(response);
});

app.post(`/create-number`, async function (req, res) {
  try {
    let {
      hotel,
      title,
      floor,
      lease_term,
      total_area,
      sleeping_rooms,
      sleeping_places,
      children_bed,
      double_places,
      single_spaces,
      additional_sleeping_places,
      bathrooms,
      bathrooms_showers,
      drying_for_inventory,
      wifi,
      warm_floor,
      dishwasher,
      parking_cars,
      mall,
      kazan,
      bath_territory,
      pool,
      transfer_city,
      transfer_mountain,
      live_whith_animals,
      additionally,
    } = req.body;
    console.log(`creating number...`);
    await addNumber(
      hotel,
      title,
      (price = lease_term),
      floor,
      lease_term,
      total_area,
      sleeping_rooms,
      sleeping_places,
      children_bed,
      double_places,
      single_spaces,
      additional_sleeping_places,
      bathrooms,
      bathrooms_showers,
      drying_for_inventory,
      wifi,
      warm_floor,
      dishwasher,
      parking_cars,
      mall,
      kazan,
      bath_territory,
      pool,
      transfer_city,
      transfer_mountain,
      live_whith_animals,
      (additionally = "a")
    );
    console.log(`number create`);
    res.send({ message: `Успешно`, status: `200` });
  } catch (err) {
    res.send({ error: err, status: `400` });
  }
});

app.post(`/deleteNumber`, async function (req, res) {
  try {
    let { id, name } = req.body;
    let card;
    card = await NumberModel.findOne({ where: { id: id } });
    card.done = true;
    await card.save();
    res.send({ status: "200" });
  } catch (e) {
    res.send({ message: "Ошибка" });
  }
});

app.post(`/number`, async function (req, res) {
  try {
    let { id } = req.body;
    let number = [];
    if (id) {
      number = await NumberModel.findAll({
        where: { HotelModelId: id, done: false },
      });
    }
    return res.send({ number });
  } catch (err) {
    return res.send({ error: err });
  }
});

app.post(`/create_lift`, async function (req, res) {
  try {
    let {
      title,
      geo,
      lifting_time,
      phone,
      price,
      working_hours_start,
      working_hours_finish,
    } = req.body;
    try {
      console.log("building card...");
      let card = await LiftModel.build({
        title: title,
        geo: geo,
        lifting_time: lifting_time,
        phone: phone,
        price: price,
        working_hours_start: working_hours_start,
        working_hours_finish: working_hours_finish,
      });
      console.log("saving card...");
      try {
        card.save().then((e) => {
          try {
            console.log("binding id...");
            timeId = card.id;
          } catch (e) {
            console.log(`Ошибка создания timeId: ${e} `);
            return res.send({
              message: `Ошибка создания timeId: ${e} `,
              status: "400",
            });
          }

          console.log("done.");
          return res.send({
            //message: `Создание карты завершено, timeId: ${timeId}`,
            message: timeId,
            status: "200",
          });
        });
      } catch (e) {
        console.log(`сохранение не работает: ${e} `);
        return res.send({
          message: `сохранение не работает: ${e} `,
          status: "400",
        });
      }
    } catch (e) {
      console.log(`Ошибка создания карточки: ${e} `);
      return res.send({
        message: `Ошибка создания карточки: ${e} `,
        status: "400",
      });
    }
  } catch (err) {
    return res.send({ error: err });
  }
});

app.post(`/lifts`, async function (req, res) {
  let lifts = await LiftModel.findAll();
  res.send({ lifts });
});

app.post(`/delete_lift`, async function (req, res) {
  try {
    let id = req.body.id;
    let liftDelete = await LiftModel.findOne({ where: { id: id } });
    console.log(liftDelete, id);
    await liftDelete.destroy();
    res.json({ message: "Удаление прошло успешно", status: 200 });
  } catch (err) {
    res.json({ message: "Ошибка удаления подъёмника", err });
  }
});

app.post(`/skipass`, async function (req, res) {
  try {
    let skipass = await SkipassModel.findAll();
    res.send({ skipass });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/find_skipass`, async function (req, res) {
  try {
    let id = req.body.id;
    let skipass = await SkipassModel.findOne({ where: { id } });
    res.send({ skipass });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/edit_skipass`, async function (req, res) {
  try {
    let { title, content, price, id } = req.body;
    let skipass = await SkipassModel.findOne({ where: { id } });
    skipass.title = title;
    skipass.content = content;
    skipass.price = price;
    await skipass.save();
    res.send({ success: true, message: "Успешно" });
  } catch (err) {
    res.send({ success: false, message: "Ошибка сохранения" });
    console.log(err);
  }
});

app.post(`/create_skipass`, async function (req, res) {
  try {
    let { title, content, price } = req.body;
    let skipass = await SkipassModel.create({
      title,
      content,
      price,
    });
    await skipass.save();
    return res.send({
      message: "Ски-пасс успешно создан",
      success: true,
      status: 200,
    });
  } catch (err) {
    res.send({
      message: "Ошибка создания ски-пасса",
      success: false,
      err,
      status: 400,
    });
  }
});

app.post(`/delete_skipass`, async function (req, res) {
  try {
    let id = req.body.id;
    let skipass = await SkipassModel.findOne({ where: { id: id } });
    await skipass.destroy();
    res.send({
      message: "Удаление прошло успешно",
      status: 200,
      success: true,
    });
  } catch (err) {
    res.send({ message: "Ошибка удаления ски-пасса", err, success: false });
  }
});

app.post(`/payment`, async function (req, res) {
  try {
    let { price, name, id, userID, category, clientID } = req.body;
    let client = await UserModel.findOne({ where: { id: clientID } });
    let user = await UserModel.findOne({ where: { id: userID } });
    let request = await ReqBrone.findOne({
      where: { done: true, clientID, cardID: id, userID },
    });
    let totalPrice = request.places * price * 0.06;
    console.log("Данные для платежа", totalPrice, price);
    let { paymentRef, payment } = await initPayment(totalPrice, name);
    if (category == "transfer") {
      let transfer = await CardTransfer.findOne({ where: { id } });
      awaitPayment(payment).then(async (result) => {
        if (result) {
          console.log("Результат", result);
          request.status = "Оплачено";
          await request.save();
          if (bot) {
            bot.sendMessage(
              user.chatID,
              `Клиент оплатил комиссию https://sneg-info.ru/transfer/card?id=${id} ${client.username} ${client.surname} ${client.phone}`
            );
          }
          if (user.email) {
            let transporter = nodemailer.createTransport({
              host: "smtp.beget.com",
              port: 2525,
              secure: false,
              auth: {
                user: "codered-it@coderedit.site",
                pass: "Stas_2001",
              },
            });

            let mailOptions = {
              from: "<codered-it@coderedit.site>",
              to: user.email,
              subject: "Оплата",
              text: "Оплата",
              html: `Клиент оплатил комиссию https://sneg-info.ru/transfer/card?id=${id} ${client.username} ${client.surname} ${client.phone}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log("Message sent: %s", info.messageId);
            });
          }
          await transfer.save();
        }
      });
    } else if (category == "hotel") {
      let hotel = await HotelModel.findOne({ where: { id } });
      awaitPayment(payment).then(async (result) => {
        if (result) {
          console.log("Результат", result);
          request.status = "Оплачено";
          await request.save();
          if (bot) {
            bot.sendMessage(
              user.chatID,
              `Клиент оплатил комиссию https://sneg-info.ru/card?id=${id}&name=${category}' ${client.username} ${client.surname} ${client.phone}`
            );
          }
          if (user.email) {
            let transporter = nodemailer.createTransport({
              host: "smtp.beget.com",
              port: 2525,
              secure: false,
              auth: {
                user: "codered-it@coderedit.site",
                pass: "Stas_2001",
              },
            });

            let mailOptions = {
              from: "<codered-it@coderedit.site>",
              to: user.email,
              subject: "Оплата",
              text: "Оплата",
              html: `Клиент оплатил комиссию https://sneg-info.ru/card?id=${id}&name=${category}' ${client.username} ${client.surname} ${client.phone}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log("Message sent: %s", info.messageId);
            });
          }
          await hotel.save();
        }
      });
    } else if (category == "service") {
      let service = await CardService.findOne({ where: { id } });
      awaitPayment(payment).then(async (result) => {
        if (result) {
          console.log("Результат", result);
          request.status = "Оплачено";
          await request.save();
          if (bot) {
            bot.sendMessage(
              user.chatID,
              `Клиент оплатил комиссию https://sneg-info.ru/card?id=${id}&name=${category}' ${client.username} ${client.surname} ${client.phone}`
            );
          }
          if (email) {
            let transporter = nodemailer.createTransport({
              host: "smtp.beget.com",
              port: 2525,
              secure: false,
              auth: {
                user: "codered-it@coderedit.site",
                pass: "Stas_2001",
              },
            });

            let mailOptions = {
              from: "<codered-it@coderedit.site>",
              to: user.email,
              subject: "Оплата",
              text: "Оплата",
              html: `Клиент оплатил комиссию https://sneg-info.ru/card?id=${id}&name=${category}' ${client.username} ${client.surname} ${client.phone}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log("Message sent: %s", info.messageId);
            });
          }
          await service.save();
        }
      });
    } else {
      let card = await CardModel.findOne({ where: { id } });
      awaitPayment(payment).then(async (result) => {
        if (result) {
          console.log("Результат", result);
          request.status = "Оплачено";
          await request.save();
          if (bot) {
            bot.sendMessage(
              user.chatID,
              `Клиент оплатил комиссию https://sneg-info.ru/card?id=${id}&name=${category}' ${client.username} ${client.surname} ${client.phone}`
            );
          }
          if (email) {
            let transporter = nodemailer.createTransport({
              host: "smtp.beget.com",
              port: 2525,
              secure: false,
              auth: {
                user: "codered-it@coderedit.site",
                pass: "Stas_2001",
              },
            });

            let mailOptions = {
              from: "<codered-it@coderedit.site>",
              to: user.email,
              subject: "Оплата",
              text: "Оплата",
              html: `Клиент оплатил комиссию https://sneg-info.ru/card?id=${id}&name=${category}' ${client.username} ${client.surname} ${client.phone}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log("Message sent: %s", info.messageId);
            });
          }
          await card.save();
        }
      });
    }

    res.send({ paymentRef, success: true });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/send_mail`, async function (req, res) {
  try {
    let { email, phone, fromdate, todate } = req.body;
    let transporter = nodemailer.createTransport({
      host: "smtp.beget.com",
      port: 2525,
      secure: false,
      auth: {
        user: "codered-it@coderedit.site",
        pass: "Stas_2001",
      },
    });

    let mailOptions = {
      from: "<codered-it@coderedit.site>",
      to: email,
      subject: "Бронирование",
      text: "Прошло бронирование",
      html: `Прошло бронирование на сайте http://sneg-info.ru по вашему объявлению.<br>Номер клиента: ${phone}.<br>С <b>${fromdate}</b> по <b>${todate}</b>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    });
    res.send({ status: 200, success: true });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/send_tg`, async function (req, res) {
  try {
    let { phone, chatID, fromdate, todate } = req.body;
    bot.sendMessage(
      chatID,
      `Прошло бронирование на сайте http://sneg-info.ru по вашему объявлению. Номер клиента: ${phone}. С "${fromdate}" по "${todate}"`
    );
    res.send({ status: 200, success: true });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/send_brone`, async function (req, res) {
  try {
    let { chatID, email, name, cardID, accept } = req.body;
    if (accept) {
      if (name == "transfer") {
        let card = await CardTransfer.findOne({ where: { id: cardID } });
        if (bot) {
          bot.sendMessage(
            chatID,
            `Водитель подтвердил ваше бронирование на https://sneg-info.ru/transfer/card?id=${cardID}&confirm=true, оплатите поездку в ближайшее время!`
          );
        }
        if (email) {
          let transporter = nodemailer.createTransport({
            host: "smtp.beget.com",
            port: 2525,
            secure: false,
            auth: {
              user: "codered-it@coderedit.site",
              pass: "Stas_2001",
            },
          });

          let mailOptions = {
            from: "<codered-it@coderedit.site>",
            to: email,
            subject: "Бронирование",
            text: "Ваша бронь подтверждена",
            html: `Водитель подтвердил ваше бронирование на https://sneg-info.ru/transfer/card?id=${cardID}&confirm=true, оплатите поездку в ближайшее время!`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log("Message sent: %s", info.messageId);
          });
        }
      } else if (name == "habitation") {
        let card = await HotelModel.findOne({ where: { id: cardID } });
        if (bot && chatID) {
          bot.sendMessage(
            chatID,
            `Ваш запрос на бронирование принят https://sneg-info.ru/card?id=${cardID}&confirm=true&name=habitation оплатите бронирование в ближайшее время!`
          );
        }
        let transporter = nodemailer.createTransport({
          host: "smtp.beget.com",
          port: 2525,
          secure: false,
          auth: {
            user: "codered-it@coderedit.site",
            pass: "Stas_2001",
          },
        });

        let mailOptions = {
          from: "<codered-it@coderedit.site>",
          to: email,
          subject: "Бронирование",
          text: "Ваша бронь подтверждена",
          html: `Ваш запрос на бронирование принят https://sneg-info.ru/card?id=${cardID}&confirm=true&name=habitation оплатите бронирование в ближайшее время!`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
        });
        if (card.calendar) {
          let calendar = JSON.parse(card.calendar);
          for (let i = 0; i < brone.actives.length; i++) {
            let item = brone.actives[i];
            for (let j = 0; j < calendar.length; j++) {
              if (calendar[j].date == item && !calendar[j].brone) {
                calendar[j].await = false;
                calendar[j].active = false;
              }
            }
          }
          card.calendar = JSON.stringify(calendar);
          await card.save();
        }
      } else {
        let card = await CardModel.findOne({ where: { id: cardID } });
        if (bot && chatID) {
          bot.sendMessage(
            chatID,
            `Ваш запрос на бронирование принят https://sneg-info.ru/card?id=${cardID}&confirm=true&name=${name} оплатите бронирование в ближайшее время!`
          );
        }
        let transporter = nodemailer.createTransport({
          host: "smtp.beget.com",
          port: 2525,
          secure: false,
          auth: {
            user: "codered-it@coderedit.site",
            pass: "Stas_2001",
          },
        });

        let mailOptions = {
          from: "<codered-it@coderedit.site>",
          to: email,
          subject: "Бронирование",
          text: "Ваша бронь подтверждена",
          html: `Ваш запрос на бронирование принят https://sneg-info.ru/card?id=${cardID}&confirm=true&name=${name} оплатите бронирование в ближайшее время!`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
        });
        if (card.calendar) {
          let calendar = JSON.parse(card.calendar);
          for (let i = 0; i < brone.actives.length; i++) {
            let item = brone.actives[i];
            for (let j = 0; j < calendar.length; j++) {
              if (calendar[j].date == item && !calendar[j].brone) {
                calendar[j].await = false;
                calendar[j].active = false;
              }
            }
          }
          card.calendar = JSON.stringify(calendar);
          await card.save();
        }
      }
    } else {
      if (bot) {
        bot.sendMessage(chatID, `Водитель отменил ваше бронирование`);
      }
      if (email) {
        let transporter = nodemailer.createTransport({
          host: "smtp.beget.com",
          port: 2525,
          secure: false,
          auth: {
            user: "codered-it@coderedit.site",
            pass: "Stas_2001",
          },
        });

        let mailOptions = {
          from: "<codered-it@coderedit.site>",
          to: email,
          subject: "Бронирование",
          text: "Ваша бронь отклонена",
          html: `Водитель отменил ваше бронирование`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/admin_requests`, async function (req, res) {
  try {
    let { nameModel, category } = req.body;
    let requests = [];
    if (category == "habitation") {
      requests = await HotelModel.findAll({
        where: { verified: false, subcategory: nameModel },
      });
    } else if (nameModel == "transfer") {
      requests = await CardTransfer.findAll({ where: { verified: false } });
    } else if (nameModel == "service") {
      requests = await CardService.findAll({ where: { verified: false } });
    } else {
      console.log(category, nameModel);
      requests = await CardModel.findAll({
        where: { category: category, subcategory: nameModel, verified: false },
      });
      console.log(requests);
    }
    res.send({ requests });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/accept_request`, async function (req, res) {
  try {
    let { id, nameModel } = req.body;
    let card;
    console.log(id, nameModel);
    if (
      nameModel == "hotels" ||
      nameModel == "cottage" ||
      nameModel == "rooms" ||
      nameModel == "flat"
    ) {
      card = await HotelModel.findOne({ where: { id: id } });
    } else if (nameModel == "transfer") {
      card = await CardTransfer.findOne({ where: { id: id } });
    } else if (nameModel == "service") {
      card = await CardService.findOne({ where: { id: id } });
    } else {
      card = await CardModel.findOne({ where: { id: id } });
    }
    console.log(card);
    card.verified = true;
    await card.save();
    res.send({
      message: "Принято",
      status: 200,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.send({
      message: "Ошибка создания запроса",
      err,
      success: false,
      status: 400,
    });
  }
});

app.post(`/reject_request`, async function (req, res) {
  try {
    let { id, nameModel } = req.body;
    let card;
    console.log(id, nameModel);
    if (nameModel == "hotels") {
      card = await HotelModel.findOne({ where: { id: id } });
    } else if (nameModel == "transfer") {
      card = await CardTransfer.findOne({ where: { id: id } });
    } else if (nameModel == "service") {
      card = await CardService.findOne({ where: { id: id } });
    } else {
      card = await CardModel.findOne({ where: { id: id } });
    }
    await card.destroy();
    res.send({
      message: "Удаление прошло успешно",
      status: 200,
      success: true,
    });
  } catch (err) {
    res.send({ message: "Ошибка удаления запроса", err, success: false });
  }
});
app.get(`/check`, async function (req, res) {
  let admin = false;
  let token = req.headers.authorization;
  console.log(token);
  let { role: userRoles } = jwt.verify(token, secret);
  console.log(userRoles);

  if (token) {
    userRoles.forEach((role) => {
      if (role == "ADMIN") {
        admin = true;
      }
    });
  }
  return res.send({ admin });
});

app.post(`/check_admin`, async function (req, res) {
  try {
    let { id, cardID } = req.body;
    let admin = false;
    let user;
    if (cardID) {
      let card = await HotelModel.findOne({ where: { id: cardID } });
      if (id == card.userID) {
        admin = true;
      }
    } else {
      if (id) {
        user = await UserModel.findOne({ where: { id } });
        if (user.role == "ADMIN") {
          admin = true;
        }
      }
    }
    res.send({ admin });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/notifications`, async function (req, res) {
  try {
    let { nameModel, category } = req.body;
    if (nameModel == "reqAll") {
      let transfer = await CardTransfer.findAll({ where: { verified: false } });
      let service = await CardService.findAll({ where: { verified: false } });
      let cards = await CardModel.findAll({ where: { verified: false } });
      let habitation = await HotelModel.findAll({
        where: {
          verified: false,
        },
      });
      let payments = await RequestPaymentModel.findAll({
        where: { done: false },
      });

      let s =
        transfer.length +
        service.length +
        cards.length +
        habitation.length +
        payments.length;
      return res.send({ s });
    }
    if (nameModel == "all") {
      let transfer = await CardTransfer.findAll({ where: { verified: false } });
      let service = await CardService.findAll({ where: { verified: false } });
      if (transfer) {
        transfer = transfer.length + service.length;
      }

      let habitation = await HotelModel.findAll({
        where: {
          verified: false,
        },
      });
      if (habitation) {
        habitation = habitation.length;
      }

      let rental = await CardModel.findAll({
        where: {
          category: "rental",
          verified: false,
        },
      });
      if (rental) {
        rental = rental.length;
      }

      let forChildren = await CardModel.findAll({
        where: {
          category: "forChildren",
          verified: false,
        },
      });
      if (forChildren) {
        forChildren = forChildren.length;
      }

      let instructorTours = await CardModel.findAll({
        where: { category: "instructorTours", verified: false },
      });
      if (instructorTours) {
        instructorTours = instructorTours.length;
      }

      let events = await CardModel.findAll({
        where: { category: "events", verified: false },
      });
      if (events) {
        events = events.length;
      }

      let payments = await RequestPaymentModel.findAll({
        where: { done: false },
      });
      if (payments) {
        payments = payments.length;
      }

      return res.send({
        transfer: transfer,
        habitation: habitation,
        rental: rental,
        forChildren: forChildren,
        instructorTours: instructorTours,
        events: events,
        payments: payments,
      });
    } else if (nameModel == "habitation") {
      let hotel = await HotelModel.findAll({
        where: { verified: false, subcategory: "hotels" },
      });
      if (hotel) {
        hotel = hotel.length;
      }

      let cottage = await HotelModel.findAll({
        where: { subcategory: "cottage", verified: false },
      });
      if (cottage) {
        cottage = cottage.length;
      }

      let flat = await HotelModel.findAll({
        where: { subcategory: "flat", verified: false },
      });
      if (flat) {
        flat = flat.length;
      }

      let room = await HotelModel.findAll({
        where: { subcategory: "rooms", verified: false },
      });
      if (room) {
        room = room.length;
      }

      let hostel = await HotelModel.findAll({
        where: { subcategory: "hostel", verified: false },
      });
      if (hostel) {
        hostel = hostel.length;
      }

      let longterm = await HotelModel.findAll({
        where: { subcategory: "longterm" },
      });
      if (longterm) {
        longterm = longterm.length;
      }

      return res.send({ hotel, cottage, flat, room, hostel, longterm });
    } else if (nameModel == "forChildren") {
      let childrenRooms = await CardModel.findAll({
        where: { subcategory: "childrenRooms", verified: false },
      });
      if (childrenRooms) {
        childrenRooms = childrenRooms.length;
      }

      let nanny = await CardModel.findAll({
        where: { subcategory: "nanny", verified: false },
      });
      if (nanny) {
        nanny = nanny.length;
      }

      let otherEntertainment = await CardModel.findAll({
        where: { subcategory: "otherEntertainment", verified: false },
      });
      if (otherEntertainment) {
        otherEntertainment = otherEntertainment.length;
      }

      let instructor = await CardModel.findAll({
        where: { subcategory: "instructor", verified: false },
      });
      if (instructor) {
        instructor = instructor.length;
      }

      return res.send({ childrenRooms, nanny, otherEntertainment, instructor });
    } else if (nameModel == "events") {
      let bans = await CardModel.findAll({
        where: { subcategory: "bans", verified: false },
      });
      if (bans) {
        bans = bans.length;
      }

      let massage = await CardModel.findAll({
        where: { subcategory: "massage", verified: false },
      });
      if (massage) {
        massage = massage.length;
      }

      let restaurants = await CardModel.findAll({
        where: { subcategory: "restaurants", verified: false },
      });
      if (restaurants) {
        restaurants = restaurants.length;
      }

      let nightClubs = await CardModel.findAll({
        where: { subcategory: "nightClubs", verified: false },
      });
      if (nightClubs) {
        nightClubs = nightClubs.length;
      }

      let hoofing = await CardModel.findAll({
        where: { subcategory: "hoofing", verified: false },
      });
      if (hoofing) {
        hoofing = hoofing.length;
      }

      let karaoke = await CardModel.findAll({
        where: { subcategory: "karaoke", verified: false },
      });
      if (karaoke) {
        karaoke = karaoke.length;
      }

      let ratrak = await CardModel.findAll({
        where: { subcategory: "ratrak", verified: false },
      });
      if (ratrak) {
        ratrak = ratrak.length;
      }

      let helicopter = await CardModel.findAll({
        where: { subcategory: "helicopter", verified: false },
      });
      if (helicopter) {
        helicopter = helicopter.length;
      }

      let zoos = await CardModel.findAll({
        where: { subcategory: "zoos", verified: false },
      });
      if (zoos) {
        zoos = zoos.length;
      }

      return res.send({
        bans,
        massage,
        restaurants,
        nightClubs,
        hoofing,
        karaoke,
        ratrak,
        helicopter,
        zoos,
      });
    } else if (nameModel == "rental") {
      let inventory = await CardModel.findAll({
        where: { subcategory: "inventory", verified: false },
      });
      if (inventory) {
        inventory = inventory.length;
      }

      let hookah = await CardModel.findAll({
        where: { subcategory: "hookah", verified: false },
      });
      if (hookah) {
        hookah = hookah.length;
      }

      let transport = await CardModel.findAll({
        where: { subcategory: "transport", verified: false },
      });
      if (transport) {
        transport = transport.length;
      }

      let other = await CardModel.findAll({
        where: { subcategory: "other", verified: false },
      });
      if (other) {
        other = other.length;
      }

      return res.send({ inventory, hookah, transport, other });
    } else if (nameModel == "instructorTours") {
      let instructorAdults = await CardModel.findAll({
        where: { subcategory: "instructorAdults", verified: false },
      });
      if (instructorAdults) {
        instructorAdults = instructorAdults.length;
      }

      let instructorChildren = await CardModel.findAll({
        where: { subcategory: "instructorChildren", verified: false },
      });
      if (instructorChildren) {
        instructorChildren = instructorChildren.length;
      }

      let winterTours = await CardModel.findAll({
        where: { subcategory: "winterTours", verified: false },
      });
      if (winterTours) {
        winterTours = winterTours.length;
      }

      let summerTours = await CardModel.findAll({
        where: { subcategory: "summerTours", verified: false },
      });
      if (summerTours) {
        summerTours = summerTours.length;
      }

      return res.send({
        instructorAdults,
        instructorChildren,
        winterTours,
        summerTours,
      });
    } else {
      let cards;
      let transfers = await CardTransfer.findAll({
        where: { verified: false },
      });
      if (transfers) {
        transfers = transfers.length;
      }
      let services = await CardService.findAll({ where: { verified: false } });
      if (services) {
        services = services.length;
      }
      let hotels = await HotelModel.findAll({ where: { verified: false } });
      if (hotels) {
        hotels = hotels.length;
      }
      if (category && nameModel) {
        cards = await CardModel.findAll({
          where: {
            verified: false,
            category: category,
            subcategory: nameModel,
          },
        });
        if (cards) {
          cards = cards.length;
        }
      }

      return res.send({ transfers, services, hotels, cards });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/profile`, async function (req, res) {
  try {
    let { id } = req.body;
    let user;
    if (id) {
      user = await UserModel.findOne({ where: { id } });
      let cards = await ReqBrone.findAll({
        where: { userID: id, done: false },
      });
      res.send({ user, cards });
    } else {
      res.send({ status: 400, message: "Пользователь не найден" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/myads`, async function (req, res) {
  try {
    let { id } = req.body;
    let cards = [];
    let hotels = [];
    let transfers = [];
    let services = [];
    if (id) {
      cards = await CardModel.findAll({
        where: { userID: id },
      });
      hotels = await HotelModel.findAll({
        where: { userID: id },
      });
      transfers = await CardTransfer.findAll({
        where: { userID: id },
      });
      transfers.sort((a, b) => {
        // Сначала сравниваем даты
        const dateComparison = new Date(a.datefrom) - new Date(b.datefrom);

        // Если даты равны, сравниваем время
        if (dateComparison === 0) {
          return (
            new Date(`1970-01-01T${a.timefrom}:00Z`) -
            new Date(`1970-01-01T${b.timefrom}:00Z`)
          );
        }

        return dateComparison;
      });
      services = await CardService.findAll({
        where: { userID: id },
      });
    }
    res.send({ cards, hotels, transfers, services });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/transfer_days`, async function (req, res) {
  try {
    let { month, cityfrom, cityto, passenger } = req.body;
    let Array = [];
    if (cityfrom && cityto) {
      let transfers = await CardTransfer.findAll({
        where: { cityfrom, cityto, done: false },
      });
      let days = [];
      for (let i = 0; i < transfers.length; i++) {
        let transfer = transfers[i];
        if (month.includes(transfer.datefrom) && transfer.passenger > 0) {
          days.push(transfer);
        }
      }
      days.sort((a, b) => {
        // Сначала сравниваем даты
        const dateComparison = new Date(a.datefrom) - new Date(b.datefrom);

        // Если даты равны, сравниваем время
        if (dateComparison === 0) {
          return (
            new Date(`1970-01-01T${a.timefrom}:00Z`) -
            new Date(`1970-01-01T${b.timefrom}:00Z`)
          );
        }

        return dateComparison;
      });
      days.forEach((element) => {
        if (passenger <= element.passenger - element.boardedPlaces) {
          Array.push(element);
        }
      });
      res.send({ Array });
    } else if (cityfrom && !cityto) {
      let transfers = await CardTransfer.findAll({
        where: { cityfrom, done: false },
      });
      let days = [];
      for (let i = 0; i < transfers.length; i++) {
        let transfer = transfers[i];
        if (month.includes(transfer.datefrom) && transfer.passenger > 0) {
          days.push(transfer);
        }
      }
      days.sort((a, b) => {
        // Сначала сравниваем даты
        const dateComparison = new Date(a.datefrom) - new Date(b.datefrom);

        // Если даты равны, сравниваем время
        if (dateComparison === 0) {
          return (
            new Date(`1970-01-01T${a.timefrom}:00Z`) -
            new Date(`1970-01-01T${b.timefrom}:00Z`)
          );
        }

        return dateComparison;
      });
      days.forEach((element) => {
        if (passenger <= element.passenger - element.boardedPlaces) {
          Array.push(element);
        }
      });
      res.send({ Array });
    } else if (!cityfrom && cityto) {
      let transfers = await CardTransfer.findAll({
        where: { cityto, done: false },
      });
      let days = [];
      for (let i = 0; i < transfers.length; i++) {
        let transfer = transfers[i];
        if (month.includes(transfer.datefrom) && transfer.passenger > 0) {
          days.push(transfer);
        }
      }
      days.sort((a, b) => {
        // Сначала сравниваем даты
        const dateComparison = new Date(a.datefrom) - new Date(b.datefrom);

        // Если даты равны, сравниваем время
        if (dateComparison === 0) {
          return (
            new Date(`1970-01-01T${a.timefrom}:00Z`) -
            new Date(`1970-01-01T${b.timefrom}:00Z`)
          );
        }

        return dateComparison;
      });
      days.forEach((element) => {
        if (passenger <= element.passenger - element.boardedPlaces) {
          Array.push(element);
        }
      });
      res.send({ Array });
    } else {
      let transfers = await CardTransfer.findAll({ where: { done: false } });
      let days = [];
      for (let i = 0; i < transfers.length; i++) {
        let transfer = transfers[i];
        if (month.includes(transfer.datefrom) && transfer.passenger > 0) {
          days.push(transfer);
        }
      }
      // days.sort((a, b) => new Date(a.datefrom) - new Date(b.datefrom));
      days.sort((a, b) => {
        // Сначала сравниваем даты
        const dateComparison = new Date(a.datefrom) - new Date(b.datefrom);

        // Если даты равны, сравниваем время
        if (dateComparison === 0) {
          return (
            new Date(`1970-01-01T${a.timefrom}:00Z`) -
            new Date(`1970-01-01T${b.timefrom}:00Z`)
          );
        }

        return dateComparison;
      });
      days.forEach((element) => {
        if (passenger <= element.passenger - element.boardedPlaces) {
          Array.push(element);
        }
      });
      res.send({ Array });
    }
  } catch (err) {
    console.log(err);
  }
});

let code;

app.post(`/confirmation`, async function (req, res) {
  try {
    let { phone, codeInput } = req.body;
    let number;
    if (phone) {
      number = phone.slice(1);
    }
    console.log(number, codeInput);
    if (codeInput) {
      console.log(codeInput, code);
      if (codeInput == code) {
        res.send({ verified: true });
      } else {
        res.send({ verified: false });
      }
    } else {
      let response = await sms.codeCall({
        to: phone,
      });
      console.log(response);
      code = response.code;
      let status = response.status;
      if (status == "OK") {
        res.send({ status: 200, message: "Звонок будет исполнен, ожидайте" });
      } else {
        res.send({ status: 400, message: "Ошибка, попробуйте позже" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/request_payments`, async function (req, res) {
  try {
    let { userID } = req.body;
    if (userID) {
      let user = await UserModel.findOne({ id: userID });
      if (user) {
        res.send({ balance: user.balance });
      }
    } else {
      let requests = await RequestPaymentModel.findAll({ done: false });
      res.send({ requests });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/request_payment`, async function (req, res) {
  try {
    let { userID, amount, card_number } = req.body;
    if (userID && amount && card_number) {
      let user = await UserModel.findOne({ id: userID });
      let request = await RequestPaymentModel.create({
        username: user.username,
        surname: user.surname,
        userID: userID,
        amount: amount,
        card_number: card_number,
        phone: user.phone,
        done: false,
      });
      await request.save();
      res.send({
        success: true,
        status: 200,
        message: "Запрос на вывод успешно создан, ожидайте",
      });
    } else {
      res.send({
        success: false,
        status: 400,
        message: "Недостаточно данных!",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/accept_payments`, async function (req, res) {
  try {
    let { id } = req.body;
    let request = await RequestPaymentModel.findOne({ id });
    let user = await UserModel.findOne({ id: request.userID });
    if (user.balance >= request.amount) {
      user.balance -= request.amount;
      request.done = true;
      await user.save();
      await request.save();
      res.send({ message: "Успешно", success: true });
    } else {
      res.send({
        message: "Сумма вывода превышает баланс пользователя!",
        success: false,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/reject_payments`, async function (req, res) {
  try {
    let { id } = req.body;
    let request = await RequestPaymentModel.findOne({ id });
    await request.destroy();
    res.send({ success: true });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/weather`, async function (req, res) {
  try {
    let data = await readFile("data.json", "utf8");
    let jsonData = JSON.parse(data);
    res.send({ data: jsonData });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/clone_card`, async function (req, res) {
  try {
    let { id } = req.body;
    let card = await CardTransfer.findOne({ where: { id } });
    if (card) {
      res.send({ card });
    } else {
      res.send({ message: "Такого объявления не существует", status: 400 });
      console.log("Такого объявления не существует");
    }
  } catch (e) {
    console.log(e);
  }
});

app.post(`/confirm_trip`, async function (req, res) {
  try {
    let { id } = req.body;
    if (id) {
      let transfer = await CardTransfer.findOne({ where: { id } });
      if (transfer) {
        transfer.confirmTrip = true;
        await transfer.save();
        res.send({ status: 200, message: "Поездка успешно подтверждена" });
      } else {
        res.send({ status: 400, message: "Такой поездки не существует" });
      }
    } else {
      res.send({ status: 400, message: "Номер поездки не передан" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/bind_messenger`, async function (req, res) {
  try {
    let { id, messenger, username, number, chatID } = req.body;
    if (id) {
      let user = await UserModel.findOne({ where: { id } });
      if (user) {
        let messengers = JSON.parse(user.messengers);
        messengers.push({
          messenger: messenger,
          username: username,
          number: number,
        });
        user.chatID = chatID;
        user.messengers = JSON.stringify(messengers);
        await user.save();
        res.send({ status: 200, message: "Мессенджер успешно привязан" });
      } else {
        res.send({ status: 400, message: "Пользователь не найден" });
      }
    }
  } catch (err) {
    res.send({ status: 400, message: "Серверная ошибка" });
    console.log(err);
  }
});

app.post(`/unbind_messenger`, async function (req, res) {
  try {
    let { id, messenger } = req.body;
    if (id) {
      let user = await UserModel.findOne({ where: { id } });
      if (user) {
        let messengers = JSON.parse(user.messengers);
        let item = messengers.findIndex((n) => n.messenger == messenger);
        if (item !== -1) {
          messengers.splice(item, 1);
        }
        user.messengers = JSON.stringify(messengers);
        await user.save();
        res.send({ status: 200 });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/request_brone`, async function (req, res) {
  try {
    let { cardID, name, create, username, number, clientID, places, brone } =
      req.body;
    if (name == "transfer") {
      if (create) {
        let card = await CardTransfer.findOne({ where: { id: cardID } });
        let userID = card.userID;
        if (card.passenger - card.boardedPlaces >= places) {
          let req = await ReqBrone.build({
            cardID: cardID,
            userID: userID,
            username: username,
            phone: number,
            places: places,
            clientID: clientID,
            name: "transfer",
            done: false,
            status: "Ждет подтверждения",
          });
          await req.save();
          let user = await UserModel.findOne({ where: { id: card.userID } });
          if (bot) {
            console.log("Телеграм бот");
            bot.sendMessage(
              user.chatID,
              `У вас новый запрос на бронирование https://sneg-info.ru/transfer/card?id=${cardID}, перейдите в "Запросы бронирования" и подтвердите запрос!`
            );
          }
          let transporter = nodemailer.createTransport({
            host: "smtp.beget.com",
            port: 2525,
            secure: false,
            auth: {
              user: "codered-it@coderedit.site",
              pass: "Stas_2001",
            },
          });

          let mailOptions = {
            from: "<codered-it@coderedit.site>",
            to: card.email,
            subject: "Бронирование",
            text: "Новый запрос на бронь!",
            html: `У вас новый запрос на бронирование https://sneg-info.ru/transfer/card?id=${cardID}, перейдите в "Запросы бронирования" и подтвердите запрос!`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log("Message sent: %s", info.messageId);
          });
          res.send({
            status: 200,
            message: "Успешно, ожидайте подтверждения от водителя!",
          });
        } else {
          res.send({
            status: 400,
            message: `Превышает количество свободных мест! Осталось свободных мест: ${
              card.passenger - card.boardedPlaces
            }`,
          });
        }
      } else {
        let reqs = await ReqBrone.findAll({
          where: { cardID: cardID, done: false, name: "transfer" },
        });
        reqs.reverse();
        res.send({ reqs });
      }
    } else if (name == "habitation") {
      if (create) {
        let card = await HotelModel.findOne({ where: { id: cardID } });
        let userID = card.id;
        let actives = [];
        brone.forEach((item) => {
          if (item.active) {
            actives.push(item.date);
          }
        });
        if (true) {
          let req = await ReqBrone.build({
            cardID: cardID,
            userID: userID,
            username: username,
            phone: number,
            brone: JSON.stringify(brone),
            actives: JSON.stringify(actives),
            places: places,
            clientID: clientID,
            name: "habitation",
            done: false,
            status: "Ждет подтверждения",
          });
          await req.save();
          if (!card.calendar) {
            card.calendar = JSON.stringify(brone);
          }
          let cal = JSON.parse(card.calendar);
          for (let i = 0; i < brone.length; i++) {
            if (!cal[i].brone && brone[i].active) {
              cal[i].await = true;
              cal[i].active = false;
            }
          }
          card.calendar = JSON.stringify(cal);
          await card.save();
          let user = await UserModel.findOne({ where: { id: card.userID } });
          if (bot) {
            console.log("Телеграм бот");
            bot.sendMessage(
              user.chatID,
              `У вас новый запрос на бронирование https://sneg-info.ru/card?id=${cardID}&name=habitation&edit=true, перейдите в "Запросы бронирования" и подтвердите запрос!`
            );
          }
          let transporter = nodemailer.createTransport({
            host: "smtp.beget.com",
            port: 2525,
            secure: false,
            auth: {
              user: "codered-it@coderedit.site",
              pass: "Stas_2001",
            },
          });

          let mailOptions = {
            from: "<codered-it@coderedit.site>",
            to: card.email,
            subject: "Бронирование",
            text: "Новый запрос на бронь!",
            html: `У вас новый запрос на бронирование https://sneg-info.ru/transfer/card?id=${cardID}&name=habitation&edit=true, перейдите в "Запросы бронирования" и подтвердите запрос!`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log("Message sent: %s", info.messageId);
          });
          res.send({
            status: 200,
            message: "Успешно, ожидайте подтверждения от хозяина объявления!",
          });
        } else {
          res.send({
            status: 400,
            message: `На эти даты мест нет...`,
          });
        }
      } else {
        let reqs = await ReqBrone.findAll({
          where: { cardID: cardID, done: false, name: "habitation" },
        });
        reqs.reverse();
        res.send({ reqs });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/accept_request_brone`, async function (req, res) {
  try {
    let { id, name } = req.body;
    console.log(id, name);
    if (name == "transfer") {
      let request = await ReqBrone.findOne({ where: { id } });
      if (request) {
        request.status = "Ждет оплаты";
        request.done = true;
        let transfer = await CardTransfer.findOne({
          where: { id: request.cardID },
        });
        if (transfer) {
          if (transfer.passenger - transfer.boardedPlaces >= request.places) {
            transfer.boardedPlaces += request.places;
          }
        }
        await transfer.save();
        await request.save();
        let client = await UserModel.findOne({
          where: { id: request.clientID },
        });
        res.send({
          status: 200,
          message:
            "Запрос успешно принят, пользователь перенаправлен на оплату поездки",
          chatID: client.chatID,
          email: client.email,
        });
      }
    } else if (name == "habitation") {
      let request = await ReqBrone.findOne({ where: { id } });
      if (request) {
        let card = await HotelModel.findOne({ where: { id: request.cardID } });
        if (card) {
          let calendar = JSON.parse(card.calendar);
          let brone = JSON.parse(request.brone);
          if (calendar) {
            for (let i = 0; i < calendar.length; i++) {
              let cal = calendar[i];
              let br = brone[i];
              if (!cal.brone && br.active) {
                calendar[i].brone = true;
                calendar[i].await = false;
              }
            }
            card.calendar = JSON.stringify(calendar);
            request.status = "Ждет оплаты";
            request.done = true;
            await card.save();
            await request.save();
            res.send({
              status: 200,
              message:
                "Запрос успешно принят, пользователь перенаправлен на оплату",
            });
          } else {
            let cal2 = brone;
            for (let i = 0; i < brone.length; i++) {
              if (cal2[i].active) {
                cal2[i].brone = true;
                cal2[i].active = false;
                cal2[i].await = false;
              }
            }
            card.calendar = JSON.stringify(cal2);
            request.status = "Ждет оплаты";
            request.done = true;
            await card.save();
            await request.save();
            res.send({
              status: 200,
              message:
                "Запрос успешно принят, пользователь перенаправлен на оплату",
            });
          }
        } else {
          res.send({ status: 400, message: "Объявления больше нет" });
        }
        console.log(card);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/reject_request_brone`, async function (req, res) {
  try {
    let { id, name } = req.body;
    let request = await ReqBrone.findOne({ where: { id } });
    let card;
    if (request) {
      if (name == "transfer") {
        card = await CardTransfer.findOne({ where: { id: request.cardID } });
        if (card) {
          card.boardedPlaces -= request.places;
        }
      }
      request.done = true;
      request.status = "Отменен";
      let client = await UserModel.findOne({ where: { id: request.clientID } });
      await request.save();
      res.send({
        status: 200,
        message: "Запрос успешно отклонён",
        accept: false,
        chatID: client.chatID,
        email: client.email,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/back_publish`, async function (req, res) {
  try {
    let { id, name } = req.body;
    let card;
    if (name == "habitation") {
      card = await HotelModel.findOne({ id });
    } else if (name == "transfer") {
      card = await CardTransfer.findOne({ id });
    }
    if (card) {
      card.done = false;
      await card.save();
      res.send({ status: 200, message: "Успешно" });
    } else {
      res.send({ status: 400, message: "Ваше объявление не найдено" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/get_calendar`, async function (req, res) {
  try {
    let { id } = req.body;
    if (id) {
      let card = await HotelModel.findOne({ where: { id } });
      res.send({ calendar: card.calendar });
    }
  } catch (e) {
    console.log(e);
  }
});

app.post(`/set_calendar`, async function (req, res) {
  try {
    let { id, calendar } = req.body;
    if (id) {
      let card = await HotelModel.findOne({ where: { id } });
      if (card) {
        card.calendar = JSON.stringify(calendar);
        await card.save();
        res.send({
          message: "Запрос на бронирование отправлен, ожидайте подтверждения!",
          status: 200,
        });
      } else {
        res.send({ status: 400, message: "Объявление не найдено!" });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

app.post(`/set_price`, async function (req, res) {
  try {
    let { price_workdays, price_weekdays, id, calendar } = req.body;
    let card = await HotelModel.findOne({ where: { id } });
    let work = ["пн", "вт", "ср", "чт", "пт", "Mo", "Tu", "We", "Th", "Fr"];
    if (card) {
      if (card.calendar && card.calendar != "[]") {
        let cal = JSON.parse(card.calendar);
        for (let i = 0; i < cal.length; i++) {
          let day = cal[i].date.slice(0, 2);
          if (work.includes(day)) {
            cal[i].price = price_workdays;
          } else {
            cal[i].price = price_weekdays;
          }
        }
        card.calendar = JSON.stringify(cal);
        await card.save();
        res.send({ calendar: card.calendar });
      } else {
        for (let i = 0; i < calendar.length; i++) {
          if (work.includes(calendar[i].date.slice(0, 2))) {
            calendar[i].price = price_workdays;
          } else {
            calendar[i].price = price_weekdays;
          }
        }
        card.calendar = JSON.stringify(calendar);
        await card.save();
        res.send({ calendar: card.calendar });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/set_close`, async function (req, res) {
  try {
    let { id, calendar } = req.body;
    let card = await HotelModel.findOne({ where: { id } });
    if (card) {
      if (card.calendar) {
        let cal = JSON.parse(card.calendar);
        for (let i = 0; i < calendar.length; i++) {
          if (calendar[i].active) {
            cal[i].brone = true;
            cal[i].active = false;
          }
        }
        card.calendar = JSON.stringify(cal);
        await card.save();
        res.send({ calendar: card.calendar });
      } else {
        let cal = calendar;
        for (let i = 0; i < calendar.length; i++) {
          if (cal[i].active) {
            cal[i].brone = true;
            cal[i].active = false;
          }
        }
        card.calendar = JSON.stringify(cal);
        await card.save();
        res.send({ calendar: card.calendar });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/set_open`, async function (req, res) {
  try {
    let { id, calendar } = req.body;
    let card = await HotelModel.findOne({ where: { id } });
    if (card) {
      if (card.calendar) {
        let cal = JSON.parse(card.calendar);
        for (let i = 0; i < calendar.length; i++) {
          if (calendar[i].active) {
            cal[i].brone = false;
            cal[i].active = false;
          }
        }
        card.calendar = JSON.stringify(cal);
        await card.save();
        res.send({ calendar: card.calendar });
      } else {
        let cal = calendar;
        for (let i = 0; i < calendar.length; i++) {
          if (cal[i].active) {
            cal[i].brone = false;
            cal[i].active = false;
          }
        }
        card.calendar = JSON.stringify(cal);
        await card.save();
        res.send({ calendar: card.calendar });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/set_price_date`, async function (req, res) {
  try {
    let { item, id, price, calendar } = req.body;
    let card = await HotelModel.findOne({ where: { id } });
    if (card) {
      if (card.calendar) {
        let cal = JSON.parse(card.calendar);
        cal[item].price = price;
        card.calendar = JSON.stringify(cal);
        await card.save();
        res.send({ calendar: card.calendar });
      } else {
        let cal = calendar;
        cal[item].price = price;
        card.calendar = JSON.stringify(cal);
        await card.save();
        res.send({ calendar: card.calendar });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

function filterFilledProperties(params) {
  const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {});
  return Object(filteredParams);
}

app.post(`/search_habitation`, async function (req, res) {
  try {
    let { params, datefrom, dateto, minprice, maxprice } = req.body;
    dayjs.locale("ru");
    let filledParams = filterFilledProperties(params);
    let cards = await HotelModel.findAll({ where: filledParams });
    cards.reverse();
    let INFO = [];
    if (datefrom || dateto || minprice || maxprice) {
      datefrom = dayjs(datefrom);
      dateto = dayjs(dateto);
      let datesBetween = [];
      let daysCount = dateto.diff(datefrom, "day"); // Подсчитываем количество дней между датами
      for (let i = 0; i <= daysCount; i++) {
        let currentDay = datefrom.clone().add(i, "day"); // Клонируем datefrom и добавляем i-1 дней
        datesBetween.push(currentDay.format(`dd - D MMMM`)); // Добавляем текущую дату в массив
      }
      for (let i = 0; i < cards.length; i++) {
        let info = cards[i];
        let counter = 0;
        let calendar;
        if (info.calendar) {
          calendar = JSON.parse(info.calendar);
          calendar.forEach((day) => {
            if (datesBetween.includes(day.date) && !day.brone) {
              counter++;
            }
          });
        }
        if (minprice && maxprice) {
          if (minprice <= info.price && info.price <= maxprice) {
            INFO.push(info);
          }
        } else if (minprice) {
          if (minprice <= info.price) {
            INFO.push(info);
          }
        } else if (maxprice) {
          if (info.price <= maxprice) {
            INFO.push(info);
          }
        } else {
          if (counter > 0) {
            INFO.push(info);
          }
        }
      }
    } else {
      INFO = cards;
    }
    res.send({ INFO });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/myreq`, async function (req, res) {
  try {
    let { id } = req.body;
    if (id) {
      let info = await ReqBrone.findAll({
        where: { clientID: id },
      });
      let cards = [];
      let hotels = [];
      let transfers = [];
      let services = [];
      for (let i = 0; i < info.length; i++) {
        let item = info[i];
        if (item.name == "habitation") {
          let hotel = await HotelModel.findOne({
            where: { id: item.cardID },
          });
          // console.log(hotel);
          if (hotel) {
            let obj = { ...hotel.dataValues };
            obj.status = item.status;
            hotels.push(obj);
          }
        } else if (item.name == "transfer") {
          let transfer = await CardTransfer.findOne({
            where: { id: item.cardID },
          });
          if (transfer) {
            let obj = { ...transfer.dataValues };
            obj.status = item.status;
            transfers.push(obj);
          }
        } else if (item.name == "service") {
          let service = await CardService.findOne({
            where: { id: item.cardID },
          });
          if (service) {
            let obj = { ...service.dataValues };
            obj.status = item.status;
            services.push(obj);
          }
        } else {
          let card = await CardModel.findOne({
            where: { id: item.cardID },
          });
          if (card) {
            let obj = { ...card.dataValues };
            obj.status = item.status;
            cards.push(obj);
          }
        }
      }
      res.send({ transfers, cards, hotels, services });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/cancel_brone`, async function (req, res) {
  try {
    let { id } = req.body;
    console.log(id);
    if (id) {
      let brone = await ReqBrone.findOne({ where: { id } });
      if (brone) {
        let user = await UserModel.findOne({ where: { id: brone.userID } });
        if (brone.name == "habitation" && user) {
          let card = await HotelModel.findOne({ where: { id: brone.cardID } });
          if (card) {
            if (bot) {
              bot.sendMessage(
                user.chatID,
                `Клиент отменил бронирование в одном из ваших объявлений по проживанию`
              );
            }
            let transporter = nodemailer.createTransport({
              host: "smtp.beget.com",
              port: 2525,
              secure: false,
              auth: {
                user: "codered-it@coderedit.site",
                pass: "Stas_2001",
              },
            });

            let mailOptions = {
              from: "<codered-it@coderedit.site>",
              to: card.email,
              subject: "Бронирование",
              text: "Отмена бронирования",
              html: `Клиент отменил бронирование в одном из ваших объявлений по проживанию`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log("Message sent: %s", info.messageId);
            });
            if (card.calendar) {
              let calendar = JSON.parse(card.calendar);
              for (let i = 0; i < brone.actives.length; i++) {
                let item = brone.actives[i];
                for (let j = 0; j < calendar.length; j++) {
                  if (calendar[j].date == item && !calendar[j].brone) {
                    calendar[j].await = false;
                    calendar[j].active = false;
                  }
                }
              }
              card.calendar = JSON.stringify(calendar);
              await card.save();
            }
          }
        } else if (brone.name == "transfer" && user) {
          let card = await CardTransfer.findOne({
            where: { id: brone.cardID },
          });
          if (card) {
            if (bot) {
              bot.sendMessage(
                user.chatID,
                `Клиент отменил бронирование в одном из ваших объявлений по трансферу`
              );
            }
            let transporter = nodemailer.createTransport({
              host: "smtp.beget.com",
              port: 2525,
              secure: false,
              auth: {
                user: "codered-it@coderedit.site",
                pass: "Stas_2001",
              },
            });

            let mailOptions = {
              from: "<codered-it@coderedit.site>",
              to: card.email,
              subject: "Бронирование",
              text: "Отмена бронирования",
              html: `Клиент отменил бронирование в одном из ваших объявлений по трансферу`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log("Message sent: %s", info.messageId);
            });
          }
        }
        brone.destroy();
        await brone.save();
        res.send({ message: "Успешно", status: 200 });
      } else {
        res.send({ message: "Ваша бронь не найдена", status: 400 });
      }
    } else {
      res.send({ message: "Ваша бронь не найдена", status: 400 });
    }
  } catch (err) {
    console.log(err);
  }
});
