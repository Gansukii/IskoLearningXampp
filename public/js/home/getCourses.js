let allUserCourses = [];
let inProgressUserCourses = [];
let completedUserCourses = [];
let latestCourses = [];
const arrowLeftCat = document.getElementById("arrowLeftCat");
const arrowRightCat = document.getElementById("arrowRightCat");
const myCoursesContainer = document.getElementById("myCourses");
const btnBadges = document.getElementsByClassName("badgeDev");
let activeBadge = btnBadges[0];
let currentUser;

$.ajax({
  url: "../public/php/home/getCourses.php",
  method: "get",
  success: function (response) {
    const data = JSON.parse(response);
    if (data.code === 200) {
      const currDate = new Date(data.date_now);
      for (let course of data.result) {
        let timeAgo = getTimeAgo(Math.abs(currDate - new Date(course.creation_datetime)) / 1000);
        const newNode = document.createElement("div");
        newNode.className = "col-6 col-lg-3 px-1 mt-2";
        newNode.id = data.course_id;
        newNode.setAttribute("key", `${course.course_id}`);
        newNode.setAttribute("onclick", `goToCourse(this)`);
        newNode.innerHTML = `<div class="card rounded">
                          <div class="thumb" style="background: url(${course.image_path}) no-repeat center;"></div>
                          <div class="card-body py-2 px-3">
                            <p class="courseDate mb-1">Added ${timeAgo}</p>
                            <p class="courseTitle">${course.course_title}</p>
                            <p class="courseProf mb-1">prof. ${course.fullname}</p>
                          </div>
                        </div>`;
        latest.insertBefore(newNode, arrowRight);
        if (data.course_thumbnail === undefined) {
          newNode.firstElementChild.firstElementChild.removeAttribute("style");
        }
        latestCourses.push(newNode);
        latestArrow(latestCourses);
      }
    }
  },
});

getAlluserCourses();

//     firebase
//       .database()
//       .ref("student_user_course/" + user.uid)
//       .on("child_added", (snapshot) => {
//         let courseKey = snapshot.key;
//         let courseNode = document.createElement("div");
//         if (snapshot.val()) {
//           firebase
//             .database()
//             .ref("courses/" + courseKey)
//             .once("value")
//             .then((courseMain) => {
//               const courseMainData = courseMain.val();
//               // console.log(courseMainData);

//               courseNode.className = "col-6 col-lg-4 px-2 mt-2";
//               courseNode.setAttribute("key", courseMainData.course_id);
//               courseNode.setAttribute("onclick", `goToCourse(this)`);

//               courseNode.innerHTML = `
//                   <div class="card rounded courseCard">
//                     <div class="courseThumb" style="background: url(${courseMainData.course_thumbnail}) no-repeat center;"></div>
//                     <div class="card-body py-2 px-3">
//                       <p class="courseTitle mb-0">${courseMainData.course_title}</p>
//                       <p class="courseProf mb-2">${courseMainData.prof_name}</p>
//                       <p class="courseDes">
//                         ${courseMainData.course_brief}
//                       </p>
//                     </div>
//                   </div>`;

//               myCoursesContainer.insertBefore(courseNode, arrowRightCat);
//               if (courseMainData.course_thumbnail === undefined) {
//                 courseNode.firstElementChild.firstElementChild.removeAttribute("style");
//               }
//               // myCoursesContainer.appendChild(courseNode);
//               allUserCourses.push(courseNode);

//               myCoursesArrow(allUserCourses);
//             });

//           // console.log(allUserCourses);
//         } else {
//           for (let i = 0; i < btnBadges.length; i++) {
//             btnBadges[i].setAttribute("disabled", "");
//           }
//         }
//       });
//   }
// });

{
  /* <div class="col-6 col-lg-3 px-1 mt-2">
                <div class="card rounded">
                  <div class="thumb"></div>
                  <div class="card-body py-2 px-3">
                    <p class="courseDate mb-1">Added 6 days ago</p>
                    <p class="courseTitle">System Integration &amp; Architecture</p>
                    <p class="courseProf mb-1">prof. ramos</p>
                  </div>
                </div>
              </div> */
}

function goToCourse(element) {
  courseId = element.getAttribute("key");
  window.location.assign(`../public/course.html?id=${courseId}`);
}

function changePage(element) {
  if (activeBadge === element) {
    return;
  }
  activeBadge.classList.remove("activeBadge");
  activeBadge = element;
  activeBadge.classList.add("activeBadge");

  if (element.id === "all") {
    elArrDnone(inProgressUserCourses);
    elArrDnone(completedUserCourses);
    elArrDisplay(allUserCourses);
    myCoursesArrow(allUserCourses);
  }

  if (element.id === "inProgress") {
    elArrDnone(allUserCourses);
    elArrDnone(completedUserCourses);
    if (inProgressUserCourses.length > 0) elArrDisplay(inProgressUserCourses);
    else getInprogress();
  }

  if (element.id === "completed") {
    elArrDnone(allUserCourses);
    elArrDnone(inProgressUserCourses);
    if (completedUserCourses.length > 0) elArrDisplay(completedUserCourses);
    else getCompleted();
  }
}

