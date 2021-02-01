const sideTabs = document.getElementsByClassName("sideTab");
const txtCourseTitle = document.getElementById("txtCourseTitle");
const quizContainer = document.getElementById("quizContainer");
const gradeContainer = document.getElementById("gradeContainer");
const studentContainer = document.getElementById("studentContainer");
const txtStudCount = document.getElementById("txtStudCount");
const txtStudCountNP = document.getElementById("txtStudCountNP");
const txtStudCount2 = document.getElementById("txtStudCount2");
const newQuizTable = document.getElementById("newQuizTable");
const newQuizTableClose = document.getElementById("newQuizTableClose");
const newQuizTableSpinner = document.getElementById("newQuizTableSpinner");
const tableBody = document.getElementById("tableBody");
const gradeTableBody = document.getElementById("gradeTableBody");
const studentTableBody = document.getElementById("studentTableBody");
let activeTab = sideTabs[0];
let quizArr = [];
let url = new URL(window.location.href);
const courseId = url.searchParams.get("id");

function changeTab(element) {
  if (activeTab == element) {
    return;
  }
  activeTab.classList.remove("activeTab");
  activeTab = element;
  activeTab.classList.add("activeTab");
  if (element.textContent.trim() === "Quizzes") {
    removeDNone(quizContainer);
    addDNone(gradeContainer);
    addDNone(studentContainer);
  } else if (element.textContent.trim() === "Grades") {
    removeDNone(gradeContainer);
    addDNone(quizContainer);
    addDNone(studentContainer);
  } else if (element.textContent.trim() === "Students") {
    removeDNone(studentContainer);
    addDNone(quizContainer);
    addDNone(gradeContainer);
  }
}

$.ajax({
  url: "../php/course/profCourse/getProfCourseInfo.php",
  method: "POST",
  data: { courseId: courseId },
  success: function (response) {
    document.getElementById("spinnerContainer1").remove();
    document.getElementById("spinnerContainer2").remove();
    document.getElementById("spinnerContainer3").remove();
    let data = JSON.parse(response);
    if (data.code === 200) {
      const courseData = data.result[0];
      txtCourseTitle.innerHTML = courseData.course_title;
      txtStudCountNP.innerHTML = courseData.total_enrolled_learners;
      txtStudCount.innerHTML = courseData.total_enrolled_learners;
      txtStudCount2.innerHTML = courseData.total_enrolled_learners;

      //   console.log(data.contents);
      //   console.log(data.exam_done);
      const examsArr = Object.values(data.contents);
      let examsFinArr = [];
      for (i of examsArr) {
        examsFinArr = examsFinArr.concat(i);
      }
      quizArr.concat(examsFinArr);

      for (examData of examsFinArr) {
        const rowNode = document.createElement("tr");
        rowNode.id = examData.item_id;
        rowNode.setAttribute("over", examData.total_points);
        rowNode.setAttribute("onclick", "getScores(this)");
        let status = "-/" + courseData.total_enrolled_learners;
        // console.log(data.exam_done[examData.exam_id]);
        if (examData.exam_id in data.exam_done) {
          status =
            data.exam_done[examData.exam_id][examData.exam_id] +
            "/" +
            courseData.total_enrolled_learners;
        }
        // status = contentData.submit_count + "/" + courseData.student_count;

        rowNode.innerHTML = `
                    <td class="tableBold">${examData.exam_title}</td>
                    <td class="tableThin">${status}</td>`;
        tableBody.appendChild(rowNode);
      }
    }
  },
});

