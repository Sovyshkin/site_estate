// здесь лежат все модели
const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize(
  //'a0864360_db',
  //'a0864360_db',
  //'password1',
  // { dialect: 'mysql', host: 'localhost' }
  { dialect: "sqlite", storage: "db.sqlite", logging: false }
);

class NewsModel extends Model {}
NewsModel.init(
  {
    title: { type: DataTypes.STRING, allowNull: true },
    content: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "NewsModel" }
);

class UserModel extends Model {}
UserModel.init(
  {
    username: { type: DataTypes.STRING, allowNull: true },
    surname: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    password: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.STRING, allowNull: true },
    balance: { type: DataTypes.INTEGER, allowNull: true },
    messengers: { type: DataTypes.JSON, allowNull: true },
    chatID: { type: DataTypes.STRING, allowNull: true },
    paid: { type: DataTypes.JSON, allowNull: true },
  },
  { sequelize, modelName: "UserModel" }
);

// cards

class CardModel extends Model {}
CardModel.init(
  {
    category: { type: DataTypes.STRING, allowNull: true },
    subcategory: { type: DataTypes.STRING, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: true },
    img: { type: DataTypes.JSON, allowNull: true },
    p: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    chatID: { type: DataTypes.STRING, allowNull: true },
    nameCard: { type: DataTypes.STRING, allowNull: true },
    userID: { type: DataTypes.BOOLEAN, allowNull: true },
    verified: { type: DataTypes.BOOLEAN, allowNull: true },
    done: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { sequelize, modelName: "CardModel" }
);

class CardTransfer extends Model {}
CardTransfer.init(
  {
    name: { type: DataTypes.STRING, allowNull: true },
    region: { type: DataTypes.STRING, allowNull: true },
    regionTo: { type: DataTypes.STRING, allowNull: true },
    cityfrom: { type: DataTypes.STRING, allowNull: true },
    cityto: { type: DataTypes.STRING, allowNull: true },
    datefrom: { type: DataTypes.STRING, allowNull: true },
    timefrom: { type: DataTypes.STRING, allowNull: true },
    typeCar: { type: DataTypes.STRING, allowNull: true },
    car: { type: DataTypes.STRING, allowNull: true },
    passenger: { type: DataTypes.INTEGER, allowNull: true },
    price_sit: { type: DataTypes.INTEGER, allowNull: true },
    komm: { type: DataTypes.INTEGER, allowNull: true },
    length: { type: DataTypes.STRING, allowNull: true },
    boardedPlaces: { type: DataTypes.INTEGER, allowNull: true },
    chatID: { type: DataTypes.STRING, allowNull: true },
    userID: { type: DataTypes.BOOLEAN, allowNull: true },
    verified: { type: DataTypes.BOOLEAN, allowNull: true },
    point: { type: DataTypes.STRING, allowNull: true },
    img: { type: DataTypes.JSON, allowNull: true },
    done: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { sequelize, modelName: "CardTransfer" }
);

class CardService extends Model {}
CardService.init(
  {
    name: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.STRING, allowNull: true },
    img: { type: DataTypes.JSON, allowNull: true },
    chatID: { type: DataTypes.STRING, allowNull: true },
    userID: { type: DataTypes.BOOLEAN, allowNull: true },
    verified: { type: DataTypes.BOOLEAN, allowNull: true },
    done: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { sequelize, modelName: "CardService" }
);

//booking

class HotelModel extends Sequelize.Model {}
HotelModel.init(
  {
    category: { type: DataTypes.STRING, allowNull: true },
    subcategory: { type: DataTypes.STRING, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: true },
    region: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    street: { type: DataTypes.STRING, allowNull: true },
    numberHouse: { type: DataTypes.STRING, allowNull: true },
    img: { type: DataTypes.JSON, allowNull: true },
    paid: { type: DataTypes.JSON, allowNull: true },
    p: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    calendar: { type: DataTypes.JSON, allowNull: true },
    price_workdays: { type: DataTypes.INTEGER, allowNull: true },
    price_weekdays: { type: DataTypes.INTEGER, allowNull: true },
    chatID: { type: DataTypes.STRING, allowNull: true },
    userID: { type: DataTypes.BOOLEAN, allowNull: true },
    verified: { type: DataTypes.BOOLEAN, allowNull: true },

    floor: { type: DataTypes.INTEGER, allowNull: true },
    lease_term: { type: DataTypes.INTEGER, allowNull: true },
    total_area: { type: DataTypes.INTEGER, allowNull: true },
    sleeping_rooms: { type: DataTypes.INTEGER, allowNull: true },
    sleeping_places: { type: DataTypes.INTEGER, allowNull: true },
    children_bed: { type: DataTypes.STRING, allowNull: true },
    double_places: { type: DataTypes.INTEGER, allowNull: true },
    single_spaces: { type: DataTypes.INTEGER, allowNull: true },
    additional_sleeping_places: { type: DataTypes.INTEGER, allowNull: true },
    bathrooms: { type: DataTypes.INTEGER, allowNull: true },
    bathrooms_showers: { type: DataTypes.INTEGER, allowNull: true },
    drying_for_inventory: { type: DataTypes.STRING, allowNull: true },
    wifi: { type: DataTypes.STRING, allowNull: true },
    warm_floor: { type: DataTypes.STRING, allowNull: true },
    dishwasher: { type: DataTypes.STRING, allowNull: true },
    parking_cars: { type: DataTypes.INTEGER, allowNull: true },
    mall: { type: DataTypes.STRING, allowNull: true },
    kazan: { type: DataTypes.STRING, allowNull: true },
    bath_territory: { type: DataTypes.STRING, allowNull: true },
    pool: { type: DataTypes.STRING, allowNull: true },
    poolAllYear: { type: DataTypes.STRING, allowNull: true },
    poolOnlySummer: { type: DataTypes.STRING, allowNull: true },
    poolOpen: { type: DataTypes.STRING, allowNull: true },
    poolClose: { type: DataTypes.STRING, allowNull: true },
    poolHeating: { type: DataTypes.STRING, allowNull: true },
    transfer_city: { type: DataTypes.STRING, allowNull: true },
    transfer_mountain: { type: DataTypes.STRING, allowNull: true },
    live_whith_animals: { type: DataTypes.STRING, allowNull: true },
    additionally: { type: DataTypes.STRING, allowNull: true },
    done: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { sequelize, modelName: "HotelModel" }
);

class NumberModel extends Sequelize.Model {}
NumberModel.init(
  {
    title: { type: DataTypes.STRING, allowNull: true },
    bookings: { type: DataTypes.JSON, allowNull: true },
    // количество номеров тарифа
    floor: { type: DataTypes.INTEGER, allowNull: true },
    lease_term: { type: DataTypes.INTEGER, allowNull: true },
    total_area: { type: DataTypes.INTEGER, allowNull: true },
    sleeping_rooms: { type: DataTypes.INTEGER, allowNull: true },
    sleeping_places: { type: DataTypes.INTEGER, allowNull: true },
    children_bed: { type: DataTypes.STRING, allowNull: true },
    double_places: { type: DataTypes.INTEGER, allowNull: true },
    single_spaces: { type: DataTypes.INTEGER, allowNull: true },
    additional_sleeping_places: { type: DataTypes.INTEGER, allowNull: true },
    bathrooms: { type: DataTypes.INTEGER, allowNull: true },
    bathrooms_showers: { type: DataTypes.INTEGER, allowNull: true },
    drying_for_inventory: { type: DataTypes.STRING, allowNull: true },
    wifi: { type: DataTypes.STRING, allowNull: true },
    warm_floor: { type: DataTypes.STRING, allowNull: true },
    dishwasher: { type: DataTypes.STRING, allowNull: true },
    parking_cars: { type: DataTypes.INTEGER, allowNull: true },
    mall: { type: DataTypes.STRING, allowNull: true },
    kazan: { type: DataTypes.STRING, allowNull: true },
    bath_territory: { type: DataTypes.STRING, allowNull: true },
    pool: { type: DataTypes.STRING, allowNull: true },
    transfer_city: { type: DataTypes.STRING, allowNull: true },
    transfer_mountain: { type: DataTypes.STRING, allowNull: true },
    live_whith_animals: { type: DataTypes.STRING, allowNull: true },
    additionally: { type: DataTypes.STRING, allowNull: true },
    done: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { sequelize, modelName: "NumberModel" }
);

class LiftModel extends Sequelize.Model {}
LiftModel.init(
  {
    title: { type: DataTypes.STRING, allowNull: true },
    geo: { type: DataTypes.STRING, allowNull: true },
    lifting_time: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: true },
    working_hours_start: { type: DataTypes.STRING, allowNull: true },
    working_hours_finish: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "LiftModel" }
);
class SkipassModel extends Sequelize.Model {}
SkipassModel.init(
  {
    title: { type: DataTypes.STRING, allowNull: true },
    content: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, modelName: "SkipassModel" }
);

class RequestPaymentModel extends Sequelize.Model {}
RequestPaymentModel.init(
  {
    userID: { type: DataTypes.STRING, allowNull: true },
    username: { type: DataTypes.STRING, allowNull: true },
    surname: { type: DataTypes.STRING, allowNull: true },
    card_number: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    amount: { type: DataTypes.INTEGER, allowNull: true },
    done: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { sequelize, modelName: "RequestPaymentModel" }
);

class ReqBrone extends Sequelize.Model {}
ReqBrone.init(
  {
    clientID: { type: DataTypes.STRING, allowNull: true },
    username: { type: DataTypes.STRING, allowNull: true },
    cardID: { type: DataTypes.STRING, allowNull: true },
    userID: { type: DataTypes.STRING, allowNull: true }, // ID хозяина объявления
    phone: { type: DataTypes.STRING, allowNull: true },
    done: { type: DataTypes.BOOLEAN, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: true },
    places: { type: DataTypes.INTEGER, allowNull: true },
    brone: { type: DataTypes.JSON, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: true },
    actives: { type: DataTypes.JSON, allowNull: true },
  },
  { sequelize, modelName: "ReqBrone" }
);

// finalizing hotel models
HotelModel.hasMany(NumberModel, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "NumberModel",
});
NumberModel.belongsTo(HotelModel, {
  foreignKey: "HotelModelId",
  as: "HotelModel",
});

// finalize
module.exports = {
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
  ReqBrone,
};
