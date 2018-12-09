/*
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var gain = audioCtx.createGain();
gain.connect( audioCtx.destination );
var convolver = audioCtx.createConvolver();
convolver.connect( audioCtx.destination );
*/

//https://stackoverflow.com/a/22538980
//convolver.buffer = impulseResponse( 2, 1, false );

class DelphiGain extends DelphiElement {
    constructor() {
        super();
        this.gainNode = this.audioContext.createGain();
    }

    get gain() { return parseFloat( this.getAttribute( "gain", 1 ) ); }
    set gain( val ) { 
        this.setAttribute( "gain", val ); 
        this.gainNode.gain.value = val;
    }
 
    onload() {
        super.onload();
        this.gainNode.connect( this.destination );
        this.destination = this.gainNode;
        this.gain = this.gain;
        var gain_el = document.createElement( "input" );
        this.insertBefore( gain_el, this.firstChild );
        gain_el.type="range";
        gain_el.setAttribute( "min", 0 ); 
        gain_el.setAttribute( "max", 2 ); 
        gain_el.setAttribute( "step", 0.01 ); 
        gain_el.setAttribute( "value", this.gain ); 
        var this_ = this;
        gain_el.onchange = function() {
            this_.gain = this.value;
        };
    }
}

customElements.define( 'delphi-gain', DelphiGain);

class DelphiReverb extends DelphiElement {
    constructor() {
        super();
        this.convolverNode = this.audioContext.createConvolver();
        this.impulseProperties = [ 4, 1, false ];
    }

    get duration() { return parseFloat( this.getAttribute( "duration", 4 ) ); }
    set duration( val ) { 
        this.setAttribute( "duration", val ); 
        this.impulseResponse();
    }

    get decay() { return parseFloat( this.getAttribute( "decay", 4 ) ); }
    set decay( val ) { 
        this.setAttribute( "decay", val ); 
        this.impulseResponse();
    }

    get reverse() { return this.getAttribute( "reverse", "false" ) == "true" ; }
    set reverse( val ) { 
        this.setAttribute( "reverse", val ); 
        this.impulseResponse();
    }
 
    impulseResponse() {
        var decay = this.decay;
        var sampleRate = this.audioContext.sampleRate;
        var length = sampleRate * this.duration;
        if( length == 0 ) {
            this.convolverNode.buffer = undefined;
            return;
        }
        console.log( length, sampleRate );
        var impulse = this.audioContext.createBuffer(2, length, sampleRate);
        var impulseL = impulse.getChannelData(0);
        var impulseR = impulse.getChannelData(1);

        if (!decay)
            decay = 2.0;
        for (var i = 0; i < length; i++){
          var n = this.reverse ? length - i : i;
          impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
          impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        }

        this.convolverNode.buffer = impulse;
    }

    onload() {
        super.onload();
        this.impulseResponse();
        this.convolverNode.connect( this.destination );
        this.destination = this.convolverNode;
    }
}

customElements.define( 'delphi-reverb', DelphiReverb);
