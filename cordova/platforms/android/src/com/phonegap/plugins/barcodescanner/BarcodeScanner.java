/**
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) Matt Kane 2010
 * Copyright (c) 2011, IBM Corporation
 * Copyright (c) 2013, Maciej Nux Jaros
 */
package com.phonegap.plugins.barcodescanner;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AlertDialog;
import android.util.Log;
import android.content.pm.PackageManager;
import android.view.Display;
import android.view.WindowManager;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PermissionHelper;

import com.google.zxing.WriterException;
import com.google.zxing.client.android.Intents;
import com.google.zxing.client.android.encode.QRCodeEncoder;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * This calls out to the ZXing barcode reader and returns the result.
 *
 * @sa https://github.com/apache/cordova-android/blob/master/framework/src/org/apache/cordova/CordovaPlugin.java
 */
public class BarcodeScanner extends CordovaPlugin {
    public static final int REQUEST_CODE = 0x0ba7c0de;

    private static final String SCAN = "scan";
    private static final String ENCODE = "encode";
    private static final String CANCELLED = "cancelled";
    private static final String FORMAT = "format";
    private static final String TEXT = "text";
    private static final String DATA = "data";
    private static final String TYPE = "type";
    private static final String PREFER_FRONTCAMERA = "preferFrontCamera";
    private static final String ORIENTATION = "orientation";
    private static final String SHOW_FLIP_CAMERA_BUTTON = "showFlipCameraButton";
    private static final String FORMATS = "formats";
    private static final String PROMPT = "prompt";
    private static final String SCAN_INTENT = "com.google.zxing.client.android.SCAN";
    private static final String ENCODE_DATA = "ENCODE_DATA";
    private static final String ENCODE_TYPE = "ENCODE_TYPE";
    private static final String ENCODE_INTENT = "com.google.zxing.client.android.ENCODE";//"com.phonegap.plugins.barcodescanner.ENCODE";
    private static final String TEXT_TYPE = "TEXT_TYPE";
    private static final String EMAIL_TYPE = "EMAIL_TYPE";
    private static final String PHONE_TYPE = "PHONE_TYPE";
    private static final String SMS_TYPE = "SMS_TYPE";

    private static final String LOG_TAG = "BarcodeScanner";

    private String [] permissions = { Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE };

    private JSONArray requestArgs;
    private CallbackContext callbackContext;

    //added
    public static final int SCAN_ACTION_CODE = 0;
    public static final int ENCODE_ACTION_CODE = 1;
    private String type;
    private String data;

    /**
     * Constructor.
     */
    public BarcodeScanner() {
    }

    /**
     * Executes the request.
     *
     * This method is called from the WebView thread. To do a non-trivial amount of work, use:
     *     cordova.getThreadPool().execute(runnable);
     *
     * To run on the UI thread, use:
     *     cordova.getActivity().runOnUiThread(runnable);
     *
     * @param action          The action to execute.
     * @param args            The exec() arguments.
     * @param callbackContext The callback context used when calling back into JavaScript.
     * @return                Whether the action was valid.
     *
     * @sa https://github.com/apache/cordova-android/blob/master/framework/src/org/apache/cordova/CordovaPlugin.java
     */
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        this.callbackContext = callbackContext;
        this.requestArgs = args;

