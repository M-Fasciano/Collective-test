var fixedBody = require('./fixed-body');

var mainNav = {
    options: {
        active: 'js-is-active',
        sidebar: document.querySelector('.sidebar')
    },
    init: function() {
        var self = this;
        
        // initialise toggleHandler
        self.toggleHandler()

        // remove class js-fixed when orientation change
        window.addEventListener("orientationchange", function() {
            self.options.sidebar.style = '';
        });
        
    },
    toggleHandler: function() {
        var self = this,
            menu = document.querySelector('.menu');
        
        // toggle class js-is-active to open/close sidebar
        menu.onclick = function() {

            (this.classList.contains(self.options.active) === true) ? this.classList.remove(self.options.active) : this.classList.add(self.options.active);

            self.options.sidebar.classList.toggle('js-show-sidebar');

            self.options.sidebar.style.transition = "left 1s";

            // add class js-fixed to body
            fixedBody.init();

        }
    
    }

}

module.exports = mainNav;