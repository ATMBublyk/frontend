import axios from "axios";
import {backendUrl} from "./urls";
import Item from "./elements/item";

const search = () => {
    const searchModal = document.getElementById("search-modal");
    const searchInput = document.getElementById("search-input");
    const confSearchBtn = document.getElementById("conf-search-btn");

    searchInput.addEventListener("input", () => {
        if (searchInput.value.length === 0) {
            confSearchBtn.setAttribute("disabled", "disabled");
        } else {
            confSearchBtn.removeAttribute("disabled");
        }
    });

    const searchModalBody = document.querySelector(".search-modal-body");
    const searchModalTitle = document.querySelector(".search-modal-title");
    searchModal.addEventListener("show.bs.modal", async (e) => {
        if (e.relatedTarget.getAttribute("data-source") === "item-card") {
                const lastSearchModalTitle = localStorage.getItem("last-search-modal-title");
                const lastSearchResultBody = localStorage.getItem("last-search-result-body");

                if (lastSearchModalTitle && lastSearchResultBody) {
                    searchModalTitle.innerText = lastSearchModalTitle;
                    searchModalBody.innerHTML = lastSearchResultBody;

                    return;
                }
        }

        const searchResult = await axios.get(`${backendUrl}/search?request=${searchInput.value}`);
        const searchModalTitleText = `Результати за запитом "${searchInput.value}"`;
        searchModalTitle.innerText = searchModalTitleText;

        if (Object.keys(searchResult.data).length === 0) {
            const nothingFoundLabel = document.createElement("p");
            nothingFoundLabel.classList.add("fs-4", "nothing-found", "text-center");
            nothingFoundLabel.innerText = "Нічого не знайдено."
            searchModalBody.appendChild(nothingFoundLabel);
            return;
        }

        Object.entries(searchResult.data).forEach(([groupName, items]) => {
            const groupResultElem = document.createElement("div");
            groupResultElem.classList.add("mb-4");

            const groupHeader = document.createElement("h3");
            groupHeader.classList.add("fs-4", "mb-3");
            groupHeader.innerText = groupName;

            const itemsContainer = document.createElement("div");
            itemsContainer.classList.add("row", "row-cols-1", "row-cols-md-3", "g-4");
            items.forEach((item) => {
               itemsContainer.appendChild(new Item(item, true).getPreviewElement());
            });

            groupResultElem.appendChild(groupHeader);
            groupResultElem.appendChild(itemsContainer);

            searchModalBody.appendChild(groupResultElem);
        });

        localStorage.setItem("last-search-modal-title", searchModalTitleText);
        localStorage.setItem("last-search-result-body", searchModalBody.innerHTML);
    });

    searchModal.addEventListener("hidden.bs.modal", () => {
       searchModalBody.innerHTML = "";
    });
};

export default search;
