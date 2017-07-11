import { AuthenticationWindow } from "../authentication";
import { GenieWindow } from "../genie-window";
import { MainWindow } from "../main-window";
import { RecoverWindow } from "../recover-window";
import { SplashScreen } from "../splash-screen";

const splashScreen = new SplashScreen();
const authenticationWindow = new AuthenticationWindow();
const recoverWindow = new RecoverWindow();
const mainWindow = new MainWindow();
const genieWindow = new GenieWindow();

/**
 * Set of unique windows used across the app
 */
export const windows = { splashScreen, genieWindow, authentication: authenticationWindow, main: mainWindow, recover: recoverWindow };
