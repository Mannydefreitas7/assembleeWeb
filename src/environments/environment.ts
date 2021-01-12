// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: "AIzaSyAG52zdOjqJW5wTVNoSdwyHz-VPQPuzcmA",
   authDomain: "assemblee-5ddb6.firebaseapp.com",
   databaseURL: "https://assemblee-5ddb6.firebaseio.com",
   projectId: "assemblee-5ddb6",
   storageBucket: "assemblee-5ddb6.appspot.com",
   messagingSenderId: "98690802434",
   appId: "1:98690802434:web:160a4494153ad4d5cf581b",
   measurementId: "G-8MT9491E7D",
 };

export const environment = {
  production: false,
  firebaseConfig: firebaseConfig,
  wolApiUrl: 'http://localhost:4200/',
  meetingUrl: 'http://localhost:4200/api',
  SENDGRID_API_KEY: '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'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
