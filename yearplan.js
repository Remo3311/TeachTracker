let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let events = {};  // Store events for each day
let selectedDay = null;  // Store the day clicked for adding event

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Load events from localStorage if available
function loadEvents() {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
        events = JSON.parse(storedEvents);
    }
}

// Get and display incomplete events for the current day
function getIncompleteEventsForToday() {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const incompleteEvents = (events[todayKey] || []).filter(event => !event.finished);
    
    displayIncompleteEvents(incompleteEvents);
}

function displayIncompleteEvents(events) {
    const incompleteEventsContainer = document.getElementById('incompleteEvents');
    incompleteEventsContainer.innerHTML = '';

    if (events.length === 0) {
        incompleteEventsContainer.innerHTML = '<p>No incomplete events for today.</p>';
    } else {
        events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event-item');

            eventDiv.innerHTML = `
                <strong>${event.title} (${event.time})</strong>
                <p>${event.description}</p>
                <p><em>${event.type.charAt(0).toUpperCase() + event.type.slice(1)}</em></p>
            `;
            incompleteEventsContainer.appendChild(eventDiv);
        });
    }
}

// Generate the calendar
function generateCalendar(month, year, elementId, isSidebar = false) {
    const calendarElement = document.getElementById(elementId);
    calendarElement.innerHTML = '';

    const firstDay = new Date(year, month).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    if (!isSidebar) {
        daysInWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.innerText = day;
            dayHeader.style.fontWeight = "bold";
            calendarElement.appendChild(dayHeader);
        });
    }

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        calendarElement.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.innerText = day;
        dayDiv.onclick = () => openModal(day);

        const dayKey = `${year}-${month}-${day}`;

        // Only apply dots on the main calendar, not the sidebar
        if (!isSidebar && events[dayKey]) {
            applyDots(dayDiv, events[dayKey]);
        }

        calendarElement.appendChild(dayDiv);
    }
}

// Apply event type dots
function applyDots(dayDiv, eventList) {
    dayDiv.className = ''; // Clear any existing class

    eventList.forEach(event => {
        const dot = document.createElement('span');
        dot.classList.add('event-dot');
        dot.style.backgroundColor = event.type === 'class' ? 'blue' :
                                    event.type === 'exam' ? 'red' : 'orange';
        dayDiv.appendChild(dot);
    });
}

// Navigate to the previous month
function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
}

// Navigate to the next month
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
}

// Go to the current month
function goToToday() {
    currentMonth = new Date().getMonth();
    currentYear = new Date().getFullYear();
    updateCalendar();
}

// Update the calendar display
function updateCalendar() {
    document.getElementById('mainMonth').innerText = `${months[currentMonth]} ${currentYear}`;
    document.getElementById('sidebarMonth').innerText = months[currentMonth];
    generateCalendar(currentMonth, currentYear, 'mainCalendar');
    generateCalendar(currentMonth, currentYear, 'sidebarCalendar', true);

    // Update incomplete events for the current day
    getIncompleteEventsForToday();
}

// Open the modal to view or add events
function openModal(day) {
    selectedDay = day;
    const dayKey = `${currentYear}-${currentMonth}-${selectedDay}`;
    const modalDate = document.getElementById('modalDate');
    const existingEvents = document.getElementById('existingEvents');

    modalDate.innerText = `${months[currentMonth]} ${selectedDay}, ${currentYear}`;
    existingEvents.innerHTML = '';  // Clear previous events

    if (events[dayKey]) {
        events[dayKey].forEach((event, index) => {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event-item');

            const eventClass = event.type === 'class' ? 'class-color' :
                               event.type === 'exam' ? 'exam-color' : 'event-color';

            const checkedAttribute = event.finished ? 'checked' : '';
            eventDiv.innerHTML = 
                `<strong class="${eventClass}">
                    <input type="checkbox" onchange="markFinished('${dayKey}', ${index}, this)" ${checkedAttribute}>
                    ${event.title} (${event.time})
                </strong>
                <p class="${eventClass}">${event.description}</p>
                <p><em>${event.type.charAt(0).toUpperCase() + event.type.slice(1)}</em></p>
                <button onclick="editEvent('${dayKey}', ${index})">Edit</button>
                <button onclick="deleteEvent('${dayKey}', ${index})">Delete</button>`;
            existingEvents.appendChild(eventDiv);
        });
    } else {
        existingEvents.innerHTML = '<p>No events for this day.</p>';
    }

    resetModalForm();
    document.getElementById('eventModal').style.display = 'flex';

    checkTaskCompletion(dayKey);
}

