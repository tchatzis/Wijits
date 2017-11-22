// common directives
var directive = function( name, template )
{
    template = template || name;

    app.directive( name, function()
    {
        return {
            restrict: 'E',
            scope:
            {
                name: "=",
                label: "=",
                data: "="
            },
            templateUrl: 'wijits/' + template + '.html'
        };
    } );
};

( function()
{
    var names =
    [
        'analog', 'array',
        'carousel', 'checkbox', 'checkboxes', 'color', 'combobox',
        'dial', 'digit',
        'eq',
        'grid',
        'knob', 'knobs',
        'multi',
        'number',
        'pans', 'peak',
        'radios', 'range', 'roller',
        'single', 'slider', 'slides', 'switch',
        'tree'
    ];

    for ( var i = 0; i < names.length; i++ )
    {
        directive( names[ i ] );
    }
} )();

var dnd = new DND();

// custom
app.directive ( 'branch', function( $compile )
{
    return {
        restrict: 'E',
        replace: true,
        scope:
        {
            name: '=',
            label: '=',
            data: '='
        },
        template: '',
        link: function( scope, element )
        {
            var info = utils.is( scope.data );
            var code = '<div>';
                code += '<div class="ul">';
                code += '<div class="item" dropitem>' + scope.label + '</div>';
                //code += '<div class="edge"></div>';
            var attribute;

            var item = function( array, key, value )
            {
                code += array ? '<div class="ul" data-index="' + key + '" draggable="true" dragitem dropitem>' : '<div class="ul" data-key="' + key + '" draggable="true" dragitem dropitem>';
                code += '<div class="insert" dropitem insertitem></div>';
                code += '<div class="item"><span>' + key + ':</span> ' + value + '</div>';
                //code += '<div class="edge"></div>';
                code += '</div>';
            };

            var traverse = function ( object, parent )
            {
                code += '<div class="ul">';

                for ( var key in object )
                {
                    if ( object.hasOwnProperty( key ) )
                    {
                        info = utils.is( object[ key ] );

                        if ( info.object )
                        {
                            attribute = parent.array ? 'data-index="' + key + '"' : 'class="ul" data-key="' + key + '"';
                            code += '<div ' + attribute + ' data-' + info.type + '="' + info.keys + '">';

                            if ( parent.object )
                            {
                                code += '<div class="insert" dropitem insertitem></div>';
                                code += '<div class="key" draggable="true" dragitem dropitem>' + key + ':</div>';
                            }

                            traverse( object[ key ], info );

                            code += '</div>';
                        }
                        else
                        {
                            item( parent.array, key, object[ key ] );
                        }
                    }
                }

                code += '</div>';
                info.array = false;
            };

            traverse( scope.data, utils.is( scope.data ) );

            code += '</div>';
            code += '</div>';
            //console.log( code );
            element.append( code );
            $compile( element.contents() )( scope );

            dnd.init( element[ 0 ] );
        }
    };
} );

/*app.directive( 'collection', function( $compile )
{
    return {
        restrict: 'E',
        replace: true,
        //scope:
        //{
            //name: '=',
            //data: '='
        //},
        link: function( scope, element )
        {
            for ( var item in scope.data )
            {
                if ( utils.is( scope.data[ item ] ).children )
                {
                    scope.childdata = scope.data[ item ];
                    console.log( scope.childdata );
                    //element.append( '<branch name="name" data="childdata"></branch>' );
                    $compile( element.contents() )( scope );

                    //console.log( scope._data, scope.data, element );
                }
                else
                {
                    element.append( '<div class="ul" item="' + item + '">' + scope.data + '</div>' );
                }
            }
        }
    }
} );*/

app.directive( 'dragitem', function( $compile )
{
    return {
        restrict: 'A',
        link: function( scope, element )
        {
            element[ 0 ].addEventListener( 'drag', dnd.drag );
            element[ 0 ].addEventListener( 'drop', dnd.drop );
            element[ 0 ].addEventListener( 'dragover', dnd.over );
            element[ 0 ].addEventListener( 'dragleave', dnd.leave );

            $compile( element.contents() )( scope );
        }
    };
} );

app.directive( 'dropitem', function( $compile )
{
    return {
        restrict: 'A',
        link: function( scope, element )
        {
            element[ 0 ].addEventListener( 'drop', dnd.drop );
            element[ 0 ].addEventListener( 'dragover', dnd.over );
            element[ 0 ].addEventListener( 'dragleave', dnd.leave );

            $compile( element.contents() )( scope );
        }
    };
} );

app.directive( 'insertitem', function( $compile )
{
    return {
        restrict: 'A',
        link: function( scope, element )
        {
            element[ 0 ].addEventListener( 'click', dnd.click );
            element[ 0 ].addEventListener( 'dblclick', dnd.save );

            $compile( element.contents() )( scope );
        }
    };
} );

app.directive( 'element', function()
{
    return function ( scope, element, attributes ) 
    {
        scope.init( { scope: scope, element: element[ 0 ], attributes: attributes } );

        item.addEventListener( "mousedown", function( e )
        {
            scope.init( { scope: scope, element: element[ 0 ], attributes: attributes } );
        } );

        item.addEventListener( "dblclick", function( e )
        {
            scope.reset( { scope: scope, element: element[ 0 ], attributes: attributes } );
        } );
    };
} );

app.directive( 'icon', function( $filter )
{
    var label;

    return {
        restrict: 'E',
        scope:
        {
            exception: '&',
            handler: '&',
            args: '=',
            disabled: "="
        },
        link: function( scope, element, attributes )
        {
            switch( attributes.label )
            {
                case "add":
                    label = "+";
                break;

                case "clear":
                    label = "x";
                break;

                case "data":
                    label = "▦";
                break;

                case "delete":
                    label = "-";
                break;

                case "next":
                    label = "→";
                break;

                case "undo":
                    label = "⤾";
                break;
            }

            element.html( "<div class='button icon'>" + $filter( 'unicode' )( label ) + "</div>" );

            item.addEventListener( 'click', function( e )
            {
                if ( scope.disabled )
                {
                    e.target.classList.add( 'disabled' );

                    scope.exception( { message: attributes.message } );

                    return false;
                }

                scope.handler( scope.args );
            } );
        }
    }
} );