function getInprogress() {
  $.ajax({
    url: "../public/php/home/getInProgress.php",
    method: "get",
    success: function (response) {
      let data = JSON.parse(response);
      displayUserCourse(data.result, inProgressUserCourses);
    },
  });
}
function getCompleted() {
  $.ajax({
    url: "../public/php/home/getCompleted.php",
    method: "get",
    success: function (response) {
      let data = JSON.parse(response);
      displayUserCourse(data.result, completedUserCourses);
    },
  });
}

function getAlluserCourses() {
  $.ajax({
    url: "../public/php/home/getUserCourses.php",
    method: "get",
    success: function (response) {
      let data = JSON.parse(response);
      displayUserCourse(data.result, allUserCourses);
    },
  });
}
function displayUserCourse(data, courseArr) {
  for (let course of data) {
    let courseNode = document.createElement("div");
    courseNode.className = "col-6 col-lg-4 px-2 mt-2";
    courseNode.setAttribute("key", course.course_id);
    courseNode.setAttribute("onclick", `goToCourse(this)`);

    courseNode.innerHTML = `
                  <div class="card rounded courseCard">
                    <div class="courseThumb" style="background: url(${course.image_path}) no-repeat center;"></div>
                    <div class="card-body py-2 px-3">
                      <p class="courseTitle mb-0">${course.course_title}</p>
                      <p class="courseProf mb-2">${course.fullname}</p>
                      <p class="courseDes">
                        ${course.course_brief}
                      </p>
                    </div>
                  </div>`;

    myCoursesContainer.insertBefore(courseNode, arrowRightCat);
    if (course.image_path === null) {
      courseNode.firstElementChild.firstElementChild.removeAttribute("style");
    }
    // myCoursesContainer.appendChild(courseNode);
    courseArr.push(courseNode);

    myCoursesArrow(courseArr);
  }
}
// firebase
//   .database()
//   .ref("student_user_course/" + currentUser.uid)
//   .on("child_added", (snapshot) => {
//     let data = snapshot.val();
//     let courseNode = document.createElement("div");

//     if (data.progress_percent < 100) {
//       firebase
//         .database()
//         .ref("courses/" + data.courseId)
//         .once("value")
//         .then((courseMain) => {
//           const courseMainData = courseMain.val();

//           courseNode.className = "col-6 col-lg-4 px-2 mt-2";
//           courseNode.setAttribute("key", courseMainData.course_id);
//           courseNode.setAttribute("onclick", `goToCourse(this)`);

//           courseNode.innerHTML = `
//                 <div class="card rounded courseCard">
//                   <div class="courseThumb" style="background: url(${courseMainData.course_thumbnail}) no-repeat center;"></div>
//                   <div class="card-body py-2 px-3">
//                     <p class="courseTitle mb-0">${courseMainData.course_title}</p>
//                     <p class="courseProf mb-2">${courseMainData.prof_name}</p>
//                     <p class="courseDes">
//                       ${courseMainData.course_brief}
//                     </p>
//                   </div>
//                 </div>`;

//           myCoursesContainer.insertBefore(courseNode, arrowRightCat);
//           if (courseMainData.course_thumbnail === undefined) {
//             courseNode.firstElementChild.firstElementChild.removeAttribute("style");
//           }
//           // myCoursesContainer.appendChild(courseNode);
//           inProgressUserCourses.push(courseNode);

//           myCoursesArrow(inProgressUserCourses);
//         });
//     }
//   });

// function getCompleted() {
//   firebase
//     .database()
//     .ref("student_user_course/" + currentUser.uid)
//     .on("child_added", (snapshot) => {
//       let data = snapshot.val();
//       let courseNode = document.createElement("div");

//       if (data.progress_percent == 100) {
//         firebase
//           .database()
//           .ref("courses/" + data.courseId)
//           .once("value")
//           .then((courseMain) => {
//             const courseMainData = courseMain.val();

//             courseNode.className = "col-6 col-lg-4 px-2 mt-2";
//             courseNode.setAttribute("key", courseMainData.course_id);
//             courseNode.setAttribute("onclick", `goToCourse(this)`);

//             courseNode.innerHTML = `
//                   <div class="card rounded courseCard">
//                     <div class="courseThumb" style="background: url(${courseMainData.course_thumbnail}) no-repeat center;"></div>
//                     <div class="card-body py-2 px-3">
//                       <p class="courseTitle mb-0">${courseMainData.course_title}</p>
//                       <p class="courseProf mb-2">${courseMainData.prof_name}</p>
//                       <p class="courseDes">
//                         ${courseMainData.course_brief}
//                       </p>
//                     </div>
//                   </div>`;

//             myCoursesContainer.insertBefore(courseNode, arrowRightCat);
//             if (courseMainData.course_thumbnail === undefined) {
//               courseNode.firstElementChild.firstElementChild.removeAttribute("style");
//             }
//             // myCoursesContainer.appendChild(courseNode);
//             completedUserCourses.push(courseNode);

//             myCoursesArrow(completedUserCourses);
//           });
//       }
//     });
// }

function elArrDnone(elementArr) {
  for (element of elementArr) {
    element.classList.add("d-none");
  }
  arrowRightCat.classList.remove("d-flex");
  arrowLeftCat.classList.remove("d-flex");
}

function elArrDisplay(elementArr) {
  for (element of elementArr) {
    element.classList.remove("d-none");
  }
}
