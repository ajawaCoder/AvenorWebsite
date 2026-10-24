/* =========================================
   AVENOR INTERACTIVE DEMO
========================================= */


/* DEMO DATA */

let tasks = JSON.parse(localStorage.getItem("avenorTasks")) || [

    {
        id: 1,
        name: "Math Homework",
        className: "Math",
        date: "2026-08-24",
        completed: false
    },

    {
        id: 2,
        name: "Chemistry Lab",
        className: "Science",
        date: "2026-08-24",
        completed: false
    },

    {
        id: 3,
        name: "English Essay",
        className: "English",
        date: "2026-08-27",
        completed: false
    },

    {
        id: 4,
        name: "APUSH Reading",
        className: "History",
        date: "2026-08-25",
        completed: false
    }

];


const taskList = document.getElementById("taskList");
const allTaskList = document.getElementById("allTaskList");

const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

const modal = document.getElementById("taskModal");

const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

const addTaskButton = document.getElementById("addTask");

const taskNameInput = document.getElementById("taskName");
const taskClassInput = document.getElementById("taskClass");
const taskDateInput = document.getElementById("taskDate");


/* SAVE */

function saveTasks() {

    localStorage.setItem(
        "avenorTasks",
        JSON.stringify(tasks)
    );

}


/* FORMAT DATE */

function formatDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric"
        }
    );

}


/* RENDER TASKS */

function renderTasks(filter = "All") {

    taskList.innerHTML = "";
    allTaskList.innerHTML = "";


    const filteredTasks =
        filter === "All"
            ? tasks
            : tasks.filter(
                task => task.className === filter
            );


    filteredTasks.forEach(task => {

        const element = createTaskElement(task);

        allTaskList.appendChild(element.cloneNode(true));

    });


    tasks.forEach(task => {

        const element = createTaskElement(task);

        taskList.appendChild(element);

    });


    updateProgress();

}


/* CREATE TASK ELEMENT */

function createTaskElement(task) {

    const div = document.createElement("div");

    div.className = "demo-task";

    if (task.completed) {
        div.classList.add("completed");
    }


    div.innerHTML = `

        <button
            class="task-check"
            data-id="${task.id}">
        </button>

        <div class="demo-task-info">

            <span class="demo-task-name">
                ${escapeHTML(task.name)}
            </span>

            <span class="demo-task-meta">
                ${escapeHTML(task.className)}
                ·
                ${formatDate(task.date)}
            </span>

        </div>

        <button
            class="delete-task"
            data-id="${task.id}">
            ×
        </button>

    `;


    return div;

}


/* SECURITY */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* CLICK TASK */

document.addEventListener("click", function(event) {

    const checkButton =
        event.target.closest(".task-check");

    const deleteButton =
        event.target.closest(".delete-task");


    if (checkButton) {

        const id =
            Number(checkButton.dataset.id);

        const task =
            tasks.find(task => task.id === id);

        if (task) {

            task.completed =
                !task.completed;

            saveTasks();

            renderTasks();

        }

    }


    if (deleteButton) {

        const id =
            Number(deleteButton.dataset.id);

        tasks =
            tasks.filter(
                task => task.id !== id
            );

        saveTasks();

        renderTasks();

    }

});


/* PROGRESS */

function updateProgress() {

    if (tasks.length === 0) {

        progressText.textContent = "0%";

        progressBar.style.width = "0%";

        return;

    }


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const percentage =
        Math.round(
            (completed / tasks.length) * 100
        );


    progressText.textContent =
        percentage + "%";

    progressBar.style.width =
        percentage + "%";

}


/* OPEN MODAL */

openModal.addEventListener(
    "click",
    function() {

        modal.classList.add("open");

        taskNameInput.focus();

    }
);


/* CLOSE MODAL */

closeModal.addEventListener(
    "click",
    function() {

        modal.classList.remove("open");

    }
);


/* CLICK OUTSIDE MODAL */

