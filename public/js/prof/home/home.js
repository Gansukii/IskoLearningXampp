const btnNewCourse = document.getElementById("btnNewCourse");
const tabItems = document.getElementsByClassName("tabItem");
let activeTab = document.getElementsByClassName("tabItem")[0];

btnNewCourse.onclick = () => {
  window.location.assign("../professor/course-creation.html");
};

function changePage(element) {
  if (activeTab === element) {
    return;
  }
  activeTab.classList.remove("activeTab");
  activeTab = element;
  activeTab.classList.add("activeTab");
}
