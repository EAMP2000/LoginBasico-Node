//Mensaje de error en el FrontEnd
const msjError= document.getElementsByClassName('error')[0] //El primer error de la clase error.

//Funcinalidad correcta en el frontEnd
document.getElementById('register-form').addEventListener("submit",async (e)=>{
 e.preventDefault();   
  console.log(e.target.children.password.value);

  //Comunicacion con el Backend 
  const res= await fetch("http://localhost:3000/api/register",{
    method: "POST",
    headers:{
        "Content-Type": "application/json"
    },
    body:JSON.stringify({
        user: e.target.children.user.value,
        email: e.target.children.email.value,
        password: e.target.children.password.value
    })
  })

  //Funcionalidad en la parte del FRONTEND
  if(!res.ok) return msjError.classList.toggle("escondido", false);//Si la respuesta no esta bien...
    
  const resJson= await res.json();
  if (resJson.redirect) { //Si tiene redireccion...
    window.location.href = resJson.redirect;
  }
})