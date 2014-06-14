$(function () {
    "use strict";

    var toggleLink = $("#toggleFixedBar"),
        fixedBar = $("#fixedBar");

    toggleLink.click(function(e) {
        e.preventDefault();
        fixedBar.toggleClass("opened");
    });
});

/*window.onload = function() {
    "use strict";
    //console.timeEnd("window.load time");
};
*/



