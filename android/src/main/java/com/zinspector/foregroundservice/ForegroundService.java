package com.zinspector.foregroundservice;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Bundle;
import android.os.IBinder;
import android.os.Handler;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;

import static com.zinspector.foregroundservice.Constants.NOTIFICATION_CONFIG;
import static com.zinspector.foregroundservice.Constants.TASK_CONFIG;


// NOTE: headless task will still block the UI so don't do heavy work, but this is also good
// since they will share the JS environment
// TOOD: The headless task spawned from here seem to have infinite time and no battery blame due to its parent
// being foreground. Confirm this is the case or we might need the headless Task to call startForeground instead
// TODO2: Since calls come from a single thread environment, should we synchronize the running flag?

public class ForegroundService extends Service {

    private int running = 0;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent.getAction();

        /**
        From the docs:
        Every call to this method will result in a corresponding call to the target service's
        Service.onStartCommand(Intent, int, int) method, with the intent given here.
        This provides a convenient way to submit jobs to a service without having to bind and call on to its interface.
        */

        if (action != null) {
            if (action.equals(Constants.ACTION_FOREGROUND_SERVICE_START)) {
                if (intent.getExtras() != null && intent.getExtras().containsKey(NOTIFICATION_CONFIG)) {
                    Bundle notificationConfig = intent.getExtras().getBundle(NOTIFICATION_CONFIG);

                    try {
                        int id = (int)notificationConfig.getDouble("id");

                        Notification notification = NotificationHelper
                            .getInstance(getApplicationContext())
                            .buildNotification(getApplicationContext(), notificationConfig);

                        startForeground(id, notification);

                        running += 1;

                    }
                    catch (Exception e) {
                        Log.e("ForegroundService", "Failed to start service: " + e.getMessage());
                    }

                }
            }

            if (action.equals(Constants.ACTION_UPDATE_NOTIFICATION)) {
                if(running <= 0){
                    Log.w("ForegroundService", "Service is not running to update notification.");
                    stopSelf();
                }
                else{
                    if (intent.getExtras() != null && intent.getExtras().containsKey(NOTIFICATION_CONFIG)) {
                        Bundle notificationConfig = intent.getExtras().getBundle(NOTIFICATION_CONFIG);

                        try {
                            int id = (int)notificationConfig.getDouble("id");

                            Notification notification = NotificationHelper
                                .getInstance(getApplicationContext())
                                .buildNotification(getApplicationContext(), notificationConfig);

                            NotificationManager mNotificationManager=(NotificationManager)getSystemService(getApplicationContext().NOTIFICATION_SERVICE);
                            mNotificationManager.notify(id, notification);

                        }
                        catch (Exception e) {
                            Log.e("ForegroundService", "Failed to update notification: " + e.getMessage());
                        }

                    }
                }
            }

            else if (action.equals(Constants.ACTION_FOREGROUND_RUN_TASK)){
                if(running <= 0){
                    Log.e("ForegroundService", "Service is not running to run tasks.");
                    stopSelf();
                }
                else{
                    if (intent.getExtras() != null && intent.getExtras().containsKey(TASK_CONFIG)) {
                        Bundle taskConfig = intent.getExtras().getBundle(TASK_CONFIG);

                        try {
                            this.runHeadlessTask(taskConfig);

                        }
                        catch (Exception e) {
                            Log.e("ForegroundService", "Failed to start task: " + e.getMessage());
                        }
                    }
                }
            }

            else if (action.equals(Constants.ACTION_FOREGROUND_SERVICE_STOP)) {
                if(running > 0){
                    running -= 1;

                    if (running == 0){
                        stopSelf();
                    }
                }
                else{
                    Log.d("ForegroundService", "Service is not running to stop.");
                    stopSelf();
                }

            }
            else if (action.equals(Constants.ACTION_FOREGROUND_SERVICE_STOP_ALL)) {
                running = 0;
                stopSelf();
            }
        }
        return START_NOT_STICKY;

    }

    @Override
    public void onDestroy() {
        //Log.e("ForegroundService", "destroy called");
        running = 0;
    }

    public void runHeadlessTask(Bundle bundle){
        final Intent service = new Intent(getApplicationContext(), ForegroundServiceTask.class);
        service.putExtras(bundle);

        int delay = (int)bundle.getDouble("delay");

        if(delay <= 0){
             getApplicationContext().startService(service);

            // wakelock should be released automatically by the task
            // Shouldn't be needed, it's called automatically by headless
            //HeadlessJsTaskService.acquireWakeLockNow(getApplicationContext());
        }
        else{
            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    if(running <= 0){
                        return;
                    }
                    getApplicationContext().startService(service);
                }
            }, delay);
        }


    }
}