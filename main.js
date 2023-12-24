//=====================
//DEFINICIONES
//=====================

const fecha = document.querySelector("#fecha");
const lista = document.querySelector("#lista");
const input = document.querySelector("#input");
const botonEnter = document.querySelector("#enter")
const check = "fa-check-circle";
const uncheck = "fa-circle";
const lineThrough = "line-through";
let listaDeTareas = [];

//=====================
//FUNCIONES
//=====================
//funcion en la cual alamacenare los datos de los usuarios(Nombres). 
function inicializarUsuario() {
    let nombreUsuario;
    //Una vez declarada la variable procedo a crear una constante en la cual verificara si hay una llave en el LS.
    const usuarioEnLs = localStorage.getItem("nombreUsuario");
    //Creo una condicional en la cual en caso que si se cumpla la primera condicion, se lanza un promp en el que se ingresara el dato del usuario = nombre. 
    if (usuarioEnLs === null) {
        const prompRespuestaNombre = prompt("Cual es tu nombre de usuario?");
        //En caso de que no se ingrese un nombre esta condicional verificara el dato ingresado en el promp o si este fue cancelado.
        if (prompRespuestaNombre === null || prompRespuestaNombre === "") return;
        nombreUsuario = prompRespuestaNombre;
        localStorage.setItem("nombreUsuario", prompRespuestaNombre);
    }
    //En caso que no se cumpla ninguna de las anteriores se mostrara el dato del usuario anterior. 
    else {
        nombreUsuario = usuarioEnLs;
    }
    //En esta condicional se mostrara el nombre que estaba prederteminado en el HTML.
    if (nombreUsuario !== undefined) {
        let userNameElement = document.getElementById("user-name");
        userNameElement.innerHTML = nombreUsuario;
    }
}

