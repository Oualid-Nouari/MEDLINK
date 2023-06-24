const enableModif = document.querySelector('.enableModif');
const disabled = document.querySelectorAll('.disabled');

enableModif.addEventListener('click', (e) => {
    disabled.forEach((disabledEle) => {
        disabledEle.classList.remove('disabled');
    })
})

const cancel = document.querySelector('.cancelEdit')
cancel.addEventListener('click', (e) => {
    location.assign('/dashboard');
})

// Updating the form

const form = document.querySelector('.edit-patient-form');
const message = document.querySelector('.message');

form.addEventListener('submit', async (e) => {
    const daysOfWeek = ['Dimache', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const now = new Date()
    const day = daysOfWeek[now.getDay()]
    const hours = now.getHours()
    const minutes = now.getMinutes()
    e.preventDefault();
    const np = form.np.value;
    const ipp = form.ipp.value;
    const cin = form.cin.value;
    const firstname = form.firstname.value;
    const lastname = form.lastname.value;
    const couverture = form.couverture.value;
    if (np === "" || ipp === "" || firstname === "" || lastname === "") {
        message.classList.remove('success');
        message.classList.add('error');
        message.textContent = "Juste la couverture et CIN qui peut étre vide!"
        setTimeout(() => {
            message.classList.remove('error')
        }, 3000)
    } else {
        message.classList.remove('error')
        message.classList.add('success')
        message.textContent = "Les informations sont modifiées"
        setTimeout(() => {
            message.classList.remove('success');
        }, 2000)
        await fetch('/patient/update', {
            method: 'post',
            body: JSON.stringify({ np, ipp, cin, firstname, lastname, couverture }),
            headers: { 'Content-Type': 'application/json' },
        })
    }
})