modal.addEventListener(
    "click",
    function(event) {

        if (event.target === modal) {

            modal.classList.remove("open");

        }

    }
);


/* ADD TASK */

addTaskButton.addEventListener(
    "click",
    function() {

        const name =
            taskNameInput.value.trim();

        const className =
            taskClassInput.value;

        const date =
            taskDateInput.value;


        if (!name || !date) {

            alert(
                "Please enter an assignment and due date."
            );

            return;

        }


        const newTask = {

            id: Date.now(),

            name: name,

            className: className,

            date: date,

            completed: false

        };


        tasks.push(newTask);

        saveTasks();

        renderTasks();


        taskNameInput.value = "";

        taskDateInput.value = "";

        modal.classList.remove("open");

    }
);


/* SIDEBAR NAVIGATION */

const sidebarItems =
    document.querySelectorAll(".sidebar-item");


const views = {

    today:
        document.getElementById("todayView"),

    tasks:
        document.getElementById("tasksView"),

    classes:
        document.getElementById("classesView"),

    calendar:
        document.getElementById("calendarView")

};


const plannerTitle =
    document.getElementById("plannerTitle");


sidebarItems.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            sidebarItems.forEach(
                item =>
                    item.classList.remove("active")
            );

            button.classList.add("active");


            Object.values(views).forEach(
                view =>
                    view.classList.remove(
                        "active-view"
                    )
            );


            const selected =
                button.dataset.view;


            views[selected].classList.add(
                "active-view"
            );


            plannerTitle.textContent =
                selected.charAt(0).toUpperCase()
                +
                selected.slice(1);


            if (selected === "calendar") {

                renderCalendar();

            }

        }
    );

});


/* FILTER */

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(".filter")
                    .forEach(
                        item =>
                            item.classList
                                .remove(
                                    "active-filter"
                                )
                    );

                button.classList.add(
                    "active-filter"
                );

                renderTasks(
                    button.dataset.filter
                );

            }
        );

    });


/* CALENDAR */

let calendarDate =
    new Date(2026, 7, 1);


function renderCalendar() {

    const container =
        document.getElementById(
            "calendarDays"
        );

    const monthTitle =
        document.getElementById(
            "calendarMonth"
        );


    container.innerHTML = "";


    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    monthTitle.textContent =
        calendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        container.appendChild(empty);

    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        const dayElement =
            document.createElement("div");


        dayElement.className =
            "calendar-day";


        const tasksForDay =
            tasks.filter(
                task =>
                    task.date === dateString
            );


        if (tasksForDay.length > 0) {

            dayElement.classList.add(
                "has-task"
            );

        }


        dayElement.innerHTML =
            `<strong>${day}</strong>`;


        tasksForDay.forEach(task => {

            dayElement.innerHTML += `
                <div class="calendar-task">
                    ${escapeHTML(task.name)}
                </div>
            `;

        });


        container.appendChild(
            dayElement
        );

    }

}


/* CALENDAR BUTTONS */

document
    .getElementById("previousMonth")
    .addEventListener(
        "click",
        function() {

            calendarDate.setMonth(
                calendarDate.getMonth() - 1
            );

            renderCalendar();

        }
    );


document
    .getElementById("nextMonth")
    .addEventListener(
        "click",
        function() {

            calendarDate.setMonth(
                calendarDate.getMonth() + 1
            );

            renderCalendar();

        }
    );


/* INITIALIZE */

renderTasks();

renderCalendar();
/* =========================================
   AVENOR FOCUS MODE
========================================= */

const focusOverlay =
    document.getElementById("focusOverlay");

const focusButton =
    document.getElementById("focusButton");

const closeFocus =
    document.getElementById("closeFocus");

const startTimer =
    document.getElementById("startTimer");

const resetTimer =
    document.getElementById("resetTimer");

const completeFocus =
    document.getElementById("completeFocus");

const timerDisplay =
    document.getElementById("timerDisplay");