// Close the modal
function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
}

// Reset modal form and set saveEvent functionality for adding new event
function resetModalForm() {
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDescription').value = '';
    document.getElementById('eventType').value = 'class';
    document.getElementById('eventTime').value = '';

    const saveButton = document.querySelector('.modal-form button[onclick^="saveEvent"]');
    saveButton.onclick = saveEvent;
}

// Save the new or edited event
function saveEvent() {
    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    const type = document.getElementById('eventType').value;
    const time = document.getElementById('eventTime').value;

    if (!title || !description || !type || !time) {
        alert("Please fill all fields.");
        return;
    }

    const dayKey = `${currentYear}-${currentMonth}-${selectedDay}`;
    if (!events[dayKey]) {
        events[dayKey] = [];
    }

    events[dayKey].push({ title, description, type, time, finished: false });
    
    // Save events to localStorage
    localStorage.setItem('calendarEvents', JSON.stringify(events));

    closeModal();
    updateCalendar();
}

// Mark an event as finished
function markFinished(dayKey, index, checkbox) {
    const event = events[dayKey][index];
    event.finished = checkbox.checked;

    const eventItem = checkbox.parentElement;
    eventItem.style.textDecoration = checkbox.checked ? "line-through" : "none";

    checkTaskCompletion(dayKey);

    // Save updated events to localStorage
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

// Check if all tasks are finished and update UI accordingly
function checkTaskCompletion(dayKey) {
    const statusImage = document.getElementById('statusGif');
    const progressCircle = document.querySelector('.progress-circle');
    const progressValue = document.getElementById('progressValue');

    if (!events[dayKey] || events[dayKey].length === 0) {
        statusImage.style.display = 'none';
        progressCircle.style.background = 'conic-gradient(#ccc 0%, #ccc 100%)';
        progressValue.innerText = '0%';
        return;
    }

    const totalTasks = events[dayKey].length;
    const finishedTasks = events[dayKey].filter(event => event.finished).length;
    const percentage = Math.round((finishedTasks / totalTasks) * 100);

    progressValue.innerText = `${percentage}%`;
    progressCircle.style.background = `conic-gradient(#4CAF50 ${percentage}%, #ccc ${percentage}%)`;

    statusImage.src = percentage === 100 ? 'image/goodjub.gif' : 'image/busy.gif';
    statusImage.style.display = 'block';
}

// Edit an existing event
function editEvent(dayKey, index) {
    const event = events[dayKey][index];

    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventTime').value = event.time;
    document.getElementById('eventDescription').value = event.description;
    document.getElementById('eventType').value = event.type;

    const saveButton = document.querySelector('.modal-form button[onclick^="saveEvent"]');
    saveButton.onclick = () => {
        event.title = document.getElementById('eventTitle').value;
        event.time = document.getElementById('eventTime').value;
        event.description = document.getElementById('eventDescription').value;
        event.type = document.getElementById('eventType').value;

        // Save updated events to localStorage
        localStorage.setItem('calendarEvents', JSON.stringify(events));

        closeModal();
        updateCalendar();
    };

    document.getElementById('eventModal').style.display = 'flex';
}

// Delete an event
function deleteEvent(dayKey, index) {
    events[dayKey].splice(index, 1);

    if (events[dayKey].length === 0) {
        delete events[dayKey];
    }

    // Save updated events to localStorage
    localStorage.setItem('calendarEvents', JSON.stringify(events));

    closeModal();
    updateCalendar();
}

// Initialize the calendar on page load
window.onload = function() {
    loadEvents();
    updateCalendar();
};
