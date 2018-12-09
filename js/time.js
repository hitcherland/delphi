class BeatManager extends DelphiElement {
    get bpm() { return parseFloat( parseInt( this.getAttribute( "bpm", 120 ) ) ); }
    set bpm( val ) { 
        this.setAttribute( "bpm", val ); 
    }

    get beat_duration() {
        return 60.0 / this.bpm;
    }

    run() {
        var this_ = this;
        function runner() {
            var now = this_.audioContext.currentTime;
            var beat_num = Math.round( now / this_.beat_duration );
            var adjusted_now = Math.round( now / this_.beat_duration ) * this_.beat_duration;
            this_.beat( beat_num, adjusted_now, now );
            var next_beat_in = this_.beat_duration + adjusted_now - this_.audioContext.currentTime;
            window.setTimeout( runner, next_beat_in * 1000 );
        }
        runner();
    } 

    onload() {
        super.onload();
        this.run();
    }
}

class Clock extends DelphiElement {
    get period() { return this.getAttribute( "period", 8 ); }
    set period( val ) { this.setAttribute( "period", val ); }

    get offset() { return this.getAttribute( "offset", 0 ); }
    set offset( val ) { this.setAttribute( "offset", val ); }

    beat( beat_num, beat_fixed_time, beat_real_time ) {
        if( beat_num % this.period == this.offset ) {
            super.beat( beat_num, beat_fixed_time, beat_real_time );
        }
    }
}

customElements.define( 'delphi-beat', BeatManager );
customElements.define( 'delphi-clock', Clock);
