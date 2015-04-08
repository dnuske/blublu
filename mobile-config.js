App.info({
  id: 'com.dnuske.blublu',
  name: 'Blublu',
  description: 'Precio del dolar blue actualizado en tiempo real',
  author: 'dnuske',
  email: 'dnuske@gmail.com',
  website: 'http://nuske.com.ar',
  version: '0.0.1'
});

App.icons({
  // Android
  'android_ldpi': 'resources/icons/icon-96x96.png',
  'android_mdpi': 'resources/icons/icon-96x96.png',
  'android_hdpi': 'resources/icons/icon-96x96.png',
  'android_xhdpi': 'resources/icons/icon-96x96.png'
});

App.launchScreens({
  // Android
  'android_ldpi_portrait': 'resources/splash/splash-480x800.png',
  'android_ldpi_landscape': 'resources/splash/splash-480x800.png',
  'android_mdpi_portrait': 'resources/splash/splash-480x800.png',
  'android_mdpi_landscape': 'resources/splash/splash-480x800.png',
  'android_hdpi_portrait': 'resources/splash/splash-480x800.png',
  'android_hdpi_landscape': 'resources/splash/splash-480x800.png',
  'android_xhdpi_portrait': 'resources/splash/splash-480x800.png',
  'android_xhdpi_landscape': 'resources/splash/splash-480x800.png'
});

App.setPreference('StatusBarOverlaysWebView', 'false');
App.setPreference('StatusBarBackgroundColor', '#000000');

