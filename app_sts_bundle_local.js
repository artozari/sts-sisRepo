// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const cpx = require("cpx2");

const sources = [
    // ***********************
    // ****** README.md ******
    // ***********************
    {
        source: "./README.md",
        dest: "app_sts_local/",
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
        dest: "app_sts_local/",
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
        dest: "app_sts_local/",
        options: {
            clean: true,
            force: true,
        },
    },
    {
        source: "./__node-service/sts-uninstall-lnx.js",
        dest: "app_sts_local/",
        options: {
            clean: true,
            force: true,
        },
    },

    // *********************
    // ****** sts-api ******
    // *********************
    // app: sts-api
    {
        source: "apps/sts/sts-api/dist/**/*.js",
        dest: "app_sts_local/apps/sts/sts-api/dist",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    {
        source: "apps/sts/sts-api/package.json",
        dest: "app_sts_local/apps/sts/sts-api",
        options: {
            clean: true,
            force: true,
        },
    },

    // NotSign
    {
        source: "apps/sts/sts-api/NotSign/**/*.*",
        dest: "app_sts_local/apps/sts/sts-api/NotSign",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },

    // .env
    {
        source: "apps/sts/sts-api/.env",
        dest: "app_sts_local/apps/sts/sts-api",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },

    // prisma
    {
        source: "apps/sts/sts-api/prisma/**/*.*",
        dest: "app_sts_local/apps/sts/sts-api/prisma",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },

    // *********************
    // ***** sts-table *****
    // *********************
    // app: sts-table
    {
        source: "apps/sts/sts-table/dist/**/*.js",
        dest: "app_sts_local/apps/sts/sts-table/dist",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    {
        source: "apps/sts/sts-table/package.json",
        dest: "app_sts_local/apps/sts/sts-table",
        options: {
            clean: true,
            force: true,
        },
    },

    // NotSign
    {
        source: "apps/sts/sts-table/NotSign/**/*.*",
        dest: "app_sts_local/apps/sts/sts-table/NotSign",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },

    // *******************************
    // ***** sts-local-publisher *****
    // *******************************
    // app: sts-local-publisher
    {
        source: "apps/sts/sts-local-publisher/dist/**/*.js",
        dest: "app_sts_local/apps/sts/sts-local-publisher/dist",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    {
        source: "apps/sts/sts-local-publisher/package.json",
        dest: "app_sts_local/apps/sts/sts-local-publisher",
        options: {
            clean: true,
            force: true,
        },
    },

    // NotSign
    {
        source: "apps/sts/sts-local-publisher/NotSign/**/*.*",
        dest: "app_sts_local/apps/sts/sts-local-publisher/NotSign",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },

    // ************************
    // ***** sts-hardware *****
    // ************************
    // app: sts-hardware
    {
        source: "apps/sts/sts-hardware/dist/**/*.js",
        dest: "app_sts_local/apps/sts/sts-hardware/dist",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    {
        source: "apps/sts/sts-hardware/package.json",
        dest: "app_sts_local/apps/sts/sts-hardware",
        options: {
            clean: true,
            force: true,
        },
    },

    // NotSign
    {
        source: "apps/sts/sts-hardware/NotSign/**/*.*",
        dest: "app_sts_local/apps/sts/sts-hardware/NotSign",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },

    // *********************
    // ***** sts-wheel *****
    // *********************
    // app: sts-wheel
    {
        source: "apps/sts/sts-wheel/dist/**/*.js",
        dest: "app_sts_local/apps/sts/sts-wheel/dist",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    {
        source: "apps/sts/sts-wheel/package.json",
        dest: "app_sts_local/apps/sts/sts-wheel",
        options: {
            clean: true,
            force: true,
        },
    },

    // NotSign
    {
        source: "apps/sts/sts-wheel/NotSign/**/*.*",
        dest: "app_sts_local/apps/sts/sts-wheel/NotSign",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },

    // *******************************
    // ***** sts-ui *****
    // *******************************
    // app: sts-ui
    {
        source: "apps/sts/sts-ui/dist/**/*.*",
        dest: "app_sts_local/apps/sts/sts-ui/dist",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    {
        source: "apps/sts/sts-ui/public/**/*.*",
        dest: "app_sts_local/apps/sts/sts-ui/public",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    {
        source: "apps/sts/sts-ui/views/**/*.*",
        dest: "app_sts_local/apps/sts/sts-ui/views",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    {
        source: "apps/sts/sts-ui/**/*.*",
        dest: "app_sts_local/apps/sts/sts-ui",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    {
        source: "apps/sts/sts-ui/**/*.*",
        dest: "app_sts_local/apps/sts/sts-ui",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    {
        source: "apps/sts/sts-ui/package.json",
        dest: "app_sts_local/apps/sts/sts-ui",
        options: {
            clean: true,
            force: true,
        },
    },

    // NotSign
    {
        source: "apps/sts/sts-ui/NotSign/**/*.*",
        dest: "app_sts_local/apps/sts/sts-ui/NotSign",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    // NotSign

    // ***************************
    // ***** General NotSign *****
    // ***************************
    // General NotSign (openssl)
    {
        source: "NotSign/openssl/**/*.*",
        dest: "app_sts_local/apps/sts/NotSign/openssl",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    {
        source: "apps/sts/NotSign/config/*.*",
        dest: "app_sts_local/apps/sts/NotSign/config",
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
        dest: "app_sts_local/packages/sts-common/dist",
        options: {
            clean: true,
            force: true,
            ignore: "**/test/*",
        },
    },
    {
        source: "packages/sts-common/package.json",
        dest: "app_sts_local/packages/sts-common",
        options: {
            clean: true,
            force: true,
        },
    },

    // ***** package.json *****
    // package.json monorepo
    {
        source: "package.json",
        dest: "app_sts_local",
        options: {
            clean: true,
            force: true,
        },
    },
];

sources.forEach((source) => {
  cpx.copy(source.source, source.dest, source.options);
});
