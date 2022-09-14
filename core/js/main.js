var idleTime = 0;
var maxIdleTime = 14;

const debug = (message, type) => {
  var color = null;
  switch (type) {
    default:
      color = "#4e73df";
      break;
    case "success":
      color = "#bada55";
      break;
    case "danger":
      color = "#e74a3b";
      break;
    case "warning":
      color = "#f6c23e";
      break;
    case "info":
      color = "#d3d3d3";
      break;
  }

  console.log(`%c ${github_shortname} v${github_version}: ${message}`, "color:" + color);
};

Mousetrap.bind("plus+t", function (e) {
  $("#ticketsmodal").modal("show");
});

Mousetrap.bind("plus+c", function (e) {
  $("#clientmodal").modal("show");
});

$(document).ready(function () {
  debug("Initializing system...");

  $("#nav-link-" + pos).addClass("active");

  // Check Cookies
  if (Cookies.get("min_sidebar") == "min") $("body").toggleClass("sidebar-collapse");
  if (Cookies.get("lockscreen") == "true") {
    $("#lock_screen_modal").modal({
      backdrop: "static",
      keyboard: false,
    });
  }

  debug("Loading cookies info... done.");
  // Increment the idle time counter every minute.
  var idleInterval = setInterval(timerIncrement, 60000); // 1 minute
  debug(`Initializing lockscreen counter, set to ${maxIdleTime + 1} minutes... done.`);

  // Zero the idle timer on mouse movement.
  $(this).mousemove(function (e) {
    idleTime = 0;
  });
  $(this).keypress(function (e) {
    idleTime = 0;
  });

  $('[data-widget="pushmenu"]').click(function () {
    if (!Cookies.get("min_sidebar")) {
      Cookies.set("min_sidebar", "min");
    } else if (Cookies.get("min_sidebar") == "min") {
      Cookies.set("min_sidebar", "max");
    } else {
      Cookies.set("min_sidebar", "min");
    }
  });

  debug(`Initializing tooltip system... done`);
});

function timerIncrement() {
  idleTime = idleTime + 1;
  if (idleTime > maxIdleTime) {
    // 15 minutes

    Cookies.set("lockscreen", "true");
    $("#lock_screen_modal").modal({
      backdrop: "static",
      keyboard: false,
    });
  }
}

class localSettings {
  //constructor() {}
  getSetting(setting) {
    let res = null;

    $.ajax({
      async: false,
      url: "../../api/?settings&read&id=" + setting,
      type: "GET",
      success: function (msg) {
        res = msg.setting_value;
      },
    });

    return res;
  }

  putSetting(setting, value) {
    let res = null;

    $.ajax({
      async: false,
      url: "../../api/?settings&write&id=" + setting + "&value=" + value,
      type: "GET",
      success: function (msg) {
        if (msg.includes("true")) {
          //toastr["error"]("Error adding client to the DATABASE");
        } else {
          toastr["error"](`Error changing config "${setting}" to "${value}"`);
        }
      },
    });

    return true;
  }
}

function getData(URL, TYPE) {
  let res = {};

  $.ajax({
    async: false,
    url: "../../api/" + URL,
    type: "GET",
    success: function (msg) {
      res = msg;
    },
  });

  let data = [];
  Object.keys(res).forEach((key) => {
    switch (TYPE) {
      default:
      case "client":
        data.push({ id: res[key].id, text: res[key].name + " " + res[key].phone });
        break;

      case "tickets_category":
      case "tickets_assigned_user":
        data.push({ id: res[key].id, text: res[key].name });
        break;
    }
  });

  return data;
}
