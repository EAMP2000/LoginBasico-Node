document.getElementsByTagName("button")[0].addEventListener("click",()=>{
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT' //Al cerrar la sesion de expirara la cookie
    window.location.href= "/"
})