        if (action.equals(ENCODE)) {
            JSONObject obj = args.optJSONObject(0);
            if (obj != null) {
                String type = obj.optString(TYPE);
                String data = obj.optString(DATA);

                // If the type is null then force the type to text
                if (type == null) {
                    type = TEXT_TYPE;
                }

                if (data == null) {
                    callbackContext.error("User did not specify data to encode");
                    return true;
                }

                this.type = type;
                this.data = data;
                if(!PermissionHelper.hasPermission(this, permissions[1])) {
                    requestPermissions(ENCODE_ACTION_CODE);
                } else {
                    this.encode(type, data);
                }
            } else {
                callbackContext.error("User did not specify data to encode");
                return true;
            }
        } else if (action.equals(SCAN)) {

            //android permission auto add
            //if(!hasPermisssion()) {
            if(!PermissionHelper.hasPermission(this, permissions[0])){
              requestPermissions(SCAN_ACTION_CODE);
            } else {
              scan(args);
            }
        } else {
            return false;
        }
        return true;
    }

    /**
     * Starts an intent to scan and decode a barcode.
     */
    public void scan(final JSONArray args) {

        final CordovaPlugin that = this;

        cordova.getThreadPool().execute(new Runnable() {
            public void run() {

                Intent intentScan = new Intent(SCAN_INTENT);
                intentScan.addCategory(Intent.CATEGORY_DEFAULT);

                // add config as intent extras
                if (args.length() > 0) {

                    JSONObject obj;
                    JSONArray names;
                    String key;
                    Object value;

                    for (int i = 0; i < args.length(); i++) {

                        try {
                            obj = args.getJSONObject(i);
                        } catch (JSONException e) {
                            Log.i("CordovaLog", e.getLocalizedMessage());
                            continue;
                        }

                        names = obj.names();
                        for (int j = 0; j < names.length(); j++) {
                            try {
                                key = names.getString(j);
                                value = obj.get(key);

                                if (value instanceof Integer) {
                                    intentScan.putExtra(key, (Integer) value);
                                } else if (value instanceof String) {
                                    intentScan.putExtra(key, (String) value);
                                }

                            } catch (JSONException e) {
                                Log.i("CordovaLog", e.getLocalizedMessage());
                            }
                        }

                        intentScan.putExtra(Intents.Scan.CAMERA_ID, obj.optBoolean(PREFER_FRONTCAMERA, false) ? 1 : 0);
                        intentScan.putExtra(Intents.Scan.SHOW_FLIP_CAMERA_BUTTON, obj.optBoolean(SHOW_FLIP_CAMERA_BUTTON, false));
                        if (obj.has(FORMATS)) {
                            intentScan.putExtra(Intents.Scan.FORMATS, obj.optString(FORMATS));
                        }
                        if (obj.has(PROMPT)) {
                            intentScan.putExtra(Intents.Scan.PROMPT_MESSAGE, obj.optString(PROMPT));
                        }
                        if (obj.has(ORIENTATION)) {
                            intentScan.putExtra(Intents.Scan.ORIENTATION_LOCK, obj.optString(ORIENTATION));
                        }
                    }

                }

                // avoid calling other phonegap apps
                intentScan.setPackage(that.cordova.getActivity().getApplicationContext().getPackageName());

                that.cordova.startActivityForResult(that, intentScan, REQUEST_CODE);
            }
        });
    }

    /**
     * Called when the barcode scanner intent completes.
     *
     * @param requestCode The request code originally supplied to startActivityForResult(),
     *                       allowing you to identify who this result came from.
     * @param resultCode  The integer result code returned by the child activity through its setResult().
     * @param intent      An Intent, which can return result data to the caller (various data can be attached to Intent "extras").
     */
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        if (requestCode == REQUEST_CODE && this.callbackContext != null) {
            if (resultCode == Activity.RESULT_OK) {
                JSONObject obj = new JSONObject();
                try {
                    obj.put(TEXT, intent.getStringExtra("SCAN_RESULT"));
                    obj.put(FORMAT, intent.getStringExtra("SCAN_RESULT_FORMAT"));
                    obj.put(CANCELLED, false);
                } catch (JSONException e) {
                    Log.d(LOG_TAG, "This should never happen");
                }
                //this.success(new PluginResult(PluginResult.Status.OK, obj), this.callback);
                this.callbackContext.success(obj);
            } else if (resultCode == Activity.RESULT_CANCELED) {
                JSONObject obj = new JSONObject();
                try {
                    obj.put(TEXT, "");
                    obj.put(FORMAT, "");
                    obj.put(CANCELLED, true);
                } catch (JSONException e) {
                    Log.d(LOG_TAG, "This should never happen");
                }
                //this.success(new PluginResult(PluginResult.Status.OK, obj), this.callback);
                this.callbackContext.success(obj);
            } else {
                //this.error(new PluginResult(PluginResult.Status.ERROR), this.callback);
                this.callbackContext.error("Unexpected error");
            }
        }
    }

    /**
     * Initiates a barcode encode.
     *
     * @param type Endoiding type.
     * @param data The data to encode in the bar code.
     */
    public void encode(String type, String data) {
        Intent intentEncode = new Intent(ENCODE_INTENT);
        intentEncode.putExtra(ENCODE_TYPE, type);
        intentEncode.putExtra(ENCODE_DATA, data);
        // avoid calling other phonegap apps
        //intentEncode.setPackage(this.cordova.getActivity().getApplicationContext().getPackageName());

        //this.cordova.getActivity().startActivity(intentEncode);

        Activity activity = this.cordova.getActivity();
        WindowManager manager = (WindowManager)activity.getSystemService(Context.WINDOW_SERVICE);;
        Display display = manager.getDefaultDisplay();
        int width = display.getWidth();
        int height = display.getHeight();
        int smallerDimension = width < height?width:height;
        smallerDimension = smallerDimension * 7 / 8;

        QRCodeEncoder qrCodeEncoder = null;
        try {
            qrCodeEncoder = new QRCodeEncoder(activity, intentEncode, smallerDimension, false);
            Bitmap bitmap = qrCodeEncoder.encodeAsBitmap();
            if(bitmap == null) {
                Log.w(LOG_TAG, "Could not encode barcode");
                this.callbackContext.error("Could not encode barcode");
            }

            File outputDir = activity.getApplicationContext().getCacheDir();
            try {
                File outputFile = new File(outputDir, "tmpqrcode.jpeg");
                FileOutputStream fOut = new FileOutputStream(outputFile);
                bitmap.compress(Bitmap.CompressFormat.JPEG, 85, fOut);
                fOut.flush();
                fOut.close();

                JSONObject obj = new JSONObject();
                try {
                    obj.put(FORMAT, "QR_CODE");
                    obj.put("file", outputFile.getAbsolutePath());
                } catch (JSONException e) {
                    Log.d(LOG_TAG, "This should never happen");
                }
                //this.success(new PluginResult(PluginResult.Status.OK, obj), this.callback);
                this.callbackContext.success(obj);

            } catch (IOException e) {
                this.callbackContext.error(e.getMessage());
            }
        } catch (WriterException e) {
            this.callbackContext.error(e.getMessage());
        }
    }

    /**
     * check application's permissions
     */
   /*public boolean hasPermisssion() {
       for(String p : permissions)
       {
           if(!PermissionHelper.hasPermission(this, p))
           {
               return false;
           }
       }
       return true;
   }*/

    /**
     * We override this so that we can access the permissions variable, which no longer exists in
     * the parent class, since we can't initialize it reliably in the constructor!
     *
     * @param requestCode The code to get request action
     */
   public void requestPermissions(int requestCode)
   {
       //PermissionHelper.requestPermissions(this, requestCode, permissions);
       if(requestCode == SCAN_ACTION_CODE)
           cordova.requestPermission(this, requestCode, permissions[0]);
       else if(requestCode == ENCODE_ACTION_CODE)
           cordova.requestPermission(this, requestCode, permissions[1]);
   }

   /**
   * processes the result of permission request
   *
   * @param requestCode The code to get request action
   * @param permissions The collection of permissions
   * @param grantResults The result of grant
   */
  public void onRequestPermissionResult(int requestCode, String[] permissions,
                                         int[] grantResults) throws JSONException
   {
       /*PluginResult result;
       for (int r : grantResults) {
           if (r == PackageManager.PERMISSION_DENIED) {
               Log.d(LOG_TAG, "Permission Denied!");
               result = new PluginResult(PluginResult.Status.ILLEGAL_ACCESS_EXCEPTION);
               this.callbackContext.sendPluginResult(result);
               return;
           }
       }

       switch(requestCode)
       {
           case SCAN_ACTION_CODE:
               scan(this.requestArgs);
               break;
       }*/
       PluginResult result;
       Activity activity = cordova.getActivity();
       switch (requestCode) {
           case SCAN_ACTION_CODE:
               if (grantResults.length > 0
                       && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                   scan(this.requestArgs);
               } else {
                   if (ActivityCompat.shouldShowRequestPermissionRationale(activity, permissions[0])) {
                       showPermissionRationale(requestCode);
                   } else {
                       openPermissionSetting();
                       result = new PluginResult(PluginResult.Status.ILLEGAL_ACCESS_EXCEPTION);
                       this.callbackContext.sendPluginResult(result);
                   }
               }
               break;
           case ENCODE_ACTION_CODE:
               if (grantResults.length > 0
                       && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                   encode(this.type, this.data);
               } else {
                   if (ActivityCompat.shouldShowRequestPermissionRationale(activity, permissions[1])) {
                       showPermissionRationale(requestCode);
                   } else {
                       openPermissionSetting();
                       result = new PluginResult(PluginResult.Status.ILLEGAL_ACCESS_EXCEPTION);
                       this.callbackContext.sendPluginResult(result);
                   }
               }
               break;
       }
   }


    private void showPermissionRationale(final int requestCode)
    {
        String msg = "";
        if(requestCode == SCAN_ACTION_CODE) msg = "You need to allow use the Camera";
        else if(requestCode == ENCODE_ACTION_CODE) msg = "You need to allow access to Files";
        showMessageOKCancel(msg, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                requestPermissions(requestCode);
            }
        }, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                PluginResult result = new PluginResult(PluginResult.Status.ILLEGAL_ACCESS_EXCEPTION);
                callbackContext.sendPluginResult(result);
            }
        });
    }
    private void openPermissionSetting()
    {
        showMessageOKCancel("This app needs to use the Camera and access to Files", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Activity activity = cordova.getActivity();
                Intent intent = new Intent();
                intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                Uri uri = Uri.fromParts("package", activity.getPackageName(), null);
                intent.setData(uri);
                activity.startActivity(intent);
            }
        }, null);
    }
    private void showMessageOKCancel(String message, DialogInterface.OnClickListener okListener, DialogInterface.OnClickListener cancelListener) {
        new AlertDialog.Builder(cordova.getActivity())
                .setMessage(message)
                .setPositiveButton(android.R.string.ok, okListener)
                .setNegativeButton(android.R.string.cancel, cancelListener)
                .create()
                .show();
    }

}
