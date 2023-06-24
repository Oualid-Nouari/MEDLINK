const form = document.querySelector("form");
const usernameError = document.querySelector(".err.username");
const passwordError = document.querySelector(".err.password");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = form.username.value;
    const password = form.password.value;
    try {
        const result = await fetch("/signup", {
            method: "post",
            body: JSON.stringify({ username, password }),
            headers: { "Content-Type": "application/json" },
        });
        const data = result.json();
        data.then((res) => {
            if (res.errors) {
                usernameError.textContent = res.errors.username;
                passwordError.textContent = res.errors.password;
            }
            if (res.user) {
                location.assign("/dashboard");
            }
        });
    } catch (err) {
        console.log(err);
    }
});
//   Open & close add form:
const addUserForm = document.querySelector(".addUserForm");
const addUserBtn = document.querySelector(".addUserBtn");
const closeAddUserForm = document.querySelector('.close-addUser-form');
addUserBtn.addEventListener("click", (e) => {
    addUserForm.classList.add("active");
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);
});
closeAddUserForm.addEventListener('click', (e) => {
    addUserForm.classList.remove('active');
    document.querySelector('#overlay').remove();
}) 



// DELETE CONFIRMATION MODAL:

// const deleteConfContainer = document.querySelectorAll('.delete-conf-container');
// const deleteFormBtns = document.querySelectorAll('.delete');
// const declineUserDelete = document.querySelector('.decline');

// deleteFormBtns.forEach((del) => {
//     del.addEventListener('click', (e) => {
//         deleteConfContainer.classList.add('active')
//         const overlay = document.createElement("div");
//         overlay.id = "overlay";
//         document.body.appendChild(overlay);
//     })
// })


// declineUserDelete.addEventListener('click', (e) => {
//     deleteConfContainer.classList.remove('active')
//     document.querySelector('#overlay').remove();
// })