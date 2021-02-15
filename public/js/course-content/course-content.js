const textCourseTitle = document.getElementById("textCourseTitle");
const btnShowChapInfo = document.getElementById("btnShowChapInfo");
const sideNavDataContainer = document.getElementById("sideNavDataContainer");
const questionsContainer = document.getElementById("questionsContainer");
const btnDlCert = document.getElementById("btnDlCert");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const reviewInput = document.getElementById("reviewInput");
const modalCourseTitle = document.getElementById("modalCourseTitle");
const stars = document.getElementsByClassName("fa-star");
let btnSideItems = [];
let firstIter = true;
let chapFirstIter = true;
let btnSideItemActive;
let currentChap = 1;
let chapNames = {};
let totalQuizCount = 0;
let currentInfo;
let currentMain;
let currentUser;
let enrollmentId;
let totalQuizzesCount = 0;
let totalExamDone = 0;
let courseDone = false;
let courseTitle = "";
let starRating;
let profName = "";

let url = new URL(window.location.href);
const courseId = url.searchParams.get("id");

function changeActive(element) {
  disableNavBtn(element);
  currentChap = element.parentNode.getAttribute("chapNumber");
  if (currentMain === questionsContainer) {
    questionsContainer.innerHTML = "";
  }
  btnSideItemActive.classList.remove("btnSideItemActive");
  element.classList.add("btnSideItemActive");
  currentMain.classList.add("d-none");
  currentMain = document.getElementById(element.getAttribute("key"));
  currentMain.classList.remove("d-none");
  btnSideItemActive = element;
}

$.ajax({
  url: "../public/php/course/getEnrollmentInfo.php",
  method: "POST",
  data: {
    courseId: courseId,
  },
  success: function (response) {
    const data = JSON.parse(response);
    if (data.code === 400) {
      alert("Please enroll first to record your data");
      window.history.back();
    } else {
      enrollmentId = data.result[0].enrollment_id;
      currentUser = data.result[0].fullname;
      verified();
    }
  },
});

