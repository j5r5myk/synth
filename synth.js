$(document).ready(function() {
    try {
        context = new AudioContext();
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser. Use up-to-date chrome, safari, firefox or opera');
    }

    document.getElementById("start1").addEventListener("click", start);
    document.getElementById("stop1").addEventListener("click", stop);
    document.getElementById("lowpass").addEventListener("click", lowpass);
    document.getElementById("quiet").addEventListener("click", quiet);

    init();

    function init() {
    
        oscillator = context.createOscillator();
        gainNode = context.createGain();
        filter = context.createBiquadFilter();
    
        oscillator.frequency.value = 220;
        oscillator.type = "triangle";
        filter.type = (typeof filter.type === 'string') ? 'lowpass' : 0; // LOWPASS
        filter.frequency.value = 20000;
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(context.destination);
    
    }

    function start() {
        gainNode.gain.value = 1;
        oscillator.start(0);
    }

    function stop() {
        gainNode.gain.value = 0.0;
    }

    function lowpass() {
        filter.frequency.value = 500;    
    
    }

    function quiet() {
        gainNode.gain.value = 0.5;
    }



    changevolume = function(element) {
        var volume = element.value;
        var fraction = parseInt(element.value) / parseInt(element.max);
        // x^2 curve
        gainNode.gain.value = fraction * fraction;
    };

    changewave = function(element) {
        var wave = element.value;
        oscillator.type=wave;
    }

    changepitch = function(element) {
        var freq = element.value;
        oscillator.frequency.value=freq;
    }

    changefilterfreq = function(element) {
        var freq = element.value;
        filter.frequency.value=freq;
    }

    changeFilterRes = function(element) {
        var freq = element.value;
        filter.Q.value=freq;
    }
});
