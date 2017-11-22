( function()
{
    var index = 0;
    var head = document.head;
    var debug = false;
    var dependencies =
    [
        { type: 'css', directory: '', name: 'main' },
        { type: 'css', directory: '', name: 'layout' },
        { type: 'css', directory: '', name: 'table' },
        { type: 'css', directory: '', name: 'controls' },
        { type: 'css', directory: '', name: 'button' },
        { type: 'css', directory: '', name: 'wijits' },
        { type: 'css', directory: '', name: 'elements' },

        { type: 'js', directory: '', name: 'utils' },
        { type: 'js', directory: '', name: 'dnd' },
        { type: 'js', directory: 'angular', name: 'angular.min' },
        { type: 'js', directory: 'angular', name: 'angular-route' },
        { type: 'js', directory: 'firebase', name: 'firebase-app' },
        { type: 'js', directory: 'firebase', name: 'firebase-auth' },
        { type: 'js', directory: 'firebase', name: 'firebase-database' },
        { type: 'js', directory: '', name: 'global' },
        { type: 'js', directory: '', name: 'db' },
        { type: 'js', directory: '', name: 'wijits.services' },
        { type: 'js', directory: '', name: 'wijits.directives' },
        { type: 'js', directory: '', name: 'wijits.filters' },
        { type: 'js', directory: '', name: 'app.routes' },
        { type: 'js', directory: 'controllers', name: 'wijits.root' },
        { type: 'js', directory: 'controllers', name: 'wijits.analog' },
        { type: 'js', directory: 'controllers', name: 'wijits.array' },
        { type: 'js', directory: 'controllers', name: 'wijits.carousel' },
        { type: 'js', directory: 'controllers', name: 'wijits.color' },
        { type: 'js', directory: 'controllers', name: 'wijits.combobox' },
        { type: 'js', directory: 'controllers', name: 'wijits.digit' },
        { type: 'js', directory: 'controllers', name: 'wijits.eq' },
        { type: 'js', directory: 'controllers', name: 'wijits.grid' },
        { type: 'js', directory: 'controllers', name: 'wijits.knob' },
        { type: 'js', directory: 'controllers', name: 'wijits.meter' },
        { type: 'js', directory: 'controllers', name: 'wijits.multi' },
        { type: 'js', directory: 'controllers', name: 'wijits.number' },
        { type: 'js', directory: 'controllers', name: 'wijits.range' },
        { type: 'js', directory: 'controllers', name: 'wijits.samples' },
        { type: 'js', directory: 'controllers', name: 'wijits.slider' },
        { type: 'js', directory: 'controllers', name: 'wijits.single' },
        { type: 'js', directory: 'controllers', name: 'wijits.switch' },
        { type: 'js', directory: 'controllers', name: 'wijits.tree' },
    ];

    var load = function()
    {
        var d = dependencies[ index ];
        var tag;
        var url = d.type + "/" + d.directory + "/" + d.name + "." + d.type;

        switch( d.type )
        {
            case "js":
                tag = document.createElement( "script" );
                tag.src = url;
            break;

            case "css":
                tag = document.createElement( "link" );
                tag.type = "text/css";
                tag.rel = "stylesheet";
                tag.href = url;
            break;
        }

        head.appendChild( tag );

        tag.onload = function( e )
        {
            index++;

            if ( debug ) console.info( e.timeStamp, tag.name );
            if ( index < dependencies.length ) load();
        };
    };

    load();
} )();