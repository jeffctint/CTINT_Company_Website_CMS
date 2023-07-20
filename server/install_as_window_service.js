// Install NodeJS as Windows Service

// Load the node-windows module
var Service = require('node-windows').Service;

// CHANGE THIS: Set the service name and description.
var service_name = 'CTINT HKDL APP GENESYS ENGAGE';
var service_description = 'CTINT HKDL APP GENESYS ENGAGE';

// CHANGE THIS: Set the script path. This is relative to the current directory of this file.
var script_path = 'server.js';

var args = getArgs();

// Set the logon account and password if any
if (typeof args.domain !== 'undefined' && typeof args.account !== 'undefined' && typeof args.password !== 'undefined') {
  svc.logOnAs.domain = args.domain;
  svc.logOnAs.account = args.account;
  svc.logOnAs.password = args.password;
}

// Set the logId
var logId = args.logId || '0';

// Create a new service object
var svc = new Service({
  name: service_name,
  description: service_description,
  script: script_path,
  env: [
    {
      name: 'logId',
      value: logId,
    },
  ],
});

if (!args.uninstall) {
  // Listen for the "install" event, which indicates the
  // process is available as a service.
  svc.on('install', function () {
    console.log('Install complete.');
    svc.start();
    console.log('Start complete.');
    console.log('The service exists: ', svc.exists);
  });

  svc.install();
} else {
  // Listen for the "uninstall" event so we know when it's done.
  svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists:', svc.exists);
  });

  // Uninstall the service.
  svc.uninstall();
}

// Function to get arguments from the command line if any
function getArgs() {
  var args = {};
  process.argv.slice(2, process.argv.length).forEach(function (arg) {
    // long arg
    if (arg.slice(0, 2) === '--') {
      var longArg = arg.split('=');
      var longArgFlag = longArg[0].slice(2, longArg[0].length);
      var longArgValue = longArg.length > 1 ? longArg[1] : true;
      args[longArgFlag] = longArgValue;
    }
    // flags
    else if (arg[0] === '-') {
      var flags = arg.slice(1, arg.length);
      args[flags] = true;
    }
  });
  return args;
}

// If needed to uninstall the service, run the following command in PowerShell as Administrator:
// Remove-Service - Name "YourServiceName"
// After that, you may need to remove from registry too. Run this command in PowerShell as Administrator:
// sc.exe delete "YourServiceName"
