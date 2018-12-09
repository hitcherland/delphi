var audioContext = new (window.AudioContext || window.webkitAudioContext)();

function makeInput( name, type, value ) {
    var label = document.createElement( "label" );
    var input = document.createElement( "input" );
    var container = document.createElement( "div" );
    container.appendChild( label );
    container.appendChild( input );

    label.innerHTML = name;
    input.setAttribute( "name", name );
    input.setAttribute( "type", type );
    input.setAttribute( "value", value );
    return container;
}

class DelphiElement extends HTMLElement {
    constructor() {
        super();
        var this_ = this;
        this.audioContext = audioContext;
        this.destination = audioContext.destination;
        this.elements = {};
        window.addEventListener( "load", function() { this_.onload() } );
    }

    getAttribute( key, default_value ) {
        var value = super.getAttribute( key )
        return value !== null ? value : default_value
    }
    
    beat( beat_num, beat_fixed_time, beat_real_time ) {
        Array.from( this.children )
            .filter( child => child instanceof DelphiElement )
            .forEach( beatChild => {
                beatChild.beat( beat_num, beat_fixed_time, beat_real_time) 
            })
    }

    onBeat( /*...callbacks*/ ) {
        var callbacks = Array.from( arguments );
        this.beatChildren.push( ...callbacks );
    }

    onload() {
        if( this.props !== undefined ) {
            this.props.forEach( a => {
                var name = a[ 0 ];
                var type = a[ 1 ];
                var default_value = a[ 2 ];
                var element = a[ 3 ].cloneNode( true );
                this.elements[ name ] = element;
            
                this.insertBefore( element, this.firstChild );
                this[ name ] = this[ name ];
                var this_ = this;
                element.children[ 1 ].onchange = function() {
                    this_[ name ] = this.value;
                };
            });

        }

        var parentElement = this.parentNode;
        if( parentElement instanceof DelphiElement ) {
            this.destination = parentElement.destination;
        } else {
            this.destination = audioContext.destination;
        }
    }

}
customElements.define( 'delphi-element', DelphiElement);

DelphiElement.addProperty = function( name, type, default_value ) {
    console.log( this, name, this.prototype );
    if( this.prototype.props ===undefined ) {
        this.prototype.props = new Array();
    }

    var element;
    switch( type ) {
        case "int": element = makeInput( name, "number", default_value ); break;
        case "float": element = makeInput( name, "number", default_value ); break;
        default: return val;
    }


    this.prototype.props.push([name,type,default_value, element]);
    Object.defineProperty( this.prototype, name, {
        get: function() { 
            var val = this.getAttribute( name, default_value);
            switch( type ) {
                case "int": return parseInt( val ); break;
                case "float": return parseFloat( val ); break;
                default: return val;
            }
            return  
        },
        set: function( val ) {
            switch( type ) {
                case "int": val = parseInt( val ); break;
                case "float": val = parseFloat( val ); break;
            }

            this.setAttribute( name, val ); 
            if( this.elements[ name ] !== undefined ) {
                this.elements[ name ].children[ 1 ].value = val;
            }
            //this.gainNode.gain.value = val;
        }
    });


}
