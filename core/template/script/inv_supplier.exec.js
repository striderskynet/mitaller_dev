$(`li#inventory_submenu`).addClass("menu-open");
$(`a#nav-link-inventory-supplier`).addClass("active");

const supplier_manage_render = (param) => {
  const parent_element = document.createElement("p");
  const element = document.createElement("span");
  element.innerHTML = `<button onclick='supplier_modify(${param.data.id})' class='btn btn-sm'><i class="fa text-primary fa-pencil-square" aria-hidden="true"></i></button>`;
  parent_element.appendChild(element);
  return parent_element;
};

const loadTable = () => {
  let suppliers_count = 0;

  $.ajax({
    method: "GET",
    url: local_address + "api/?inventory&supplier_list",
  }).done(function (msg) {
    debug(`Loading suppliers from database`, "success");
    suppliers_data = msg;

    /*Object.keys(inventory_data).forEach((key) => {
        ordered_inventory_data[inventory_data[key].inventoryID] = inventory_data[key].name;
      });
      */
    console.log(suppliers_data);

    suppliers_count = Object.keys(suppliers_data).length;

    $("#supplier_count_badge").html(suppliers_count);
    $("button#button_supplier_add").show();

    const columnDefs = [
      { field: "id", headerCheckboxSelection: true, checkboxSelection: true, width: 150 },
      { field: "name" },
      { field: "phone" },
      { field: "company" },
      { field: "comments" },
      { field: "manage", cellRenderer: supplier_manage_render, width: 60 },
    ];

    // specify the data
    const rowData = suppliers_data;
    //const rowData = [];

    class CustomNoRowsOverlay {
      init(params) {
        this.eGui = document.createElement("div");
        this.eGui.innerHTML = `
            <div style="height: 70vh" class="mt-10 d-flex justify-content-center align-items-center">
            <div class="text-center">
              
              <h4>Create your first supplier</h4>
              <h6>
                You do not have any supplier yet. <br />
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
        $("#button_supplier_delete").removeClass("d-none");
        $("#button_supplier_delete #text").html(" (" + event.api.getSelectedNodes().length + ")");
        inventory_node = event.api.getSelectedNodes();
      } else {
        $("#button_supplier_delete").addClass("d-none");
      }
    }

    // setup the grid after the page has finished loading
    const gridDiv = document.querySelector("#main_supplier_table");
    gridDiv.innerHTML = "";
    new agGrid.Grid(gridDiv, gridOptions);

    gridOptions.api.sizeColumnsToFit();
    gridDiv.style.setProperty("height", "81vh");
  });
};

loadTable();
