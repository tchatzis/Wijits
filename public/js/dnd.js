var DND = function()
{
    var dragged = {};
    var dropspot = {};
    var list = {};
    var self = this;

    var enable = function()
    {
        dropspot.style.borderColor = 'transparent';
        dropspot.style.height = "24px";
        dropspot.style.transition = '0.3s ease-in-out';
        dropspot.style.display = "flex";

        inputs();
    };

    var disable = function()
    {
        dropspot.style.borderColor = 'transparent';
        dropspot.style.height = "6px";
    };

    var inputs = function()
    {
        dropspot.removeEventListener( "click", self.click );

        var key  = document.createElement( "input" );
            key.placeholder = "key";
            key.style.width = "80px";
            key.style.display = "flex";
        var val = document.createElement( "input" );
            val.placeholder = "value";
            val.style.width = "160px";
        var btn = document.createElement( "div" );
            btn.classList.add( "button" )
            btn.innerText = "+";
            btn.addEventListener( "click", self.insert );

        dropspot.appendChild( key );
        dropspot.appendChild( val );
        dropspot.appendChild( btn );
    };

    var insert = function( element )
    {
        dropspot.style.height = "6px";
        dropspot.innerHTML = null;

        var parent = dropspot.parentNode.parentNode;
            parent.insertBefore( element, dropspot.parentNode );
    };

    var target = function( dropspot )
    {
        var parent = dropspot.parentNode;
        var el;

        for ( var c = 0; c < parent.childNodes.length; c++ )
        {
            if ( parent.childNodes[ c ].classList.contains( 'ul' ) )
            {
                el = parent.childNodes[ c ];
                return el;
            }
        }

        el = document.createElement( 'div' );
        el.classList.add( 'ul' );

        parent.appendChild( el );

        return el;
    };

    this.init = function( el )
    {
        var object = utils.dom( el, 1 );

        list = el;
    };

    this.insert = function( e )
    {
        e.stopPropagation();

        var object = {};
        var code = '';
        var array = false;

        for ( var c = 0; c < dropspot.childNodes.length; c++ )
        {
            if ( dropspot.childNodes[ c ].placeholder ) object[ dropspot.childNodes[ c ].placeholder ] = dropspot.childNodes[ c ].value;
        }

        code += array ? '<div class="ul" data-index="' + object.key + '" draggable="true" dragitem dropitem>' : '<div class="ul" data-key="' + object.key + '" draggable="true" dragitem dropitem>';
        code += '<div class="insert" dropitem insertitem></div>';
        code += '<div class="item"><span>' + object.key + ':</span> ' + object.value + '</div>';
        code += '</div>';

        insert( code );
    };

    this.click = function( e )
    {
        e.stopPropagation();

        dropspot = e.target;
        dropspot.contentEditable = true;
        dropspot.style.outline = "none";

        enable();
    };

    this.save = function( e )
    {
        dropspot = e.target;
        //TODO: get key / path
        console.log( "save", dropspot.innerText );
        dropspot.innerHTML = null;
    };

    this.leave = function( e )
    {
        e.preventDefault();
        e.stopPropagation();

        if ( dropspot.classList.contains( 'insert' ) )
        {
            disable();
            dropspot.innerHTML = null;
        }
    };

    this.over = function( e )
    {
        e.preventDefault();
        e.stopPropagation();

        dropspot = e.target;

        if ( dropspot.classList.contains( 'insert' ) )
        {
            enable();
        }
    };

    this.drag = function( e )
    {
        e.stopPropagation();

        dragged = e.target;
        dragged.style.opacity = 0.3;

        if ( dragged.classList.contains( 'key' ) )
        {
            dragged.parentNode.style.borderRadius = "8px";
            dragged.parentNode.style.backgroundColor = "#111111";
        }
    };

    this.drop = function( e )
    {
        e.preventDefault();
        e.stopPropagation();

        self.init( list );

        dragged.style.opacity = 1;

        disable();

        var parent;

        if ( dragged.classList.contains( 'key' ) )
        {
            dragged = dragged.parentNode;
            dragged.style.backgroundColor = "transparent";
        }

        // drag from array to insert - ok
        // drag from array to parent - ok
        // drag parent - ok


        //try
        {
            if ( dropspot.classList.contains( 'insert' ) )
            {
                insert( dragged );
            }
            else
            {
                parent = target( dropspot );
                parent.appendChild( dragged );
            }
        }
        //catch( err )
        {
            //   console.warn( 'Not Allowed', err );
        }
    };
};