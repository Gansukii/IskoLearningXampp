const courseProgressContainer = document.getElementById("courseProgressContainer");
const ratingContainer = document.getElementById("ratingContainer");
const reviewColumn = document.getElementById("reviewColumn");
const rowReview = document.getElementById("rowReview");
const btnEnroll = document.getElementById("btnEnroll");
const txtCourseTitle = document.getElementById("txtCourseTitle");
const txtCourseProf = document.getElementById("txtCourseProf");
const desContainer = document.getElementById("desContainer");
const accordionContainer = document.getElementById("accordionContainer");
const txtRating = document.getElementById("txtRating");
const reviewsCount = document.getElementById("reviewsCount");
const starContainer = document.getElementById("starContainer");
const reviewBoxStarContainer = document.getElementById("reviewBoxStarContainer");
const txtChapterCount = document.getElementById("txtChapterCount");
const txtStudentCount = document.getElementById("txtStudentCount");
const starsRev = document.getElementsByClassName("starsRev");
const txtPrereq = document.getElementById("txtPrereq");
const reviewsContainer = document.getElementById("reviewsContainer");
// let totalRating = 0;
// let totalReview = 0;
// let finalRating = 0;
let url = new URL(window.location.href);
const courseId = url.searchParams.get("id");

if (document.documentElement.clientWidth < lg) {
  rowReview.appendChild(ratingContainer);
} else reviewColumn.appendChild(ratingContainer);

window.onresize = () => {
  if (document.documentElement.clientWidth < lg) {
    rowReview.appendChild(ratingContainer);
  } else reviewColumn.appendChild(ratingContainer);
};

// firebase
//   .database()
//   .ref("courses/" + courseId)
//   .once("value")
//   .then((snapshot) => {
//     if (snapshot.val() !== null) {
//       btnEnroll.removeAttribute("disabled");
//     } else {
//       alert("Course Not Found!");
//       window.history.back();
//     }
//   });

$.ajax({
  url: "../public/php/course/getEnrollmentInfo.php",
  method: "POST",
  data: { courseId: courseId },
  success: function (response) {
    btnEnroll.removeAttribute("disabled");
    btnEnroll.classList.remove("d-none");
    const data = JSON.parse(response);
    if (data.code === 400) {
      btnEnroll.onclick = () => {
        enrollUser();
      };
    } else {
      let enrollData = data.result[0];
      btnEnroll.removeAttribute("disabled");
      btnEnroll.innerHTML = enrollData.text_status;
      courseProgressContainer.classList.remove("d-none");
      courseProgressContainer.classList.add("d-flex");
      document.getElementById("txtProgressPercent").innerHTML = enrollData.progress_percent;
      document.getElementById("txtCurrentChapter").innerHTML = enrollData.current_chapter;
      document.getElementById("txtChapterName").innerHTML = enrollData.current_chapter_title;
      document.getElementById(
        "courseProgressBar"
      ).style = `width: ${enrollData.progress_percent}%;`;

      btnEnroll.onclick = () => {
        startCourse();
      };
    }
  },
});

function enrollUser() {
  $.ajax({
    url: "../public/php/course/enrollUser.php",
    method: "post",
    data: {
      courseId: courseId,
    },
    success: function (response) {
      const data = JSON.parse(response);
      if (data.code === 200) {
        window.location.reload();
      }
    },
  });
}

