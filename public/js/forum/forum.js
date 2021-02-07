const questionTitle = document.getElementById("questionTitle");
const questionBody = document.getElementById("questionBody");
const btnAskQuestion = document.getElementById("btnAskQuestion");
const questionsContainer = document.getElementById("questionsContainer");
const tagsContainer = document.getElementById("tagsContainer");
const questionTags = document.getElementById("questionTags");
const tagSearchContainer = document.getElementById("tagSearchContainer");
const tagsPaperContainer = document.getElementById("tagsPaperContainer");
let currDate = new Date();
let isUpvotedArr = [];
let questionsArr = [];
let dbTags = [];
let tags = [];
let selectedSortTag = document.getElementById("tagAll");

$.ajax({
  url: "../public/php/forum/getTags.php",
  method: "get",
  success: function (response) {
    const data = JSON.parse(response);
    if (data.code === 200) {
      for (tag of data.tags) {
        dbTags.push(tag);
      }
      localStorage.setItem("tags", dbTags);

      for (dataTag of dbTags) {
        let searchTagItem = document.createElement("div");
        searchTagItem.className = "p-1 d-none searchTagItem";
        searchTagItem.setAttribute("onclick", "addTag(this,'container')");
        searchTagItem.innerHTML = dataTag.tag_text;
        tagSearchContainer.appendChild(searchTagItem);
        let selectTag = document.createElement("div");
        selectTag.className = "badge badge-pill mx-1 mb-2 tagSelect";
        selectTag.id = dataTag.tag_id;
        selectTag.innerHTML = `<span class="badgeDelete" onclick="sortByTags(this)">${dataTag.tag_text}</span>`;
        tagsPaperContainer.appendChild(selectTag);
      }
    } else {
      localStorage.setItem("tags", []);
      console.log(data.text);
    }
  },
});

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
        // console.log(response);
        const data = JSON.parse(response);
        if (data.code === 200) {
          questionsArr = data.questions;
          showQuestions(data.questions, questionsContainer);
        } else alert(data.text);
      },
    });
  },
});

const showQuestions = (questions, container) => {
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
    } else if (hh <= 48) {
      timeAgo = "1 day ago";
    } else {
      // console.log(hh);
      var days = Math.floor(hh / 24);
      timeAgo = days.toString() + " days ago";
    }
    let isUpvoted = isUpvotedArr.includes(data.forum_id) ? "upvoted" : "";

    var node = document.createElement("div");
    node.innerHTML = `<div class='col-12 mb-3'>
              <div class='row mb-3 questionIcons' key=${data.forum_id} time=${dateDiff}>
                <div class='p-0 d-flex align-items-center mr-3 iconToggle ${isUpvoted}' onClick='upvote(this)'>
                  <i class='far fa-caret-square-up mr-1'></i><div>${data.upvote_count}</div>
                </div>
                <div class='d-flex align-items-center iconToggle' onClick='comment(this)'>
                  <i class='far fa-comment mr-1'></i>${data.comment_count}
                </div>
              </div>
              <div class='row d-flex align-items-center'>
                <button class='btn avatar' id='avatar' style="background: url('${data.image_path}') no-repeat center; background-size: cover;"></button>
                <div class='col mx-2'>
                  <div class='row questionName'>${data.fullname}</div>
                  <div class='row questionTime'>${timeAgo}</div>
                </div>
              </div>
              <div class='row mt-1 questionTitle'>
                ${data.title}
              </div>
              <div class='row mt-1'>
                ${data.text_body}
              </div>
              <div class="col-12 mt-2 col-sm-6 px-0" id="badgeContainer"></div>
            </div>
            <hr class='mb-1' />`;
    const tagContainer = node.querySelector("#badgeContainer");
    if (data.tags) {
      for (tag of data.tags) {
        const newTagNode = document.createElement("div");
        newTagNode.className = "badge badge-pill mx-1 mb-2 tag";
        newTagNode.innerHTML = tag;
        tagContainer.appendChild(newTagNode);
      }
    }
    container.appendChild(node);
  });
};

// EVENT HANDLERS