function verified() {
  $.ajax({
    url: "../public/php/course-content/getCourseContents.php",
    method: "post",
    data: {
      courseId: courseId,
    },
    success: function (response) {
      const data = JSON.parse(response);
      let courseData = data.result[0];
      profName = courseData.fullname;
      $.ajax({
        url: "../public/php/course-content/getLearningProgress.php",
        method: "post",
        data: {
          enrollment_id: enrollmentId,
        },
        success: function (response) {
          const data = JSON.parse(response);
          if (data.code === 200) {
            if (parseInt(data.result[0].progress_percent) >= 100) {
              showModal();
            }
          }
        },
      });
      courseTitle = courseData.course_title;
      document.getElementById("sideLoadingContainer").remove();
      document.getElementById("loadingMain").remove();
      sideNavDataContainer.classList.remove("d-none");
      textCourseTitle.innerHTML = courseData.course_title;

      const contents = data.contents;
      for (chapterData of data.chapters) {
        chapNames[chapterData.chapter_number] = chapterData.chapter_title;
        totalQuizCount = parseInt(chapterData.num_of_quiz);
        const newSideNode = document.createElement("div");
        newSideNode.className = "col-12 mb-4";
        newSideNode.id = `chapter${chapterData.chapter_number}`;
        newSideNode.setAttribute("chapNumber", chapterData.chapter_number);
        newSideNode.innerHTML = `
              <div class="txtChapter mb-2">Chapter ${chapterData.chapter_number}: ${chapterData.chapter_title}
              </div>
              <div class="chapterContents${chapterData.chapter_number}">
              </div>`;
        sideNavDataContainer.appendChild(newSideNode);
        addNewChapterInfo(chapterData);

        const contentChapter = contents[chapterData.chapter_number];
        for (index in contentChapter) {
          const chapterContents = contentChapter[index];
          // console.log(chapterContents);
          const icon = chapterContents.content_type == "1" ? "fa-play-circle" : "fa-file-alt";
          const newSideBtn = document.createElement("button");
          newSideBtn.className = "btn w-100 text-left d-flex align-items-center btnSideItem";
          newSideBtn.setAttribute("onclick", "changeActive(this)");
          newSideBtn.setAttribute("key", chapterContents.item_id);
          newSideBtn.innerHTML = `
                <i class="far ${icon} mr-2"></i>${chapterContents.header_title}
              `;

          document.getElementById(`chapter${chapterData.chapter_number}`).appendChild(newSideBtn);

          btnSideItems.push(newSideBtn);
          let newMainNode = document.createElement("div");
          newMainNode.className = "w-100 d-none";
          newMainNode.classList.remove(chapFirstIter ? "d-none" : "x");
          if (chapFirstIter) currentMain = newMainNode;
          chapFirstIter = false;
          newMainNode.id = chapterContents.item_id;

          if (chapterContents.content_type == "1") {
            newMainNode.innerHTML = `
                  <div class="col-12 px-0 mt-2 mb-2 mb-sm-3 mt-sm-0 txtMain">${chapterContents.video_title}</div>
                  <div class="thumbContainer">
                    <iframe
                      class="w-100 h-100"
                      src="https://www.youtube.com/embed/${chapterContents.video_link_id}"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </div>
                  <div class="col-12 my-3 text-justify px-0 vidDescription" id="vidDescription">
                    ${chapterContents.video_description}
                  </div>
                `;
          } else {
            totalQuizzesCount++;
            let startButton = `<button class="btn btn-danger px-4 btnStart" id="btnStartQuiz" qTitle=" ${chapterContents.exam_title}" chapNum="${chapterData.chapter_number}" cKey="${chapterContents.exam_id}" key="${chapterContents.item_id}" onclick="startQuiz(this)">Start Quiz</button>`;

            if (chapterContents.exam_done) {
              totalExamDone++;
              startButton = `<button class="btn btn-danger px-4 btnStart" disabled><i class="far fa-check-circle"></i> Quiz Done</button>`;
            }

            newMainNode.innerHTML = `
                    <div class="col-12 px-0 mt-2 mb-2 mb-sm-3 mt-sm-0 txtMain">${chapterContents.exam_title}</div>
                    <div class="row w-100 mx-0 py-3 px-4 paper">
                      <div class="col-12 px-0 points" id="points">${chapterContents.total_points} items</div>
                      <div class="col-12 px-0 mt-2 mb-1 txtQuizHead">Instructions</div>
                      <div class="col-12 px-0 txtInstructions" id="intructions">
                        ${chapterContents.instructions}
                      </div>
                    </div>
                    <div class="col-12 px-0 mt-4 d-flex justify-content-end">
                      ${startButton}
                    </div>`;
          }
          document.getElementById("contentItem").appendChild(newMainNode);
          if (firstIter) {
            btnSideItemActive = newSideBtn;
            newSideBtn.classList.add("btnSideItemActive");
            firstIter = false;
          }
        }
        btnNext.removeAttribute("disabled");
      }

      btnShowChapInfo.onclick = () => {
        currentInfo = document.getElementById("chapInfoContainer" + currentChap);
        currentInfo.classList.remove("d-none");
        // btnShowChapInfo.setAttribute("disabled", "");
        disabler(btnShowChapInfo);
      };
    },
  });
}

function hideChapText(element) {
  currentInfo.classList.add("d-none");
  btnShowChapInfo.removeAttribute("disabled");
}

function addNewChapterInfo(data) {
  let newChapterInfoNode = document.createElement("div");
  newChapterInfoNode.className = "row w-100 mx-0 d-none";
  newChapterInfoNode.id = `chapInfoContainer${data.chapter_number}`;
  newChapterInfoNode.innerHTML = `
            <div
              class="col-12 px-0 mt-2 mb-2 mb-sm-3 mt-sm-0 d-none d-flex justify-content-between txtMain"
            >
              <span id="txtChapterTitle1">${data.chapter_title}</span>
              <div class="d-flex align-items-center">
                <i class="far fa-times-circle c-p" onclick="hideChapText(this)"></i>
              </div>
            </div>
            <div class="col-12 mb-5 text-justify px-0" id="chapterDes1">
              ${data.chapter_description}
            </div>
  `;
  document.getElementById("contentItem").prepend(newChapterInfoNode);
}

btnNext.onclick = () => {
  const elementIndex = btnSideItems.indexOf(btnSideItemActive);

  disableNavBtn(btnSideItems[elementIndex + 1]);
  btnSideItemActive.classList.remove("btnSideItemActive");
  btnSideItemActive = btnSideItems[elementIndex + 1];
  btnSideItemActive.classList.add("btnSideItemActive");
  currentMain.classList.add("d-none");
  currentMain = document.getElementById(btnSideItems[elementIndex + 1].getAttribute("key"));
  currentMain.classList.remove("d-none");
};
btnPrev.onclick = () => {
  const elementIndex = btnSideItems.indexOf(btnSideItemActive);

  disableNavBtn(btnSideItems[elementIndex - 1]);
  btnSideItemActive.classList.remove("btnSideItemActive");
  btnSideItemActive = btnSideItems[elementIndex - 1];
  btnSideItemActive.classList.add("btnSideItemActive");
  currentMain.classList.add("d-none");
  currentMain = document.getElementById(btnSideItems[elementIndex - 1].getAttribute("key"));
  currentMain.classList.remove("d-none");
};

