// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const cpx = require("cpx2");

const sources = [
    {
        source: "./README.md",
        dest: "app_sts_central/",
        options: {
            clean: true,
            force: true,
        },
    },

    // ***********************
    // ****** sts-Central-Sala ******
    // ***********************
    {
        source: "./apps/sts/sts-central-sala/dist/**/*.js",
        dest: "app_sts_central/apps/sts/sts-central-sala/dist",
        options: {
            clean: true,
            force: true,
        },
    },

    {
        source: "./apps/sts/sts-central-sala/package.json",
        dest: "app_sts_central/apps/sts/sts-central-sala",
        options: {
            clean: true,
            force: true,
        },
    },

    // **************************
    // ****** sts-Sala-App ******
    // **************************
    {
        source: "./apps/sts/sts-sala-app/dist/**/*.js",
        dest: "app_sts_central/apps/sts/sts-sala-app/dist",
        options: {
            clean: true,
            force: true,
        },
    },

    {
        source: "./apps/sts/sts-sala-app/package.json",
        dest: "app_sts_central/apps/sts/sts-sala-app",
        options: {
            clean: true,
            force: true,
        },
    },

    // ***********************
    // ****** README.md ******
    // ***********************
    {
        source: "./README.md",
        dest: "app_sts_central/",
        options: {
            clean: true,
            force: true,
        },
    },

    // ***********************
    // ****** .npmrc ******
    // ***********************
    {
        source: "./.npmrc",
        dest: "app_sts_central/",
        options: {
            clean: true,
            force: true,
        },
    },

    // *******************************************
    // ****** install and uninstall service ******
    // *******************************************
    {
        source: "./__node-service/sts-install-lnx.js",
        dest: "app_sts_central/",
        options: {
            clean: true,
            force: true,
        },
    },
    {
        source: "./__node-service/sts-uninstall-lnx.js",
        dest: "app_sts_central/",
        options: {
            clean: true,
            force: true,
        },
    },

    // ***************************
    // ***** General NotSign *****
    // ***************************
    // General NotSign (openssl)
    {
        source: "NotSign/openssl/**/*.*",
        dest: "app_sts_central/apps/sts/NotSign/openssl",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    {
        source: "apps/sts/NotSign/config/*.*",
        dest: "app_sts_central/apps/sts/NotSign/config",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },

    // **************************
    // ******** packages ********
    // **************************

    // package: sts-common
    {
        source: "packages/sts-common/dist/**/*.js",
        dest: "app_sts_central/packages/sts-common/dist",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    {
        source: "packages/sts-common/package.json",
        dest: "app_sts_central/packages/sts-common",
        options: {
            clean: true,
            force: true,
        },
    },

    // ***** package.json *****
    // package.json monorepo
    {
        source: "package.json",
        dest: "app_sts_central/",
        options: {
            clean: true,
            force: true,
        },
    },
];

sources.forEach((source) => {
  cpx.copy(source.source, source.dest, source.options);
});
