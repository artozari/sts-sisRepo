// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const Service = require("node-linux").Service;
const fs = require("fs");
const path = require("path");

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
const prepareStsPublisher = () => {
  const appDir = path.resolve(__dirname, "..", "apps", "sts", "sts-local-publisher");
  const distDir = path.join(appDir, "dist");
  const envExample = path.join(appDir, ".env.example");
  const envFile = path.join(appDir, ".env");

  // 1. Asegurar que exista el archivo de configuracion (.env).
  if (!fs.existsSync(envFile)) {
    if (fs.existsSync(envExample)) {
      fs.copyFileSync(envExample, envFile);
      console.log("[STS-Publisher] Archivo .env creado a partir de .env.example");
    } else {
      console.error("[STS-Publisher] No se encontro ni .env ni .env.example. Revisa la configuracion.");
      process.exit(1);
    }
  } else {
    console.log("[STS-Publisher] El archivo .env ya existe");
  }

  // 2. Copiar el .env dentro de dist para que el servicio siempre lo encuentre.
  fs.mkdirSync(distDir, { recursive: true });
  fs.copyFileSync(envFile, path.join(distDir, ".env"));
  console.log("[STS-Publisher] Archivo .env copiado a dist/.env");

  // 3. Verificar que exista el build (dist/index.js); si no, construirlo.
  if (!fs.existsSync(path.join(distDir, "index.js"))) {
    console.log("[STS-Publisher] No se encontro dist/index.js, construyendo el proyecto...");
    const { execSync } = require("child_process");
    execSync("npm run build", { cwd: appDir, stdio: "inherit" });
  }
};

const installStsPublisher = () => {
  prepareStsPublisher();

  const appDir = path.resolve(__dirname, "..", "apps", "sts", "sts-local-publisher");

  // Create a new service object
  const svc = new Service({
      name: "sts_publisher",
      description: "STS-Publisher.",
      script: path.join(appDir, "dist", "index.js"),
      env: [
          {
              name: "NODE_ENV",
              value: "production",
          },
          {
              name: "configFile",
              value: path.join(appDir, "dist", ".env"),
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