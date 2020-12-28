const fullName = document.getElementById("fullName");
const userType = document.getElementById("userType");
const fullNameInput = document.getElementById("fullNameInput");
const userNameInput = document.getElementById("userNameInput");
const editProfileAvatar = document.getElementById("editProfileAvatar");
const profileAvatar = document.getElementById("profileAvatar");
const imageUpload = document.getElementById("imageUpload");
const btnSave = document.getElementById("btnSave");
const imageForm = document.getElementById("imageForm");
let imageFile;
let formData;

fullName.innerHTML = localStorage.getItem("fullname");
userType.innerHTML = localStorage.getItem("status_type");
editProfileAvatar.style = `background: url('${localStorage.getItem(
  "image_path"
)}') no-repeat center; background-size: cover;`;
profileAvatar.style = `background: url('${localStorage.getItem(
  "image_path"
)}') no-repeat center; background-size: cover;`;

console.log(localStorage.getItem("image_path"));
fullNameInput.value = localStorage.getItem("fullname");
userNameInput.value = "@" + localStorage.getItem("username");

userNameInput.onkeyup = (e) => {
  if (userNameInput.value.charAt(0) != "@") {
    userNameInput.value = "@" + userNameInput.value;
  }
};

imageUpload.onchange = (e) => {
  imageFile = e.target.files[0];
  imageUrl = URL.createObjectURL(imageFile);
  editProfileAvatar.style = `background: url(${imageUrl}) no-repeat center; background-size: cover;`;
  formData = new FormData(document.getElementById("upload_img"));
  formData.append("upload-image", imageFile);
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
        } else alert(data.text);
      },
    });
  }
  $.ajax({
    type: "POST",
    url: "../public/php/profile/uploadImage.php",
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    //data: $("#upload_img").serialize(),
    success: function (response) {
      console.log(response);
      const data = JSON.parse(response);
      if (data.code === 200) {
        localStorage.setItem("image_path", data.image_path);
        window.location.assign("../public/profile.html");
      } else alert(data.text);
    },
  });
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
