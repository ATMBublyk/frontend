import axios from "axios";
import {backendUrl} from "./urls";

const stats = () => {
    const statsTable = document.getElementById("stats-table");
    const statsTableBody = document.querySelector("#stats-table tbody");

    const getGroupTotalPrice = (group) => {
        return group.items.reduce((accumulator, currentItem) => {
            const currentItemTotalPrice = currentItem.quantity * currentItem.price;
            return accumulator + currentItemTotalPrice;
        }, 0);
    };

    const getAllGroupsTotalPrice = (groups) => {
        return groups.reduce((accumulator, currentGroup) => accumulator + getGroupTotalPrice(currentGroup), 0);
    };

    const getTotalNumberOfItems = (groups) => {
        return groups.reduce((accumulator, currentGroup) => {
            return accumulator + currentGroup.items.length;
        }, 0);
    };

    const getGroupRow = ({group, itemIndex, allGroups}, {firstRow = false, firstGroup = false} = {}) => {
        const row = document.createElement("tr");

        const item = group.items[itemIndex];

        const itemNameData = document.createElement("td");
        itemNameData.innerText = item.name;

        const itemQuantityData = document.createElement("td");
        itemQuantityData.innerText = `${item.quantity} ${item.label}`;

        const itemPriceData = document.createElement("td");
        itemPriceData.innerText = `${item.price} грн`;

        const itemTotalPriceData = document.createElement("td");
        itemTotalPriceData.innerText = `${item.quantity * item.price} грн`;

        if (firstRow) {
            const groupNameData = document.createElement("td");
            groupNameData.setAttribute("rowspan", group.items.length);
            groupNameData.innerText = group.name;
            groupNameData.classList.add("align-middle");

            const groupTotalPriceData = document.createElement("td");
            groupTotalPriceData.setAttribute("rowspan", group.items.length)
            groupTotalPriceData.innerText = `${getGroupTotalPrice(group)} грн`;
            groupTotalPriceData.classList.add("text-center", "align-middle");

            if (firstGroup) {
                const allGroupsTotalPriceData = document.createElement("td");
                allGroupsTotalPriceData.setAttribute("rowspan", getTotalNumberOfItems(allGroups));
                allGroupsTotalPriceData.innerText = `${getAllGroupsTotalPrice(allGroups)} грн`;
                allGroupsTotalPriceData.classList.add("text-center", "align-middle");

                row.append(groupNameData, itemNameData, itemQuantityData, itemPriceData, itemTotalPriceData,
                    groupTotalPriceData, allGroupsTotalPriceData);
            } else {
                row.append(groupNameData, itemNameData, itemQuantityData, itemPriceData, itemTotalPriceData,
                    groupTotalPriceData);
            }
        } else {
            row.append(itemNameData, itemQuantityData, itemPriceData, itemTotalPriceData);
        }

        return row;
    };

    const createGroupRows = (group, allGroups, firstGroup = false) => {
        group.items.forEach((item, itemIndex) => {
            if (itemIndex === 0) {
                if (firstGroup) {
                    statsTableBody.appendChild(getGroupRow({
                        group,
                        allGroups,
                        itemIndex
                    }, {
                        firstRow: true,
                        firstGroup
                    }));
                } else {
                    statsTableBody.appendChild(getGroupRow({
                        group,
                        allGroups,
                        itemIndex
                    }, {
                        firstRow: true
                    }));
                }
            } else {
                statsTableBody.appendChild(getGroupRow({
                    group,
                    allGroups,
                    itemIndex
                }));
            }

        });
    };

    const checkForAllEmptyGroups = (groups) => {
        let areAllEmpty = true;

        for (const group of groups) {
            if (group.items.length > 0) {
                areAllEmpty = false;
                break;
            }
        }

        return areAllEmpty;
    };

    const noStatsLabel = document.querySelector(".no-stats");
    const statsModal = document.getElementById("stats-modal");
    statsModal.addEventListener("show.bs.modal", async () => {
        let groups = await axios.get(`${backendUrl}/groups`);
        groups = groups.data;

        const areAllGroupsEmpty = checkForAllEmptyGroups(groups);

        if (groups.length === 0 || areAllGroupsEmpty) {
            statsTable.classList.add("d-none");
            noStatsLabel.classList.remove("d-none");
            return;
        }

        groups.forEach((group, i) => {
            if (i === 0) {
                createGroupRows(group, groups, true);
            } else {
                createGroupRows(group, groups);
            }
        });
    });

    statsModal.addEventListener("hidden.bs.modal", () => {
        statsTableBody.innerHTML = "";
        noStatsLabel.classList.add("d-none");
        statsTable.classList.remove("d-none");
    });
};

export default stats;
