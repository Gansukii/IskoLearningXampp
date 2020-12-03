const questionTitle = document.getElementById("questionTitle");
const questionBody = document.getElementById("questionBody");
const btnAskQuestion = document.getElementById("btnAskQuestion");
const questionsContainer = document.getElementById("questionsContainer");
let currDate = new Date();

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

    var node = document.createElement("div");
    node.innerHTML = `<div class='col-12 mb-3' key=${data.forum_id}>
              <div class='row mb-3 questionIcons'>
                <div class='d-flex align-items-center mr-3'>
                  <i class='far fa-caret-square-up mr-1'></i>${data.upvote_count}
                </div>
                <div class='d-flex align-items-center'>
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
