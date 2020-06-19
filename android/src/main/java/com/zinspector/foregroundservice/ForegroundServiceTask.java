package com.zinspector.foregroundservice;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import javax.annotation.Nullable;

import static com.zinspector.foregroundservice.Constants.NOTIFICATION_CONFIG;


// https://github.com/facebook/react-native/blob/master/ReactAndroid/src/main/java/com/facebook/react/HeadlessJsTaskService.java

public class ForegroundServiceTask extends HeadlessJsTaskService {

    @Nullable
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {

        // check null intents that may rarely happen
        // return null so react knows it should skip this request
        if(intent == null){
            return null;
        }

        Bundle extras = intent.getExtras();

        return new HeadlessJsTaskConfig(
          extras.getString("taskName"), //headless function to call
          Arguments.fromBundle(extras),
          0,
          true);
    }
}