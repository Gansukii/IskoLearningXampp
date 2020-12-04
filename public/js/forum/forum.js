const questionTitle = document.getElementById("questionTitle");
const questionBody = document.getElementById("questionBody");
const btnAskQuestion = document.getElementById("btnAskQuestion");
const questionsContainer = document.getElementById("questionsContainer");
let currDate = new Date();
let isUpvotedArr = [];

$.ajax({
  url: "../public/php/forum/getUpvotesById.php",
  method: "get",
  success: function (response) {
    const data = JSON.parse(response);
    if (data.code === 200) {
      isUpvotedArr = data.is_upvoted.map((rowData) => rowData.forum_id);
    } else console.log(data.text);

    $.ajax({
      url: "../public/php/forum/getQuestion.php",
      method: "get",
      success: function (response) {
        const data = JSON.parse(response);
        if (data.code === 200) {
          showQuestions(data.questions);
        } else alert(data.text);
      },
    });
  },
});

const showQuestions = (questions) => {
  questions.forEach((data) => {
    let questionDate = new Date(data.created_datetime);
    let dateDiff = parseInt((currDate - questionDate) / 1000);
    let hh = Math.floor(dateDiff / 3600);
    dateDiff -= hh * 3600;
    let mm = Math.floor(dateDiff / 60);
    dateDiff -= mm * 60;
    let ss = Math.floor(dateDiff);
    dateDiff -= ss * 1000;
    let timeAgo;
    if (hh < 1 && mm < 1) {
      timeAgo = "few seconds ago";
    } else if (hh < 1) {
      if (mm == 1) timeAgo = "1 minute ago";
      else timeAgo = mm.toString() + " minutes ago";
    } else if (hh <= 24) {
      timeAgo = "1 day ago";
    } else {
      var days = Math.floor(hh / 24);
      timeAgo = days.toString() + " days ago";
    }
    let isUpvoted = isUpvotedArr.includes(data.forum_id) ? "upvoted" : "";

    var node = document.createElement("div");
    node.innerHTML = `<div class='col-12 mb-3'>
              <div class='row mb-3 questionIcons' key=${data.forum_id}>
                <div class='p-0 d-flex align-items-center mr-3 iconToggle ${isUpvoted}' onClick='upvote(this)'>
                  <i class='far fa-caret-square-up mr-1'></i><div>${data.upvote_count}</div>
                </div>
                <div class='d-flex align-items-center iconToggle' onClick='comment(this)'>
                  <i class='far fa-comment mr-1'></i>0
                </div>
              </div>
              <div class='row d-flex align-items-center'>
                <button class='btn avatar' id='avatar'>Av</button>
                <div class='col mx-2'>
                  <div class='row questionName'>${data.fullname}</div>
                  <div class='row questionTime'>${timeAgo}</div>
                </div>
              </div>
              <div class='row mt-1'>
                ${data.text_body}
              </div>
            </div>
            <hr class='mb-1' />`;
    questionsContainer.appendChild(node);
  });
};

// EVENT HANDLERS

function upvote(e) {
  let upvoted;
  if (!e.classList.contains("upvoted")) {
    e.classList.add("upvoted");
    e.lastElementChild.innerHTML = parseInt(e.lastElementChild.innerHTML) + 1;
    upvoted = 1;
  } else {
    e.classList.remove("upvoted");
    e.lastElementChild.innerHTML = parseInt(e.lastElementChild.innerHTML) - 1;
    upvoted = 0;
  }
  $.ajax({
    url: "../public/php/forum/addUpvote.php",
    method: "post",
    data: {
      forumId: parseInt(e.parentNode.getAttribute("key")),
      totalUpvote: parseInt(e.lastElementChild.innerHTML),
      add: upvoted,
    },
    success: function (response) {
      const data = JSON.parse(response);
      if (!data.code === 200) {
        alert(data.text);
      }
    },
  });
}

btnAskQuestion.onclick = () => {
  if (questionTitle.value == "" || questionBody.value == "") {
    alert("Both fields cannot not be empty");
  } else {
    $.ajax({
      url: "../public/php/forum/addQuestion.php",
      method: "post",
      data: {
        questionTitle: questionTitle.value,
        questionBody: questionBody.value,
      },
      success: function (response) {
        const data = JSON.parse(response);
        if (data.code === 200) {
          window.location.assign("../public/forum.html");
        } else alert(data.text);
      },
    });
  }
};
