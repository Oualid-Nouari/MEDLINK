document.getElementById("np").disabled = true;

document.querySelectorAll('#np').forEach((disabled) => {
    disabled.disabled = true;
})

// COPY BY CLICK:
document.querySelectorAll('.copy-data').forEach((cell) => {
    cell.addEventListener('click', () => {
        const textToCopy = cell.innerText;
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = textToCopy;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        tempTextarea.setSelectionRange(0, 99999);
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
        document.querySelector('.text-copied').classList.add('active')
        setTimeout(() => {
            document.querySelector('.text-copied').classList.remove('active')
        }, 2000);
    });
});

// Open & close users modal:
const allUsersBtn = document.querySelector('.allUsersBtn');
const allUsersModal = document.querySelector('.allUsers');
const closeUsersModal = document.querySelector('.cancelusers');
const accessReq = document.querySelector('.accessReq');



allUsersBtn.addEventListener('click', (e) => {
    allUsersModal.classList.add('active');
    const overlay = document.createElement('div')
    overlay.id = "overlay";
    document.body.appendChild(overlay)
})

closeUsersModal.addEventListener('click', (e) => {
    allUsersModal.classList.remove('active');
    document.querySelector('#overlay').remove();
})



// Open accessReq Modal:
const accessReqModals = document.querySelectorAll('.accessReqModal');
const openAccessReqModalBtns = document.querySelectorAll('.accessReq');
const closeAccessReqModalBtns = document.querySelectorAll('.close-accessReqModal');
let activeForm = ""


openAccessReqModalBtns.forEach((openAccessReqModalBtn) => {
    openAccessReqModalBtn.addEventListener('click', async (e) => {
        accessReqModals.forEach((accessReqModal) => {
            accessReqModal.classList.remove('active')
        })
        let targetedRqModal = e.currentTarget.parentElement.nextElementSibling
        targetedRqModal.classList.add('active')
        activeForm = targetedRqModal
        activeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const req_btn = activeForm.previousElementSibling.children[1]
            req_btn.innerHTML = "Request Sent..."
            req_btn.style.backgroundColor = "transparent";
            req_btn.style.color = "black";
            req_btn.style.pointerEvents = "none";
            activeForm.classList.remove("active");
            const checkbox = activeForm.checkbox;
            const sender = activeForm.dataset.sender;
            const receiver = activeForm.dataset.receiver;
            if (checkbox.checked) {
                checkbox.value = "full access";
            } else {
                checkbox.value = "readOnly";
            }
            await fetch('/user/send-request', {
                method: 'post',
                body: JSON.stringify({ checkbox: checkbox.value, sender, receiver }),
                headers: { 'Content-Type': 'application/json' }
            })
        })
    })
})

closeAccessReqModalBtns.forEach((closeAccessReqModalBtn) => {
    closeAccessReqModalBtn.addEventListener('click', (e) => {
        let targetedRqModal = e.currentTarget.parentElement;
        targetedRqModal.classList.remove('active')
    })
})


// openin' add patient form:
const addPatient = document.querySelector('.add-patient');
const addPatientForm = document.querySelector('.add-patient-form')
const cancelAdding = document.querySelector('.cancel')
const logout = document.getElementsByClassName('logout');

addPatient.addEventListener('click', (e) => {
    addPatientForm.classList.add('active');
    const overlay = document.createElement('div')
    overlay.id = "overlay";
    document.body.appendChild(overlay)
})

cancelAdding.addEventListener('click', (e) => {
    addPatientForm.classList.remove('active');
    document.querySelector('#overlay').remove()
    addPatient.disabled = false;
})



// Submitin' the form:
const ippError = document.querySelector('.err.ipp');
const cinError = document.querySelector('.err.cin');
const firstnameError = document.querySelector('.err.firstname');
const lastnameError = document.querySelector('.err.lastname');


addPatientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log(e.currentTarget)
    let ipp = addPatientForm.ipp.value;
    let cin = addPatientForm.cin.value;
    let firstname = addPatientForm.firstname.value;
    let lastname = addPatientForm.lastname.value;
    let couverture = addPatientForm.couverture.value;
    const result = await fetch('/add-patient', {
        method: 'post',
        body: JSON.stringify({ ipp, cin, firstname, lastname, couverture }),
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await result.json();
    if (data.patient) {
        window.location.reload();
    }
    if (data.errors) {
        ippError.textContent = data.errors.ipp
        cinError.textContent = data.errors.cin
        firstnameError.textContent = data.errors.firstname
        lastnameError.textContent = data.errors.lastname
    }
})

// Searching:
const radioBtns = document.getElementsByName('search-radio');
const tbody = document.querySelector('tbody');

radioBtns.forEach((radio) => {
    radio.addEventListener('click', (e) => {
        const labels = document.querySelectorAll('label');
        labels.forEach((label) => {
            label.classList.remove('active');
        });
        let label = e.currentTarget.previousElementSibling;
        label.classList.add('active');
    })
})

function sendData(e) {
    let checkedRadio = "";
    radioBtns.forEach((radio) => {
        if (radio.checked) {
            checkedRadio = radio.id
        }
    })
    tbody.innerHTML = "";
    fetch('/getSearchedPatients', {
        method: 'post',
        body: JSON.stringify({ searchBy: checkedRadio, payload: e.value }),
        headers: { 'Content-Type': 'application/json' }
    }).then((data) => data.json()).then((result) => {
        let payload = result.payload;
        if (payload < 1) {
            tbody.innerHTML = `
            <tr>
            <th></th>
            <th></th>
            <th></th>
            <th class="nothingFound">Sorry. Nothing Found.</th>
            <th></th>
            </tr>
            `;
            return;
        }
        payload.forEach((dossier) => {
            const ipp = createCell(dossier.ipp)
            ipp.classList.add('copy-data'); // Add the "copy-data" class to the IPP cell
            const row = document.createElement('tr');
            const editLink = document.createElement('a');
            editLink.className = 'edit';
            editLink.href = '/dashboard?id=' + dossier._id;
            editLink.textContent = 'Modifier';
            const deleteLink = document.createElement('a');
            deleteLink.className = 'delete';
            deleteLink.href = '/patients/delete/' + dossier._id;
            deleteLink.textContent = 'x';
            const actionCell = document.createElement('th');
            actionCell.className = 'action';
            actionCell.appendChild(editLink);
            actionCell.appendChild(deleteLink);
            row.appendChild(createCell(dossier.np));
            row.appendChild(ipp);
            row.appendChild(createCell(dossier.cin));
            const fullnameCell = createCell(`${dossier.firstname} ${dossier.lastname}`);
            row.appendChild(fullnameCell);
            row.appendChild(createCell(dossier.couverture));
            row.appendChild(actionCell);
            tbody.appendChild(row);
        });
        function createCell(text) {
            const cell = document.createElement('th');
            cell.textContent = text;
            return cell;
        }
    });

    // Add event listener to the tbody element to handle the click event
    tbody.addEventListener('click', function (event) {
        // Check if the clicked element has the "copy-data" class
        if (event.target.classList.contains('copy-data')) {
            const ippText = event.target.innerHTML; // Get the IPP text
            navigator.clipboard.writeText(ippText) // Copy the IPP text to the clipboard
                .then(() => {
                    document.querySelector('.text-copied').classList.add('active')
                    setTimeout(() => {
                        document.querySelector('.text-copied').classList.remove('active')
                    }, 2000);
                })
                .catch((error) => {
                    console.error('Failed to copy IPP to clipboard:', error);
                });
        }
    });
}

// nOTIFCATION MODAL:

const notifBtn = document.querySelector('.open-notifs-modal');
const notifMoadl = document.querySelector('.notifications-modal');
notifBtn.addEventListener('click', (e) => {
    notifMoadl.classList.toggle('active');
})