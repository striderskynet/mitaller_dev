toastr.options = {
  positionClass: "toast-top-center",
};

let clients_node = null;
$("#button_client_delete").click(function () {
  var delete_id = [];
  clients_node.forEach(function (e) {
    delete_id.push(e.data.id);
  });

  let query = "DELETE FROM `data_clients` WHERE `id` in (" + delete_id.join(", ") + ");";

  $.ajax({
    method: "POST",
    url: "../../api/?clients&query",
    // Passing all the variables
    data: { query: query },
  }).done(function (msg) {
    if (msg.includes("true")) {
      loadTable();
      $("#button_client_delete").addClass("d-none");
      toastr["success"]("Success removing clients from database");
      debug(`Success removing clients from database`, "success");
    } else {
      toastr["error"]("Error removing clients from database");
      debug(`Error removing clients from database`, "error");
    }
  });
  //console.log;
});
const avatarRenderer = (param) => {
  let name = param.data.name;
  name = name
    .match(/(\b[aA-zZ])?/g)
    .join("")
    /*.match(/(^\S|\S$)?/g)
    .join("")*/
    .toUpperCase();

  const parent_element = document.createElement("div");
  parent_element.classList.add("data-initials");
  parent_element.innerHTML = name;

  parent_element.style.backgroundColor = `rgba(${param.data.color}, 1)`;

  return parent_element;
};

const clients_manage_render = (param) => {
  const parent_element = document.createElement("p");
  const element = document.createElement("span");
  element.setAttribute("data-type", "tooltip");
  element.setAttribute("title", "Modify");
  element.innerHTML = `<button onclick='category_modify(${param.data.id})' class='btn btn-sm'><i class="fa text-primary fa-pencil-square" aria-hidden="true"></i></button>`;
  parent_element.appendChild(element);
  return parent_element;
};

const loadTable = () => {
  let clients_data;
  let clients_count = 0;

  $.ajax({
    method: "GET",
    url: "../../api/?clients&list",
  }).done(function (msg) {
    debug(`Loading client list from database`, "success");
    //clients_data = JSON.parse(msg);
    clients_data = msg;
    clients_count = Object.keys(clients_data).length;

    $("#client_count_badge").html(clients_count);
    if (clients_count > 0) {
      $("section#no_data").hide();
      $("button#button_client_add").show();

      const columnDefs = [
        { field: "id", hide: true },
        { headerName: "Avatar", cellRenderer: avatarRenderer, headerCheckboxSelection: true, checkboxSelection: true, width: 150 },
        { field: "name", editable: true },
        { field: "company", editable: true },
        { field: "address", editable: true },
        { field: "phone", editable: true },
        { field: "manage", cellRenderer: clients_manage_render, width: 60 },
      ];

      // specify the data
      const rowData = clients_data;

      // let the grid know which columns and what data to use
      const gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        defaultColDef: {
          resizable: true,
          sortable: true,
        },
        pagination: true,
        rowSelection: "multiple",
        onRowSelected: onRowSelected,
        cacheQuickFilter: true,
        editType: "fullRow",
        paginationAutoPageSize: true,
      };

      function onRowSelected(event) {
        if (event.api.getSelectedNodes().length > 0) {
          $("#button_client_delete").removeClass("d-none");
          $("#button_client_delete #text").html(" (" + event.api.getSelectedNodes().length + ")");
          clients_node = event.api.getSelectedNodes();
        } else {
          $("#button_client_delete").addClass("d-none");
        }
      }

      // setup the grid after the page has finished loading
      const gridDiv = document.querySelector("#main_clients_table");
      gridDiv.innerHTML = "";
      new agGrid.Grid(gridDiv, gridOptions);

      if (jQuery.browser.mobile == false) {
        gridOptions.api.sizeColumnsToFit();
      }
      gridDiv.style.setProperty("height", "81vh");

      $("#clients_search").on("input", function () {
        //console.log(this.value);
        if (this.value.length >= 3) gridOptions.api.setQuickFilter(this.value);

        if (this.value.length < 3) gridOptions.api.setQuickFilter("");
      });
    } else {
      $("section#no_data").show();
      $("button#button_client_add").hide();
    }

    $(function () {
      $('[data-type="tooltip"]').tooltip();
    });
  });
};

loadTable();

$("form#client_form").submit(function (e) {
  e.preventDefault();
  form_submit("client", $(this));
});
