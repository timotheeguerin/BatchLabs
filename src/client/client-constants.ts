import * as path from "path";

/**
 * Root of BatchLabs(This is relative to where this file is when in the build folder)
 */
const root = path.join(__dirname, "../..");

// tslint:disable-next-line:no-var-requires
const packageConfig = require(`${root}/package.json`);

const urls = {
    main: {
        dev: "http://localhost:3178/index.html",
        prod: `file://${__dirname}/../../build/index.html`,
    },
    splash: {
        dev: `file://${root}/src/client/splash-screen/splash-screen.html`,
        prod: `file://${root}/build/client/splash-screen/splash-screen.html`,
    },
    recover: {
        dev: `file://${root}/src/client/recover-window/recover-window.html`,
        prod: `file://${root}/build/client/recover-window/recover-window.html`,
    },
    genie: {
        // dev: `file://${root}/src/client/genie-window/genie-window.html`,
        // prod: `file://${root}/build/client/genie-window/genie-window.html`,
        dev: "http://localhost:3178/genie_index.html",
        prod: `file://${__dirname}/../../build/genie_index.html`,
    },
    icon: __dirname + "/../assets/images/icon.ico",
};

const isAsar = process.mainModule.filename.indexOf("app.asar") !== -1;

export const Constants = {
    isAsar,
    root,
    urls,
    version: packageConfig.version,
};
