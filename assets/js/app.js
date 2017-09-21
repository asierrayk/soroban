$(document).ready(function() {
    $('#game').hide();

    $('#start').click(function() {
        $('#welcome').hide();
        startGame();
    });

    $('#guess').on('input', function(e) {
        if ($(this).val() == $('#answer').val()) {
            var score = parseInt($('#score').text());
            score++;
            $('#score').text(score);
            $(this).val('');

            generateQuestion();
        };

    });
    $('#guess').focusout(function() {
        $(this).focus();
    });

    $('#gameClock').change(function() {
        if ($(this).text() == 'GAME OVER'){
            $('#guess').prop('disabled', true);
        };
    });

    $('#showAgain').click(function(){
        var numbers = window.numbers;
        showNumbers(numbers.numbers_list);
    });

    $(document).bind('keydown', 'ctrl+q', function() {
        var numbers = window.numbers;
        showNumbers(numbers.numbers_list);
    });
});


function startGame() {
    var duration = $('#duration').find(':selected').val();
    $('#gameClock').text(duration);
    $('#game').show();
    var max = $('#max').val();
    var min = $('#min').val();
    var numNumbers = $('#numNumbers').val();
    var numbers = {
        numbers_list: [],
        numNumbers: parseInt(numNumbers),
        max: parseInt(max),
        min: parseInt(min),

        genNumbers: function(){
            var getRandom = function(min, max) {
                var rand = Math.floor(Math.random() * (max - min + 1)) + min;
                while (rand == 0){
                    rand = Math.floor(Math.random() * (max - min + 1)) + min;
                };
                return rand;
            };
            var populate = function(n, min, max){
                var tempNums = [];
                for (i=0; i < n; i++){
                    var rand = getRandom(min, max);
                    tempNums.push(rand);
                };
                return tempNums;
            };
            var numbers = populate(this.numNumbers, this.min, this.max);
            var sum = numbers.reduce((a,b) => a+b, 0);
            while (sum < min || max < sum) {
                numbers = populate(this.numNumbers, this.min, this.max);
                sum = numbers.reduce((a,b) => a+b, 0);
            };
            this.numbers_list = numbers;
            return;
        },
        getSum: function(){
            return this.numbers_list.reduce((a,b) => a+b,0);
        },
    };
    window.numbers = numbers;


    function timer() {
        $('#gameClock').text(duration);
        duration -= 1;

        if (duration < 0) {
            clearInterval(counter);
            $('#gameClock').text('GAME OVER').trigger('change');
            return;
        }
    }

    generateQuestion();
    var counter = setInterval(timer, 1000);
    $('#guess').focus();
}


function generateQuestion() {
    var numbers = window.numbers;
    numbers.genNumbers();
    showNumbers(numbers.numbers_list);
    var sum = numbers.getSum();
    $('#answer').val(sum);
}


function showNumbers(vals) {
    var screen = $('#numbers');
    // To milissecs
    var blinkTime = parseFloat($('#blinkTime').val()) * 1000;

    var keys = Object.keys(vals);
    var i = 0;
    var interval = setInterval(function() {
        var val = vals[keys[i]];
        screen.text(val);
        put(screen);
        i++;
        if (i == keys.length){
            setTimeout(function(){
                rmv(screen);
                clearInterval(interval);
            }, blinkTime);
        };
    }, blinkTime);
}


function put(el){
    el.css('opacity', '1.0');
}


function rmv(el){
    el.css('opacity', '0.0');
}
