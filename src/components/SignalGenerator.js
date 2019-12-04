/*
  Johan Karlsson (DonKarlssonSan)

  Read my blog post about Web Audio API:
  https://codepen.io/DonKarlssonSan/blog/fun-with-web-audio-api
  
  Browser support for Web Audio API:
  http://caniuse.com/#feat=audio-api
  
  Fourier Series:
  http://en.wikipedia.org/wiki/Fourier_series
  
  Octave:
  http://en.wikipedia.org/wiki/Octave
*/
(function() {
    var AudioContext;
    var audioContext;
    var oscillator;
    var gainNode;
    var analyser;
    var isPlaying = false;  
    var canvas = document.getElementById("theCanvas");
    var canvasContext = canvas.getContext("2d");    
    var dataArray;
    var analyserMethod = "getByteTimeDomainData";
    var frequencySlider = document.getElementById("frequencySlider");
    // Fourier Coefficients used for the custom wave
    var first = 33;
    var second = 33;
    var third = 33;
  
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
  
    function initAudio() {
      AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
      // The oscillator creates the sound waves.
      // As you can see on the canvas when drawing
      // the square wave, the wave is not perfectly
      // square. What you see is the Gibbs phenomenon
      // caused by the oscillator using Fourier series
      // to approximate the different wave types.
      oscillator = audioContext.createOscillator();
      oscillator.type = "sine";
      // The tone A
      // http://en.wikipedia.org/wiki/A440_(pitch_standard)
      oscillator.frequency.value = 440;
      oscillator.start(0);
      // Controls the volume
      gainNode = audioContext.createGain();
      gainNode.gain.value = 0;
      oscillator.connect(gainNode);
      // Provides info about the sound playing
      analyser = audioContext.createAnalyser();            
      gainNode.connect(analyser);
      gainNode.connect(audioContext.destination);
      
      // Oscillator -- Gain +-- Out (speaker/phones)  
      //                    |   
      //                    +-- Analyser    
    };
  
    function startDrawing() {
      analyser.fftSize = 2048;
      var bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      canvasContext.lineWidth = 1;
      canvasContext.strokeStyle = 'rgba(0, 0, 0, 1)';
      function drawAgain() {
        canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        requestAnimationFrame(drawAgain);
  
        analyser[analyserMethod](dataArray);
        for(var i = 0; i < bufferLength; i++){
          canvasContext.beginPath();
          canvasContext.moveTo(i, 255);
          canvasContext.lineTo(i, 255 - dataArray[i]);
          canvasContext.closePath();
          canvasContext.stroke();
        }
      }
  
      drawAgain();
    }
    
    var speakerIcon = document.getElementById("speaker");
    var toggleLabel = document.getElementById("toggleLabel");
  
    function toggleSound () {
      if(isPlaying) {
        speakerIcon.classList.remove("fa-volume-off");
        speakerIcon.classList.add("fa-volume-up");
        gainNode.gain.value = 0;
        toggleLabel.innerHTML = "Start!";
        isPlaying = false;
      } else {
        speakerIcon.classList.remove("fa-volume-up");
        speakerIcon.classList.add("fa-volume-off");
        gainNode.gain.value = 1;
        toggleLabel.innerHTML = "Stop!"
        isPlaying = true;
      }
    }
  
    document.getElementById("toggleSound").addEventListener("click",
      toggleSound, false);
  
    // Fourier series
    function customWave(first, second, third) {
      document.getElementById("first").value = first;
      document.getElementById("second").value = second;
      document.getElementById("third").value = third;
      // You could create several oscillator nodes with different
      // frequencies and then combine them. But here we use a
      // PeriodicWave to combine the first three sin components.
      // https://developer.mozilla.org/en-US/docs/Web/API/PeriodicWave
      var real = new Float32Array(4);
      var imag = new Float32Array(4);
      // a0 (or DC offset)
      real[0] = 0;
      imag[0] = 0;
      
      // First term. The frequency, f, set on the oscillator.
      // sin
      real[1] = first/100;
      // cos 
      imag[1] = 0;
  
      // Second term, f * 2, one octave up. 
      // sin
      real[2] = second/100;
      // cos 
      imag[2] = 0;
  
      // Third term, f * 3, two octaves up.
      // sin
      real[3] = third/100;
      // cos 
      imag[3] = 0;
  
      var wave = audioContext.createPeriodicWave(real, imag);
      // "the browser performs an inverse Fourier transform to 
      // get a time domain buffer for the frequency of the 
      // oscillator" -MDN
      oscillator.setPeriodicWave(wave);  
    }
  
    function applyClicked() {
      first = parseInt(document.getElementById("first").value);
      second = parseInt(document.getElementById("second").value);
      third = parseInt(document.getElementById("third").value);
      customWave(first, second, third);
    }
    document.getElementById("applyButton").addEventListener("click",
      applyClicked, false);
  
    function waveDropdownClicked (event) {
      event = event || window.event;
      var target = event.target || event.srcElement;
      if(target.nodeName === "A") {
        var waveType = target.id;
        console.log(waveType);
        oscillator.type = waveType;
        if(waveType === "custom") {
          customWave(first, second, third);
        }
      }
    };
  
    document.getElementById("waveDropdown").addEventListener("click", 
      waveDropdownClicked, false);
  
    frequencySlider.min = 5;
    frequencySlider.max = 10000;
    frequencySlider.value = 440;
    frequencySlider.step = 1;
    frequencySlider.addEventListener("change", function () {
      oscillator.frequency.value = this.value; 
      document.getElementById("frequency").innerHTML = this.value;
    });
    frequencySlider.addEventListener("mousemove", function () {
      oscillator.frequency.value = this.value; 
      document.getElementById("frequency").innerHTML = this.value;
    });
  
    initAudio();
    startDrawing();
  })();