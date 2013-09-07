'use strict';

/* Services */
var services = angular.module('ecoTravel.services', []);

// Demonstrate how to register services
// In this case it is a simple value service.
services.value('version', '0.1.1');

services.value('serverURL', 'http://78.47.47.172:8080');

services.value('chartColors', ['#1D72AA', '#C44440', '#8CBB4E', '#795892', '#0099B2', '#F38533', '#8BAAD1']);

services.value('transportNames', {bike: 'kolo', bus:'avtobus', train:'vlak', car:'avto', bicycle:'kolo', walk:'hoja'});

