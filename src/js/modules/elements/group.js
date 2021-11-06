import Item from "./item";

class Group {
    constructor({id, name, description, items}, isActive = false) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.items = items;

        this.isActive = isActive;
    }

    #renderGroupLink() {
        const allGroupsList = document.querySelector(".all-groups-list");

        const newGroupLink = document.createElement("a");
        newGroupLink.innerText = this.name;

        newGroupLink.classList.add("list-group-item", "list-group-item-action");
        if (this.isActive) {
            newGroupLink.classList.add("active");
        }
        newGroupLink.setAttribute("href", `#list-${this.id}`);
        newGroupLink.setAttribute("data-bs-toggle", "list");
        newGroupLink.setAttribute("role", "tab");
        newGroupLink.setAttribute("aria-control", `list-${this.id}`);

        allGroupsList.appendChild(newGroupLink);
    }

    #renderTabPane() {
        const groupsContentBlock = document.querySelector(".groups-content");

        const newGroupPane = document.createElement("div");
        newGroupPane.classList.add("tab-pane", "fade", "show", "group-pane");
        if (this.isActive) {
            newGroupPane.classList.add("active");
        }
        newGroupPane.setAttribute("id", `list-${this.id}`);
        newGroupPane.setAttribute("role", "tabpanel");
        newGroupPane.setAttribute("aria-labelledby", `list-${this.id}`);

        const groupBasePanel = document.createElement("div");
        groupBasePanel.classList.add("d-flex", "justify-content-between", "mb-3");
        groupBasePanel.innerHTML = `<p class="mb-0 group-descr-par">${this.description}</p>
                        <div class="col-5 d-flex justify-content-end align-items-start">
                            <button class="btn btn-outline-primary me-2" data-bs-toggle="modal"
                                    data-bs-target="#edit-group-modal" data-group-id="${this.id}">Редагувати групу
                            </button>
                            <button class="btn btn-outline-primary add-new-item-btn" type="button" data-bs-toggle="modal"
                                    data-bs-target="#add-item-modal" data-group-id="${this.id}">Додати товар
                            </button>
                        </div>`;


        newGroupPane.appendChild(groupBasePanel);

        if (this.items.length > 0) {
            const groupItemsList = document.createElement("div");
            groupItemsList.classList.add("row", "row-cols-1", "row-cols-md-3", "g-4", "group-items-list");
            this.items.forEach((item) => {
                groupItemsList.appendChild(new Item(item).getPreviewElement());
            });
            newGroupPane.appendChild(groupItemsList);
        } else {
            const noItemsLabel = document.createElement("p");
            noItemsLabel.innerText = "В групі поки що немає товарів.";
            noItemsLabel.classList.add("text-center", "fs-4", "empty-group");
            newGroupPane.appendChild(noItemsLabel);
        }

        groupsContentBlock.appendChild(newGroupPane);
    }

    render() {
        this.#renderGroupLink();
        this.#renderTabPane();
    }
}

export default Group;