// ############################# SHOW DATA ###################################

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
      txtCourseProf.classList.remove("loading");
      txtRating.classList.remove("loadingRating");
      txtStudentCount.classList.remove("loadingRating");
      txtPrereq.classList.remove("loadingRating");
      txtChapterCount.classList.remove("loadingRating");
      desContainer.innerHTML = "";
      txtCourseTitle.innerHTML = courseData.course_title;
      txtCourseProf.innerHTML = "Prof. " + courseData.fullname;
      desContainer.innerHTML = courseData.course_brief;
      txtRating.innerHTML = courseData.overall_rating;
      reviewsCount.innerHTML =
        courseData.review_count + (courseData.review_count < 2 ? " review" : " reviews");
      let starCount = courseData.overall_rating;
      for (let i = 0; i < 5; i++) {
        const star = document.createElement("i");
        star.className = i < starCount ? "fas fa-star star2" : "far fa-star star2";
        starContainer.appendChild(star);
      }
      txtChapterCount.innerHTML = courseData.num_of_chapter;
      txtStudentCount.innerHTML = courseData.total_enrolled_learners;
      txtPrereq.innerHTML = courseData.prerequisite_courses === "" ? "--" : data.prerequisite;
      document.getElementById("txtReviewBoxNum").innerHTML = courseData.overall_rating;
      document.getElementById("txtReviewBoxCount").innerHTML = courseData.review_count;
      for (let i = 0; i < 5; i++) {
        if (i < Math.floor(courseData.overall_rating)) {
          starsRev[i].classList.remove("far");
          starsRev[i].classList.add("fas");
        } else {
          starsRev[i].classList.remove("fas");
          starsRev[i].classList.add("far");
        }
      }
      const starsReview = reviewBoxStarContainer.cloneNode(true);
      starContainer.innerHTML = "";
      starContainer.appendChild(starsReview);
      // for (let i = 0; i < 5; i++) {
      //   const star = document.createElement("i");
      //   star.className = i < starCount ? "fas fa-star star2" : "far fa-star star2";
      //   reviewBoxStarContainer.appendChild(star);
      // }
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
          // console.log(item);
          // const chapterContents = Object.values(data.chapter_contents);
          // for (let i = 0; i < contents; i++) {

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
  url: "../public/php/course/getReviews.php",
  method: "post",
  data: {
    courseId: courseId,
  },
  success: function (response) {
    const data = JSON.parse(response);
    if (data.code === 200) {
      const reviews = data.result;
      totalReview = reviews.length;
      for (review of reviews) {
        // totalRating += review.star_equivalent_id;
        // finalRating = 5 * (totalRating / (totalReview * 5));
        // txtRating.innerHTML = finalRating.toFixed(1);
        // document.getElementById("txtReviewBoxNum").innerHTML = review.toFixed(1);
        // starsRev;
        // for (let i = 0; i < 5; i++) {
        //   if (i < Math.floor(finalRating)) {
        //     starsRev[i].classList.remove("far");
        //     starsRev[i].classList.add("fas");
        //   } else {
        //     starsRev[i].classList.remove("fas");
        //     starsRev[i].classList.add("far");
        //   }
        // }
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
        const dateObj = new Date(review.submission_date);
        const month = dateObj.getMonth() + 1;
        const day = String(dateObj.getDate()).padStart(2, "0");
        const year = dateObj.getFullYear();
        const dateOutput = month + "/" + day + "/" + year;
        console.log(dateOutput);
        const newReviewNode = document.createElement("div");
        newReviewNode.className = "col-12 mt-3";
        newReviewNode.innerHTML = `
            <div class="row py-3 px-4 reviewBox">
              <div class="col-12 d-flex p-0 reviewStar" id="starsContainer">
                <i class="far fa-star star1"></i>
                <i class="far fa-star star2"></i>
                <i class="far fa-star star3"></i>
                <i class="far fa-star star4"></i>
                <i class="far fa-star star5"></i>
                <div class="reviewDate">${dateOutput}</div>
              </div>
              <div class="col-12 p-0 mt-3 text-justify">
                ${review.feedback_text}
              </div>
              <div class="col-12 p-0 mt-1 reviewName">-${review.fullname}</div>
            </div>`;
        reviewsContainer.appendChild(newReviewNode);

        const stars = newReviewNode.querySelectorAll(".fa-star");
        for (let i = 0; i < review.star_equivalent_id; i++) {
          stars[i].classList.remove("far");
          stars[i].classList.add("fas");
        }
      }
    }
  },
});

function startCourse() {
  window.location.assign(`../public/course-overview.html?id=${courseId}`);
}

// <div class="col-12 py-2">
//   <button class="btn w-100">
//     <div class="row d-flex align-items-center">
//       <div>
//         <i class="far fa-play-circle"></i>
//       </div>
//       <div class="px-2 d-flex flex-column">
//         <div class="accordionSubItemText lh-1 text-left">Video 1</div>
//         <div class="text-muted small text-left">3:05</div>
//       </div>
//     </div>
//   </button>
// </div>
