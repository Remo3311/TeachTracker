let studentCount = 0;

function addRow() {
    studentCount++;
    const table = document.getElementById('studentTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.classList.add('fade-in');
    const countCell = newRow.insertCell(0);
    const studentCell = newRow.insertCell(1);
    const contactCell = newRow.insertCell(2);
    const guardianCell = newRow.insertCell(3);
    const notesCell = newRow.insertCell(4);
    const actionsCell = newRow.insertCell(5);

    countCell.innerHTML = studentCount;
    studentCell.innerHTML = `
        <div class="student-cell">
            <img src="image/student.png" class="student-icon">
            <input type="file" accept="image/*" onchange="previewImage(event, this)">
            <input type="text" placeholder="Student Name" style="margin-left:10px;">
        </div>`;
    contactCell.innerHTML = '<input type="text" placeholder="Contact Number">';
    guardianCell.innerHTML = '<input type="text" placeholder="Guardian Name">';
    
    notesCell.innerHTML = `
        <input type="checkbox" onchange="toggleNotesInput(this)"> Add Notes
        <input type="text" placeholder="Notes" class="notes-input">`;
    
    actionsCell.innerHTML = `
        <div class="action-buttons">
            <button onclick="saveRow(this)">Save</button>
            <button onclick="deleteRow(this)">Delete</button>
        </div>`;
    
    saveTableToLocalStorage(); // Save changes to local storage
}

function toggleNotesInput(checkbox) {
    const notesInput = checkbox.nextElementSibling;
    if (checkbox.checked) {
        notesInput.style.display = 'block';
    } else {
        notesInput.style.display = 'none';
    }
}

function previewImage(event, input) {
    const reader = new FileReader();
    reader.onload = function() {
        const imgElement = input.previousElementSibling;
        imgElement.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

function saveRow(button) {
    const row = button.parentElement.parentElement.parentElement;
    const inputs = row.querySelectorAll('input');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim() && input.type !== "file" && input.type !== "checkbox" && input.className !== "notes-input") {
            input.style.border = '1px solid red';
            isValid = false;
        } else {
            input.style.border = '';
        }
    });

    if (!isValid) return;

    const studentCell = row.getElementsByTagName('td')[1];
    const contactCell = row.getElementsByTagName('td')[2];
    const guardianCell = row.getElementsByTagName('td')[3];
    const notesCell = row.getElementsByTagName('td')[4];

    const studentName = studentCell.querySelector('input[type="text"]').value;
    const contactNumber = contactCell.querySelector('input').value;
    const guardianName = guardianCell.querySelector('input').value;
    const notes = notesCell.querySelector('.notes-input').value || 'No notes';
    const studentIcon = studentCell.querySelector('.student-icon').src;

    studentCell.innerHTML = `
        <div class="student-cell">
            <img src="${studentIcon || 'image/student.png'}" class="student-img">
            ${studentName}
        </div>`;
    contactCell.innerHTML = contactNumber;
    guardianCell.innerHTML = guardianName;
    notesCell.innerHTML = notes;

    button.textContent = "Edit";
    button.onclick = function() { editRow(this); };

    saveTableToLocalStorage(); // Save changes to local storage
}

function editRow(button) {
    const row = button.parentElement.parentElement.parentElement;
    const studentCell = row.getElementsByTagName('td')[1];
    const contactCell = row.getElementsByTagName('td')[2];
    const guardianCell = row.getElementsByTagName('td')[3];
    const notesCell = row.getElementsByTagName('td')[4];

    const studentName = studentCell.querySelector('.student-cell').textContent.trim();
    const contactNumber = contactCell.textContent.trim();
    const guardianName = guardianCell.textContent.trim();
    const notes = notesCell.textContent.trim();
    const studentIcon = studentCell.querySelector('.student-img').src;

    studentCell.innerHTML = `
        <div class="student-cell">
            <img src="${studentIcon || 'image/default-student.png'}" class="student-icon">
            <input type="text" value="${studentName}" style="margin-left:10px;">
        </div>`;
    contactCell.innerHTML = `<input type="text" value="${contactNumber}">`;
    guardianCell.innerHTML = `<input type="text" value="${guardianName}">`;
    
    notesCell.innerHTML = `
        <input type="checkbox" ${notes !== 'No notes' ? 'checked' : ''} onchange="toggleNotesInput(this)"> Add Notes
        <input type="text" value="${notes}" class="notes-input" style="${notes !== 'No notes' ? 'display: block;' : 'display: none;'}">`;

    button.textContent = "Save";
    button.onclick = function() { saveRow(this); };
}

function deleteRow(button) {
    const row = button.parentElement.parentElement.parentElement;
    row.parentNode.removeChild(row);
    updateRowNumbers();
    saveTableToLocalStorage(); // Save changes to local storage
}

function updateRowNumbers() {
    const table = document.getElementById('studentTable').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    studentCount = 0;
    for (let i = 0; i < rows.length; i++) {
        const countCell = rows[i].getElementsByTagName('td')[0];
        studentCount++;
        countCell.innerHTML = studentCount;
    }
}

function sortTable(columnIndex) {
    const table = document.getElementById('studentTable').tBodies[0];
    const rows = Array.from(table.rows);

    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].innerText.toLowerCase();
        const cellB = rowB.cells[columnIndex].innerText.toLowerCase();
        return cellA > cellB ? 1 : -1;
    });

    rows.forEach(row => table.appendChild(row));
}

function saveTableToLocalStorage() {
    const table = document.getElementById('studentTable').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    const tableData = [];

    for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        const rowData = {
            studentCount: cells[0].innerText,
            studentName: cells[1].querySelector('.student-cell').innerText.trim(),
            contactNumber: cells[2].innerText,
            guardianName: cells[3].innerText,
            notes: cells[4].innerText,
            studentIcon: cells[1].querySelector('.student-img')?.src || ''
        };
        tableData.push(rowData);
    }

    localStorage.setItem('studentTableData', JSON.stringify(tableData));
}

function loadTableFromLocalStorage() {
    const tableData = JSON.parse(localStorage.getItem('studentTableData')) || [];
    const table = document.getElementById('studentTable').getElementsByTagName('tbody')[0];

    tableData.forEach((data, index) => {
        studentCount = index + 1; // Update studentCount for new rows
        const newRow = table.insertRow();
        newRow.classList.add('fade-in');
        const countCell = newRow.insertCell(0);
        const studentCell = newRow.insertCell(1);
        const contactCell = newRow.insertCell(2);
        const guardianCell = newRow.insertCell(3);
        const notesCell = newRow.insertCell(4);
        const actionsCell = newRow.insertCell(5);

        countCell.innerHTML = studentCount;
        studentCell.innerHTML = `
            <div class="student-cell">
                <img src="${data.studentIcon || 'image/student.png'}" class="student-img">
                ${data.studentName}
            </div>`;
        contactCell.innerHTML = data.contactNumber;
        guardianCell.innerHTML = data.guardianName;
        notesCell.innerHTML = data.notes;

        actionsCell.innerHTML = `
            <div class="action-buttons">
                <button onclick="editRow(this)">Edit</button>
                <button onclick="deleteRow(this)">Delete</button>
            </div>`;
    });
}

// Load table data from local storage when the page loads
window.onload = function() {
    loadTableFromLocalStorage();
    // Optionally update row numbers after loading
    updateRowNumbers();
};

// Optionally sort table by column headers
document.querySelectorAll('th').forEach((header, index) => {
    header.addEventListener('click', () => sortTable(index));
});
