let departamentos = [];
const url = "http://localhost:3000/Departamentos";

window.addEventListener('DOMContentLoaded',getDepartamentos);

async function getDepartamentos() { 
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        const departementoSelect = document.getElementById("departamentoSelect");
        departementoSelect.innerHTML = "";

        const departementoSelects = document.querySelectorAll(".selectDepartamento");

        departementoSelects.forEach((select) => {
            select.innerHTML = "";

            datos.forEach((departamento) => {
                const opcion = document.createElement("option");
                opcion.value = departamento.id;
                opcion.textContent = departamento.nomDepartamento;
                select.appendChild(opcion);
            });
        });

        departamentos = datos;
        console.log(departamentos);
        renderDepartamentos();
    } catch (error) {
        alertAlert("error", "Ha ocurrido un problema");
    }   
};

const contenedorDepartamentos = document.getElementById('contenedorDepartamento');

const renderDepartamentos = () => {
    let listar = "";
    departamentos.forEach(departamento => {
        listar += `
            <tr>
                <td>${departamento.id}</td>
                <td>${departamento.nomDepartamento}</td>
                <td><button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalEditar" onclick="editarDepartamento(${departamento.id})">EDITAR</button></td>
                <td><button class="btn btn-danger" onclick="eliminarDepartamento(${departamento.id})">ELIMINAR</button></td>
            </tr>`;
    });
    contenedorDepartamentos.innerHTML = listar;
};

async function crearDepartamento (){
    const inputNombre = document.getElementById("inputNombre").value;
    if (!inputNombre) {
        document.getElementById('llenarTodo').innerHTML = "DEBES LLENAR TODOS LOS CAMPOS";
        return;
    }

    document.getElementById("llenarTodo").innerHTML = "";

    const departamento = {
        nomDepartamento: inputNombre
    };

    console.log(departamento);

    try {
        const respuesta = await fetch(url,{
            method: "POST",
            body: JSON.stringify(departamento),
            headers: {"Content-Type": "application/json"}
        });

        const datos = await respuesta.json;
        alertAlert("success", 'Ruta agregada correctamente');
        getDepartamentos();
    } catch(error){
        alertAlert("error", error);
        document.getElementById("crear").reset();
    };
};

const editarDepartamento = (id) => {
    let departamento = departamentos.find(departamento => departamento.id == id);

    document.getElementById("editarNombre").value = departamento.nomDepartamento;

    document.getElementById("modalEditar").setAttribute("data-id", id);
};

