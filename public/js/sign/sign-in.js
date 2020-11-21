const email = document.getElementById('email');
const password = document.getElementById('password');
const signIn = document.getElementById('sign-in');
const btnGoogle = document.getElementById('googleSign');
//var lg = 992;

function createDb(){
     $.ajax({
      url: "../public/php/createDb.php"
     })
}

window.onload = createDb



signIn.onclick = (e) => {
    e.preventDefault()
    $.ajax({
            url: '../public/php/sign/sign-in.php',
            method: 'post',
            data: {
                email: email.value,
                password: password.value
            },
            success: function (response) {
                const data = JSON.parse(response)
                if (data.code === 200)
                    window.location.assign('../public/home.html')
                else
                    alert(data.text)
            }
        });

  
}



btnGoogle.onclick = (e) => {
}
