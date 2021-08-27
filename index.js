const express = require("express");
const fs = require("fs");
const { Server: HttpServer } = require("http")
const { SocketAddress } = require("net")
const { Server: IOServer } = require("socket.io")
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.json())
app.use(express.static(`./src/public`))

app.get("/", (req, resp) => {
    resp.sendFile(__dirname + "./src/public/index.html")
})
httpServer.listen(8080, () => { console.log(" arrancó en puerto 8080") })




class Usuario {
    constructor(id, nombre, img, mensaje,horario_del_mensaje) {
        this.id = id;
        this.nombre = nombre;
        this.img = img;
        this.mensaje = mensaje;
        this.horario_del_mensaje=horario_del_mensaje;
        let informacionRelevante= JSON.stringify({id:this.id, nombre:this.nombre,mensaje:this.mensaje,horario:this.horario_del_mensaje})
        this. guardarMensaje=()=>{
            fs.appendFileSync("dataBaseMensajes.JSON",`[${informacionRelevante}]`, error => {
                if (error) { console.log(error) }
            })
        }
    }
}


//icono del usuario random 
io.on("connection", (socket) => {
    console.log("usuarionuevo")
    let num = Math.floor(Math.random() * 80 + 1);
    let imgUsuario = `https://picsum.photos/id/${num}/86/82`;

    socket.emit("dataUsuario", imgUsuario);

    // al desconectarse el usuario
    socket.on("disconnect", (error) => { console.log(" se desconecó un usuario"+error) });


    socket.on("mensajeFront", (data) => {

        //armar datos y guardarlos en Json al recibir data del front
        let tiempoDelDato= new Date();
        let horas=tiempoDelDato.getHours();
        let minutos= tiempoDelDato.getMinutes();
        let segundos= tiempoDelDato.getSeconds();
        let horario_del_mensaje=`${horas} :${minutos} :${segundos}`;
        let Usuario_en_sistema = new Usuario(socket.id, `${data.nombre_cargado_por_Usuario}`, imgUsuario, `${data.mensaje}`,`${horario_del_mensaje}`);
        Usuario_en_sistema.guardarMensaje();
     
        let mensajes=[{
            id: socket.id,
            img: imgUsuario,
            mensaje: data.mensaje,
            nombre_cargado_por_Usuario: data.nombre_cargado_por_Usuario,
            horario:horario_del_mensaje
        }];
     console.log(mensajes)
        // info que recibe el back
        io.sockets.emit("mensajeBackend", mensajes);
    })
})
