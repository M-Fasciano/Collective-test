var fixedBody = require('./fixed-body');

var getUsers = {
    options: {
        url: 'https://randomuser.me/api/?results=20&nat=gb',
        users: '.main-content__users',
        visible: 'js-is-visible'
    },
    init: function() {
        var self = this;

        // build users list
        self.ajax_get(self.options.url, function(data) {
        
            var users = '';
                users += '<ul>';
                    for (var i = 0; i < data['results'].length; i++) {
                        users += '<li><img src="'+ data['results'][i]['picture']['thumbnail'] +'" alt="'+ data['results'][i]['name']['first'] +' '+ data['results'][i]['name']['last'] +'" />' + data['results'][i]['name']['first'] +' '+ data['results'][i]['name']['last'] +
                                '<div class="main-content__users__info">' +
                                    '<div><span></span><img src="'+ data['results'][i]['picture']['large'] +'" alt="'+ data['results'][i]['name']['first'] +' '+ data['results'][i]['name']['last'] +'" />' + data['results'][i]['name']['first'] +' '+ data['results'][i]['name']['last'] +'</div>' +
                                    '<ul>' +
                                        '<li>City</li>'+ 
                                        '<li>'+ data['results'][i]['location']['city'] +'</li>' +
                                        '<li>Cell</li>'+ 
                                        '<li>'+ data['results'][i]['cell'] +'</li>' +
                                        '<li>E-mail</li>'+
                                        '<li>'+ data['results'][i]['email'] +'</li>' +
                                    '</ul>' +
                                '</div></li>'
                    }
                users += "</ul>";
            
            document.querySelector(self.options.users).innerHTML = users;

            // initialise toggleHandler funtction
            self.toggleHandler();
            
        });
 
    },
    ajax_get: function(url, callback) {
        var xhr = new XMLHttpRequest();
        
        // make ajax call
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                try {
                    var data = JSON.parse(xhr.responseText);

                } catch(err) {

                    return;
                }
                callback(data);
            }
        };
    
        xhr.open("GET", url, true);
        xhr.send();
    },
    toggleHandler: function() {
        var self = this;

        // click event to add/remove js-is-visible
        [].forEach.call(document.querySelectorAll(self.options.users + ' ul li'), function(el) {
            el.addEventListener('click', function(e) {
                e.preventDefault();

                (this.classList.contains(self.options.visible) === true) ? this.classList.remove(self.options.visible) : this.classList.add(self.options.visible);

                var w = window.innerWidth;

                // check if window size is smaller than 1024px 
                // if so add class js-fixed to body
                if(w < 1024) {
                    fixedBody.init();
                }

            }, false);
        });

    }
}

module.exports = getUsers;