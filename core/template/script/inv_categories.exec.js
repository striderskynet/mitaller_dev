$(`li#inventory_submenu`).addClass("menu-open");
$(`a#nav-link-inventory-categories`).addClass("active");

let category_data,
  ordered_category_data = {};

$("#button_category_delete").click(function () {
  var delete_id = [];
  category_node.forEach(function (e) {
    //console.log(e.data);
    delete_id.push(e.data.categoryID);
  });

  let query = "DELETE FROM `inventory_category` WHERE `categoryID` in (" + delete_id.join(", ") + ");";

  $.ajax({
    method: "POST",
    url: local_address + "api/?category&query",
    // Passing all the variables
    data: { query: query },
  }).done(function (msg) {
    if (msg.includes("true")) {
      loadTable();
      $("#button_category_delete").addClass("d-none");
      toastr["success"]("Success removing categories from database");
      debug(`Success removing categories from database`, "success");
    } else {
      toastr["error"]("Error removing categories from database");
      debug(`Error removingcategories from database`, "error");
    }
  });
  //console.log(query);
});

const avatarRenderer = (param) => {
  const parent_element = document.createElement("p");

  if (param.data.subcategoryID != null) parent_element.innerHTML = ordered_category_data[param.data.subcategoryID];
  return parent_element;
};

const category_logo_renderer = (param) => {
  const parent_element = document.createElement("div");
  const sub_element = document.createElement("img");

  imageURL = local_address + `elements/images/components/inventory_category/${param.data.name}.png`;

  //console.log(UrlExists(imageURL));
  if (UrlExists(imageURL) == true) {
    sub_element.src = imageURL;
  } else {
    sub_element.src = local_address + "elements/images/components/no_image.svg";
  }

  sub_element.width = "40";
  parent_element.appendChild(sub_element);
  parent_element.classList.add("inventory_item_grid_image");
  return parent_element;
};

const category_manage_render = (param) => {
  const parent_element = document.createElement("p");
  const element = document.createElement("span");
  element.innerHTML = `<button onclick='category_modify(${param.data.id})' class='btn btn-sm'><i class="fa  text-primary fa-pencil-square" aria-hidden="true"></i></button>`;
  parent_element.appendChild(element);
  return parent_element;
};

const loadTable = () => {
  let clients_count = 0;

  $.ajax({
    method: "GET",
    url: local_address + "api/?category&inv_list",
  }).done(function (msg) {
    debug(`Loading client list from database`, "success");
    category_data = msg;

    Object.keys(category_data).forEach((key) => {
      ordered_category_data[category_data[key].categoryID] = category_data[key].name;
    });

    //console.log(ordered_category_data);

    category_count = Object.keys(category_data).length;

    $("#category_count_badge").html(category_count);
    $("button#button_category_add").show();

    if (category_count > 0) {
      const columnDefs = [
        { field: "categoryID", headerCheckboxSelection: true, checkboxSelection: true, width: 100 },
        { field: "subcategoryID", cellRenderer: avatarRenderer, width: 100 },
        { field: "imagen", cellRenderer: category_logo_renderer },
        { field: "name" },
        { field: "description" },
        { field: "manage", cellRenderer: category_manage_render, width: 50 },
      ];

      // specify the data
      const rowData = category_data;
      //const rowData = [];

      class CustomNoRowsOverlay {
        init(params) {
          this.eGui = document.createElement("div");
          this.eGui.innerHTML = `
        <div style="height: 70vh" class="mt-10 d-flex justify-content-center align-items-center">
        <div class="text-center">
          
          <h4>Create your first Category</h4>
          <h6>
            You do not have any category yet. <br />
          </h6>
          <button data-toggle="modal" data-target="#cinventory_category_modal" class="mt-3 btn btn-lg btn-success" style="border-radius: 35px" tabindex="0" type="button" style="margin-top: 15px">
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
        pagination: true,
        rowSelection: "multiple",
        onRowSelected: onRowSelected,
        cacheQuickFilter: true,
        editType: "fullRow",
        paginationAutoPageSize: true,
        noRowsOverlayComponent: CustomNoRowsOverlay,
        noRowsOverlayComponentParams: {
          noRowsMessageFunc: () => "",
        },
      };

      function onRowSelected(event) {
        if (event.api.getSelectedNodes().length > 0) {
          $("#button_category_delete").removeClass("d-none");
          $("#button_category_delete #text").html(" (" + event.api.getSelectedNodes().length + ")");
          category_node = event.api.getSelectedNodes();
        } else {
          $("#button_category_delete").addClass("d-none");
        }
      }

      // setup the grid after the page has finished loading
      const gridDiv = document.querySelector("#main_category_table");
      gridDiv.innerHTML = "";
      new agGrid.Grid(gridDiv, gridOptions);

      gridOptions.api.sizeColumnsToFit();
      gridDiv.style.setProperty("height", "81vh");

      create_category_list(rowData);
    }
  });
};

loadTable();

$("form#inventory_category_form").submit(function (e) {
  e.preventDefault();

  var form_submit = $(this);
  var subcategory = form_submit[0].subcategoryID.value;
  if (subcategory == "0") subcategory = "null";

  const category = {
    name: form_submit[0].name.value,
    subcategory: subcategory,
    description: form_submit[0].description.value,
    logo: form_submit[0].description.value,
  };

  var query = "INSERT INTO `inventory_category` values (" + category.subcategory + ", null ,'" + category.name + "','" + category.description + "')";

  //console.log(query);
  $.ajax({
    method: "POST",
    url: local_address + "api/?category&query",
    data: { query: query },
  }).done(function (msg) {
    if (msg.includes("true")) {
      myDropzone.processQueue();
      loadTable();
      $("#inventory_category_modal").modal("hide");
      form_submit[0].reset();
      toastr["success"]("Success adding category to the database");
      debug(`Success adding category to the database`, "success");
    } else {
      console.log(msg);
      toastr["error"]("Error adding category to the database");
      debug(`Error adding categoryto the database`, "error");
    }
  });
});
