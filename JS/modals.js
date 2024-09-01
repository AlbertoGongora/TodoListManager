// Función para crear y mostrar el modal de confirmación de eliminación
export function createDeleteModal(taskText, onDeleteConfirm) {
    // Crear el contenedor del modal
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Definir el contenido HTML del modal
    modal.innerHTML = `
        <main class="modal-content">
            <h2 class="modal-header">Confirmar Eliminación</h2>
            <p class="modal-paraf">¿Estás seguro de que deseas eliminar la tarea '<em>${taskText}</em> ' ?</p>
            <div class="modal-footer">
                <button class="btn-modal confirm">Eliminar</button>
                <button class="btn-modal cancel">Cancelar</button>
            </div>
        </main>
    `;


    // Añadir el modal al cuerpo del documento
    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Función para eliminar el modal del DOM
    const removeModal = () => {
        document.body.removeChild(modal);
    };

    // Función para manejar la confirmación de eliminación
    const confirmDelete = () => {
        onDeleteConfirm(); 
        removeModal(); 
    };

    // Añadir el evento de confirmación de eliminación
    modal.querySelector('.confirm').addEventListener('click', confirmDelete);

    // Añadir el evento de cancelar eliminación
    modal.querySelector('.cancel').addEventListener('click', removeModal);

    // Añadir el evento para confirmar eliminación al presionar Enter
    document.addEventListener('keydown', function handleKey(event) {
        if (event.key === 'Enter') {
            confirmDelete(); 
        } else if (event.key === 'Escape') {
            removeModal();
        }
        document.removeEventListener('keydown', handleKey);
    });
}

// Función para crear y mostrar el modal de edición de tarea
export function createEditModal(currentText, onEditConfirm) {
    // Crear el contenedor del modal
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Definir el contenido HTML del modal
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">Editar Tarea</div>
            <input type="text" id="editTaskInput" value="${currentText}" style="width: 100%; margin-bottom: 10px; padding: 8px;">
            <div class="modal-footer">
                <button class="btn-modal edit">Guardar</button>
                <button class="btn-modal cancel">Cancelar</button>
            </div>
        </div>
    `;

    // Añadir el modal al cuerpo del documento
    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Función para eliminar el modal del DOM
    const removeModal = () => {
        document.body.removeChild(modal);
    };

    // Función para manejar la confirmación de edición
    const submitEdit = () => {
        const newText = modal.querySelector('#editTaskInput').value;
        onEditConfirm(newText);
        removeModal(); 
    };

    // Añadir el evento para guardar los cambios en la tarea
    modal.querySelector('.edit').addEventListener('click', submitEdit);

    // Añadir el evento para cancelar la edición
    modal.querySelector('.cancel').addEventListener('click', removeModal);

    // Añadir el evento para guardar cambios al presionar Enter
    modal.querySelector('#editTaskInput').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            submitEdit();
        }
    });

    // Añadir el evento para cerrar el modal con la tecla Escape
    document.addEventListener('keydown', function escListener(event) {
        if (event.key === 'Escape') {
            removeModal();
            document.removeEventListener('keydown', escListener);
        }
    });
}
