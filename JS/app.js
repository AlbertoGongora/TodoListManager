// Importar modales para eliminar y editar tareas
import { createDeleteModal, createEditModal } from "./modals.js";

// Obtener los elementos del DOM necesarios
const taskList = document.getElementById('taskList');
const formTask = document.getElementById('formTask');
const task = document.getElementById('inserTask');
const trashIcon = document.getElementById('trashIcon');

// Recuperar tareas desde localStorage o iniciar con un array vacío
const tasks = JSON.parse(localStorage.getItem("Tasks")) || [];

// Renderizar las tareas en la lista
renderTask();

function renderTask() {
    // Limpiar la lista antes de renderizar
    taskList.innerHTML = '';
    
    // Crear y añadir cada tarea a la lista
    tasks.forEach((task, index) => {
        const li = createTaskElement(task, index);
        taskList.appendChild(li);
    });

    // Habilitar la funcionalidad de arrastrar y soltar usando SortableJS
    const sortable = new Sortable(taskList, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        onStart: function () {
            // Mostrar el icono de la papelera al empezar a arrastrar
            trashIcon.classList.remove('hidden');
            trashIcon.classList.add('visible');
        },
        onEnd: function (evt) {
            // Ocultar el icono de la papelera al finalizar el arrastre
            trashIcon.classList.remove('visible');
            trashIcon.classList.add('hidden');

            // Actualizar el orden de las tareas en el array según el nuevo índice
            const oldIndex = evt.oldIndex;
            const newIndex = evt.newIndex;

            const movedTask = tasks.splice(oldIndex, 1)[0];
            tasks.splice(newIndex, 0, movedTask);

            // Guardar el nuevo orden en localStorage
            localStorage.setItem("Tasks", JSON.stringify(tasks));

            // Actualizar los índices de las tareas en el DOM
            updateTaskIndexes();
        },
        onMove: function (evt) {
            // Detectar si el elemento arrastrado está sobre la papelera
            const trashRect = trashIcon.getBoundingClientRect();
            const taskRect = evt.dragged.getBoundingClientRect();

            const isOverTrash = (
                taskRect.left < trashRect.right &&
                taskRect.right > trashRect.left &&
                taskRect.top < trashRect.bottom &&
                taskRect.bottom > trashRect.top
            );

            // Cambiar el cursor y la opacidad de la papelera si está sobre ella
            if (isOverTrash) {
                trashIcon.style.opacity = '1'; 
                evt.dragged.style.cursor = 'copy'; 
            } else {
                trashIcon.style.opacity = ''; 
                evt.dragged.style.cursor = 'grab'; 
            }
        }
    });
}

// Habilitar eventos de drag & drop sobre la papelera
trashIcon.addEventListener('dragover', function (e) {
    e.preventDefault(); 
});

trashIcon.addEventListener('drop', function (e) {
    e.preventDefault();

    // Obtener el elemento arrastrado y su índice
    const draggedItem = document.querySelector('.sortable-chosen'); 
    const taskIndex = draggedItem.getAttribute('data-index'); 

    const taskText = tasks[taskIndex].text;

    // Abrir el modal de confirmación de eliminación
    createDeleteModal(taskText, () => {
        tasks.splice(taskIndex, 1); 
        localStorage.setItem("Tasks", JSON.stringify(tasks)); 
        draggedItem.remove(); 
        updateTaskIndexes(); 
    });
});

// Crear un nuevo elemento de tarea
function createTaskElement(task, index) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const btnDelete = document.createElement('button');
    const btnEdit = document.createElement('button');

    li.className = 'liTask';

    // Configurar el checkbox de la tarea
    checkbox.type = 'checkbox';
    checkbox.id = `task-${index}`;
    checkbox.checked = task.completed;
    checkbox.className = 'taskCheckbox';

    // Configurar la etiqueta de la tarea
    label.textContent = task.text;
    label.className = 'taskLabel';
    label.setAttribute('for', checkbox.id);

    // Configurar los botones de eliminar y editar
    btnDelete.textContent = '❌';
    btnDelete.className = 'btnDelete';
    btnEdit.textContent = '✏️';
    btnEdit.className = 'btnEdit';

    // Añadir el evento para alternar el estado completado de la tarea
    checkbox.addEventListener('change', () => {
        label.classList.toggle('completed', checkbox.checked);
        task.completed = checkbox.checked; 
        localStorage.setItem("Tasks", JSON.stringify(tasks));
    });

    // Aplicar estilo completado si la tarea está marcada como completada
    if (task.completed) {
        label.classList.add('completed');
    }

    // Añadir los elementos al li
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(btnDelete);
    li.appendChild(btnEdit);
    li.setAttribute('data-index', index);

    return li;
}

// Añadir una nueva tarea a la lista
function addTask() {
    if (task.value.trim() === '') {
        task.value = '';
        return;
    } else {
        tasks.push({ text: task.value, completed: false });
        localStorage.setItem("Tasks", JSON.stringify(tasks));
        
        const li = createTaskElement(tasks[tasks.length - 1], tasks.length - 1);
        taskList.appendChild(li);
        task.value = '';
        updateTaskIndexes();
    }
}

// Eliminar una tarea de la lista
function deleteTask(event) {
    if (event.target.classList.contains('btnDelete')) {
        const li = event.target.parentElement;
        const index = li.getAttribute('data-index');
        const taskText = tasks[index].text;

        createDeleteModal(taskText, () => {
            tasks.splice(index, 1);
            localStorage.setItem("Tasks", JSON.stringify(tasks));
            li.remove();
            updateTaskIndexes();
        });
    }
}

// Editar una tarea en la lista
function editTask(event) {
    if (event.target.classList.contains('btnEdit')) {
        const li = event.target.parentElement;
        const index = li.getAttribute('data-index');
        const parraf = li.querySelector('.taskLabel');
        const currentText = parraf.textContent;

        createEditModal(currentText, (newText) => {
            tasks[index].text = newText;
            localStorage.setItem("Tasks", JSON.stringify(tasks));
            parraf.textContent = newText;
        });
    }
}

// Actualizar los índices de las tareas en el DOM
function updateTaskIndexes() {
    const listItems = taskList.querySelectorAll('li');
    listItems.forEach((li, newIndex) => {
        li.setAttribute('data-index', newIndex);
    });
}

// Añadir el evento submit al formulario de tareas
formTask.addEventListener('submit', (e) => { 
    e.preventDefault();
    addTask();
});

// Añadir eventos de click a la lista de tareas para eliminar y editar
taskList.addEventListener('click', (e) => {
    deleteTask(e);
    editTask(e);
});
