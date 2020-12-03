const questionTitle = document.getElementById("questionTitle");
const questionBody = document.getElementById("questionBody");
const btnAskQuestion = document.getElementById("btnAskQuestion");

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
