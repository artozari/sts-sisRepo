
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
let Service = require("node-linux").Service;

// Create a new service object
let svc = new Service({
  name: "mqtts0",
  description: "Mqtts 0 broker",
  script: "./dist/index.js",
  user: "admin",
  group: "admin",
  env: [
    {
      name: "NODE_ENV",
      value: "production",
    },
    {
      name: "configFile",
      value: "./NotSign/config/config_mqtts-broker.yml",
    },
  ],
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on("install", function () {
  svc.start();
});

svc.install();