function disableNavBtn(element) {
  if (btnSideItems.indexOf(element) > 0) {
    btnPrev.removeAttribute("disabled");
    btnPrev.classList.add("lessonNavActive");
  } else {
    // btnPrev.setAttribute("disabled", "");
    disabler(btnPrev);
    btnPrev.classList.remove("lessonNavActive");
  }
  if (btnSideItems.indexOf(element) === btnSideItems.length - 1) {
    // btnNext.setAttribute("disabled", "");
    disabler(btnNext);

    btnNext.classList.remove("lessonNavActive");
  } else {
    btnNext.removeAttribute("disabled");
    btnNext.classList.add("lessonNavActive");
  }
}

function startQuiz(element) {
  console.log(totalExamDone, totalQuizzesCount);

  let key = element.getAttribute("key");
  let chapter = element.getAttribute("chapNum");
  let examKey = element.getAttribute("ckey");
  let quizTitle = element.getAttribute("qTitle");
  questionsContainer.classList.remove("d-none");
  let answersArr = [];
  disabler(element);
  element.innerHTML = `<div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                          <span class="sr-only">Loading...</span>
                        </div>
                      </div>`;
  for (el of btnSideItems) {
    disabler(el);
  }
  $.ajax({
    url: "../public/php/course-content/getQuestions.php",
    method: "post",
    data: {
      examId: examKey,
    },
    success: function (response) {
      const data = JSON.parse(response);
      if (data.code === 200) {
        let questionsArr = data.questions;
        let over = 0;
        currentMain.classList.add("d-none");
        let quizTitleNode = document.createElement("div");
        quizTitleNode.className = "col-12 px-0 mt-2 mb-2 mb-sm-3 mt-sm-0 txtMain";
        quizTitleNode.id = "quizTitle" + key;
        quizTitleNode.innerHTML = quizTitle;
        questionsContainer.appendChild(quizTitleNode);

        for (question of questionsArr) {
          // console.log(question);
          over++;
          let newQuizNode = document.createElement("div");
          newQuizNode.className = "row w-100 mx-0 py-4 px-4 mb-4 paper";
          newQuizNode.innerHTML = `
            <div class="row w-100 mx-0">
              <div class="itemNumber">${question.question_number}.</div>
              <div class="col pr-0 txtQuestion">
                ${question.question_text}
              </div>
              <div class="col-12 mt-4 txtQuestion">Answer:</div>
              <input type="text" class="col-12 col-lg-5 col-md-6 ml-md-4 mt-1 form-control"></input>
            </div>
          </div>`;
          questionsContainer.appendChild(newQuizNode);
          answersArr.push(question.answer);
        }
        let submitButton = document.createElement("div");
        submitButton.className = "col-12 px-0 mt-4 d-flex justify-content-end";
        submitButton.innerHTML = `<button class="btn btn-danger px-4 btnStart" id="btnSubmitQuiz">Submit Quiz</button>`;
        questionsContainer.appendChild(submitButton);

        btnSubmitQuiz.onclick = () => {
          btnSubmitQuiz.innerHTML = `<div class="d-flex justify-content-center">
                      <div class="spinner-border spinner-border-sm" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>`;

          let score = 0;
          for (let i = 1; i < questionsContainer.children.length - 1; i++) {
            const questionElement = questionsContainer.children[i];
            const userAnswer = questionElement.firstElementChild.lastElementChild.value;
            const correctAns = questionsArr[i - 1].question_answer;
            if (userAnswer.toString().toLowerCase() == correctAns.toString().toLowerCase()) {
              score++;
              questionElement.firstElementChild.lastElementChild.style =
                "border: 0.75px solid #008F28;";
              disabler(questionElement.firstElementChild.lastElementChild);
            } else {
              questionElement.firstElementChild.lastElementChild.style =
                "border: 1.5px solid #FF0000;";
              disabler(questionElement.firstElementChild.lastElementChild);
              const correctAnsElement = document.createElement("input");
              correctAnsElement.setAttribute("type", "text");
              correctAnsElement.className = "col-12 col-lg-5 col-md-6 ml-md-4 mt-1 form-control";
              questionElement.firstElementChild.appendChild(correctAnsElement);
              correctAnsElement.style = "border: 0.75px solid #008F28;";
              questionElement.firstElementChild.lastElementChild.value = correctAns;
              disabler(questionElement.firstElementChild.lastElementChild);
            }
          }
          let resultNode = document.createElement("div");
          resultNode.className = "row w-100 mx-0 py-4 px-4 mb-4 paper";
          resultNode.innerHTML = `
        <div class="col-12 px-0 txtResult">Results</div>
        <div class="col-12 px-0 score">${score}/${over}</div>
        <div class="col-12 px-0">answered correctly</div>`;
          questionsContainer.insertBefore(resultNode, questionsContainer.children[1]);

          const progress_percent = ((totalExamDone + 1) / totalQuizzesCount) * 100;

          totalExamDone = totalExamDone + 1;
          // console.log(totalExamDone, totalQuizzesCount);

          $.ajax({
            url: "../public/php/course-content/addQuizDone.php",
            method: "post",
            data: {
              examId: examKey,
              currentChap: currentChap,
              currentChapName: chapNames[currentChap],
              enrollmentId: enrollmentId,
              score: score,
              over: over,
              progress_percent: progress_percent,
            },
            success: function (response) {
              btnSubmitQuiz.remove();
              window.scrollTo(0, 0);
              currentMain = questionsContainer;
              element.innerHTML = '<i class="far fa-check-circle"></i> Quiz Done';
              for (el of btnSideItems) {
                el.removeAttribute("disabled");
              }
              if (progress_percent >= 100) {
                $("#reviewModal").modal("show");
              }
            },
          });
        };
      } else {
        console.log(data.text);
        alert("Error retrieving data. Please try again");
      }
    },
  });
}

