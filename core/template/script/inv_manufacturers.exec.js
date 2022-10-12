$(`li#inventory_submenu`).addClass("menu-open");
$(`a#nav-link-inventory-manufacturers`).addClass("active");

const brand_inventory_renderer = (param) => {
  const parent_element = document.createElement("div");
  const sub_element = document.createElement("img");
  const imageURL = local_address + `elements/uploaded/items/${param.data.id}.itemid.jpg`;

  //if (UrlExists(imageURL) == true) {
  //  sub_element.src = `../../elements/uploaded/items/${param.data.id}.itemid.jpg`;
  //} else {
  sub_element.src = local_address + "elements/images/components/no_image.svg";
  //}

  parent_element.appendChild(sub_element);
  parent_element.classList.add("inventory_item_grid_image");
  return parent_element;
};

let manufacturers_data = null;

const manufacturer_manage_render = (param) => {
  const parent_element = document.createElement("p");
  const element = document.createElement("span");
  element.innerHTML = `<button onclick='manufacturer_modify(${param.data.id})' class='btn btn-sm'><i class="fa text-primary fa-pencil-square" aria-hidden="true"></i></button>`;
  parent_element.appendChild(element);
  return parent_element;
};

const loadTable = () => {
  let manufacturers_count = 0;

  $.ajax({
    method: "GET",
    url: local_address + "api/?inventory&manufacturer_list",
  }).done(function (msg) {
    debug(`Loading manufacturers from database`, "success");
    manufacturers_data = msg;

    /*Object.keys(inventory_data).forEach((key) => {
        ordered_inventory_data[inventory_data[key].inventoryID] = inventory_data[key].name;
      });
      */
    console.log(manufacturers_data);

    manufacturers_count = Object.keys(manufacturers_data).length;

    $("#manufacturers_count_badge").html(manufacturers_count);
    $("button#button_manufacturers_add").show();

    const columnDefs = [
      { field: "id", headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
      { field: "logo", cellRenderer: brand_inventory_renderer, width: 50 },
      { field: "name" },
      { field: "manage", cellRenderer: manufacturer_manage_render, width: 50 },
    ];

    // specify the data
    const rowData = manufacturers_data;
    //const rowData = [];

    class CustomNoRowsOverlay {
      init(params) {
        this.eGui = document.createElement("div");
        this.eGui.innerHTML = `
            <div style="height: 70vh" class="mt-10 d-flex justify-content-center align-items-center">
            <div class="text-center">
              
              <h4>Create your first manufacturers</h4>
              <h6>
                You do not have any manufacturers yet. <br />
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
        $("#button_manufacturers_delete").removeClass("d-none");
        $("#button_manufacturers_delete #text").html(" (" + event.api.getSelectedNodes().length + ")");
        inventory_node = event.api.getSelectedNodes();
      } else {
        $("#button_manufacturers_delete").addClass("d-none");
      }
    }

    // setup the grid after the page has finished loading
    const gridDiv = document.querySelector("#main_manufacturers_table");
    gridDiv.innerHTML = "";
    new agGrid.Grid(gridDiv, gridOptions);

    gridOptions.api.sizeColumnsToFit();
    gridDiv.style.setProperty("height", "81vh");
  });
};

loadTable();
