document.addEventListener("DOMContentLoaded", function () {
    const listaTareas = document.getElementById("lista-tareas");
    const nuevaTareaInput = document.getElementById("nueva-tarea");
    const agregarTareaBtn = document.getElementById("agregar-tarea-btn");
    const restablecerTareasBtn = document.getElementById("restablecer-tareas");
    const splashScreen = document.getElementById("splash-screen");
    const contenedor = document.getElementById("contenedor");
    const entrarBtn = document.getElementById("enter-btn"); // Cambiar "entrar-btn" por "enter-btn"

    // Mostrar lista de tareas al presionar el botón "Entrar"
    entrarBtn.addEventListener("click", function () {
        splashScreen.style.display = "none";
        contenedor.style.display = "block";
    });

    // Cargar tareas almacenadas en localStorage
    let tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];

    // Función para actualizar la lista de tareas en el HTML
    function actualizarListaTareas() {
        listaTareas.innerHTML = "";
        tareasGuardadas.forEach(function (tarea, index) {
            const tareaElemento = document.createElement("li");
            tareaElemento.innerHTML = `
                <input type="checkbox" id="tarea${index}" ${tarea.completada ? "checked" : ""}>
                <label for="tarea${index}" class="${tarea.completada ? "completada" : ""}">${tarea.texto}</label>
            `;
            listaTareas.appendChild(tareaElemento);

            // Manejar cambios en el estado de la tarea
            tareaElemento.querySelector("input").addEventListener("change", function () {
                tareasGuardadas[index].completada = this.checked;
                actualizarListaTareas();
                guardarTareas();
            });
        });
    }

    // Función para guardar tareas en localStorage
    function guardarTareas() {
        localStorage.setItem("tareas", JSON.stringify(tareasGuardadas));
    }

    // Evento de clic para el botón "Agregar Tarea"
    function agregarTarea() {
        const nuevaTareaTexto = nuevaTareaInput.value.trim();
        if (nuevaTareaTexto !== "") {
            tareasGuardadas.push({ texto: nuevaTareaTexto, completada: false });
            nuevaTareaInput.value = ""; // Limpiar el campo de entrada
            actualizarListaTareas();
            guardarTareas();
        } else {
            alert("Es necesario agregar una tarea.");
        }
    }

    agregarTareaBtn.addEventListener("click", agregarTarea);

    // Evento de tecla "Enter" en el campo de entrada de texto
    nuevaTareaInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            agregarTarea();
        }
    });

    // Evento de clic para el botón "Restablecer Tareas"
    restablecerTareasBtn.addEventListener("click", function () {
        tareasGuardadas = tareasGuardadas.filter(tarea => !tarea.completada);
        actualizarListaTareas();
        guardarTareas();
    });

    // Actualizar la lista de tareas al cargar la página
    actualizarListaTareas();
});

