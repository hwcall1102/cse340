// javascript to prevent updates to existing inventory if nothing has changed
const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
        const updateBtn = document.querySelector("button")
        updateBtn.removeAttribute("disabled")
    })