function upvote(e) {
  let upvoted;
  let forumIdentifier = questionsArr.filter(
    (data) => data.forum_id == e.parentNode.getAttribute("key")
  );

  // console.log(forumIdentifier[0].upvote_count);
  if (!e.classList.contains("upvoted")) {
    e.classList.add("upvoted");
    forumIdentifier[0].upvote_count = parseInt(forumIdentifier[0].upvote_count) + 1;
    e.lastElementChild.innerHTML = forumIdentifier[0].upvote_count;
    upvoted = 1;
  } else {
    e.classList.remove("upvoted");
    forumIdentifier[0].upvote_count = parseInt(forumIdentifier[0].upvote_count) - 1;
    e.lastElementChild.innerHTML = forumIdentifier[0].upvote_count;
    upvoted = 0;
  }
  // console.log(forumIdentifier[0].upvote_count);
  $.ajax({
    url: "../public/php/forum/addUpvote.php",
    method: "post",
    data: {
      forumId: parseInt(e.parentNode.getAttribute("key")),
      totalUpvote: forumIdentifier[0].upvote_count,
      add: upvoted,
    },
    success: function (response) {
      console.log(forumIdentifier[0].upvote_count);

      // const data = JSON.parse(response);
      // if (!data.code === 200) {
      //   alert(data.text);
      // }
      // $.ajax({
      //   url: "../public/php/forum/getQuestionDetails.php",
      //   method: "get",
      //   success: function (response) {
      //     // console.log(response);
      //     const data = JSON.parse(response);
      //     if (data.code === 200) {
      //       // questionsArr = [];
      //       // questionsArr = data.questions;
      //     }
      //   },
      // });
      // console.log(questionsArr[0].upvote_count);
    },
  });
}

function comment(e) {
  let forumId = e.parentNode.getAttribute("key");
  let time = e.parentNode.getAttribute("time");
  let isUp = 0;
  if (e.previousElementSibling.classList.contains("upvoted")) isUp = 1;
  console.log(isUp);
  window.location.assign(`../public/answer.html?id=${forumId}&t=${time}&isUp=${isUp}`);
}

btnAskQuestion.onclick = () => {
  if (questionTitle.value == "" || questionBody.value == "" || tags.length < 1) {
    alert("all fields cannot not be empty");
  } else {
    btnAskQuestion.setAttribute("disabled", "");
    $.ajax({
      url: "../public/php/forum/addQuestion.php",
      method: "post",
      data: {
        questionTitle: questionTitle.value,
        questionBody: questionBody.value,
        tags: tags,
      },
      success: function (response) {
        // console.log(response);
        const data = JSON.parse(response);
        if (data.code === 200) {
          window.location.assign("../public/forum.html");
        } else {
          alert(data.text);
          btnAskQuestion.removeAttribute("disabled");
        }
      },
    });
  }
};

questionTags.onkeyup = (e) => {
  if (e.key === "Enter" || e.keyCode === 13) {
    addTag(e.target, "input");
    // tags.push(questionTags.value);
    // let newTag = document.createElement("span");
    // newTag.className = "badge badge-pill mx-1 mb-2 tagItem d-flex flex-row";
    // newTag.innerHTML = `<div>${questionTags.value}</div><span class="badgeDelete ml-1" onclick="deleteTag(this)">&times;</span>`;
    // tagsContainer.appendChild(newTag);
    // questionTags.value = "";
  } else {
    if (questionTags.value === "") tagSearchContainer.classList.add("d-none");
    else tagSearchContainer.classList.remove("d-none");

    let tagItems = document.getElementsByClassName("searchTagItem");
    for (let i = 0; i < tagItems.length; i++) {
      if (tagItems[i].textContent.toUpperCase().indexOf(questionTags.value.toUpperCase()) > -1) {
        tagItems[i].classList.remove("d-none");
      } else tagItems[i].classList.add("d-none");
    }
  }
};

function deleteTag(element) {
  // console.log(element.previousSibling.textContent);
  let remove = false;
  tags = tags.filter((data) => {
    if (data !== element.previousSibling.textContent || remove) {
      return data;
    } else {
      remove = true;
    }
  });
  element.parentNode.remove();
  console.log(tags);
}
function addTag(element, action) {
  let value = action === "input" ? element.value : element.textContent;
  tags.push(value);
  let newTag = document.createElement("span");
  newTag.className = "badge badge-pill mx-1 mb-2 tagItem d-flex flex-row";
  newTag.innerHTML = `<div>${value}</div><span class="badgeDelete ml-1" onclick="deleteTag(this)">&times;</span>`;
  tagsContainer.appendChild(newTag);
  questionTags.value = "";
  tagSearchContainer.classList.add("d-none");
  // console.log(tags);
}

function sortByTags(element) {
  selectedSortTag.classList.remove("tagSelected");
  element.parentNode.classList.add("tagSelected");
  selectedSortTag = element.parentNode;
  if (element === selectedSortTag) {
    return;
  }
  if (element.textContent !== "all") {
    questionsContainer.classList.add("d-none");
    $.ajax({
      url: "../public/php/forum/sortQuestionByTag.php",
      method: "post",
      data: {
        tag_id: element.parentNode.id,
      },
      success: function (response) {
        questionsContainerSorted.innerHTML = "";
        const data = JSON.parse(response);
        if (data.code === 200) {
          showQuestions(data.questions, questionsContainerSorted);
        } else {
          console.log(data.text);
          questionsContainerSorted.innerHTML = "no data found";
        }
      },
    });
    // document.getElementById("spinnerContainer").classList.add("d-flex");
    // getSortedQuestion(element.textContent, userUpvotesArr);
  } else {
    questionsContainer.classList.remove("d-none");
    // questionsContainerSorted.innerHTML = "";
  }
}
