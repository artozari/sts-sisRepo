// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const Service = require("node-linux").Service;

// * ****************************************************
// * MQTT Broker
// * ****************************************************
const installMqtt = () => {
  // Create a new service object
  const svcMqtt = new Service({
    name: "sts_mqtts",
    description: "Broker MQTTS.",
    script: "./apps/mqtts-broker/dist/index.js",
    env: [
      {
        name: "NODE_ENV",
        value: "production",
      },
      {
        name: "configFile",
        value: "./apps/mqtts-broker/NotSign/config/config_mqtts-broker.yml",
      },
    ],
  });

  // Listen for the "install" event, which indicates the
  // process is available as a service.
  svcMqtt.on("install", function () {
    svcMqtt.start();
  });

  svcMqtt.install();
};

// * ****************************************************
// * STS-Hardware
// * ****************************************************
const installStsHardware = () => {
  // Create a new service object
  const svcStsHardware = new Service({
    name: "sts_hardware",
    description: "STS-Hardware.",
    script: "./apps/sts/sts-hardware/dist/index.js",
    env: [
      {
        name: "NODE_ENV",
        value: "production",
      },
      {
        name: "configFile",
        value: "./apps/sts/sts-hardware/NotSign/config/config_sts-hardware.yml",
      },
    ],
  });

  // Listen for the "install" event, which indicates the
  // process is available as a service.
  svcStsHardware.on("install", function () {
    svcStsHardware.start();
  });

  svcStsHardware.install();
};


// * ****************************************************
// * STS-Wheel
// * ****************************************************
const installStsWheel = () => {
  // Create a new service object
  const svcStsWheel = new Service({
    name: "sts_wheel",
    description: "STS-Wheel.",
    script: "./apps/sts/sts-wheel/dist/index.js",
    env: [
      {
        name: "NODE_ENV",
        value: "production",
      },
      {
        name: "configFile",
        value: "./apps/sts/sts-wheel/NotSign/config/config_sts-wheel.yml",
      },
    ],
  });

  // Listen for the "install" event, which indicates the
  // process is available as a service.
  svcStsWheel.on("install", function () {
    svcStsWheel  .start();
  });

  svcStsWheel.install();
};


// * ****************************************************
// * STS-Api
// * ****************************************************
const installStsApi = () => {
  // Create a new service object
  const svcStsApi = new Service({
    name: "sts_api",
    description: "STS-Api.",
    script: "./apps/sts/sts-api/dist/main.js",
    env: [
      {
        name: "NODE_ENV",
        value: "production",
      },
      {
        name: "configFile",
        value: "./apps/sts/sts-api/NotSign/config/config_sts-api.yml",
      },
    ],
  });

  // Listen for the "install" event, which indicates the
  // process is available as a service.
  svcStsApi.on("install", function () {
    svcStsApi.start();
  });

  svcStsApi.install();
};


// * ****************************************************
// * STS-Table
// * ****************************************************
const installStsTable = () => {
  // Create a new service object
  const svc = new Service({
    name: "sts_table",
    description: "STS-Table.",
    script: "./apps/sts/sts-table/dist/index.js",
    env: [
      {
        name: "NODE_ENV",
        value: "production",
      },
      {
        name: "configFile",
        value: "./apps/sts/sts-table/NotSign/config/config_sts-table.yml",
      },
    ],
  });

  // Listen for the "install" event, which indicates the
  // process is available as a service.
  svc.on("install", function () {
    svc.start();
  });

  svc.install();
};



// * ****************************************************
// * STS-Local-Publisher
// * ****************************************************
const installStsPublisher = () => {
  // Create a new service object
  const svc = new Service({
      name: "sts_publisher",
      description: "STS-Publisher.",
      script: "./apps/sts/sts-local-publisher/dist/index.js",
      env: [
          {
              name: "NODE_ENV",
              value: "production",
          },
          {
              name: "configFile",
              value: "./apps/sts/sts-local-publisher/NotSign/config/config_sts-local-publisher.yml",
          },
      ],
  });

  // Listen for the "install" event, which indicates the
  // process is available as a service.
  svc.on("install", function () {
    svc.start();
  });

  svc.install();
};


// * ****************************************************
// * GENERAL: Start services.
// * ****************************************************
setTimeout(installMqtt, 100);
setTimeout(installStsApi, 500);
setTimeout(installStsHardware, 1000);
setTimeout(installStsWheel, 1500);
setTimeout(installStsTable, 2000);
setTimeout(installStsPublisher, 2500);