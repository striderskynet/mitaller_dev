$("main_search").on("input", function () {});

function search() {}
toastr.options = {
  positionClass: "toast-top-center",
};

let tickets_node = null;

$("#button_tickets_delete").click(function () {
  var delete_id = [];
  tickets_node.forEach(function (e) {
    delete_id.push(e.data.id);
  });

  let query = "DELETE FROM `data_tickets` WHERE `id` in (" + delete_id.join(", ") + ");";

  $.ajax({
    method: "POST",
    url: "../../api/?tickets&query",
    // Passing all the variables
    data: { query: query },
  }).done(function (msg) {
    apiCalls += 1;
    if (msg.includes("true")) {
      loadTable();
      $("#button_tickets_delete").addClass("d-none");
      toastr["success"]("Success removing tickets from database");
      debug(`Success removing tickets from database`, "success");
    } else {
      toastr["error"]("Error removing tickets from database");
      debug(`Error removing ticketsfrom database`, "error");
    }
  });
  //console.log(query);
});

const local = new localSettings();
const paid_checked_value = local.getSetting("gui.showTicketsPaid");
let showPaid = "&paid=false";

if (typeof paid_checked_value !== "undefined") {
  showPaid = "&paid=" + paid_checked_value;
}

$("#paid_checked").prop("checked", typeof paid_checked_value !== "undefined" ? paid_checked_value == "true" : true);
//when checkbox is updated, update stored value

$("#paid_checked").change(function () {
  //sessionStorage.show_paid = $(this).prop("checked");
  local.putSetting("gui.showTicketsPaid", $(this).prop("checked"));
  showPaid = "&paid=" + $(this).prop("checked");

  loadTable();
});

let tickets_count = 0;

