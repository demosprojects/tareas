// Importar desde los módulos CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD1WfQhJk1vpoxThn-Nw2pi3Ovf_5AZS3E",
  authDomain: "tareas-e5f56.firebaseapp.com",
  projectId: "tareas-e5f56",
  storageBucket: "tareas-e5f56.appspot.com",
  messagingSenderId: "342912132848",
  appId: "1:342912132848:web:da4ec0116e53ededbf4435"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elementos del DOM
const claveScreen = document.getElementById("clave-screen");
const contenedor = document.getElementById("contenedor");
const validarClaveBtn = document.getElementById("validar-clave");
const claveInput = document.getElementById("clave-input");
const listaTareas = document.getElementById("lista-tareas");
const nuevaTareaInput = document.getElementById("nueva-tarea");
const agregarTareaBtn = document.getElementById("agregar-tarea-btn");
const restablecerTareasBtn = document.getElementById("restablecer-tareas");

let tareas = [];

// Validar clave
validarClaveBtn.addEventListener("click", async () => {
  const docRef = doc(db, "config", "access");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const claveCorrecta = docSnap.data().clave;
    if (claveInput.value === claveCorrecta) {
      claveScreen.style.display = "none";
      contenedor.style.display = "block";
      cargarTareas();
    } else {
      alert("Clave incorrecta");
    }
  } else {
    alert("No se encontró la configuración de clave en Firestore");
  }
});

// Cargar tareas
async function cargarTareas() {
  const querySnapshot = await getDocs(collection(db, "tareas"));
  tareas = [];
  querySnapshot.forEach((docSnap) => {
    tareas.push({ id: docSnap.id, ...docSnap.data() });
  });
  actualizarListaTareas();
}

// Guardar tarea
async function guardarTarea(texto) {
  const nueva = { texto, completada: false };
  const id = Date.now().toString();
  await setDoc(doc(db, "tareas", id), nueva);
  cargarTareas();
}

// Actualizar tarea
async function actualizarTarea(id, completada) {
  await setDoc(doc(db, "tareas", id), { ...tareas.find(t => t.id === id), completada });
  cargarTareas();
}

// Borrar completadas
async function borrarTareasCompletadas() {
  for (const tarea of tareas) {
    if (tarea.completada) {
      await deleteDoc(doc(db, "tareas", tarea.id));
    }
  }
  cargarTareas();
}

// Eventos
agregarTareaBtn.addEventListener("click", () => {
  const texto = nuevaTareaInput.value.trim();
  if (texto !== "") {
    guardarTarea(texto);
    nuevaTareaInput.value = "";
  }
});

restablecerTareasBtn.addEventListener("click", () => {
  borrarTareasCompletadas();
});

// Actualizar UI
function actualizarListaTareas() {
  listaTareas.innerHTML = "";
  tareas.forEach((tarea) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label class="tarea-checkbox">
        <input type="checkbox" ${tarea.completada ? "checked" : ""}>
        <span class="checkmark"></span>
      </label>
      <span class="tarea-texto ${tarea.completada ? "completada" : ""}">${tarea.texto}</span>
    `;
    li.querySelector("input").addEventListener("change", (e) => {
      actualizarTarea(tarea.id, e.target.checked);
    });
    listaTareas.appendChild(li);
  });
}
