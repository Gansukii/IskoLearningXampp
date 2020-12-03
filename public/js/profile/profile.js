const fullName = document.getElementById("fullName");
const userType = document.getElementById("userType");
const fullNameInput = document.getElementById("fullNameInput");
const userNameInput = document.getElementById("userNameInput");
const btnSave = document.getElementById("btnSave");

fullName.innerHTML = localStorage.getItem("fullname");
userType.innerHTML = localStorage.getItem("status_type");

fullNameInput.value = localStorage.getItem("fullname");
userNameInput.value = "@" + localStorage.getItem("username");

userNameInput.onkeyup = (e) => {
  if (userNameInput.value.charAt(0) != "@") {
    userNameInput.value = "@" + userNameInput.value;
  }
};

btnSave.onclick = () => {
  if (fullNameInput.value == "" || userNameInput.value.length < 2) {
    alert("Both fields cannot not be empty");
  } else {
    $.ajax({
      url: "../public/php/profile/profile.php",
      method: "post",
      data: {
        fullname: fullNameInput.value,
        username: userNameInput.value.slice(1),
      },
      success: function (response) {
        const data = JSON.parse(response);
        if (data.code === 200) {
          localStorage.setItem("fullname", fullNameInput.value);
          localStorage.setItem("username", userNameInput.value.slice(1));
          window.location.assign("../public/profile.html");
        } else alert(data.text);
      },
    });
  }
};

// $.ajax({
//   url: "../public/php/profile/profile.php",
//   method: "post",
//   data: {
//     userId: localStorage.getItem("userId"),
//   },
//   success: function (response) {
//     console.log(response);
//     const data = JSON.parse(response);
//     if (data.code === 200) {
//       //   window.location.assign("../public/home.html");
//       fullName.innerHTML = data.fullname;
//       userType.innerHTML = data.user_type === "s" ? "STUDENT" : "PROFESSOR";
//       localStorage.setItem("fullname", data.fullname);
//       localStorage.setItem(
//         "status_type",
//         data.user_type === "s" ? "STUDENT" : "PROFESSOR"
//       );
//     } else alert(data.text);
//   },
// });
