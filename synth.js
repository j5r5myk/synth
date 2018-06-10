$(document).ready(function() {
    try {
        context = new AudioContext();
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser. Use up-to-date chrome, safari, firefox or opera');
    }

    document.getElementById("start").addEventListener("click", start);
    document.getElementById("stop").addEventListener("click", stop);
    document.getElementById("lowpass").addEventListener("click", lowpass);
    document.getElementById("quiet").addEventListener("click", quiet);

    init();

    function init() {
        /*         
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
        */ 

        carrier = new carrier("sine", 440);
        modulator = new modulator("sine", 964, 300);
        modulator.gain.connect(carrier.osc.frequency);
        carrier.gain.gain.value = 0;
        carrier.gain.connect(context.destination);
        

    }

    // TODO: use this in other functions
    function osc() {
        osc = context.createOscillator();
        oscGain = context.createGain();
        osc.type = "sawtooth";
        gain.gain.value = 1;
        osc.frequency.value = 440;
    }

    function modulator (type, freq, gain) {
        this.osc = context.createOscillator();
        this.gain = context.createGain();
        this.osc.type = type;
        this.osc.frequency.value = freq;
        this.gain.gain.value = gain;
        this.osc.connect(this.gain);
        this.osc.start(0);
    }

    function carrier (type, freq) {
        this.osc = context.createOscillator();
        this.gain = context.createGain();
        this.osc.type = type;
        this.osc.frequency.value = freq;
        this.osc.connect(this.gain);
        this.osc.start(0);
    }


    function start() {
        carrier.gain.gain.value = 1;
        // gainNode.gain.value = 1;
        // oscillator.start(0);
    }

    function stop() {
        carrier.gain.gain.value = 0.0;
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
    
    changecarrier = function(element) {
        var carrierFreq = element.value;
        carrier.osc.frequency.value=carrierFreq;
    }
    
    changemodulator = function(element) {
        var modulatorFreq = element.value;
        modulator.osc.frequency.value=modulatorFreq;
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
