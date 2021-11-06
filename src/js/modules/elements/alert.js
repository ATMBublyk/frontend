class Alert {
    constructor(parentNode, text = "", ...classes) {
        this.parentNode = parentNode;
        this.text = text;
        this.classes = classes;
    }

    render() {
        const alert = document.createElement("div");
        this.node = alert;
        alert.classList.add("alert");

        if (this.classes.length > 0) {
            this.classes.forEach((className) => {
                alert.classList.add(className);
            });
        }

        alert.innerText = this.text;
        this.parentNode.append(alert);
    }

    changeText(newText) {
        this.text = newText;
    }

    changeClass(classToRemove, classToAdd) {
        this.classes.filter((item) => item !== classToRemove);
        this.classes.push(classToAdd);
    }

    addClass(classToAdd) {
        this.classes.push(classToAdd);
    }

    addClassAndRender(classToAdd) {
        this.node.classList.add(classToAdd);
    }

    removeClass(classToRemove) {
        this.classes.filter((item) => item !== classToRemove);
    }

    removeClassAndRender(classToRemove) {
        this.node.classList.remove(classToRemove);
    }

    remove() {
        try {
            this.node.remove();
        } catch (e) {

        }
    }
}

export default Alert;