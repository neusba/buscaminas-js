// FUNCIONES PARA JUEGO BUSCAMINAS

// Variables globales
let tabla;
let casillasMinadas = [];
let filas = 0;
let columnas = 0;
let casillasPorRevisar = [];

function iniciarPartida() {
    // Reiniciar valores para empezar otra partida
    
    filas = parseInt(prompt('Introduce el número de filas'));
    columnas = parseInt(prompt('Introduce el número de columnas'));

    // Control de medidas del tablero
    // if (filas < 10) {
    //     filas = 10;
    // } else if (filas > 30) {
    //     filas = 30;
    // }

    // if (columnas < 10) {
    //     columnas = 10;
    // } else if (columnas > 30) {
    //     columnas = 30;
    // }

    crearTablero();                 // Creamos el tablero
    setMinas();                     // Colocamos las minas de manera aleatoria
}

function crearTablero() {

    // Obtenemos el div del tablero y le creamos un elemento tabla dentro
    document.getElementById('tablero').innerHTML = '<table id="tabla"></table>';
    tabla = document.getElementById('tabla');
    tabla.id = "tabla";
    tabla.style.border = "3px solid lightgray";
    tabla.style.padding = "1em";
    tabla.style.backgroundColor = "gray";

    // Creamos las casillas de manera dinámica
    for (let i=0; i<filas; i++) {
        let fila = document.createElement('tr');
        for (let j=0; j<columnas; j++) {   
            let celda = document.createElement('td');
            celda.innerHTML = `<img fila="${i}" columna="${j}" class="casilla" src="img/fondo.jpg" data-mine="false" abierta="false" onclick="abreCasilla(this)"/>` // en el evento onclick le pasamos el parámetro this el cual equivale al elemento img que se esta clickando en ese momento

            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }

}

function setMinas() {

    // El 17% de las casillas totales del tablero deben ser minas
    let totalCasillas = filas * columnas;
    let totalMinas = Math.round((totalCasillas * 17) / 100);

    while (totalMinas != 0) {
        let fila = Math.floor(Math.random() * (filas));         // Número random de fila
        let columna = Math.floor(Math.random() * (columnas));   // Número random de columna
        let casilla = [fila, columna];                          // Posición de la casilla que será minada

        if (!casillasMinadas.includes(casilla)) {
            let img = tabla.rows[fila].cells[columna].querySelector('img'); // obtenemos el elemento img de la casilla
            img.setAttribute('data-mine', 'true');              // Cambiamos propiedad data-mine a true
            totalMinas--;                                       
        }

        casillasMinadas.push(casilla);                          // Añadimos casilla al array de minadas
    }

}

function abreCasilla(img) {

    // comprobamos si esta ya abierta para no poder ejecutar nada una vez se abre
    if (img.getAttribute('abierta') == 'true') {
        return;
    }
    // Le asignamos a la casilla un atributo de que ya ha sido abierta en true
    img.setAttribute('abierta', 'true');

    // Comprobación de si la casilla tiene la propiedad data-mine en true o en false
    if (esMina(img)) {
        img.src = 'img/mina.jpg';
        img.style.border = '2px solid red';
        alert('¡BOOM! Has muerto');
        revelarMapa();
        // cambiaMensajeBoton();
        // reiniciar variables
        return;
    }
    // Si no es mina, checkea minas a su alrededor
    
     if (!checkeaMinasAlrededor(img)) {
        casillasPorRevisar.push(calculaAdjacentes(img));
        recursividad();
     }
    
}

function checkeaMinasAlrededor(img) {

    // Obtenemos el array con todas las posiciones de las casillas adjacentes de la casilla abierta
    let adjacentes = calculaAdjacentes(img);

    let minasAdjacentes = 0;    // minas que tiene alrededor
    adjacentes.forEach(adjacente => {
        let img = document.querySelector(`[fila="${adjacente[0]}"][columna="${adjacente[1]}"]`);    // obtenemos el elemento específico
        if (img != undefined) {
            if (img.getAttribute('abierta') == 'false') {
                if (esMina(img)) {
                    minasAdjacentes++;
                }
            }
        }
    });

    if (minasAdjacentes > 0) {
        img.src = `img/minas${minasAdjacentes}.jpg`;
        return true;
    } else {
        img.src = 'img/minas0.jpg';
        return false;
    }
    
}

function calculaAdjacentes(img) {

    // Obtenemos la fila y columna de la casilla recibida
    let fila = parseInt(img.getAttribute('fila'));
    let columna = parseInt(img.getAttribute('columna'));

    // Calculamos sus respectivas adjacentes y las metemos todas en un array
    let supIzquierda = [(fila - 1), (columna - 1)];
    let supCentro = [(fila - 1), columna];
    let supDerecha = [(fila - 1), (columna + 1)];

    let lineaIzquierda = [fila, (columna - 1)];
    let lineaDerecha = [fila, (columna + 1)];

    let infIzquierda = [(fila + 1), (columna - 1)];
    let infCentro = [(fila + 1), columna];
    let infDerecha = [(fila + 1), columna + 1];

    let adjacentes = [supIzquierda, supCentro, supDerecha, lineaIzquierda, lineaDerecha, infIzquierda, infCentro, infDerecha];

    return adjacentes;  // Devolvemos el array con las casilla adjacentes de la recibida

}
function recursividad() {

    let nuevasCasillas = [];

    // Revisar cada casilla adjacente y comprovar su numero de minas adjacentes
    for(let i=0; i<casillasPorRevisar.length; i++) {
        for(let j=0; j<casillasPorRevisar[i].length; j++) {
            let adjacente = casillasPorRevisar[i][j];
            let img = document.querySelector(`[fila="${adjacente[0]}"][columna="${adjacente[1]}"]`);    // obtenemos el elemento específico
            if (img != undefined) {
                img.style.border = '1px solid red';
                if (img.getAttribute('abierta') == 'false') {
                    if (!checkeaMinasAlrededor(img)) {
                        // img.setAttribute('abierta', 'true');
                        nuevasCasillas.push(calculaAdjacentes(img));
                    }
                }
            }
        };
        casillasPorRevisar.pop(casillasPorRevisar[i]);
    };
    console.log(casillasPorRevisar.length);
    console.log(nuevasCasillas.length)
    if (nuevasCasillas.length > 0) {
        casillasPorRevisar = nuevasCasillas;
        nuevasCasillas = [];
        // recursividad();
    }
    console.log(casillasPorRevisar.length);
    console.log(nuevasCasillas.length)
    console.log('fin recursividad');
}

function revelarMapa() {

    // Obtenemos todos los elementos de class "casilla" en una variable y los recorremos mirando su data-mine
    let casillas = document.querySelectorAll('.casilla');

    casillas.forEach(casilla => {
        if (esMina(casilla)) {
            casilla.src = 'img/mina.jpg';
        }
    });

}

function esMina(casilla) {

    // Si la casilla en cuestión tiene propiedad data-mine == true, es una mina y devuelve true
    if (casilla.getAttribute('data-mine') == 'true') {
        return true;
    }
    return false;

}

// function cambiaMensajeBoton() {
//     // Función que cambia el contenido del botón de iniciar partida
//     let boton = document.getElementById('iniciar');

//     if () {
//         boton.innerText = 'Jugar otra vez';
//     } else {
//         boton.innerText = 'Iniciar Partida';
//     }

// }