const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPass");
const signUp = document.getElementById("sign-up");
const match = document.getElementById("match");
let passMatch = false;

const handleConfirm = () => {
  if (
    confirmPassword.value == password.value &&
    (password.value != "" || password.value != "")
  ) {
    match.classList.remove("d-none");
    passMatch = true;
  } else {
    match.classList.add("d-none");
    passMatch = false;
  }
};

confirmPassword.addEventListener("keyup", handleConfirm);
password.addEventListener("keyup", handleConfirm);

signUp.onclick = (e) => {
  e.preventDefault();
  if (passMatch) {
    $.ajax({
      url: "../public/php/sign/sign-up.php",
      method: "post",
      data: {
        email: email.value,
        password: password.value,
      },
      success: function (response) {
        const data = JSON.parse(response);
        if (data.code === 200) window.location.assign("../public/home.html");
        else alert(data.text);
      },
    });
  } else {
    e.preventDefault();
    alert("Passwords should match");
  }
};
