
var fixedBoby = {
    init: function() {
        setTimeout(function(){  
            var body = document.getElementsByTagName("body")[0];
            body.classList.toggle('js-fixed');
        }, 1000);
    }
}

module.exports = fixedBoby;