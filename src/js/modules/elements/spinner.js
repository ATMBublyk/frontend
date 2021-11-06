class Spinner {
    constructor(parentNode, prepend = false, ...classes) {
        this.parentNode = parentNode;
        this.prepend = prepend;
        this.classes = classes
    }

    changeParent(parentNode) {
        this.parentNode = parentNode;
    }

    render() {
        const spinner = document.createElement("div");
        this.node = spinner;
        spinner.classList.add("spinner-border");
        if (this.classes.length > 0) {
            this.classes.forEach((className) => {
                spinner.classList.add(className);
            });
        }

        if (this.prepend) {
            this.parentNode.prepend(spinner);
        } else {
            this.parentNode.append(spinner);
        }
    }

    remove() {
        this.node.remove();
    }
}

export default Spinner;