async function subirDepartamento() {
    const editarNombre = document.getElementById("editarNombre").value;

    if (!editarNombre) {
        document.getElementById('llenarTodoEditar').innerHTML = "DEBES LLENAR TODOS LOS CAMPOS";
        return;
    }

    document.getElementById("llenarTodoEditar").innerHTML = "";

    const id = document.getElementById("modalEditar").getAttribute("data-id"); 

    const departamento = {
        nomDepartamento: editarNombre
    };

    try {
        const respuesta = await fetch(`${url}/${id}`,{
            method: "PUT",
            body: JSON.stringify(departamento),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await respuesta.json();
        alertAlert("success", data.mensaje);
        getDepartamentos();

    } catch(error){
        alertAlert("error", error);
    };

    document.getElementById("modalEditar").reset();

};

async function eliminarDepartamento(id) {
    try {
        const respuesta = await fetch(`${url}/${id}`, {
            method: "DELETE"
        });

        const data = await respuesta.json();
        alertAlert("success", 'Departamento eliminado correctamente');

        await eliminarCiudadesDepartamento(id);

        getDepartamentos();
        
    } catch(error) {
        alertAlert("error", error);
    }
};

async function eliminarCiudadesDepartamento(depaId) {
    try {
        const departamentoEliminar = ciudades.filter(ciudad => ciudad.departamentoId === depaId);

        for (const ciudad of departamentoEliminar) {
            await fetch(`${urll}/${ciudad.id}`, {
                method: "DELETE"
            });
        }
        
    } catch(error) {
        alertAlert("Error al eliminar la ciudad del departamento");
    }
};

function alertAlert(type, message) {
    const alertContainer = document.getElementById('alertContainer');
    const alertElement = document.createElement('div');

    alertElement.className = 'alert ' + type;
    alertElement.textContent = message;

    alertContainer.appendChild(alertElement);

    setTimeout(function() {
        alertElement.remove();
    }, 3000);
};


////////////////////////////////

const urll = "http://localhost:3000/Ciudades";
let ciudades = [];

window.addEventListener("DOMContentLoaded", () => {
    getCiudades();
});

async function getCiudades() {
    try {
        const respuesta = await fetch(urll);
        const datos = await respuesta.json();
        ciudades = datos;
    } catch(error) {
        alertAlert("error", "Ha ocurrido un problema");
    };
}; 

const contenedorCiudades = document.getElementById('contenedorCiudades');

document.getElementById("departamentoSelect").addEventListener("change", mostrarCiudades);

function mostrarCiudades() {
    const ciudadId = document.getElementById("departamentoSelect").value;
    const ciudadesFiltradas = ciudades.filter(ciudad => ciudad.departamentoId == ciudadId);
    renderCiudadesFiltradas(ciudadesFiltradas);
};

const renderCiudadesFiltradas = (ciuadesFiltradas) => {
    let listar = "";
    ciuadesFiltradas.forEach((ciudad) => {
        listar +=`
        <div class="card cartas" style="width: 18rem;">
            <img src="./imgs/pexels-brooke-laven-14762474.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">${ciudad.id}</li>
                    <li class="list-group-item">${ciudad.nomCiudad}</li>
                    <li class="list-group-item">${ciudad.departamentoId}</li>
                    <li class="list-group-item">${ciudad.coordenadas.lat}  lat</li>
                    <li class="list-group-item">${ciudad.coordenadas.lon}  lon</li>
                
                    <a href="#">
                        <button class="btn btn-warning btnsPuntos" data-bs-toggle="modal" data-bs-target="#modalEditarCiudad" onclick="editarCiudad(${ciudad.id})">EDITAR</button><button class="btn btn-danger btnsPuntos" onclick="eliminarCiudad(${ciudad.id})">ELIMINAR</button>
                    </a>
                </ul>
            </div>
        </div>`;
    });
    contenedorCiudades.innerHTML = listar;
};

async function crearCiudad() {
    const inputNombreCiudad = document.getElementById("inputNombreCiudad").value;
    const inputIdCiudad = document.getElementById("inputIdCiudad").value;

    if (!inputNombreCiudad || !inputIdCiudad) {
        document.getElementById("llenarTodoPunto").innerHTML =
            "DEBES LLENAR TODOS LOS CAMPOS";
        return;
    }

    document.getElementById("llenarTodoPunto").innerHTML = "";

    const ciudad = {
        nomCiudad: inputNombreCiudad,
        departamentoId: parseInt(inputIdCiudad),
        Imagen: "./imgs/pexels-brooke-laven-14762474.jpg",
        coordenadas: {
            lat: 4,
            lon: 72
        }
    };

    try {
        const respuesta = await fetch(urll, {
            method: "POST",
            body: JSON.stringify(ciudad),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await respuesta.json();
        alertAlert("success", data.mensaje);
        getCiudades();
    } catch(error) {
        alertAlert("error", error);
        document.getElementById("crear").reset();
    };
};

const editarCiudad = (id) => {
    let ciudad = ciudades.find((ciudad) => ciudad.id == id);

    document.getElementById("editarNombreCiudad").value = ciudad.nomCiudad;
    document.getElementById("editarDepartamentoCiudad").value = ciudad.departamentoId;

    document.getElementById("modalEditarCiudad").setAttribute("data-id", id);
};

async function subirCiudad() {
    const editarNombreCiudad = document.getElementById("editarNombreCiudad").value;
    const editarDepartamentoCiudad = document.getElementById("editarDepartamentoCiudad").value;

    if (!editarNombreCiudad || !editarDepartamentoCiudad) {
        document.getElementById("llenarTodoCiudadEditar").innerHTML =
            "DEBES LLENAR TODOS LOS CAMPOS";
        return;
    }

    document.getElementById("llenarTodoCiudadEditar").innerHTML = "";

    const id = document.getElementById("modalEditarCiudad").getAttribute("data-id");

    const ciudad = {
        nomCiudad: editarNombreCiudad,
        departamentoId: parseInt(editarDepartamentoCiudad),
        Imagen: "./imgs/pexels-brooke-laven-14762474.jpg",
        coordenadas: {
            lat: 4,
            lon: 72
        }
    };

    try {
        const respuesta = await fetch(`${urll}/${id}`,{
            method: "PUT",
            body: JSON.stringify(ciudad),
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        const data = await respuesta.json();
        alertAlert("success", data.mensaje);
        getCiudades();

    } catch (error){
        alertAlert("error", error);
    };

    document.getElementById("modalEditarPuntos").reset();
};

async function eliminarCiudad(id){
    try {
        const respuesta = await fetch(`${urll}/${id}`, {
            method: "DELETE",
        });

        const data = await respuesta.json();
        alertAlert("success", data.mensaje);
        getCiudades();
    } catch (error) {
        alertAlert("error", error);
    }
};


///////////////////////

function cambiarTema(theme) {
    var customTheme = document.getElementById('customTheme');

    if (theme === 'light') {
      customTheme.textContent = `
        body {
          background-color: #f4f4f4;
          color: #333;
        }
      `;
    } else if (theme === 'dark') {
      customTheme.textContent = `
        body {
          background-color: #333;
          color: #f4f4f4;
        }
      `;
    }

    localStorage.setItem('theme', theme);
  }

  function shiftTema() {
    var miTema = localStorage.getItem('theme');
    if (miTema == 'light') {
      cambiarTema('dark')
    } else if (miTema == 'dark') {
      cambiarTema('light')
    }
  }
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    cambiarTema(savedTheme);
  }