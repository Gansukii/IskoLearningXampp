const search = document.getElementById("search");
const avatar = document.getElementById("avatar");
const menuPop = document.getElementById("menuPop");
const signOut = document.getElementById("sign-out");
const fullNameNav = document.getElementById("fullNameNav");
const userTypeNav = document.getElementById("userTypeNav");

let isOpen = false;
var lg = 992;

// $(document).click(function (event) {
//   console.log(isOpen);
//   console.log(menuPop);
// });

if (menuPop) {
  window.onresize = () => {
    if (document.documentElement.clientWidth < lg) {
      menuPop.style.left = "-100px";
    } else {
      menuPop.removeAttribute("style");
    }
  };
  if (document.documentElement.clientWidth < lg) {
    if (document.documentElement.clientWidth < lg) {
      menuPop.style.left = "-100px";
    } else {
      menuPop.removeAttribute("style");
    }
  }
}

if (fullNameNav) {
  fullNameNav.innerHTML = localStorage.getItem("fullname");
  userTypeNav.innerHTML = localStorage.getItem("status_type");
}

avatar
  ? (avatar.onclick = () => {
      if (!isOpen) {
        menuPop.classList.remove("d-none");
        menuPop.classList.remove("menuClose");
        menuPop.classList.add("d-flex");
        menuPop.classList.add("menuOpen");
        isOpen = true;
      } else {
        menuPop.classList.remove("menuOpen");
        menuPop.classList.add("menuClose");
        menuPop.classList.add("d-none");
        isOpen = false;
      }
    })
  : null;

// signOut
//   ? (signOut.onclick = () => {
//       firebase
//         .auth()
//         .signOut()
//         .then(function () {
//           window.location.assign("../../sign-in");
//         })
//         .catch(function (error) {
//           alert("Error occured");
//         });
//     })
//   : null;
