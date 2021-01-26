const txtSearchTitle = document.getElementById("txtSearchTitle");
const url = new URL(window.location.href);
let urlCategory = url.searchParams.get("search");
let category = "";

switch (urlCategory) {
  case "programming":
    category = "programming";
    break;
  case "ui ux design":
    category = "ui_ux_design";
    break;

  case "data science":
    category = "data_science";
    break;

  case "machine learning":
    category = "machine_learning";
    break;

  case "networking":
    category = "networking";
    break;

  case "data structure":
    category = "data_structure";
    break;

  case "database":
    category = "database";
    break;

  case "others":
    category = "others";
    break;
}

txtSearchTitle.innerHTML = urlCategory;
$.ajax({
  url: "../public/php/category/searchCategory.php",
  method: "post",
  data: { category: category },
  success: function (response) {
    coursesContainer.innerHTML = "";
    let data = JSON.parse(response);
    if (data.code === 200) {
      const courses = data.result;
      for (course of courses) {
        const brief =
          course.course_brief.length < 225
            ? course.course_brief
            : course.course_brief.slice(0, 225) + "...";
        const newCourseNode = document.createElement("div");
        newCourseNode.className = "row mx-0 courseContainer";
        newCourseNode.id = course.course_id;

        newCourseNode.innerHTML = `<div class="thumb mx-0 mr-lg-2" style="background: url(${course.image_path}) no-repeat center;" onclick="linkThumb(this)"></div>
           <div class="col-12 col-lg-6 py-1 mt-2 mt-lg-0 pr-0 pl-0 pl-lg-2">
             <div class="row mx-0 w-100">
               <div class="col-10 px-0  courseTitle" onclick="linkTitle(this)">${course.course_title}</div>
               <div class="col-12 px-0 mb-2 courseProf">Prof. ${course.fullname}</div>
               <div class="col-12 px-0 courseBrief">
                 ${brief}
               </div>
             </div>
           </div>
           <hr class="w-75 my-4" />`;
        coursesContainer.appendChild(newCourseNode);
        if (!course.image_path) {
          newCourseNode.firstElementChild.removeAttribute("style");
        }
      }
    } else {
      searchNoData.classList.remove("d-none");
    }
  },
});

function linkThumb(element) {
  goToCourse(element.parentNode.id);
}

function linkTitle(element) {
  goToCourse(element.parentNode.parentNode.parentNode.id);
}
function goToCourse(id) {
  window.open(`/WebProjXampp/public/course.html?id=${id}`);
}
