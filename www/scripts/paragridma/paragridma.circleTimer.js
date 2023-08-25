// base on: http://blakek.us/labs/jquery/css3-pie-graph-timer/

function drawTimer(percent){
    "use strict";
}

$.fn.circleTimer = function (method) {
    "use strict";

    var timer = $(this);
    console.log(timer);


    if ( circleTimerMethods[method] ) {
        return circleTimerMethods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
        // Default to "init"
        return methods.init.apply( this, arguments );
    } else {
        $.error( 'Method ' +  methodOrOptions + ' does not exist on $.circleTimerMethods' );
    }


    function stopWatch(){
        var seconds = (timerFinish-(new Date().getTime()))/1000;
        if(seconds <= 0){
            drawTimer(100);
            clearInterval(timer);
            $('input[type=button]#watch').val('Start');
            alert('Finished counting down from '+timerSeconds);
        }else{
            var percent = 100-((seconds/timerSeconds)*100);
            drawTimer(percent);
        }
    }


    return this.each(function() {
            var timer;
            var timerCurrent;
            var timerFinish;
            var timerSeconds;


            $(document).ready(function(){
                $('input[type=button]#percent').click(function(e){
                    e.preventDefault();
                    drawTimer($('input[type=text]#percent').val());
                });
                $('input[type=button]#size').click(function(e){
                    e.preventDefault();
                    $('.timer').css('font-size',$('input[type=text]#size').val()+'px');
                });
                $('input[type=button]#watch').click(function(e){
                    e.preventDefault();
                    if($('input[type=button]#watch').val() == 'Start'){
                        $('input[type=button]#watch').val('Stop');
                        timerSeconds = $('input[type=text]#watch').val();
                        timerCurrent = 0;
                        timerFinish = new Date().getTime()+(timerSeconds*1000);
                        timer = setInterval('stopWatch()',50);
                    }else{
                        $('input[type=button]#watch').val('Start');
                        clearInterval(timer);
                    }
                });
                $('input[type=button]#watch').click();
            });

    });
};

var circleTimerMethods = {
    draw : function(percent) {
        // $($0).circleTimer('draw',60);

        $('.timer').html('<div id="slice"'+(percent > 50?' class="gt50"':'')+'><div class="pie"></div>'+(percent > 50?'<div class="pie fill"></div>':'')+'</div>');
        var deg = 360/100*percent;
        $('#slice .pie').css({
            '-moz-transform':'rotate('+deg+'deg)',
            '-webkit-transform':'rotate('+deg+'deg)',
            '-o-transform':'rotate('+deg+'deg)',
            'transform':'rotate('+deg+'deg)'
        });
    },
    show : function( ) {    },// IS
    hide : function( ) {  },// GOOD
    update : function( content ) {

    }// !!!
};