$.ajax({
  url: "../php/course/profCourse/getCourseStudents.php",
  method: "POST",
  data: { courseId: courseId },
  success: function (response) {
    let data = JSON.parse(response);
    if (data.code === 200) {
      const userData = data.result[0];

      const status = userData.progress_percent >= 100 ? "Completed" : "In-progress";
      //   const grade = studentData.grade || "-";
      const statusClass = userData.progress_percent >= 100 ? "gradeComplete" : "gradeInProgress";
      const imagePath = "../../../." + userData.image_path;
      const newRowNode2 = document.createElement("tr");
      newRowNode2.innerHTML = `
                <td class="d-flex align-items-center">
                <div class="studentAvatar mr-2 mr-sm-3" style="background: url('${imagePath}') no-repeat center;  background-size: cover;"></div> 
                <div class="">${userData.fullname} <i class="${statusClass}">(${status})</i></div>
                </td>`;
      studentTableBody.appendChild(newRowNode2);
      if (!userData.image_path) {
        newRowNode2.querySelector(".studentAvatar").removeAttribute("style");
      }
    }
  },
});

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    firebase
      .database()
      .ref("courses/" + courseId)
      .once("value")
      .then((snapshot) => {
        document.getElementById("spinnerContainer1").remove();

        const courseData = snapshot.val();
        if (courseData.prof_id === user.uid) {
          firebase
            .database()
            .ref("course_students/" + courseId)
            .once("value")
            .then((snapshot) => {
              document.getElementById("spinnerContainer2").remove();
              document.getElementById("spinnerContainer3").remove();
              if (snapshot.val()) {
                const data = snapshot.val();
                for (id in data) {
                  const studentData = data[id];
                  const status = studentData.grade ? "Completed" : "In-progress";
                  const grade = studentData.grade || "-";
                  const statusClass = studentData.grade ? "gradeComplete" : "gradeInProgress";

                  firebase
                    .database()
                    .ref("users/" + studentData.user)
                    .once("value")
                    .then((studUser) => {
                      const userData = studUser.val();
                      const newRowNode = document.createElement("tr");
                      newRowNode.setAttribute("key", studentData.user);
                      newRowNode.setAttribute("onclick", "showGrade(this)");
                      const newPage = document.createElement("div");
                      newPage.id = studentData.user;
                      newPage.className = "paperCourse d-none p-2 p-sm-3";
                      newPage.innerHTML = `
                          <div class="row mx-0">
                            <div class="btn col-12 mb-2 close" onclick="hideGrade(this)">
                              <span>&times;</span>
                            </div>
                            <div class="col-12 py-3 mb-3 d-flex align-items-center studentContainer">
                              <div class="studentAvatar mr-2 mr-sm-3" style='background: url(${userData.photoUrl}) no-repeat center; background-size: cover;'></div>
                              <div class="">${userData.fullname} <i class="${statusClass}">(${status})</i></div>
                            </div>
                            <div class="col-12 px-0 txtCourseGrade">Course Grade</div>
                            <div class="col-12 px-0 numGrade">${grade}</div>
                          </div>

                          <table class="table mt-4">
                            <thead>
                              <tr>
                                <th scope="col" class="col-6 gradeTableTxt">ITEM</th>
                                <th scope="col" class="col-4 gradeTableTxt">STATUS</th>
                                <th scope="col" class="col gradeTableTxt">GRADE</th>
                              </tr>
                            </thead>
                            <tbody id="studGradeTableBody"></tbody>
                          </table>
                          <div class="col-12 py-3 mb-4 tableBold text-center paperCourse">
                            Course Grade: <span style="color: rgb(40, 176, 46)" id="courseGrade">${grade}</span>
                          </div>`;

                      newRowNode.innerHTML = `
                          <td class="d-flex align-items-center">
                            <div class="studentAvatar mr-2 mr-sm-3" style='background: url(${userData.photoUrl}) no-repeat center; background-size: cover;'></div> 
                            <div class="gradeTableTxt">${userData.fullname}</div>
                          </td>
                          <td class="gradeTableTxt ${statusClass}">${status}</td>
                          <td class="gradeTableTxt">${grade}</td>`;
                      gradeTableBody.appendChild(newRowNode);
                      gradeContainer.appendChild(newPage);
                      if (!userData.photoUrl) {
                        newRowNode.querySelector(".studentAvatar").removeAttribute("style");
                      }
                      if (!userData.photoUrl) {
                        newPage.querySelector(".studentAvatar").removeAttribute("style");
                      }
                      let newPageNode;
                      for (i of quizArr) {
                        if (studentData.quiz_done) {
                          if (i.itemId in studentData.quiz_done) {
                            newPageNode = newGradeNode(i, studentData.quiz_done[i.itemId]);
                          } else {
                            newPageNode = noGradeNode(i);
                          }
                        } else {
                          newPageNode = noGradeNode(i);
                        }

                        newPage.querySelector("#studGradeTableBody").appendChild(newPageNode);
                      }

                      const newRowNode2 = document.createElement("tr");
                      newRowNode2.innerHTML = `
                          <td class="d-flex align-items-center">
                          <div class="studentAvatar mr-2 mr-sm-3" style='background: url(${userData.photoUrl}) no-repeat center; background-size: cover;'></div> 
                            <div class="">${userData.fullname} <i class="${statusClass}">(${status})</i></div>
                          </td>`;
                      studentTableBody.appendChild(newRowNode2);
                      if (!userData.photoUrl) {
                        newRowNode2.querySelector(".studentAvatar").removeAttribute("style");
                      }
                    });
                }
              } else {
                txtStudCount.innerHTML = 0;
              }
            });
        } else {
          alert("Invalid user");
          window.history.back();
        }
      });
  }
});

