'use strict';
var MainNav = require('./modules/main-nav');
var GetUsers = require('./modules/get-users');

document.addEventListener('DOMContentLoaded', function() {
    MainNav.init();
    GetUsers.init();
})