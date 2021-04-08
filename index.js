
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
 * @property {boolean} ongoing - true/false if the notification is ongoing. The notification the service was started with will always be ongoing
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
     * Note: this method might fail if called right after starting the service
     * since the service might not be yet ready.
     * If service is not running, it will be started automatically like calling startService.
     * @param {NotificationConfig} notificationConfig - Notification config
     * @return Promise
     */
    static async updateNotification(notificationConfig) {
        return await ForegroundServiceModule.updateNotification(notificationConfig);
    }

    /**
     * Cancels/dimisses a notification given its id. Useful if the service used
     * more than one notification
     * @param {number} id - Notification id to cancel
     * @return Promise
     */
    static async cancelNotification(id) {
        return await ForegroundServiceModule.cancelNotification({id: id});
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
     * Note: This method might silently fail if the service is not running, but will run successfully
     * if the service is still spinning up.
     * If the service is not running because it was killed, it will be attempted to be started again
     * using the last notification available.
     * @param {TaskConfig} taskConfig - Notification config
     * @return Promise
     */
    static async runTask(taskConfig) {
        return await ForegroundServiceModule.runTask(taskConfig);
    }

    /**
     * Returns an integer indicating if the service is running or not.
     * The integer represents the internal counter of how many startService
     * calls were done without calling stopService
     * @return Promise
     */
    static async isRunning() {
        return await ForegroundServiceModule.isRunning();
    }

    /**
     * Returns true if background is restricted as provided by
     * https://developer.android.com/reference/android/app/ActivityManager#isBackgroundRestricted()
     *
     * Returns false if restriction cannot be determined due to Android constraints,
     * only available for SDK >= 28
     * @return Promise
     */
     static async isBackgroundRestricted() {
        return await ForegroundServiceModule.isBackgroundRestricted();
    }
}
