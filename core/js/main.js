var idleTime = 0;
var maxIdleTime = 14;

// Detect mobile browser
(function (a) {
  (jQuery.browser = jQuery.browser || {}).mobile =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      a
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      a.substr(0, 4)
    );
})(navigator.userAgent || navigator.vendor || window.opera);

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

function timerIncrement() {
  idleTime = idleTime + 1;
  if (idleTime > maxIdleTime) {
    // 15 minutes

    Cookies.set("lockscreen", "true");
    debug("Locked screen");
    $("#lock_screen_modal").modal({
      backdrop: "static",
      keyboard: false,
    });
    clearInterval(idleTick);
  }
}

function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open("HEAD", url, false);
  http.send();
  if (http.status != 404) return true;
  else return false;
}

class localSettings {
  //constructor() {}
  getSetting(setting) {
    let res = null;

    $.ajax({
      async: false,
      url: local_address + "api/?settings&read&id=" + setting,
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
      url: local_address + "api/?settings&write&id=" + setting + "&value=" + value,
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
    url: local_address + "api/" + URL,
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

      case "inventory_category":
        data.push({ id: res[key].categoryID, text: res[key].name });
        break;

      case "tickets_category":
      case "inventory_supplier":
      case "inventory_brand":
        data.push({ id: res[key].id, text: res[key].name });
        break;
      case "tickets_assigned_user":
        data.push({ id: res[key].id, text: res[key].nickname });
        break;
    }
  });

  return data;
}

const textWhatsapp = (clientPhone) => {
  document.location = "whatsapp://send/?text&app_absent=0&phone=" + clientPhone;
};

const generateModal = (element, type) => {
  $("#modalWindow").remove();

  const generated_modal = $('<div id="modalWindow" class="modal hide fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">');

  var html = `
  <div class="modal-dialog modal-lg">
    <div class="modal-content login-card-body pb-0">
      <div class="modal-header">
        <div class='data-initials' style='background-color: rgb({color}, 1)'>{initials}</div>
        <h4 class='modal-title'>{title}</h4>
        <a href="#" class="close" data-dismiss="modal">×</a>
      </div>
      <div class="modal-body">{content}</div>
      <div class="modal-footer">{footer}</div>
    </div>
  </div>`;

  switch (type) {
    case "client":
      if (element.comments === undefined) element.comments = "";

      var google_maps_url = "https://www.google.com/maps/search/" + encodeURIComponent(element.address);

      var content = `<div><span class='modal-info title'>Company:</span><span class='modal-info data'>${element.company}</span></div>
      <div>
        <span class='modal-info title'>Phone:</span><span class='modal-info data'>${element.phone}</span>
        <button class="ml-5 mb-0 btn btn-sm btn-primary"><i class="fa fa-envelope" aria-hidden="true"></i></button>
        <button onClick="textWhatsapp('${element.phone}')" class="mb-0 btn btn-sm btn-success"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></button>
      </div>
      <div><span class='modal-info title'>Address:</span><span class='modal-info data'><a target="blank" href="${google_maps_url}">${element.address}</a></span></div>
      <div>
        <span class='modal-info title'>Email:</span><span class='modal-info data'><a href="mailto://${element.email}">${element.email}</a></span>
      </div><hr>
      <div class="form-group"><textarea placeholder="Comments" class="form-control" id="update_comments" name="update_comments" rows="6" disabled>${element.comments}</textarea></div>`;

      content += `
      <div class="card collapsed-card">
        <div class="card-header">
        <span id='users_tickets_count' class='card-title badge badge-success'>0</span>
        <h3 class="card-title ms-2">Ticket list </h3>
          <div class="card-tools">
            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-plus"></i></button>
          </div>
        </div>
      
      <div class="card-body ag-theme-material m-0 p-0" id='user_tickets_table' style="display: none;">
      </div>
      </div>`;
      var footer = `<button class="btn btn-primary" data-dismiss="modal">Close</button>`;

      initials = element.name
        .match(/(\b[aA-zZ])?/g)
        .join("")
        /*.match(/(^\S|\S$)?/g)
    .join("")*/
        .toUpperCase();

      html = html.replace("{color}", element.color);
      html = html.replace("{initials}", initials);
      html = html.replace("{title}", element.name);
      html = html.replace("{content}", content);
      html = html.replace("{footer}", footer);
      break;

    default:
      console.log("do nothing...");
      break;
  }

  generated_modal.html(html);
  generated_modal.modal();

  $(document.body).append(generated_modal);

  const columnDefs = [{ field: "id", width: 90, hide: false }, { field: "tickets_code", width: 120 }, { field: "device_brand", width: 115 }, { field: "device_model" }, { field: "tickets_created" }];

  $.ajax({
    method: "POST",
    url: local_address + "api/?query",
    data: { query: `SELECT * FROM \`data_tickets\` WHERE \`clients\` = ${element.id}` },
  }).done(function (msg) {
    debug(`Loading client list from database`, "success");
    //clients_data = JSON.parse(msg);
    // specify the data
    const rowData = msg;
    $("#users_tickets_count").html(rowData.length);

    // let the grid know which columns and what data to use
    const gridOptions = {
      columnDefs: columnDefs,
      rowData: rowData,
      defaultColDef: {
        resizable: true,
        sortable: true,
      },
      rowSelection: "multiple",
      paginationAutoPageSize: true,
    };

    // setup the grid after the page has finished loading
    const gridDiv = document.querySelector("#user_tickets_table");
    gridDiv.innerHTML = "";
    new agGrid.Grid(gridDiv, gridOptions);

    gridOptions.api.sizeColumnsToFit();
    gridDiv.style.setProperty("height", "30vh");
  });
};