const loadTable = () => {
  let tickets_data;

  let cat_data = [];
  let status_data = [];
  let user_data = [];

  $.ajax({
    method: "GET",
    url: "../../api/?tickets&list" + showPaid,
  }).done(function (msg) {
    // console.log(msg);
    apiCalls += 1;
    tickets_data = JSON.parse(msg);

    tickets_count = Object.keys(tickets_data).length;

    status_query = `SELECT * FROM \`data_tickets_status\``;
    let ticket_status = getAjaxValue("../../api/?query=" + status_query, "GET");

    Object.keys(ticket_status).forEach((key) => {
      status_data[ticket_status[key].id] = { status: ticket_status[key].status, color: ticket_status[key].color };
    });

    const tickets_status_render = (param) => {
      const parent_element = document.createElement("p");
      const element = document.createElement("span");
      element.classList.add(`badge`);
      element.classList.add(`badge-pill`);
      element.classList.add(`badge-${status_data[param.value].color}`);
      element.innerHTML = status_data[param.value].status;
      parent_element.appendChild(element);
      parent_element.setAttribute("style", "font-size: 18px;");
      return parent_element;
    };

    const tickets_manage_render = (param) => {
      const parent_element = document.createElement("p");
      const element = document.createElement("span");
      element.innerHTML = `<button onclick='tickets_modify(${param.data.id})' class='btn btn-sm btn-primary'>Modify</button>`;
      parent_element.appendChild(element);
      return parent_element;
    };

    $("#tickets_count_badge").html(tickets_count);

    if (tickets_count == 0) {
      $("button#button_client_add").hide();
    } else {
      $("button#button_tickets_add").show();
    }

    const columnDefs = [
      { field: "id", hide: true },
      //{ field: "ticket_title", headerCheckboxSelection: true, checkboxSelection: true, editable: true },
      {
        headerName: "Ticket Data",
        children: [
          { headerName: "Client", field: "clients", headerCheckboxSelection: true, checkboxSelection: true },
          { headerName: "Created", field: "tickets_created" },
          { headerName: "Assigned User", field: "tickets_assigned_user" },
          { headerName: "CODE", field: "tickets_code" },
          { headerName: "Status", field: "tickets_status", cellRenderer: tickets_status_render },
          { headerName: "Charge", field: "tickets_charge", width: 110 },
          { headerName: "Warranty", field: "tickets_warranty" },
        ],
      },
      {
        headerName: "Device",
        children: [
          { headerName: "Category", field: "tickets_category", width: 110 },
          { headerName: "Brand", field: "device_brand", width: 110 },
          { headerName: "Model", field: "device_model", width: 110 },
        ],
      },
      //{ field: "manage", cellRenderer: tickets_manage_render },
    ];

    // specify the data
    category_query = `SELECT * FROM \`data_tickets_category\``;
    category_data = getAjaxValue("../../api/?query=" + category_query, "GET");
    Object.keys(category_data).forEach((key) => {
      cat_data[category_data[key].id] = category_data[key].name;
    });

    assigned_user_query = `SELECT * FROM \`general_users\``;
    assigned_user_data = getAjaxValue("../../api/?query=" + assigned_user_query, "GET");

    Object.keys(assigned_user_data).forEach((key) => {
      user_data[assigned_user_data[key].id] = assigned_user_data[key].name;
    });

    Object.keys(tickets_data).forEach((key) => {
      clients_query = `SELECT * FROM \`data_clients\` WHERE \`id\`=${tickets_data[key].clients}`;
      tickets_data[key].clients = getAjaxValue("../../api/?query=" + clients_query, "GET")[0].name;

      tickets_data[key].tickets_category = cat_data[tickets_data[key].tickets_category];

      tickets_data[key].tickets_assigned_user = user_data[tickets_data[key].tickets_assigned_user];
    });

    const rowData = tickets_data;

    function doSomething(param) {
      //console.log(param);
      switch (param.colDef.field) {
        case "tickets_status":
          $("#ticket_status_modal").modal("show");
          status_form(param.data);
          console.log(`Open status modal for ticket(${param.data.id})`);
          break;
        case "tickets_assigned_user":
          console.log(`Open change assigned user modal for ticket(${param.data.id})`);
          break;

        case "tickets_created":
          $("#ticket_history_modal").modal("show");
          ticket_history_form(param.data);
          console.log(`Open history for ticket(${param.data.id})`);
          break;
      }
    }
    class CustomLoadingCellRenderer {
      init(params) {
        this.eGui = document.createElement("div");
        this.eGui.innerHTML = `
              <div class="ag-custom-loading-cell" style="padding-left: 10px; line-height: 25px;">  
                  <i class="fas fa-spinner fa-pulse"></i> 
                  <span>${params.loadingMessage} </span>
              </div>
          `;
      }

      getGui() {
        return this.eGui;
      }
    }

    class CustomNoRowsOverlay {
      init(params) {
        this.eGui = document.createElement("div");
        this.eGui.innerHTML = `
      <div style="height: 70vh" class="mt-10 d-flex justify-content-center align-items-center">
      <div class="text-center">
        <img src="../../../elements/images/components/tickets_component.svg" />
        <h4>Create your first ticket</h4>
        <h6>
          You do not have any ticket yet. <br />
          Press Shift + N or click on button below.
        </h6>
        <button data-toggle="modal" data-target="#ticketsmodal" class="mt-3 btn btn-lg btn-success" style="border-radius: 35px" tabindex="0" type="button" style="margin-top: 15px">
          <i class="fa fa-plus" aria-hidden="true"></i>
        </button>
      </div>
    </div>`;
      }

      getGui() {
        return this.eGui;
      }
    }

    // let the grid know which columns and what data to use
    const gridOptions = {
      columnDefs: columnDefs,
      rowData: rowData,

      defaultColDef: {
        resizable: true,
        sortable: true,
      },

      rowClass: "table-row",
      pagination: true,
      paginationPageSize: 10,
      sideBar: true,
      rowSelection: "multiple",
      onRowSelected: onRowSelected,
      cacheQuickFilter: true,
      editType: "fullRow",
      paginationAutoPageSize: true,
      onCellDoubleClicked: doSomething,
      loadingOverlayComponent: CustomLoadingCellRenderer,
      loadingOverlayComponentParams: {
        loadingMessage: "One moment please...",
      },
      noRowsOverlayComponent: CustomNoRowsOverlay,
      noRowsOverlayComponentParams: {
        noRowsMessageFunc: () => "",
      },
    };

    function onRowSelected(event) {
      if (event.api.getSelectedNodes().length > 0) {
        $("#button_tickets_delete").removeClass("d-none");
        $("#button_tickets_delete #text").html(" (" + event.api.getSelectedNodes().length + ")");
        tickets_node = event.api.getSelectedNodes();
      } else {
        $("#button_tickets_delete").addClass("d-none");
      }
    }

    // setup the grid after the page has finished loading
    const gridDiv = document.querySelector("#main_tickets_table");
    gridDiv.innerHTML = "";
    new agGrid.Grid(gridDiv, gridOptions);

    gridOptions.api.sizeColumnsToFit();
    gridDiv.style.setProperty("height", "81vh");
    //}
  });
};

loadTable();

$("form#client_form").submit(function (e) {
  e.preventDefault();

  var form_submit = $(this);

  const client = {
    name: form_submit[0].client_name.value,
    company: form_submit[0].client_company.value,
    address: form_submit[0].client_address.value,
    phone: form_submit[0].client_phone.value,
    email: form_submit[0].client_email.value,
    info: form_submit[0].client_info.value,
  };

  $.ajax({
    method: "POST",
    url: "../../api/?clients&insert",
    // Passing all the variables
    data: client,
  }).done(function (msg) {
    apiCalls += 1;
    if (msg.includes("true")) {
      //document.location = "./";
      loadTable();
      $("#clientmodal").modal("hide");
      form_submit[0].reset();
    } else {
      toastr["error"]("Error adding client to the DATABASE");
    }
  });
});

function getAjaxValue(URL, type = "GET") {
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

  return result;
}

function tickets_modify(ticket_id) {
  alert(ticket_id);
}

$("#clientmodal").on("hide.bs.modal", function (e) {
  debug("Reload tickets modal selects");
  select2();
});
