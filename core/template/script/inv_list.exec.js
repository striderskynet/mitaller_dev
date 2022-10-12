$(`li#inventory_submenu`).addClass("menu-open");
$(`a#nav-link-inventory-list`).addClass("active");

$("#button_inventory_delete").click(function () {
  var delete_id = [];
  inventory_node.forEach(function (e) {
    console.log(e.data);
    delete_id.push(e.data.id);
  });

  let query = "DELETE FROM `inventory_items` WHERE `id` in (" + delete_id.join(", ") + ");";

  $.ajax({
    method: "POST",
    url: local_address + "api/?inventory&query",
    // Passing all the variables
    data: { query: query },
  }).done(function (msg) {
    if (msg.includes("true")) {
      loadTable();
      $("#button_inventory_delete").addClass("d-none");
      toastr["success"]("Success removing inventory items from database");
      debug(`Success removing inventory items from database`, "success");
    } else {
      toastr["error"]("Error removing inventory items from database");
      debug(`Error removing inventory items from database`, "error");
    }
  });
  console.log(query);
});

function imageFullScreen(url) {
  var modalImg = document.getElementById("img01");
  $("#invImgModal").modal();
  modalImg.src = url;
}

const item_inventory_renderer = (param) => {
  const parent_element = document.createElement("div");
  const sub_element = document.createElement("img");
  const imageURL = local_address + `elements/uploaded/items/${param.data.id}.itemid.jpg`;

  if (UrlExists(imageURL) == true) {
    sub_element.setAttribute("onclick", `imageFullScreen("${imageURL}")`);
    sub_element.src = imageURL;
  } else {
    sub_element.src = local_address + "elements/images/components/no_image.svg";
  }

  sub_element.width = 45;

  parent_element.appendChild(sub_element);
  parent_element.classList.add("inventory_item_grid_image");
  return parent_element;
};

const item_manage_render = (param) => {
  const parent_element = document.createElement("p");
  const element = document.createElement("button");
  element.setAttribute("data-type", "tooltip");
  element.setAttribute("title", "Modify");
  element.setAttribute("onClick", `item_modify(${param.data.id})`);
  element.classList.add("btn");
  element.classList.add("btn-sm");
  element.innerHTML = `<i class="fa text-primary fa-pencil-square" aria-hidden="true"></i>`;

  const element1 = document.createElement("span");
  element1.setAttribute("data-type", "tooltip");
  element1.setAttribute("title", "Publish in Revolico");
  element1.setAttribute("onClick", `item_revolico(${param.data.id})`);
  element1.classList.add("btn");
  element1.classList.add("btn-sm");
  element1.innerHTML = `<img style="width: 16px;" src="{local_address}elements/images/components/brands/revolico_icon.ico">`;
  parent_element.appendChild(element);
  parent_element.appendChild(element1);
  return parent_element;
};

const loadTable = () => {
  let inventory_count = 0;

  $.ajax({
    method: "GET",
    url: local_address + "api/?inventory&list",
  }).done(function (msg) {
    debug(`Loading inventory from database`, "success");
    inventory_data = msg;

    /*Object.keys(inventory_data).forEach((key) => {
      ordered_inventory_data[inventory_data[key].inventoryID] = inventory_data[key].name;
    });
    */

    inventory_count = Object.keys(inventory_data).length;

    $("#inventory_count_badge").html(inventory_count);
    $("button#button_inventory_add").show();

    const columnDefs = [
      { field: "id", headerCheckboxSelection: true, checkboxSelection: true, width: 150 },
      { field: "imagen", cellRenderer: item_inventory_renderer },
      { field: "name" },
      { field: "description" },
      { field: "category" },
      { field: "subcategory" },
      { field: "supplier" },
      { field: "brand" },
      { field: "model" },
      { field: "in_stock", headerName: "Stock" },
      { field: "minimum_stock_alert", headerName: "Alert" },
      { field: "manage", cellRenderer: item_manage_render, width: 150 },
    ];

    // specify the data
    const rowData = inventory_data;
    //const rowData = [];

    class CustomNoRowsOverlay {
      init(params) {
        this.eGui = document.createElement("div");
        this.eGui.innerHTML = `
          <div style="height: 70vh" class="mt-10 d-flex justify-content-center align-items-center">
          <div class="text-center">
            
            <h4>Create your first inventory item</h4>
            <h6>
              You do not have any item yet. <br />
            </h6>
            <button data-toggle="modal" data-target="#inventory_item_modal" class="mt-3 btn btn-lg btn-success" style="border-radius: 35px" tabindex="0" type="button" style="margin-top: 15px">
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
        $("#button_inventory_delete").removeClass("d-none");
        $("#button_inventory_delete #text").html(" (" + event.api.getSelectedNodes().length + ")");
        inventory_node = event.api.getSelectedNodes();
      } else {
        $("#button_inventory_delete").addClass("d-none");
      }
    }

    // setup the grid after the page has finished loading
    const gridDiv = document.querySelector("#main_inventory_table");
    gridDiv.innerHTML = "";
    new agGrid.Grid(gridDiv, gridOptions);

    gridOptions.api.sizeColumnsToFit();
    gridDiv.style.setProperty("height", "81vh");

    $(function () {
      $('[data-type="tooltip"]').tooltip();
    });
    //create_inventory_list(rowData);
  });
};

loadTable();