const form_submit = (type, form) => {
  var form_submit = form;

  const colorRed = Math.floor(Math.random() * (255 + 1));
  const colorGreen = Math.floor(Math.random() * (255 + 1));
  const colorBlue = Math.floor(Math.random() * (255 + 1));

  const client_generated_color = `${colorRed}, ${colorGreen}, ${colorBlue}`;
  const client = {
    name: form_submit[0].client_name.value,
    company: form_submit[0].client_company.value,
    address: form_submit[0].client_address.value,
    phone: form_submit[0].client_phone.value,
    email: form_submit[0].client_email.value,
    info: form_submit[0].client_info.value,
    color: client_generated_color,
  };

  $.ajax({
    method: "POST",
    url: "../../api/?clients&insert",
    data: client,
  }).done(function (msg) {
    if (msg.includes("true")) {
      //document.location = "./";
      loadTable();
      $("#clientmodal").modal("hide");
      form_submit[0].reset();
      toastr["success"]("Success adding client to the database");
      debug(`Success adding client to the database`, "success");
    } else {
      console.log(msg);
      toastr["error"]("Error adding client to the database");
      debug(`Error adding client to the database`, "error");
    }
  });
};

const getAjaxValue = (URL, type = "GET") => {
  let result = null;
  $.ajax({
    async: false,
    method: type,
    url: URL,
    dataType: "json",
    contentType: "application/json",
    success: function (msg) {
      result = msg;
    },
  });

  api_call_count++;
  $("b#api_call_count").html(api_call_count);

  return result;
};

var today = new Date();
var DD = String(today.getDate()).padStart(2, "0");
var MM = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var YYYY = today.getFullYear();
var hh = today.getHours();
var mm = today.getMinutes();
var ss = today.getSeconds();
if (ss < 10) ss = `0` + ss;
today = `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;

var lastChatTick;
const tick = () => {
  query = "../../api/?query=" + `SELECT user_sender, count(*) as amount FROM \`internal_chat_messages\` WHERE \`user_receiver\` = ${user_session_id} AND \`is_read\` = "0" GROUP BY \`user_sender\``;
  chats = getAjaxValue(query, "GET");
  //console.log(today);
  //console.log("Chats:", chats, query);

  var recentMessagesBadge = $("#recentMessagesBadge");
  var recentMessagesList = $("#recentMessagesList");

  if (JSON.stringify(lastChatTick) != JSON.stringify(chats)) {
    lastChatTick = chats;

    recentMessagesBadge.html(chats.length);
    if (chats.length > 0) recentMessagesBadge.show();
    if (chats.length > 0) generateMessagesList(recentMessagesList);
  }

  //console.log(lastChatTick);
};

const generateMessagesList = (e) => {
  console.log("Generating messages list...");
  e.html("");

  var msgListEnd = $(`<div class="dropdown-divider"></div><a href="#" class="dropdown-item dropdown-footer">See All Messages</a>`);
  var msgList = `<a href="#" class="dropdown-item">
                    <div class="media">
                        <img src="../../elements/uploaded/users/no_avatar.png" alt="{user_name}" class="img-size-50 mr-3 img-circle">
                        <div class="media-body">
                            <h3 class="dropdown-item-title">
                                {nickname}
                                <span class="float-right text-sm text-danger"><i class="fas fa-star"></i></span>
                            </h3>
                            <p class="text-sm">{last_message}</p>
                            <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> {last_message_date}</p>
                        </div>
                    </div>
                  </a>
                  <div class="dropdown-divider"></div>`;

  Object.keys(lastChatTick).forEach((key) => {
    query = "../../api/?query=" + `SELECT * FROM \`general_users\` WHERE \`id\` = ${lastChatTick[key].user_sender} LIMIT 1`;
    user = getAjaxValue(query, "GET");

    query = "../../api/?query=" + `SELECT message, datetime FROM \`internal_chat_messages\` WHERE \`user_receiver\` = ${user_session_id} ORDER BY \`id\` DESC LIMIT 1`;
    last_message = getAjaxValue(query, "GET")[0];

    // console.log(last_message);
    Object.keys(user[0]).forEach((key1) => {
      msgList = msgList.replace(`{` + key1 + `}`, user[0][key1]);
    });

    msgList = msgList.replace(`{last_message}`, last_message.message);
    msgList = msgList.replace(`{last_message_date}`, last_message.datetime);

    //console.log(user, query, msgList);
    e.append($(msgList));
  });

  e.append(msgListEnd);
};

$(document).ready(function () {
  debug("Initializing system...");
  var idleInterval = setInterval(timerIncrement, 60000); // 1 minute
  var idleTick = setInterval(tick, 3000); // 1 minute

  $("#nav-link-" + pos).addClass("active");

  // Check Cookies
  if (Cookies.get("min_sidebar") == "min") $("body").toggleClass("sidebar-collapse");
  if (Cookies.get("lockscreen") == "true") {
    $("#lock_screen_modal").modal({
      backdrop: "static",
      keyboard: false,
    });
    clearInterval(idleInterval);
    clearInterval(idleTick);
  }

  debug("Loading cookies info... done.");
  // Increment the idle time counter every minute.

  debug(`Initializing lockscreen counter, set to ${maxIdleTime + 1} minutes... done.`);

  // Zero the idle timer on mouse movement.
  $(this).mousemove(function (e) {
    idleTime = 0;
  });
  $(this).keypress(function (e) {
    idleTime = 0;
  });

  $('[data-widget="pushmenu"]').click(function () {
    if (Cookies.get("min_sidebar") == "min") {
      Cookies.set("min_sidebar", "max");
      return;
    }

    Cookies.set("min_sidebar", "min");
  });

  debug(`Initializing tooltip system... done`);
});
