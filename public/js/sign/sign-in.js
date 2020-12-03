const email = document.getElementById("email");
const password = document.getElementById("password");
const signIn = document.getElementById("sign-in");
const btnGoogle = document.getElementById("googleSign");
//var lg = 992;
localStorage.clear();

signIn.onclick = (e) => {
  e.preventDefault();
  $.ajax({
    url: "../public/php/sign/sign-in.php",
    method: "post",
    data: {
      email: email.value,
      password: password.value,
    },
    success: function (response) {
      const data = JSON.parse(response);
      if (data.code === 200) {
        localStorage.setItem("fullname", data.fullname);
        localStorage.setItem("username", data.username);
        localStorage.setItem(
          "status_type",
          data.user_type === "s" ? "STUDENT" : "PROFESSOR"
        );
        window.location.assign("../public/home.html");
      } else alert(data.text);
    },
  });
};

btnGoogle.onclick = (e) => {};
