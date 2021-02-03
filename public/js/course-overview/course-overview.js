const sideTabs = document.getElementsByClassName("sideTab");
const contentContainer = document.getElementById("contentContainer");
const gradeContentContainer = document.getElementById("gradeContentContainer");
const btnGoTo = document.getElementById("goToCourse");
const txtCourseTitle = document.getElementById("txtCourseTitle");
const tableBody = document.getElementById("tableBody");
const courseGrade = document.getElementById("courseGrade");
let activeTab = sideTabs[0];
let url = new URL(window.location.href);
const courseId = url.searchParams.get("id");
let studentRecord = {};
let totalScore = 0;
let totalPoint = 0;

function changeTab(element) {
  if (activeTab == element) {
    return;
  }
  activeTab.classList.remove("activeTab");
  activeTab = element;
  activeTab.classList.add("activeTab");
  if (element.textContent.trim() === "Course Overview") {
    contentContainer.classList.remove("d-none");
    gradeContentContainer.classList.add("d-none");
  } else {
    gradeContentContainer.classList.remove("d-none");
    contentContainer.classList.add("d-none");
  }
}

$.ajax({
  url: "../public/php/course/getEnrollmentInfo.php",
  method: "POST",
  data: { courseId: courseId },
  success: function (response) {
    const data = JSON.parse(response);
    if (data.code === 400) {
      alert("Please enroll first to record your data");
      window.history.back();
    } else {
      btnGoTo.removeAttribute("disabled");

      showData();
      let enrollData = data.result[0];
      btnGoTo.innerHTML = enrollData.text_status;

      courseProgressContainer.classList.remove("d-none");
      courseProgressContainer.classList.add("d-flex");
      document.getElementById("txtProgressPercent").innerHTML = enrollData.progress_percent;
      document.getElementById("txtCurrentChapter").innerHTML = enrollData.current_chapter;
      document.getElementById("txtChapterName").innerHTML = enrollData.current_chapter_title;
      document.getElementById(
        "courseProgressBar"
      ).style = `width: ${enrollData.progress_percent}%;`;

      btnGoTo.onclick = () => {
        startCourse();
      };
    }
  },
});

function showData() {
  $.ajax({
    url: "../public/php/course/getCourse.php",
    method: "post",
    data: {
      courseId: courseId,
    },
    success: function (response) {
      const data = JSON.parse(response);
      if (data.code === 200) {
        const courseData = data.result[0];
        const chapters = data.chapters;
        txtCourseTitle.classList.remove("loading");
        txtCourseTitle.innerHTML = courseData.course_title;
        const contents = data.contents;
        for (key in contents) {
          let contentArr = contents[key];
          let currChapter = data["chapters"][key - 1];
          let videoCount;
          let quizCount;
          const newNode = document.createElement("div");
          newNode.innerHTML = `<div
                class="accordion md-accordion"
                id="accordionEx"
                role="tablist"
                aria-multiselectable="true"
              >
                <div class="card">
                  <button
                    class="btn p-0"
                    data-toggle="collapse"
                    data-parent="#accordionEx"
                    href="#collapse${key}"
                    aria-expanded="false"
                    aria-controls="collapse${key}"
                  >
                    <div class="card-header" role="tab" id="heading${key}">
                      <div class="w-100 mb-0 d-flex justify-content-between align-items-center">
                        <div class="row text-left">
                          <div class="col-12 accordionHeaderText lh-1">${currChapter.chapter_title}</div>
                          <div class="col-12 text-muted small" id="itemsCount${key}">2 videos, 1 quiz</div>
                        </div>
                        <i class="fas fa-angle-down rotate-icon"></i>
                      </div>
                    </div>
                  </button>
                  <div
                    id="collapse${key}"
                    class="collapse"
                    role="tabpanel"
                    aria-labelledby="heading${key}"
                    data-parent="#accordionEx"
                  >
                    <div class="card-body p-0">
                      <div class="row mx-0" id="accordionInnerContainer${key}">

                      </div>
                    </div>
                  </div>
                </div>
              </div>`;
          accordionContainer.appendChild(newNode);

          for (item of contentArr) {
            videoCount = currChapter.num_of_video;
            quizCount = currChapter.num_of_quiz;

            let icon;
            let itemDes;
            if (item.content_type === "1") {
              icon = "fa-play-circle";
              itemDes = "Video";
            } else {
              icon = "fa-file-alt";
              itemDes =
                item.total_points.toString() + (item.total_points < 2 ? " question" : " questions");
            }
            const itemNode = document.createElement("div");
            itemNode.className = "col-12 py-2";
            itemNode.innerHTML = `<button class="btn w-100">
                                    <div class="row d-flex align-items-center">
                                      <div>
                                        <i class="far ${icon}"></i>
                                      </div>
                                      <div class="px-2 d-flex flex-column">
                                        <div class="accordionSubItemText lh-1 text-left">${item.header_title}</div>
                                        <div class="text-muted small text-left">${itemDes}</div>
                                      </div>
                                    </div>
                                  </button>`;
            document.getElementById(`accordionInnerContainer${key}`).appendChild(itemNode);
          }
          const itemsCount = document.getElementById(`itemsCount${key}`);
          let vidString, quizString;
          vidString = videoCount.toString() + (videoCount > 1 ? " videos" : " video");
          quizString = quizCount.toString() + (quizCount > 1 ? " quizzes" : " quiz");
          itemsCount.innerHTML = vidString + " &#x25CF; " + quizString;
        }
      }
    },
  });
  $.ajax({
    url: "../public/php/course/getStudExams.php",
    method: "POST",
    data: { courseId: courseId },
    success: function (response) {
      let data = JSON.parse(response);
      if (data.code === 200) {
        let totalPoint = 0;
        let totalScore = 0;
        for (studentExam of data.result) {
          const rowNode = document.createElement("tr");
          totalPoint += parseInt(studentExam.score);
          totalScore += parseInt(studentExam.total);
          //   let status = "";
          //   let score = "-";
          //   if (chapterContents[i].itemId in studentRecord) {
          //     status = "Submitted";
          //     const key = chapterContents[i].itemId;
          //     score = studentRecord[key].score + "/" + studentRecord[key].over;
          //     totalPoint += parseInt(studentRecord[key].score);
          //   } else {
          //     status = "Not Taken";
          //   }
          rowNode.innerHTML = `
                    <td class="tableBold">${studentExam.title}</td>
                    <td class="tableThin">Submitted</td>
                    <td class="tableBold">${studentExam.score + "/" + studentExam.total}</td>`;

          tableBody.appendChild(rowNode);
        }
        courseGrade.innerHTML = Number(((totalPoint / totalScore) * 100).toFixed(1));
      } else {
        const rowNode = document.createElement("div");
        rowNode.innerHTML = "no quizzed completed";
        tableBody.appendChild(rowNode);
      }
    },
  });
}

function startCourse() {
  window.location.assign(`../public/course-content.html?id=${courseId}`);
}
