const search = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");
const avatar = document.getElementById("avatar");
const menuAvatar = document.getElementById("menuAvatar");
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
search.onkeydown = (e) => {
  if (e.keyCode === 13) {
    const keySearch = search.value;
    window.location.assign(`../public/search.html?key=${keySearch}`);
  }
};
btnSearch.onclick = () => {
  const keySearch = search.value;
  window.location.assign(`../public/search.html?key=${keySearch}`);
};

if (menuPop) {
  avatar.style = `background: url('${localStorage.getItem(
    "image_path"
  )}') no-repeat center; background-size: cover;`;
  menuAvatar.style = `background: url('${localStorage.getItem(
    "image_path"
  )}') no-repeat center; background-size: cover;`;
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
