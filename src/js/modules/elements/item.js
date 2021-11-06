class Item {
    constructor({id, name, description, manufacturer, price, quantity, label, groupId}, inSearchResults = false) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.manufacturer = manufacturer;
        this.price = parseFloat(parseFloat(price).toFixed(2));
        this.quantity = parseFloat(parseFloat(quantity).toFixed(2));
        this.label = label;
        this.groupId = groupId;

        this.inSearchResults = inSearchResults;
    }

    getPreviewElement() {
        const itemPreviewElement = document.createElement("div");
        itemPreviewElement.classList.add("col");
        if (this.inSearchResults) {
            itemPreviewElement.innerHTML = `
                            <div class="card h-100">
                                <div class="card-body d-flex flex-column align-items-start" data-item-id="${this.id}">
                                    <h5 class="card-title">${this.name}</h5>
                                    <p class="card-text mb-0"><b>Кількість: </b><span class="card-quantity">${this.quantity}</span> <span class="card-label">${this.label}</span>.</p>
                                    <p class="card-text"><b>Ціна: </b><span class="card-price">${this.price}</span> грн.</p>
                                    <button class="btn btn-outline-primary mt-auto" data-bs-toggle="modal"
                                            data-bs-target="#item-card-modal" data-bs-dismiss="modal" data-source="search">Детальніше
                                    </button>
                                </div>
                            </div>
        `;
        } else {
            itemPreviewElement.innerHTML = `
                            <div class="card h-100">
                                <div class="card-body d-flex flex-column align-items-start" data-item-id="${this.id}">
                                    <h5 class="card-title">${this.name}</h5>
                                    <p class="card-text mb-0"><b>Кількість: </b><span class="card-quantity">${this.quantity}</span> <span class="card-label">${this.label}</span>.</p>
                                    <p class="card-text"><b>Ціна: </b><span class="card-price">${this.price}</span> грн.</p>
                                    <button class="btn btn-outline-primary mt-auto" data-bs-toggle="modal"
                                            data-bs-target="#item-card-modal">Детальніше
                                    </button>
                                </div>
                            </div>
        `;
        }
        return itemPreviewElement;
    }
}

export default Item;
