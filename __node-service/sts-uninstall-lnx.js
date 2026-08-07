// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const Service = require("node-linux").Service;

// * ****************************************************
// * MQTT Broker
// * ****************************************************
// Create a new service object
const svcMqtt = new Service({
  name: "sts_mqtts",
  script: "./apps/mqtts-broker/dist/index.js",
});

// Listen for the "uninstall" event so we know when it's done.
svcMqtt.on("uninstall", function () {
  console.log("Complete uninstallation of MQTTS-Broker.");
  console.log("The service MQTTS-Broker exists: ", svcMqtt.exists());
});

// Uninstall the service.
svcMqtt.uninstall();


// * ****************************************************
// * STS-Hardware
// * ****************************************************
// Create a new service object
const svcStsHardware = new Service({
  name: "sts_hardware",
  script: "./apps/sts/sts-hardware/dist/index.js",
});

// Listen for the "uninstall" event so we know when it's done.
svcStsHardware.on("uninstall", function () {
  console.log("Complete uninstallation of STS-Hardware.");
  console.log("The service STS-Hardware exists: ", svcStsHardware.exists());
});

// Uninstall the service.
svcStsHardware.uninstall();


// * ****************************************************
// * STS-Wheel
// * ****************************************************
// Create a new service object
const svcStsWheel = new Service({
  name: "sts_wheel",
  script: "./apps/sts/sts-wheel/dist/index.js",
});

// Listen for the "uninstall" event so we know when it's done.
svcStsWheel.on("uninstall", function () {
  console.log("Complete uninstallation of STS-Wheel.");
  console.log("The service STS-Wheel exists: ", svcStsWheel.exists());
});

// Uninstall the service.
svcStsWheel.uninstall();



// * ****************************************************
// * STS-Api
// * ****************************************************
// Create a new service object
const svcStsApi = new Service({
  name: "sts_api",
  script: "./apps/sts/sts-api/dist/main.js",
});

// Listen for the "uninstall" event so we know when it's done.
svcStsApi.on("uninstall", function () {
  console.log("Complete uninstallation of STS-Api.");
  console.log("The service STS-Api exists: ", svcStsApi.exists());
});

// Uninstall the service.
svcStsApi.uninstall();



// * ****************************************************
// * STS-Table
// * ****************************************************
// Create a new service object
const svcStsTable = new Service({
  name: "sts_table",
  script: "./apps/sts/sts-table/dist/index.js",
});

// Listen for the "uninstall" event so we know when it's done.
svcStsTable.on("uninstall", function () {
  console.log("Complete uninstallation of STS-Table.");
  console.log("The service STS-Table exists: ", svcStsTable.exists());
});

// Uninstall the service.
svcStsTable.uninstall();




// * ****************************************************
// * STS-Local-Publisher
// * ****************************************************
// Create a new service object
const svcStsLocalPublisher = new Service({
  name: "sts_publisher",
  script: "./apps/sts/sts-local-publisher/dist/index.js",
});

// Listen for the "uninstall" event so we know when it's done.
svcStsLocalPublisher.on("uninstall", function () {
  console.log("Complete uninstallation of STS-Local-Publisher.");
  console.log("The service STS-Local-Publisher exists: ", svcStsLocalPublisher.exists());
});

// Uninstall the service.
svcStsLocalPublisher.uninstall();