//Funcion para conseguir la fecha actual.
function inicializarFecha() {
    //constante que me obtendra la fecha actual.
    const FECHA = new Date();
    //en esta linea de codigo le doy a la constante fecha datos exactos que me va a insertar en el innerHTML 
    fecha.innerHTML = FECHA.toLocaleDateString("es-MX", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
}

//Esta funcion basicamente es para poder ir creando tareas una por una.
function agregarTareaEnUI(tarea) {
    //esta condicional esta para que en caso que se elimine una tarea no retorne nada.
    if (tarea.eliminado) return;
    // en esta constante me verifica el estado del icono si esta true o false, cambia de uno a otro dependiendo de su valor. esto que se usa aqui se llama operador ternario.
    const esRealizadoIcono = tarea.completar ? check : uncheck;
    //de igual manera se aplica un operador ternario el cual usamos como sentencias condicionales (un if... else basicamente) solo que en este caso se le agrega una clase que esta guardada en una variable.
    const estiloTextoClase = tarea.completar ? lineThrough : '';
    //en esta constante tiene como valor el elemento HTML el cual ira agregandose en la to do list. la linea que dice "${esRealizadoIcono}" es para llamar mi constante con el operador ternario que me verifica el estado del elemento icono. si esta realizado o no. en la parte de "${tarea.id}" obtengo el elemento id de la tarea like object.
    const elemento = `<li>
                      <i class="far ${esRealizadoIcono}" data="completar" id="${tarea.id}"></i>
                     <p class="text ${estiloTextoClase}">${tarea.nombre}</p>
                      <i class="fas fa-trash de" data="eliminar" id="${tarea.id}"></i>
                      </li>
                     `
    //aqui simplemente le especifico en que posicion iran apareciendo las tareas agregadas.                 
    lista.insertAdjacentHTML("beforeend", elemento);
}

//Esta funcion es para obetener un id unico.
function generarIDUnico() {
    //constante que me consigue la fecha actual;
    const fechaActual = new Date();
    const idUnico = fechaActual.getTime(); // Obtiene la marca de tiempo en milisegundos
    //me retorna la fecha en milisegundos.
    return idUnico;
}

//Esta funcion sirve para que cada tarea agregada tenga los valores de sus propiedades definidas. por ejemplo  la constante dentro de la funcion crearTarea tiene como propiedad nombre, id, realizado y eleminado. estas propiedades deben tener un valor el cual yo le asigno segun lo que el nombre indique.  
function crearTarea(nombreTarea) {
    //Armamos nuestra tarea
    const tarea = {
        nombre: nombreTarea,
        id: generarIDUnico(),
        completar: false,
        eliminar: false
    }
    //se agrega tarea en la UI (DOM)
    agregarTareaEnUI(tarea);
    //se guarda en el LS 
    almacenarTareaEnMemoria(tarea);
}

//Funcion en la que cada tarea creada se guardara en el LS.
function almacenarTareaEnMemoria(tarea) {
    //Agrega una tarea en el array (listaDeTareas)
    listaDeTareas.push(tarea);
    //Persite la lista de tareas, guardandolo en el LS.
    localStorage.setItem("TODOS", JSON.stringify(listaDeTareas));
}

//
function completarTarea(element) {
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector(".text").classList.toggle(lineThrough);
    //TODO: refractorizar la busquedad de tarea
    //paso 1: cambiar sus valores respectivos. 
    //paso 2: actualizar listaDeTareas con la tarea actualizada (array.filter).
    listaDeTareas.forEach((tarea) => {
        if (tarea.id.toString() === element.id.toString()) {
            tarea.completar = !tarea.completar;
        }
    })
    console.log(listaDeTareas);
    localStorage.setItem("TODOS", JSON.stringify(listaDeTareas));

}

function eliminarTarea(element) {
    element.parentNode.parentNode.removeChild(element.parentNode)
    ////TODO: refractorizar la busquedad de tarea y actualizar sus valores.
    listaDeTareas = listaDeTareas.filter(tarea => tarea.id.toString() !== element.id.toString());
    localStorage.setItem("TODOS", JSON.stringify(listaDeTareas));
}

function cargarTareasEnUI(tareas) {
    tareas.forEach(function (tarea) {
        agregarTareaEnUI(tarea);
    })
}

function obtenerTareasGuardadas() {
    let data = localStorage.getItem("TODOS")
    console.log(data);
    if (data) {
        //Se rellena la listaDeTareas con la data del LS
        listaDeTareas = JSON.parse(data);
        //inserta las tareas en la UI (DOM)
        cargarTareasEnUI(listaDeTareas);
    }
}
//=====================
//EVENTOS
//=====================

botonEnter.addEventListener("click", () => {
    //Obtenemos el valor del input
    const nombreTarea = input.value;
    //Si el valor de input es un valor valido (!= "") 
    if (nombreTarea) {
        //se crea nueva tarea 
        crearTarea(nombreTarea);
        //se limpia el input.
        input.value = "";
    }
})

document.addEventListener("keyup", function (event) {
    if (event.key == 'Enter') {
        //Obtenemos el valor del input
        const nombreTarea = input.value;
        //Si el valor de input es un valor valido (!= "") 
        if (nombreTarea) {
            //se crea nueva tarea 
            crearTarea(nombreTarea);
            //se limpia el input.
            input.value = "";
        }
    }
})

lista.addEventListener("click", function (event) {
    //se obtiene el elemento HTML clickeado
    const elementoClickeado = event.target;
    //Se obtiene la id del elemento HTML clickeado
    const tareaID = elementoClickeado.id;
    //Se valida que el elemento clickeado tenga un id
    if (tareaID === undefined || tareaID === null) return;
    //se obtiene el tipo de accion.
    const accion = elementoClickeado.getAttribute("data");
    if (accion === "completar") {
        completarTarea(elementoClickeado);
    }
    else if (accion === "eliminar") {
        eliminarTarea(elementoClickeado);
    }
    localStorage.setItem("TODOS", JSON.stringify(listaDeTareas))
})

//=====================================================
//FUCIONES EJECUTADAS CUANDO CARGA LA PAGINA (INICIALIZACION)
//=====================================================
inicializarFecha();
inicializarUsuario();
obtenerTareasGuardadas();

