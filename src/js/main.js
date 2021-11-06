import itemCard from "./modules/itemCard";
import groupEdit from "./modules/groupEdit";
import newItem from "./modules/newItem";
import newGroup from "./modules/newGroup";
import init from "./modules/init";
import search from "./modules/search";
import stats from "./modules/stats";


(async () => {
    await init();
})();
search();
stats();
itemCard();
groupEdit();
newItem();
newGroup();
