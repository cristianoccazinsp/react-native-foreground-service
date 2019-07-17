
import {NativeModules, AppRegistry} from 'react-native';

// ANDROID ONLY
// Copied and adapted from https://github.com/voximplant/react-native-foreground-service
// and https://github.com/zo0r/react-native-push-notification/

const ForegroundServiceModule = NativeModules.ForegroundService;

/**
 * @property {number} id - Unique notification id
 * @property {string} title - Notification title
 * @property {string} message - Notification message
 * @property {string} number - int specified as string > 0, for devices that support it, this might be used to set the badge counter
 * @property {string} icon - Small icon name | ic_notification
 * @property {string} largeIcon - Large icon name | ic_launcher
 * @property {string} visibility - private | public | secret
 * @property {number} [importance] - Importance (and priority for older devices) of this notification. This might affect notification sound One of:
 *                                  none - IMPORTANCE_NONE (by default),
    *                               min - IMPORTANCE_MIN,
    *                               low - IMPORTANCE_LOW,
    *                               default - IMPORTANCE_DEFAULT
    *                               high - IMPORTANCE_HIGH,
    *                               max - IMPORTANCE_MAX
 */
const NotificationConfig = {

};

/**
 * @property {string} taskName - name of the js task configured with registerForegroundTask
 * @property {number} delay - start task in delay miliseconds, use 0 to start immediately
 * ... any other values passed to the task as well
 */
const TaskConfig = {

}


export default class ForegroundService {

    /**
     * Registers a piece of JS code to be ran on the service
     * NOTE: This must be called before anything else, or the service will fail.
     * NOTE2: Registration must also happen at module level (not at mount)
     * task will receive all parameters from runTask
     * @param {task} async function to be called
     */
    static registerForegroundTask(taskName, task) {
        AppRegistry.registerHeadlessTask(taskName, () => task);
    }

    /**
     * Start foreground service
     * Multiple calls won't start multiple instances of the service, but will increase its internal counter
     * so calls to stop won't stop until it reaches 0.
     * Note: notificationConfig can't be re-used (becomes immutable)
     * @param {NotificationConfig} notificationConfig - Notification config
     * @return Promise
     */
    static async startService(notificationConfig) {
        return await ForegroundServiceModule.startService(notificationConfig);
    }

    /**
     * Updates a notification of a running service. Make sure to use the same ID
     * or it will trigger a separate notification.
     * @param {NotificationConfig} notificationConfig - Notification config
     * @return Promise
     */
    static async updateNotification(notificationConfig) {
        return await ForegroundServiceModule.updateNotification(notificationConfig);
    }

    /**
     * Stop foreground service. Note: Pending tasks might still complete.
     * If startService will called multiple times, this needs to be called as many times.
     * @return Promise
     */
    static async stopService() {
        return await ForegroundServiceModule.stopService();
    }

    /**
     * Stop foreground service. Note: Pending tasks might still complete.
     * This will stop the service regardless of how many times start was called
     * @return Promise
     */
    static async stopServiceAll() {
        return await ForegroundServiceModule.stopServiceAll();
    }

    /**
     * Runs a previously configured headless task.
     * Task must be able to self stop if the service is stopped, since it can't be force killed once started.
     * @param {TaskConfig} taskConfig - Notification config
     * @return Promise
     */
    static async runTask(taskConfig) {
        return await ForegroundServiceModule.runTask(taskConfig);
    }
}
