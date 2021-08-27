const socket = io();
const iconoUsuario = document.getElementById("iconoUsuario");
const input = document.getElementById("mensajeTipeo");
const btn = document.getElementById("btnEnviar")
const nombre_cargado_por_Usuario = document.getElementById("nombre_cargado_por_Usuario");
//const BorrarMensajes = document.getElementById("borrarMensajes")

/* function emojis(){
    let emoji=document.getElementById("ListadoEmojis").value;
    input.value.innerHTML+=`"${emoji}"`
} */
iconoUsuario.addEventListener("click",()=>{
    document.getElementsByClassName("mensajeTexto").classList.toggle('fuenteNueva')
})
socket.on("dataUsuario", (data) => {
    iconoUsuario.innerHTML = `<img class="mensajeUsuario" src="${data}" alt="icono de usuario">`;


})

btn.addEventListener("click", () => {
    let datos_de_usuario = { mensaje: input.value, nombre_cargado_por_Usuario: nombre_cargado_por_Usuario.value }
    socket.emit("mensajeFront", datos_de_usuario)


})
/* BorrarMensajes.addEventListener("click",()=>{
    socket.emit("peticionDeBorrado",true)
})
 */

function Borrar(){
    document.getElementById("lista").innerHTML= "";
}
socket.on("mensajeBackend", (data) => {


    console.log(data)

    data.map((data) => {
        let mimensaje =
            `<li id="mensaje_en_lista" >
                        <div class="mensaje">
                             <img class="mensajeUsuario" src="${data.img}">
                            <div class="contenedor_header_mensaje">
                              <p class="horario_de_mensaje">${data.nombre_cargado_por_Usuario}</p>
                              <p class="horario_de_mensaje">${data.horario}</p>
                             </div>
                        
                             <p class="mensajeTexto" title="mensaje">${data.mensaje}</p>
                        
                        </div> 
                    </li> `;
        document.getElementById("lista").innerHTML += mimensaje

    })




})
