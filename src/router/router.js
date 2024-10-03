import { createRouter, createWebHistory } from "vue-router";
import AppNav from "../components/AppNav.vue";
import AppWeather from "../views/nav/AppWeather.vue";
import AppRegister from "../views/nav/AppRegister.vue";
import AppLogin from "../views/nav/AppLogin.vue";
import AppHome from "../views/nav/AppHome.vue";
import AppInfo from "../views/slider/AppInfo.vue";
import AppTransferTaksi from "../views/slider/AppTransferTaksi.vue";
import AppHabitation from "../views/slider/AppHabitation.vue";
import AppRental from "../views/slider/AppRental.vue";
import AppEvents from "../views/slider/AppEvents.vue";
import AppForChildren from "../views/slider/AppForChildren.vue";
import AppInstructorTours from "../views/slider/AppInstructorTours.vue";
import AppNews from "../views/slider/AppNews.vue";
import AppAds from "../views/slider/AppAds.vue";
import AppTransfer from "../views/center/AppTransfer.vue";
import AppTaxiDelivery from "../views/center/AppTaxiDelivery.vue";
import AppHotel from "../views/habination/AppHotel.vue";
import AppCardOpen from "../components/AppCardOpen.vue";
import AppCreateCard from "../components/AppCreateCard.vue";
import AppCreateNews from "../components/AppCreateNews.vue";
import AppCreateTransfer from "../components/AppCreateTransfer.vue";
import AppCreateService from "../components/AppCreateService.vue";
import AppTransferCardOpen from "../components/AppTransferCardOpen.vue";
import AppTransferEdit from "../components/AppTransferEdit.vue";
import ServiceCard from "../components/ServiceCard.vue";
import AppLift from "../views/info/AppLift.vue";
import AppCreateLift from "../views/info/AppCreateLift.vue";
import AppCameras from "../views/info/AppCameras.vue";
import AppEmergency from "../views/info/AppEmergency.vue";
import AppSkipass from "../views/info/AppSkipass.vue";
import AppSkipassCreate from "../views/info/AppSkipassCreate.vue";
import AdminReq from "../views/admin/AdminReq.vue";
import AdminSections from "../views/admin/AdminSections.vue";
import AdminEvents from "../views/admin/AdminEvents.vue";
import AdminForChildren from "../views/admin/AdminForChildren.vue";
import AdminHabitation from "../views/admin/AdminHabitation.vue";
import AdminRental from "../views/admin/AdminRental.vue";
import AdminTransferTaksi from "../views/admin/AdminTransferTaksi.vue";
import AdminInstructorTours from "../views/admin/AdminInstructorTours.vue";
import AdminAds from "../views/admin/AdminAds.vue";
import AppProfile from "../components/AppProfile.vue";
import MyAds from "../components/MyAds.vue";
import MyReq from "../components/MyReq.vue";
import PhonePolicy from "../components/PhonePolicy.vue";
import AdminPayments from "../views/admin/AdminPayments.vue";
import BookOpen from "../components/BookOpen.vue";
import BindMessenger from "../components/BindMessenger.vue";
import ReqBrone from "../components/ReqBrone.vue";
import CardCalendar from "../components/CardCalendar.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: AppHome,
    },
    {
      path: "/nav",
      name: "nav",
      component: AppNav,
    },
    {
      path: "/weather",
      name: "weather",
      component: AppWeather,
    },
    {
      path: "/register",
      name: "register",
      component: AppRegister,
    },
    {
      path: "/login",
      name: "login",
      component: AppLogin,
    },
    {
      path: "/info",
      name: "info",
      component: AppInfo,
    },
    {
      path: "/transfer-taksi",
      name: "transfer-taksi",
      component: AppTransferTaksi,
    },
    {
      path: "/habitation",
      name: "habitation",
      component: AppHabitation,
    },
    {
      path: "/habitation/hotels",
      name: "hotels",
      component: AppHotel,
    },
    {
      path: "/habitation/cottages",
      name: "cottages",
      component: AppHotel,
    },
    {
      path: "/habitation/flats",
      name: "flats",
      component: AppHotel,
    },
    {
      path: "/habitation/rooms",
      name: "rooms",
      component: AppHotel,
    },
    {
      path: "/habitation/hostels",
      name: "hostels",
      component: AppHotel,
    },
    {
      path: "/habitation/longterms",
      name: "longterms",
      component: AppHotel,
    },
    {
      path: "/rental",
      name: "rental",
      component: AppRental,
    },
    {
      path: "/rental/items",
      name: "rentalItems",
      component: AppHotel,
    },
    {
      path: "/events",
      name: "event",
      component: AppEvents,
    },
    {
      path: "/event/items",
      name: "eventItems",
      component: AppHotel,
    },
    {
      path: "/forChildren",
      name: "forChildren",
      component: AppForChildren,
    },
    {
      path: "/forChildren/items",
      name: "forChildrenItems",
      component: AppHotel,
    },
    {
      path: "/instructor-tours",
      name: "instructor-tours",
      component: AppInstructorTours,
    },
    {
      path: "/instructor-tours/items",
      name: "instructorToursItems",
      component: AppHotel,
    },
    {
      path: "/news",
      name: "news",
      component: AppNews,
    },
    {
      path: "/ads",
      name: "ads",
      component: AppAds,
    },
    {
      path: "/ads/items",
      name: "adsItems",
      component: AppHotel,
    },
    {
      path: "/transfer",
      name: "transfer",
      component: AppTransfer,
    },
    {
      path: "/taxi-delivery",
      name: "taxi-delivery",
      component: AppTaxiDelivery,
    },
    {
      path: "/taxi-delivery/card",
      name: "serviceCardOpen",
      component: ServiceCard,
    },
    {
      path: "/card",
      name: "card",
      component: AppCardOpen,
    },
    {
      path: "/create-card",
      name: "createCard",
      component: AppCreateCard,
    },
    {
      path: "/create-news",
      name: "createNews",
      component: AppCreateNews,
    },
    {
      path: "/create-transfer",
      name: "createTransfer",
      component: AppCreateTransfer,
    },
    {
      path: "/create-service",
      name: "createService",
      component: AppCreateService,
    },
    {
      path: "/transfer/card",
      name: "transfercard",
      component: AppTransferCardOpen,
    },
    {
      path: "/transfer/edit",
      name: "transferedit",
      component: AppTransferEdit,
    },
    {
      path: "/lift",
      name: "lift",
      component: AppLift,
    },
    {
      path: "/lift/create-lift",
      name: "appcreatelift",
      component: AppCreateLift,
    },
    {
      path: "/cameras",
      name: "appcameras",
      component: AppCameras,
    },
    {
      path: "/emergency",
      name: "appemergency",
      component: AppEmergency,
    },
    {
      path: "/skipass",
      name: "skipass",
      component: AppSkipass,
    },
    {
      path: "/skipass/create",
      name: "skipasscreate",
      component: AppSkipassCreate,
    },
    {
      path: "/admin/requests",
      name: "adminreq",
      component: AdminReq,
    },
    {
      path: "/admin/sections",
      name: "adminsections",
      component: AdminSections,
    },
    {
      path: "/admin/events",
      name: "adminevents",
      component: AdminEvents,
    },
    {
      path: "/admin/for-children",
      name: "adminforchildren",
      component: AdminForChildren,
    },
    {
      path: "/admin/habitation",
      name: "adminhabitation",
      component: AdminHabitation,
    },
    {
      path: "/admin/instructor-tours",
      name: "admininstructortours",
      component: AdminInstructorTours,
    },
    {
      path: "/admin/rental",
      name: "adminrental",
      component: AdminRental,
    },
    {
      path: "/admin/transfer-taksi",
      name: "admintransfertaksi",
      component: AdminTransferTaksi,
    },
    {
      path: "/admin/ads",
      name: "adminads",
      component: AdminAds,
    },
    {
      path: "/profile",
      name: "profile",
      component: AppProfile,
    },
    {
      path: "/myads",
      name: "myads",
      component: MyAds,
    },
    {
      path: "/phone_policy",
      name: "phonepolicy",
      component: PhonePolicy,
    },
    {
      path: "/request_payments",
      name: "reqpayments",
      component: AdminPayments,
    },
    {
      path: "/booking",
      name: "bookopen",
      component: BookOpen,
    },
    {
      path: "/bind_messsenger",
      name: "bindms",
      component: BindMessenger,
    },
    {
      path: "/req_brone",
      name: "reqBrone",
      component: ReqBrone,
    },
    {
      path: "/calendar",
      name: "calendar",
      component: CardCalendar,
    },
    {
      path: "/myreq",
      name: "myreq",
      component: MyReq,
    },
  ],
});

export default router;