function disabler(element) {
  element.setAttribute("disabled", "");
}

function showModal() {
  courseDone = true;
  $("#certModal").modal("show");
  modalCourseTitle.innerHTML = courseTitle;
  modifyPdf(
    "https://firebasestorage.googleapis.com/v0/b/iskolearning.appspot.com/o/Certificate.pdf?alt=media&token=a778e26d-e238-410d-a631-ca0973dbd3bd"
  );
}

function goToOverview() {
  window.location.assign(`/course-overview?id=${courseId}`);
}

for (i of stars) {
  i.onmouseover = (e) => {
    let end = false;
    for (j of stars) {
      if (!end) {
        j.classList.remove("far");
        j.classList.add("fas");
      } else {
        j.classList.remove("fas");
        j.classList.add("far");
      }
      if (e.target == j) end = true;
    }
  };
  i.onmouseout = () => {
    if (!starRating) {
      for (j of stars) {
        j.classList.remove("fas");
        j.classList.add("far");
      }
    }
  };
}

function starCount(element) {
  starRating = parseInt(element.getAttribute("count"));
}

function submitReview(element) {
  element.setAttribute("disabled", "");
  console.log(starRating);
  $.ajax({
    url: "../public/php/course-content/addRating.php",
    method: "POST",
    data: {
      review_number: starRating,
      review_text: reviewInput.value,
      course_id: courseId,
    },
    success: function (response) {
      $("#reviewModal").modal("hide");
      showModal();
    },
  });
}

var PDFDocument = PDFLib.PDFDocument;
var rgb = PDFLib.rgb;
var StandardFonts = PDFLib.StandardFonts;

async function modifyPdf(url) {
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaThinFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  const courseTitleCap = courseTitle
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

  const currDate = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const drawDate =
    monthNames[currDate.getMonth()] + " " + currDate.getDate() + ", " + currDate.getFullYear();

  var test1 = document.getElementById("Test");
  var test2 = document.getElementById("Test2");
  var test3 = document.getElementById("Test3");
  var test4 = document.getElementById("Test4");
  test1.innerHTML = currentUser;
  test2.innerHTML = courseTitle.slice(0, 40);
  test3.innerHTML = profName;
  test4.innerHTML = drawDate;

  var width1 = test1.clientWidth + 1;
  var width2 = test2.clientWidth + 1;
  var width3 = test3.clientWidth + 1;
  var width4 = test4.clientWidth + 1;

  firstPage.drawText(currentUser, {
    x: width / 2 - width1 / 2,
    y: height / 2,
    size: 25,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(courseTitleCap, {
    x: width / 2 - width2 / 2,
    y: height / 3,
    size: 25,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(profName, {
    x: width / 2 - width3 / 2,
    y: 70,
    size: 15,
    font: helveticaThinFont,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(drawDate, {
    x: width / 2 - width4 / 2,
    y: 140,
    size: 15,
    font: helveticaThinFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  btnDlCert.onclick = () => {
    download(pdfBytes, `${courseTitle}-Certificate.pdf`, "application/pdf");
  };
}
