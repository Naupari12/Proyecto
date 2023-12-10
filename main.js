// Obtén el nombre de usuario almacenado en localStorage
let nombreUsuarioAlmacenado = localStorage.getItem("nombreUsuario");

let nombreUsuarioActual;

if (nombreUsuarioAlmacenado) {
    // Si hay un nombre de usuario almacenado, pregunta si es el mismo usuario
    let esMismoUsuario = confirm("¿Eres el mismo usuario?");
    
    if (esMismoUsuario) {
        // Si es el mismo usuario, utiliza el nombre almacenado
        nombreUsuarioActual = nombreUsuarioAlmacenado;
    } else {
        // Si no es el mismo usuario, pide al usuario que ingrese un nuevo nombre
        nombreUsuarioActual = prompt("Coloca tu nombre");
        // Almacena el nuevo nombre de usuario en localStorage
        localStorage.setItem("nombreUsuario", nombreUsuarioActual);
    }
} else {
    // Si no hay un nombre de usuario almacenado, pide al usuario que ingrese su nombre
    nombreUsuarioActual = prompt("Coloca tu nombre");
    // Almacena el nombre de usuario en localStorage
    localStorage.setItem("nombreUsuario", nombreUsuarioActual);
}

// Actualiza el contenido del elemento con id "user-name"
let userNameElement = document.getElementById("user-name");
userNameElement.innerHTML = nombreUsuarioActual;

const fecha = document.querySelector("#fecha");
const lista = document.querySelector("#lista");
const input = document.querySelector("#input");
const botonEnter = document.querySelector("#enter")
const check = "fa-check-circle";
const uncheck = "fa-circle";
const lineThrough ="line-through";
let id 
let LIST 

// creacion de fecha
const FECHA = new Date();
fecha.innerHTML = FECHA.toLocaleDateString("es-MX",{weekday:"long",month:"short",day:"numeric",year:"numeric"});

function agregarTarea(tarea,id,realizado,eliminado){

    if(eliminado){return}

    const REALIZADO = realizado ? check : uncheck;
    const LINE = realizado ? lineThrough : '';
    const elemento = `<li id="elemento">
                      <i class="far ${REALIZADO}" data="realizado" id="${id}"></i>
                      <p class="text ${LINE}">${tarea}</p>
                      <i class="fas fa-trash de" data="eliminado" id="${id}"></i>
                      </li>
                     `
    lista.insertAdjacentHTML("beforeend",elemento);
}

/*funcion de tarea realizada*/
function tareaRealizada(element){
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector(".text").classList.toggle(lineThrough);
    LIST[element.id].realizado = LIST[element.id].realizado ?false :true; 
}

function tareaEliminada(element){
    element.parentNode.parentNode.removeChild(element.parentNode)
    LIST[element.id].eliminado= true;
}

botonEnter.addEventListener("click",()=>{
    const tarea = input.value;
    if (tarea){
        agregarTarea(tarea,id,false,false);
        LIST.push({
            nombre: tarea,
            id: id,
            realizado: false,
            eliminado: false
        });
    }
    localStorage.setItem("TODO",JSON.stringify(LIST))
    input.value=''
    id++;
})

document.addEventListener("keyup", function(event){
    if(event.key == 'Enter'){
        const tarea= input.value;
        if(tarea){
            agregarTarea(tarea,id,false,false);
            LIST.push({
                nombre: tarea,
                id: id,
                realizado: false,
                eliminado: false
            });
        }
        localStorage.setItem("TODO",JSON.stringify(LIST))
        input.value='';
        id++;
    }
})

lista.addEventListener("click", function(event){
    const element = event.target;
    const elementData = element.attributes.data.value;
    if(elementData == "realizado"){
        tareaRealizada(element);
    }
    else if (elementData === "eliminado"){
        tareaEliminada(element);
    }
    localStorage.setItem("TODO",JSON.stringify(LIST))
})

let data = localStorage.getItem("TODO")
if(data){
    LIST = JSON.parse(data);
    id = LIST.length;
    cargarLista(LIST);
}
else{
    LIST = [];
    id = 0;
}

function cargarLista(DATA){
    DATA.forEach(function(i){
        agregarTarea(i.nombre,i.id,i.realizado,i.eliminado);
    })
}