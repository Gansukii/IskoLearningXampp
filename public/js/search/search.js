const txtSearchTitle = document.getElementById("txtSearchTitle");
const coursesContainer = document.getElementById("coursesContainer");
const btnBadges = document.getElementsByClassName("badgeDev");
const searchNoData = document.getElementById("searchNoData");
const forumContainer = document.getElementById("forumContainer");
const forumSearchNoData = document.getElementById("forumSearchNoData");
const txtSearchNoData = document.getElementById("txtSearchNoData");
let activeBadge = btnBadges[0];
let coursesElement = [];
let forumElement = [];

const url = new URL(window.location.href);
let searchTxt = url.searchParams.get("key");

txtSearchTitle.innerHTML = searchTxt;
txtSearchNoData.innerHTML = searchTxt;
$.ajax({
  url: "../public/php/search/getSearchForum.php",
  method: "POST",
  data: {
    keyword: searchTxt,
  },
  success: function (response) {
    const data = JSON.parse(response);
    coursesContainer.innerHTML = "";
    if (data.code === 200) {
      const forums = data.result;
      let currDate = new Date(data.date_now);
      for (forumData of forums) {
        console.log(forumData);
        let timeAgo = getTimeAgo(Math.abs(currDate - new Date(forumData.created_datetime)) / 1000);
        const newForumNode = document.createElement("div");
        newForumNode.className = "row mx-0";
        newForumNode.innerHTML = `
              <div class="mx-0 d-flex align-items-center mr-4">
                <div class="row mx-0 w-100 d-block">
                  <div class="col-12 px-0 d-block justify-content-center">
                    <p class="m-0 text-center formInfo formInfoNum">${forumData.upvote_count}</p>
                    <p class="m-0 text-center formInfo">upvotes</p>
                  </div>
                  <div class="col-12 mt-2 mt-sm-4 px-0 d-block">
                    <p class="m-0 text-center formInfo formInfoNum">${forumData.comment_count}</p>
                    <p class="m-0 text-center formInfo">answers</p>
                  </div>
                </div>
              </div>
              <div class="col px-0">
                <div class="row mx-0">
                  <div class="col-12 px-0 mb-1 questionTitle"><a href="answer.html?id=${forumData.forum_id}">${forumData.title}</a></div>
                  <div class="col-12 px-0 d-none d-sm-flex questionBody">
                    ${forumData.text_body}
                  </div>
                </div>
                <div
                  class="col-12 mt-1 px-0 d-block d-sm-flex justify-content-sm-between align-items-center"
                >
                  <div class="col-12 col-sm-6 px-0" id="badgeContainer">
                  </div>

                  <div
                    class="col-12 col-sm-4 px-0 d-flex justify-content-sm-end align-items-center"
                  >
                    <div class="mr-2 avatarForum" style="background: url('${forumData.image_path}') no-repeat center; background-size: cover;"></div>
                    <div class="row mx-0 px-0 d-flex flex-column">
                      <p class="p-0 m-0">${forumData.fullname}</p>
                      <p class="p-0 m-0 txtTimeAgo">${timeAgo}</p>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="col-12 mx-0 px-0"/> `;
        forumContainer.appendChild(newForumNode);
        const tagContainer = newForumNode.querySelector("#badgeContainer");
        if (forumData.tags) {
          for (tag of data.tags) {
            const newTagNode = document.createElement("div");
            newTagNode.className = "badge badge-pill mx-1 mb-2 tag";
            newTagNode.innerHTML = tag;
            tagContainer.appendChild(newTagNode);
          }
        }
        forumElement.push(newForumNode);
      }
    }
  },
});

$.ajax({
  url: "../public/php/search/getSearch.php",
  method: "POST",
  data: {
    keyword: searchTxt,
  },
  success: function (response) {
    const data = JSON.parse(response);
    coursesContainer.innerHTML = "";
    if (data.code === 200) {
      const coursesData = data.result;
      for (courseData of coursesData) {
        console.log(courseData);
        const brief =
          courseData.course_brief.length < 225
            ? courseData.course_brief
            : courseData.course_brief.slice(0, 225) + "...";
        const newCourseNode = document.createElement("div");
        newCourseNode.className = "row mx-0 courseContainer";
        newCourseNode.id = courseData.course_id;

        newCourseNode.innerHTML = `<div class="thumb mx-0 mr-lg-2" style="background: url(${courseData.image_path}) no-repeat center;" onclick="linkThumb(this)"></div>
           <div class="col-12 col-lg-6 py-1 mt-2 mt-lg-0 pr-0 pl-0 pl-lg-2">
             <div class="row mx-0 w-100">
               <div class="col-10 px-0  courseTitle" onclick="linkTitle(this)">${courseData.course_title}</div>
               <div class="col-12 px-0 mb-2 courseProf">Prof. ${courseData.fullname}</div>
               <div class="col-12 px-0 courseBrief">
                 ${brief}
               </div>
             </div>
           </div>
           <hr class="w-75 my-4" />`;
        coursesContainer.appendChild(newCourseNode);
        coursesElement.push(newCourseNode);
        if (!courseData.image_path) {
          newCourseNode.firstElementChild.removeAttribute("style");
        }
      }
    } else {
      searchNoData.classList.remove("d-none");
    }
  },
});

function changePage(element) {
  if (activeBadge === element) {
    return;
  }
  activeBadge.classList.remove("activeBadge");
  activeBadge = element;
  activeBadge.classList.add("activeBadge");

  if (element.id === "all") {
    elArrDisplay(coursesElement);
    elArrDisplay(forumElement);
  }
  if (element.id === "courses") {
    elArrDisplay(coursesElement);
    elArrHide(forumElement);
  }
  if (element.id === "forum") {
    elArrHide(coursesElement);
    elArrDisplay(forumElement);
  }
}

function goToCourse(element) {
  courseId = element.getAttribute("key");
  window.location.assign(`/course.html?id=${courseId}`);
}

function linkThumb(element) {
  goToCourse(element.parentNode.id);
}

function linkTitle(element) {
  goToCourse(element.parentNode.parentNode.parentNode.id);
}

function goToCourse(id) {
  window.open(`../public/course.html?id=${id}`);
}

function elArrDisplay(elementArr) {
  for (element of elementArr) {
    element.classList.remove("d-none");
  }
}

function elArrHide(elementArr) {
  for (element of elementArr) {
    element.classList.add("d-none");
  }
}
