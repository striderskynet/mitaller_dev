const data = new Object();

// Getting data.tickets data from the API endpoint
data.tickets = {
  newTask: getAjaxValue("../../api/?query=" + `SELECT count(*) as \`amount\` FROM \`data_tickets\``, "GET")[0].amount,
  newTaskPaid: getAjaxValue("../../api/?query=" + `SELECT count(*) as \`amount\` FROM \`data_tickets\` WHERE \`tickets_status\` = 7 OR \`tickets_status\` = 6`, "GET")[0].amount,
};
data.tickets.newTaskCompletion = Math.floor((data.tickets.newTaskPaid / data.tickets.newTask) * 100) + " %";

// Getting data.clients data from the API endpoint
data.clients = {
  newClients: getAjaxValue("../../api/?query=" + `SELECT count(*) as \`amount\` FROM \`data_clients\``, "GET")[0].amount,
};

// Getting data.types data from the API endpoint
data.tasks = {
  types: getAjaxValue(
    "../../api/?query=" +
      `SELECT \`data_tickets\`.\`tickets_status\` as \`status\`, \`data_tickets_status\`.\`status\` AS \`name\`, COUNT(*) AS \`amount\` FROM \`data_tickets\`  INNER JOIN \`data_tickets_status\` ON \`data_tickets\`.\`tickets_status\` = \`data_tickets_status\`.\`id\` GROUP BY \`name\``
  ),
  //types: getAjaxValue("../../api/?query=" + `SELECT \`tickets_status\` as \`status\`, COUNT(*) AS \`amount\` FROM \`data_tickets\` GROUP BY \`tickets_status\``),
  //status: getAjaxValue("../../api/?query=" + `SELECT \`id\`, \`status\` FROM \`data_tickets_status\``),
};

Object.keys(data.tickets).forEach((key) => {
  $("#data\\.tickets\\." + key).html(data.tickets[key]);
});

Object.keys(data.clients).forEach((key) => {
  $("#data\\.clients\\." + key).html(data.clients[key]);
});

data.tasks.amount = Array();
data.tasks.names = Array();

Object.keys(data.tasks.types).forEach((key) => {
  data.tasks.amount.push(data.tasks.types[key].amount);
  data.tasks.names.push(data.tasks.types[key].name);
});

console.log("🚀 ~ file: analytics.exec.js ~ line 2 ~ data", data);

var options = {
  series: data.tasks.amount,
  chart: {
    type: "donut",
  },
  labels: data.tasks.names,
  stroke: {
    colors: ["#fff"],
  },
  fill: {
    opacity: 0.8,
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

var chart = new ApexCharts(document.querySelector("#chart2"), options);
chart.render();
