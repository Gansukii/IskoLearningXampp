function createDb() {
  $.ajax({
    url: "../public/php/createDb.php",
    success: function (response) {
      console.log(response);
    },
  });
}

window.onload = createDb;