function removeDNone(element) {
  element.classList.remove("d-none");
  element.classList.add("d-block");
}

function addDNone(element) {
  element.classList.remove("d-block");
  element.classList.add("d-none");
}

function showGrade(element) {
  document.getElementById(element.getAttribute("key")).classList.remove("d-none");
  document.getElementById("gradeTable").classList.add("d-none");
}

function hideGrade(element) {
  element.parentNode.parentNode.classList.add("d-none");
  document.getElementById("gradeTable").classList.remove("d-none");
}

function newGradeNode(data, userQuiz) {
  const newNode = document.createElement("tr");
  let score = userQuiz.score + "/" + userQuiz.over;

  newNode.innerHTML = `
      <td class="tableBold">${data.title}</td>
      <td class="tableThin">Submitted</td>
      <td class="tableBold">${score}</td>`;

  return newNode;
}

function noGradeNode(data) {
  const newNode = document.createElement("tr");

  newNode.innerHTML = `
      <td class="tableBold">${data.title}</td>
      <td class="tableThin">Not Taken</td>
      <td class="tableBold">-</td>`;

  return newNode;
}

function getScores(element) {
  const id = element.id;
  let over = element.getAttribute("over");
  newQuizTableClose.classList.remove("d-none");
  newQuizTableSpinner.classList.remove("d-none");
  const quizTable = document.getElementById("quizTable");
  const quizTablePaper = document.getElementById("quizTablePaper");
  newQuizTable.classList.remove("d-none");
  quizTable.classList.add("d-none");
  firebase
    .database()
    .ref("course_students/" + courseId)
    .once("value")
    .then((snapshot) => {
      newQuizTableSpinner.classList.add("d-none");

      const dataColl = snapshot.val();
      for (i in dataColl) {
        const data = dataColl[i];
        // const dataArr = [];
        // if (data.quiz_done) {
        //   if (id in data.quiz_done) dataArr.push(data.quiz_done[id].score);
        //   else dataArr.push(-1);
        // } else dataArr.push(-1);
        let score;
        let submit_date = null;
        let scoreTxt = "--/" + over;
        if (data.quiz_done) {
          if (id in data.quiz_done) {
            score = data.quiz_done[id].score;
            scoreTxt = score + "/" + over;
            submit_date = String(new Date(data.quiz_done[id].submit_datetime)).slice(4, 21);
          } else {
            score = -1;
            submit_date = "-";
          }
        } else {
          score = -1;
          submit_date = "-";
        }

        firebase
          .database()
          .ref("users/" + data.user)
          .once("value")
          .then((studUser) => {
            const userData = studUser.val();

            const newNode = document.createElement("tr");
            const status = score < 0 ? "Not Graded" : "Graded";
            newNode.innerHTML = `
                <td class="tableBold">${userData.fullname}</td>
                <td class="tableThin">${status}</td>
                <td class="tableThin">${submit_date}</td>
                <td class="tableBold">${scoreTxt}</td>`;

            document.getElementById("newQuizTableBody").appendChild(newNode);
          });
      }
    });

  newQuizTableClose.onclick = () => {
    newQuizTableClose.classList.add("d-none");
    newQuizTable.classList.add("d-none");
    newQuizTableSpinner.classList.add("d-none");
    quizTable.classList.remove("d-none");
    document.getElementById("newQuizTableBody").innerHTML = "";
  };
}
// Fri Jan 29 2021 02:05
