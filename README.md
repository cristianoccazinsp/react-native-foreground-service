# react-native-foreground-service
Android only foreground service with JS code support

TODO: Write this properly. Migrate to react 60 and androidx

Thanks to the following repos to provide ideas and insight about how to do this.
https://github.com/voximplant/react-native-foreground-service
https://github.com/zo0r/react-native-push-notification/


# Installation

    - Add to package.json
    "react-native-background-upload": "github:cristianoccazinsp/react-native-foreground-service",

    react-native link react-native-foreground-service

    Add/configure the following into the AndroidManifest.xml

    ```
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
    <uses-permission android:name="android.permission.WAKE_LOCK" />


    <!-- inside application -->

    <meta-data android:name="com.zinspector.foregroundservice.notification_channel_name"
                android:value="zInspector Service"/>
    <meta-data  android:name="com.zinspector.foregroundservice.notification_channel_description"
                android:value="zInspector Service."/>
    <meta-data  android:name="com.zinspector.foregroundservice.notification_color"
                android:resource="@color/orange"/>

    <service android:name="com.zinspector.foregroundservice.ForegroundService"></service>
    <service android:name="com.zinspector.foregroundservice.ForegroundServiceTask"></service>
    ```


# Usage:
    TODO, but basically: register headless task (at module level) and then call the methods from index.js with the notification config

    ```
    import ForegroundService from 'react-native-foreground-service';


    // register task with a given name and function
    let foregroundTask = async (data) => {
        await myTask();
    }
    ForegroundService.registerForegroundTask("myTaskName", foregroundTask);


    // then later, start service, and send tasks

    let notificationConfig = {
        id: 3,
        title: 'Service',
        message: `blah message`,
        visibility: 'public',
        importance: 'low',
        number: String(total)
    };

    await ForegroundService.startService(notificationConfig);

    await ForegroundService.runTask({
      taskName: 'myTaskName',
      delay: 0
    });


    // stop service when no longer needed
    await ForegroundService.stopServiceAll();
    // or await ForegroundService.stopService();


    ```
