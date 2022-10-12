let tickets_node = null;
let tickets_count = 0;

const local = new localSettings();
const paid_checked_value = local.getSetting("gui.showTicketsPaid");
let showPaid = "&paid=false";
if (typeof paid_checked_value !== "undefined") showPaid = "&paid=" + paid_checked_value;

$("#paid_checked").prop("checked", typeof paid_checked_value !== "undefined" ? paid_checked_value == "true" : true);
//when checkbox is updated, update stored value

$("#paid_checked").change(function () {
  //sessionStorage.show_paid = $(this).prop("checked");
  local.putSetting("gui.showTicketsPaid", $(this).prop("checked"));
  showPaid = "&paid=" + $(this).prop("checked");

  loadTable();
});

$("#button_tickets_delete").click(function () {
  var delete_id = [];
  tickets_node.forEach(function (e) {
    delete_id.push(e.data.id);
  });

  let query = "DELETE FROM `data_tickets` WHERE `id` in (" + delete_id.join(", ") + ");";

  $.ajax({
    method: "POST",
    url: local_address + "api/?tickets&query",
    // Passing all the variables
    data: { query: query },
  }).done(function (msg) {
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
});

const loadTable = () => {
  let tickets_data;

  let cat_data = [];
  let status_data = [];
  let user_data = [];

  $.ajax({
    method: "GET",
    url: local_address + "api/?tickets&list" + showPaid,
  }).done(function (msg) {
    tickets_data = JSON.parse(msg);

    tickets_count = Object.keys(tickets_data).length;

    let ticket_status = getAjaxValue("../../api/?query=" + `SELECT * FROM \`data_tickets_status\``, "GET");

    Object.keys(ticket_status).forEach((key) => {
      status_data[ticket_status[key].id] = { status: ticket_status[key].status, color: ticket_status[key].color };
    });

    const tickets_charge = (param) => {
      const parent_element = document.createElement("p");
      parent_element.innerHTML = `$<strong class='currency-table'>${param.data.tickets_charge.slice(0, -3)}</strong> ${param.data.tickets_charge_coin}`;
      return parent_element;
    };

    const tickets_status_render = (param) => {
      const parent_element = document.createElement("p");
      const element = document.createElement("span");
      element.classList.add(`badge`);
      //element.classList.add(`badge-pill`);
      element.classList.add(`badge-${status_data[param.value].color}`);
      element.innerHTML = status_data[param.value].status;
      parent_element.appendChild(element);
      parent_element.setAttribute("style", "font-size: 20px;");
      return parent_element;
    };

    const tickets_created_render = (param) => {
      let created_date = param.value;
      let from_date = moment(created_date).fromNow();
      const parent_element = document.createElement("p");
      const element = document.createElement("span");
      element.classList.add(`badge`);

      if (from_date.match("day ")) element.classList.add(`alert-success`);
      if (from_date.match("seconds")) element.classList.add(`alert-success`);
      if (from_date.match("minute")) element.classList.add(`alert-success`);

      if (from_date.match("days")) element.classList.add(`alert-primary`);
      if (from_date.match("hour")) element.classList.add(`alert-primary`);

      if (from_date.match("month")) element.classList.add(`alert-danger`);

      element.innerHTML = from_date;
      element.title = param.value;
      element.setAttribute("data-type", "tooltip");
      element.setAttribute("data-placement", "right");
      parent_element.appendChild(element);
      parent_element.setAttribute("style", "font-size: 20px;");
      return parent_element;
    };

    const changeRowColor = (element) => {
      if (element.data.tickets_status == 7) return { "background-color": "var(--bs-gray-200)" };
    };

    const onRowSelected = (event) => {
      if (event.api.getSelectedNodes().length == 0) {
        $("#button_tickets_delete").addClass("d-none");
        return false;
      }

      $("#button_tickets_delete").removeClass("d-none");
      $("#button_tickets_delete #text").html(" (" + event.api.getSelectedNodes().length + ")");
      tickets_node = event.api.getSelectedNodes();
    };

    $(function () {
      $('[data-type="tooltip"]').tooltip();
    });

    $("#tickets_count_badge").html(tickets_count);
    tickets_count == 0 ? $("button#button_client_add").hide() : $("button#button_tickets_add").show();

    const columnDefs = [
      { field: "id", hide: true },
      //{ field: "ticket_title", headerCheckboxSelection: true, checkboxSelection: true, editable: true },
      {
        headerName: "Ticket Data",
        children: [
          { headerName: "Client", field: "clients", headerCheckboxSelection: true, checkboxSelection: true },
          { headerName: "CODE", field: "tickets_code", width: 110 },
          { headerName: "Created", field: "tickets_created", cellRenderer: tickets_created_render, width: 120 },
          { headerName: "Assigned User", field: "tickets_assigned_user", width: 110 },
          { headerName: "Status", field: "tickets_status", cellRenderer: tickets_status_render, width: 110 },
          { headerName: "Charge", field: "tickets_charge", cellRenderer: tickets_charge, width: 90, cellStyle: { "text-align": "right" } },
          { headerName: "Warranty", field: "tickets_warranty", width: 110 },
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
    ];

    // specify the data
    category_data = getAjaxValue("../../api/?query=" + `SELECT * FROM \`data_tickets_category\``, "GET");
    Object.keys(category_data).forEach((key) => {
      cat_data[category_data[key].id] = category_data[key].name;
    });

    assigned_user_data = getAjaxValue("../../api/?query=" + `SELECT * FROM \`general_users\``, "GET");

    Object.keys(assigned_user_data).forEach((key) => {
      user_data[assigned_user_data[key].id] = assigned_user_data[key].nickname;
    });

    Object.keys(tickets_data).forEach((key) => {
      clients_data = getAjaxValue("../../api/?query=" + `SELECT * FROM \`data_clients\` WHERE \`id\`=${tickets_data[key].clients}`, "GET")[0];
      tickets_data[key].clients = clients_data.name;
      tickets_data[key].clients_data = clients_data;
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
        case "clients":
          console.log(`Open client modal for (${param.data.id})`);
          generateModal(param.data.clients_data, "client");
          break;
        case "tickets_assigned_user":
          console.log(`Open change assigned user modal for ticket(${param.data.id})`);
          break;
        case "tickets_created":
          $("#ticket_history_modal").modal("show");
          ticket_history_form(param.data);
          console.log(`Open history for ticket(${param.data.id})`);
          //generateModal(param.data.clients_data, "client");
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
      getRowStyle: changeRowColor,
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

    // setup the grid after the page has finished loading
    const gridDiv = document.querySelector("#main_tickets_table");
    gridDiv.innerHTML = "";
    new agGrid.Grid(gridDiv, gridOptions);

    if (jQuery.browser.mobile == false) {
      gridOptions.api.sizeColumnsToFit();
    }

    gridDiv.style.setProperty("height", "81vh");

    $("#tickets_search").on("input", function () {
      //console.log(this.value);
      if (this.value.length >= 3) gridOptions.api.setQuickFilter(this.value);

      if (this.value.length < 3) gridOptions.api.setQuickFilter("");
    });
  });
};

loadTable();

$("form#client_form").submit(function (e) {
  e.preventDefault();
  form_submit("client", $(this));
});

$("#clientmodal").on("hide.bs.modal", function (e) {
  debug("Reload tickets modal selects");
  select2();
});
