$(document).ready(function() {
    try {
        context = new AudioContext();
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser. Use up-to-date chrome, safari, firefox or opera');
    }

    document.getElementById("start").addEventListener("click", start);
    document.getElementById("stop").addEventListener("click", stop);
	// document.getElementById("lowpass").addEventListener("click", lowpass);

    var analyser = context.createAnalyser();
    var canvas = document.querySelector('#visualizer');
    var canvasCtx = canvas.getContext("2d");
    var stop = false;
    init();

    function init() {
        car = new carrier("sine", 440);
        mod = new modulator("sine", 964, 300);
        mod.gain.connect(car.osc.frequency);
        car.gain.gain.value = 0;
        car.gain.connect(context.destination);
    
        // oscillators just for visual
        vCar = new carrier("sine", 440);
        vMod = new modulator("sine", 964, 300);
        vMod.gain.connect(vCar.osc.frequency);
        vCar.gain.gain.value = 0;
        
        //carrier.osc.connect(analyser);
        vCar.osc.connect(analyser);
        //visualize();
    }

    // thank you https://github.com/mdn/voice-change-o-matic/blob/gh-pages/scripts/app.js
    function visualize() {
        console.log("Enter visualize");
        WIDTH = canvas.width;
        HEIGHT = canvas.height;
        console.log("WIDTH: " + WIDTH);
        analyser.fftSize = 256;
        var bufferLength = analyser.fftSize;
        console.log(bufferLength);
        var dataArray = new Uint8Array(bufferLength);
      
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        
        var draw = function() {
            console.log("Enter draw");
            // stop animating
            if (stop) {
	            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);	
                return;
            }
            drawVisual = requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);

            //canvasCtx.fillStyle = 'rgb(200, 200, 200)';
			canvasCtx.fillStyle = 'rgb(256, 256, 256)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

            canvasCtx.beginPath();

            var x = 0;
            var sliceWidth = WIDTH * 1.0 / bufferLength;
            
            for(i = 0; i < bufferLength; i++) {

              var v = dataArray[i] / 128.0;
              var y = v * HEIGHT/2;

              if(i === 0) {
                canvasCtx.moveTo(x, y);
              } else {
                //if (y == HEIGHT/2) 
                 //   break;
                canvasCtx.lineTo(x, y);
              }

              x += sliceWidth;
            }

            canvasCtx.lineTo(canvas.width, canvas.height/2);
            canvasCtx.stroke();
        };
        drawVisual = requestAnimationFrame(draw);
        draw();
    }
 
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
        car.gain.gain.value = 1;
        visualize();
        stop = false;
    }

    function stop() {
        car.gain.gain.value = 0;
        vCar.gain.gain.value = 0;
        stop = true;
        //visualize();
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
        //visualizer();
    }

    changepitch = function(element) {
        var freq = element.value;
        oscillator.frequency.value=freq;
    }
    
    changecarrier = function(element) {
        var carrierFreq = element.value;
        car.osc.frequency.value=carrierFreq;
        //visualize();
    }
    
    changemodulator = function(element) {
        var modulatorFreq = element.value;
        mod.osc.frequency.value=modulatorFreq;
        vMod.osc.frequency.value=modulatorFreq;
        //visualize();
    }
    changeFMGain = function(element) {
        var FMGain = element.value;
        mod.gain.gain.value=FMGain;
        vMod.gain.gain.value=FMGain;
        //visualize();
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
