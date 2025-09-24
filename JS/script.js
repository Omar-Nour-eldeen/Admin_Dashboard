$(document).ready(function () {
  // ----------------- Theme -----------------
  if (localStorage.getItem("theme") === "dark") {
    $("body").addClass("dark-mode");
    $("#toggleTheme i").removeClass("fa-moon").addClass("fa-sun");
    $(".card").removeClass("shadow-lg");
    $(".sidebar").removeClass("shadow-lg");
    $("table").removeClass("table-hover").addClass("table-dark");
  } else {
    $("body").removeClass("dark-mode");
    $("#toggleTheme i").removeClass("fa-sun").addClass("fa-moon");
    $(".card").addClass("shadow-lg");
    $(".sidebar").addClass("shadow-lg");
    $("table").removeClass("table-dark").addClass("table-hover");
  }

  $("#toggleTheme").click(function () {
    $("body").toggleClass("dark-mode");

    if ($("body").hasClass("dark-mode")) {
      localStorage.setItem("theme", "dark");
      $("#toggleTheme i").removeClass("fa-moon").addClass("fa-sun");
      $(".card").removeClass("shadow-lg");
      $(".sidebar").removeClass("shadow-lg");
      $("table").removeClass("table-hover").addClass("table-dark");
    } else {
      localStorage.setItem("theme", "light");
      $("#toggleTheme i").removeClass("fa-sun").addClass("fa-moon");
      $(".card").addClass("shadow-lg");
      $(".sidebar").addClass("shadow-lg");
      $("table").removeClass("table-dark").addClass("table-hover");
    }
  });

  // ----------------- Dashboard Stats -----------------
  function loadDashboardStats() {
    let usersData = JSON.parse(localStorage.getItem("users"));
    let postsData = JSON.parse(localStorage.getItem("posts"));
    let commentsData = JSON.parse(localStorage.getItem("comments"));
    if (usersData && usersData.length > 0) {
      $("#usersCount").text(usersData.length);
    } else {
      $.get("https://jsonplaceholder.typicode.com/users", function (data) {
        $("#usersCount").text(data.length);
        localStorage.setItem("users", JSON.stringify(data));
      });
    }


    if (postsData && postsData.length > 0) {
      $("#postsCount").text(postsData.length);
    } else {
      $.get("https://jsonplaceholder.typicode.com/posts", function (data) {
        $("#postsCount").text(data.length);
        localStorage.setItem("posts", JSON.stringify(data));
      });
    }

    if (commentsData && commentsData.length > 0) {
      $("#commentsCount").text(commentsData.length);
    } else {
      $.get("https://jsonplaceholder.typicode.com/comments", function (data) {
        $("#commentsCount").text(data.length);
        localStorage.setItem("comments", JSON.stringify(data));
      });
    }
  }
  loadDashboardStats();
});
