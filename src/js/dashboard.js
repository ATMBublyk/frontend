import checkAuthentication from "./modules/main/check-authentication";
import finishSession from "./modules/main/finish-session";
import deposits from "./modules/main/deposits";
import withdrawals from "./modules/main/withdrawals";
import transfers from "./modules/main/transfers";
import regularPayments from "./modules/main/regular-payments";
import cardInfo from "./modules/main/card-info";

checkAuthentication();
finishSession();

(async () => {
  await deposits();
})();

(async () => {
  await withdrawals();
})();

(async () => {
  await transfers();
})();

(async () => {
  await regularPayments();
})();

(async () => {
  await cardInfo();
})();




