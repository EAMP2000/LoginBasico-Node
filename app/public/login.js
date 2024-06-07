const msjError= document.getElementsByClassName('error')[0];

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = e.target.children.user.value;
    const password = e.target.children.password.value;

    const res = await fetch('http://localhost:3000/api/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user, password
        })
    })

    if (!res.ok) return msjError.classList.toggle("escondido", false);//Si la respuesta no esta bien...

    const resJson = await res.json();
    if (resJson.redirect) {
        window.location.href = resJson.redirect;
    }
})