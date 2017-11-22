var Animation = function()
{
    var capitalize = function( string )
    {
        return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
    };

    this.from = function( parent, target, attr, start, end, duration )
    {
        var amount = Math.abs( end - start );
        var sign = Math.sign( end - start );
        var value = 0;
        var tick;
        var elapsed;
        var property = 'offset' + capitalize( attr );
        var speed = 4;

        var animate = function( time )
        {
            if ( !tick ) tick = time;

            elapsed = time - tick;

            // fixed duration : fixed speed
            value = duration ? sign * amount * elapsed / ( duration * 1000 ) : value + sign * speed;

            if ( target[ property ] < end )
            {
                target.style.opacity = value / amount;
                target.style[ attr ] = value + 'px';
                parent.style[ attr ] = 'auto';

                requestAnimationFrame( animate );
            }
        };

        if ( target ) animate();
    };
};