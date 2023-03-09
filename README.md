# react-native-foreground-service
Android only foreground service with JS code support, This is a library which can help to run headless js task while your app is in background, such as geolocation update, play music, fetch data, 

TODO: Write a proper readme.

Thanks to the following repos to provide ideas and insight about how to do this.
https://github.com/voximplant/react-native-foreground-service
https://github.com/zo0r/react-native-push-notification/


# Installation

    - Add to package.json
    "react-native-foreground-service": "github:cristianoccazinsp/react-native-foreground-service",
    
    -- For react native >= 60.0 , autolinking is used  
    
    -- For react native previous versions 
    
    react-native link react-native-foreground-service

    Add/configure the following into the AndroidManifest.xml

    ```
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    
    
    add a color.xml file in /android/app/src/main/res/values
    ```
    <?xml version="1.0" encoding="utf-8"?>
    <resources>
    <item  name="orange"  type="color">#FF4500
    </item>
    <integer-array  name="androidcolors">
    <item>@color/orange</item>
    </integer-array>
    </resources>
    ```

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
        time: true,
        number: String(1)
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

#   Demo
    
    Take Geolocation while the app in Background 

    https://github.com/nahidmbstu/React-Native-Foreground-Service-Demo
    
    
