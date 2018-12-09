var tones = {
    "C": 261.63,
    "C#": 277.18,
    "D": 293.66,
    "E": 329.63,
    "F": 349.23,
    "G": 392.00,
    "A": 440.00,
    "B": 493.88,
}

class DelphiTone extends DelphiElement {
    beat( beat_num, beat_fixed_time, beat_real_time ) {
        var notes = Array.from( this.childNodes ).filter( node => node.nodeType == Node.TEXT_NODE )[ 0 ].textContent.replace( /\s/g, '' );
        var index = this.index;
        var note = notes[ index ];
        index += 1;
        index %= notes.length;
        this.index = index;

        if( tones[ note ] === undefined )
            return;

        var frequency = tones[ note ] * this.pitch;

        var oscillator = new OscillatorNode( this.audioContext, {
            "frequency": frequency,
            "type": this.type,
        });
        oscillator.connect( this.destination );
        oscillator.start( beat_fixed_time );
        var beat_duration = this.closest( "delphi-beat" ).beat_duration;
        oscillator.stop( beat_fixed_time + beat_duration * this.duration );

        super.beat( beat_num, beat_fixed_time, beat_real_time );
    }
}
DelphiTone.addProperty( "pitch", "float", 1 );
DelphiTone.addProperty( "duration", "float", 1 );
DelphiTone.addProperty( "index", "int", 1 );
customElements.define( 'delphi-tone', DelphiTone);
