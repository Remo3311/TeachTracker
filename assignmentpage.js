let assignmentCount = 0;

document.addEventListener("DOMContentLoaded", function() {
    loadAssignments(); // Load assignments from localStorage when the page loads
});

function addAssignment(assignment = null) {
    assignmentCount++;
    const table = document.getElementById('assignmentTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const countCell = newRow.insertCell(0);
    const assignmentCell = newRow.insertCell(1);
    const dateRangeCell = newRow.insertCell(2);
    const subjectCell = newRow.insertCell(3);
    const studentCell = newRow.insertCell(4);
    const completedCell = newRow.insertCell(5);
    const completionDateCell = newRow.insertCell(6);
    const actionsCell = newRow.insertCell(7);

    countCell.innerHTML = assignmentCount;

    if (assignment) {
        // Display the saved data in view mode (no input fields)
        assignmentCell.innerHTML = assignment.name;
        dateRangeCell.innerHTML = `${assignment.startDate} to ${assignment.endDate}`;
        subjectCell.innerHTML = assignment.subject;
        studentCell.innerHTML = assignment.student;
        completedCell.innerHTML = assignment.completed ? "Yes" : "No";
        completionDateCell.innerHTML = assignment.completed ? assignment.completionDate : "-";
    } else {
        // Display input fields if no data (adding new assignment)
        assignmentCell.innerHTML = `<input type="text" placeholder="Assignment Name">`;
        dateRangeCell.innerHTML = `<input type="date"> to <input type="date">`;
        subjectCell.innerHTML = `<input type="text" placeholder="Subject Name">`;
        studentCell.innerHTML = `<input type="text" placeholder="Student Name">`;
        completedCell.innerHTML = `<input type="checkbox" onchange="toggleCompletionDate(this, this.parentElement.parentElement)">`;
        completionDateCell.innerHTML = `<input type="date" disabled>`;
    }

    actionsCell.innerHTML = `
        <div class="action-buttons">
            <button onclick="${assignment ? 'editAssignment(this)' : 'saveAssignment(this)'}">${assignment ? 'Edit' : 'Save'}</button>
            <button onclick="deleteAssignment(this)">Delete</button>
        </div>`;

    updateRowColor(newRow);
}

function saveAssignment(button) {
    const row = button.parentElement.parentElement.parentElement;
    const assignmentCell = row.getElementsByTagName('td')[1];
    const dateRangeCell = row.getElementsByTagName('td')[2];
    const subjectCell = row.getElementsByTagName('td')[3];
    const studentCell = row.getElementsByTagName('td')[4];
    const completedCell = row.getElementsByTagName('td')[5];
    const completionDateCell = row.getElementsByTagName('td')[6];

    const assignmentName = assignmentCell.querySelector('input').value;
    const startDate = dateRangeCell.getElementsByTagName('input')[0].value;
    const endDate = dateRangeCell.getElementsByTagName('input')[1].value;
    const subjectName = subjectCell.querySelector('input').value;
    const studentName = studentCell.querySelector('input').value;
    const isCompleted = completedCell.querySelector('input').checked;
    const completionDate = completionDateCell.querySelector('input').value;

    // Display saved values in plain text (view mode)
    assignmentCell.innerHTML = assignmentName;
    dateRangeCell.innerHTML = `${startDate} to ${endDate}`;
    subjectCell.innerHTML = subjectName;
    studentCell.innerHTML = studentName;
    completedCell.innerHTML = isCompleted ? "Yes" : "No";
    completionDateCell.innerHTML = isCompleted ? completionDate : "-";

    // Change the button to "Edit"
    button.textContent = "Edit";
    button.onclick = function() { editAssignment(this); };

    // Save to localStorage
    saveToLocalStorage();
    updateRowColor(row);
}

function editAssignment(button) {
    const row = button.parentElement.parentElement.parentElement;
    const assignmentCell = row.getElementsByTagName('td')[1];
    const dateRangeCell = row.getElementsByTagName('td')[2];
    const subjectCell = row.getElementsByTagName('td')[3];
    const studentCell = row.getElementsByTagName('td')[4];
    const completedCell = row.getElementsByTagName('td')[5];
    const completionDateCell = row.getElementsByTagName('td')[6];

    const assignmentName = assignmentCell.textContent.trim();
    const dateRange = dateRangeCell.textContent.split(" to ");
    const subjectName = subjectCell.textContent.trim();
    const studentName = studentCell.textContent.trim();
    const isCompleted = completedCell.textContent === "Yes";
    const completionDate = completionDateCell.textContent.trim();

    // Replace with input fields to edit the data
    assignmentCell.innerHTML = `<input type="text" value="${assignmentName}">`;
    dateRangeCell.innerHTML = `
        <input type="date" value="${dateRange[0]}"> to <input type="date" value="${dateRange[1]}">`;
    subjectCell.innerHTML = `<input type="text" value="${subjectName}">`;
    studentCell.innerHTML = `<input type="text" value="${studentName}">`;
    completedCell.innerHTML = `<input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleCompletionDate(this, this.parentElement.parentElement)">`;
    completionDateCell.innerHTML = `<input type="date" value="${completionDate}" ${isCompleted ? '' : 'disabled'}>`;

    button.textContent = "Save";
    button.onclick = function() { saveAssignment(this); };
}

function deleteAssignment(button) {
    const row = button.parentElement.parentElement.parentElement;
    row.parentNode.removeChild(row);
    updateAssignmentNumbers();
    saveToLocalStorage();
}

function updateAssignmentNumbers() {
    const table = document.getElementById('assignmentTable').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    assignmentCount = 0;
    for (let i = 0; i < rows.length; i++) {
        const countCell = rows[i].getElementsByTagName('td')[0];
        assignmentCount++;
        countCell.innerHTML = assignmentCount;
    }
}

function toggleCompletionDate(checkbox, row) {
    const completionDateCell = row.getElementsByTagName('td')[6];
    const completionDateInput = completionDateCell.querySelector('input');
    completionDateInput.disabled = !checkbox.checked;
    updateRowColor(row);
    saveToLocalStorage();
}

function updateRowColor(row) {
    const completedCell = row.getElementsByTagName('td')[5];
    const isCompleted = completedCell.querySelector('input')?.checked ?? (completedCell.innerHTML === "Yes");
    row.className = isCompleted ? 'completed' : 'not-completed';
}

// Save assignments to localStorage
function saveToLocalStorage() {
    const table = document.getElementById('assignmentTable').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    const assignments = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const assignment = {
            name: row.getElementsByTagName('td')[1].innerHTML,
            startDate: row.getElementsByTagName('td')[2].innerHTML.split(" to ")[0],
            endDate: row.getElementsByTagName('td')[2].innerHTML.split(" to ")[1],
            subject: row.getElementsByTagName('td')[3].innerHTML,
            student: row.getElementsByTagName('td')[4].innerHTML,
            completed: row.getElementsByTagName('td')[5].innerHTML === "Yes",
            completionDate: row.getElementsByTagName('td')[6].innerHTML
        };
        assignments.push(assignment);
    }

    localStorage.setItem('assignments', JSON.stringify(assignments));
}

// Load assignments from localStorage
function loadAssignments() {
    const assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    assignmentCount = 0;

    for (const assignment of assignments) {
        addAssignment(assignment); // Load in view mode
    }
}