const focusRing =
    document.getElementById("focusRing");

const focusTaskName =
    document.getElementById("focusTaskName");

const focusTaskClass =
    document.getElementById("focusTaskClass");


let selectedMinutes = 25;

let totalSeconds =
    selectedMinutes * 60;

let remainingSeconds =
    totalSeconds;

let timerInterval = null;

let timerRunning = false;


/* OPEN FOCUS MODE */

focusButton.addEventListener(
    "click",
    function() {

        focusOverlay.classList.add("open");

        chooseFocusTask();

        resetFocusTimer();

    }
);


/* CLOSE */

closeFocus.addEventListener(
    "click",
    function() {

        stopTimer();

        focusOverlay.classList.remove("open");

    }
);


/* CHOOSE TASK */

function chooseFocusTask() {

    const incompleteTasks =
        tasks.filter(
            task => !task.completed
        );


    if (incompleteTasks.length === 0) {

        focusTaskName.textContent =
            "You're all caught up";

        focusTaskClass.textContent =
            "Add an assignment to start focusing.";

        return;

    }


    const task =
        incompleteTasks[0];


    focusTaskName.textContent =
        task.name;

    focusTaskClass.textContent =
        `${task.className} · Due ${formatDate(task.date)}`;

}


/* TIMER DISPLAY */

function updateTimerDisplay() {

    const minutes =
        Math.floor(
            remainingSeconds / 60
        );

    const seconds =
        remainingSeconds % 60;


    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    updateFocusRing();

}


/* PROGRESS RING */

function updateFocusRing() {

    const circumference =
        2 * Math.PI * 130;


    const progress =
        1 -
        (remainingSeconds / totalSeconds);


    const offset =
        circumference -
        (progress * circumference);


    focusRing.style.strokeDashoffset =
        offset;

}


/* START / PAUSE */

startTimer.addEventListener(
    "click",
    function() {

        if (timerRunning) {

            stopTimer();

            startTimer.textContent =
                "Resume";

            return;

        }


        timerRunning = true;

        startTimer.textContent =
            "Pause";


        timerInterval =
            setInterval(
                function() {

                    remainingSeconds--;

                    updateTimerDisplay();


                    if (
                        remainingSeconds <= 0
                    ) {

                        finishTimer();

                    }

                },
                1000
            );

    }
);


/* STOP */

function stopTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    timerRunning = false;

}


/* RESET */

resetTimer.addEventListener(
    "click",
    resetFocusTimer
);


function resetFocusTimer() {

    stopTimer();

    remainingSeconds =
        totalSeconds;

    startTimer.textContent =
        "Start";

    updateTimerDisplay();

}


/* FINISH */

completeFocus.addEventListener(
    "click",
    function() {

        const incompleteTasks =
            tasks.filter(
                task => !task.completed
            );


        if (incompleteTasks.length > 0) {

            incompleteTasks[0].completed =
                true;

            saveTasks();

            renderTasks();

        }


        stopTimer();

        chooseFocusTask();

        resetFocusTimer();

    }
);


/* TIMER FINISHED */

function finishTimer() {

    stopTimer();

    startTimer.textContent =
        "Finished";

    alert(
        "Focus session complete. Great work!"
    );

}


/* SESSION LENGTH */

document
    .querySelectorAll(".session-option")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(
                        ".session-option"
                    )
                    .forEach(
                        option =>
                            option.classList
                                .remove(
                                    "active-session"
                                )
                    );


                button.classList.add(
                    "active-session"
                );


                selectedMinutes =
                    Number(
                        button.dataset.minutes
                    );


                totalSeconds =
                    selectedMinutes * 60;


                resetFocusTimer();

            }
        );

    });


/* ESCAPE TO EXIT */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            focusOverlay.classList.contains(
                "open"
            )
        ) {

            stopTimer();

            focusOverlay.classList.remove(
                "open"
            );

        }

    }
);


/* INITIAL TIMER */

updateTimerDisplay();