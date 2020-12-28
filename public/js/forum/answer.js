const questionContainer = document.getElementById("questionContainer");
const answersContainer = document.getElementById("answersContainer");
const commentBody = document.getElementById("commentBody");
const btnSubmitAns = document.getElementById("btnSubmitAns");

let url = new URL(window.location.href);
let forumId = url.searchParams.get("id");
let time = Math.abs(parseInt(url.searchParams.get("t")));
let isUpvoted;
let upvoteCount = 0;
// let upvoteCounteAnswer = 0;
let isUpvotedAnswerArr = [];

$.ajax({
  url: "../public/php/forum/answer/getIsUpvotedByIdAnswer.php",
  method: "post",
  data: {
    forumId: forumId,
  },
  success: function (response) {
    const data = JSON.parse(response);
    if (data.code === 200) {
      isUpvoted = data.upvoted === 1 ? true : false;
    } else console.log(data.text);
  },
});

$.ajax({
  url: "../public/php/forum/answer/getQuestionAnswer.php",
  method: "get",
  data: {
    forumId: forumId,
  },
  success: function (response) {
    const data = JSON.parse(response);
    if (data.code === 200) {
      upvoteCount = data.question[0].upvote_count;
      showQuestions(data.question[0]);
    } else alert(data.text);
  },
});

$.ajax({
  url: "../public/php/forum/answer/getUpvotesByIdAnswer.php",
  method: "get",
  success: function (response) {
    const data = JSON.parse(response);
    if (data.code === 200) {
      isUpvotedAnswerArr = data.is_upvoted.map((rowData) => rowData.answer_id);
    }
    $.ajax({
      url: "../public/php/forum/answer/getAnswer.php",
      method: "post",
      data: {
        forumId: forumId,
      },
      success: function (response) {
        const data = JSON.parse(response);
        if (data.code === 200) {
          showAnswers(data.answers);
        }
      },
    });
  },
});

const showQuestions = (question) => {
  let timeAgo = getTimeAgo(time);
  let upVoted = isUpvoted ? "upvoted" : "";

  questionContainer.innerHTML = `
    <div class='row d-flex align-items-center'>
                <button class='btn avatar' id='avatar'>Av</button>
                <div class='col mx-2'>
                  <div class='row questionName'>${question.fullname}</div>
                  <div class='row questionTime'>${timeAgo}</div>
                </div>
              </div>
              <div class='row mt-1'>
                ${question.text_body}
              </div>

              <div class='row mt-3 mt-lg-4 questionIcons'>
                <div class='d-flex align-items-center mr-3 iconToggle ${upVoted}' onClick='upvote(this)'>
                  <i class='far fa-caret-square-up mr-1'></i><div>${question.upvote_count}</div>
                </div>
                <div class='d-flex align-items-center'>
                  <i class='far fa-comment mr-1'></i>${question.comment_count}
                </div>
              </div>`;
};

function upvote(e) {
  let upvoted;
  if (!e.classList.contains("upvoted")) {
    e.classList.add("upvoted");
    upvoteCount++;
    e.lastElementChild.innerHTML = upvoteCount;

    upvoted = 1;
  } else {
    e.classList.remove("upvoted");
    upvoteCount--;
    e.lastElementChild.innerHTML = upvoteCount;
    upvoted = 0;
  }
  $.ajax({
    url: "../public/php/forum/addUpvote.php",
    method: "post",
    data: {
      forumId: forumId,
      totalUpvote: upvoteCount,
      add: upvoted,
    },
    success: function (response) {
      const data = JSON.parse(response);
      if (!data.code === 200) {
        console.log(data.text);
      }
    },
  });
}

const showAnswers = (data) => {
  let numAnswers = data.length;
  document.getElementById("txtAnswers").innerHTML =
    numAnswers + (numAnswers < 2 ? " Answer" : " Answers");
  data.forEach((answer) => {
    let currDate = new Date();
    let questionDate = new Date(answer.answered_datetime);
    let dateDiff = parseInt((currDate - questionDate) / 1000);
    let answerTimeAgo = getTimeAgo(dateDiff);
    let node = document.createElement("div");
    let isUpvoted = isUpvotedAnswerArr.includes(answer.answer_id)
      ? "upvoted"
      : "";
    node.innerHTML = `<div class="col-12 mb-3">
        <div class="row mb-4 questionIcons">
          <div class="d-flex align-items-center iconToggle ${isUpvoted}" onClick={upvoteAnswer(this,${answer.answer_id})}>
            <i class="far fa-caret-square-up mr-1"></i><div>${answer.upvote_count}</div>
          </div>
        </div>
        <div class="row d-flex align-items-center">
          <button class="btn avatar" id="avatar">Av</button>
          <div class="col mx-2">
            <div class="row questionName">${answer.fullname}</div>
            <div class="row questionTime">${answerTimeAgo}</div>
          </div>
        </div>
        <div class="row mt-1">
          ${answer.text_content}
        </div>
      </div>
      <hr class="mb-1" />`;
    answersContainer.appendChild(node);
  });
};

function upvoteAnswer(e, key) {
  let upvoted;

  if (!e.classList.contains("upvoted")) {
    e.classList.add("upvoted");
    console.log();
    // upvoteCount++;
    e.lastElementChild.innerHTML = parseInt(e.lastElementChild.textContent) + 1;
    upvoted = 1;
  } else {
    e.classList.remove("upvoted");
    // upvoteCount--;
    e.lastElementChild.innerHTML = parseInt(e.lastElementChild.textContent) - 1;
    upvoted = 0;
  }
  $.ajax({
    url: "../public/php/forum/answer/addUpvoteAnswer.php",
    method: "post",
    data: {
      forumId: forumId,
      answerId: key,
      totalUpvote: 0,
      add: upvoted,
    },
    success: function (response) {
      const data = JSON.parse(response);
      if (!data.code === 200) {
        console.log(data.text);
      }
    },
  });
}

btnSubmitAns.onclick = () => {
  commentBody.innerHTML = "";
  $.ajax({
    url: "../public/php/forum/answer/addAnswer.php",
    method: "post",
    data: {
      forumId: forumId,
      textContent: commentBody.value,
    },
    success: function (response) {
      const data = JSON.parse(response);
      if (data.code === 200) location.reload();
      else alert(data.text);
    },
  });
};

function getTimeAgo(timeDiff) {
  let hh = Math.floor(timeDiff / 3600);
  timeDiff -= hh * 3600;
  let mm = Math.floor(timeDiff / 60);
  timeDiff -= mm * 60;
  let ss = Math.floor(timeDiff);
  timeDiff -= ss * 1000;
  let timeAgo;
  if (hh < 1 && mm < 1) {
    timeAgo = "few seconds ago";
  } else if (hh < 1) {
    if (mm == 1) timeAgo = "1 minute ago";
    else timeAgo = mm.toString() + " minutes ago";
  } else if (hh <= 48) {
    timeAgo = "1 day ago";
  } else {
    var days = Math.floor(hh / 24);
    timeAgo = days.toString() + " days ago";
  }
  return timeAgo;
}
