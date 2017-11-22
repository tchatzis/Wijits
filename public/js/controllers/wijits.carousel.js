app.controller( 'carouselCtrl', function( $rootScope, $scope, $filter, dataservice, dbservice )
{
    var px = "px";
    var data = $scope.$parent.data;
    var hack = 1.3;
    
    $scope.db = dbservice;
    $scope.selected = data.selected;
    $scope.items = [];

    $scope.list = function( data )
    {
        $scope.master = $filter( 'array' )( data.data );
        $scope.display();
        $scope.$applyAsync();
    };

    $scope.display = function()
    {
        Math.rad = function( deg )
        {
            return ( Math.PI * 2 * deg ) / 360;
        };

        var max = $scope.master.length;
        var count = 3;
        var selected = Math.floor( count / 2 );
        var angle = 30;
        var use =
        {
            horizontal: data.size.width,
            vertical: data.size.height
        };
        var r = hack * use[ data.class ];
        var x, z, deg, rad, index;
        var items = [];
        var item = {}

        for ( var i = 0; i < count; i++ )
        {
            index = ( max + ( i - selected ) + $scope.selected ) % max;

            deg = angle * ( i - selected );
            rad = Math.rad( deg );
            x = r * Math.cos( rad ) * ( i - selected ) + px;
            z = -Math.abs( r * Math.sin( rad ) ) + px;

            item =
            {
                index: index,
                data: $scope.master[ index ],
                rotate: deg,
                translate: { x: x, z: z }
            }
            
            switch( data.display.type )
            {
                case "object":
                    item.display = item.data[ data.display.key ];
                break;

                case "number":
                case "string":
                    item.display = item.data;
                break;

                default:
                    item.display = item.index;
                break;
            }

            items.push( item );
        }

        $scope.items = items;
    };

    // get the data
    ( function()
    {
        switch ( data.source.type )
        {
            case "database":
                $scope.db.read( { path: data.source.name, callback: $scope.list } );
            break;

            case "list":
                $scope.master = $rootScope.ls.get( data.source.name );
                $scope.display();
            break;

            default:

            break;
        }
    } )();
    
    $scope.select = function( args )
    {
        $scope.selected = args.value;
        $scope.display();

        args.value = $scope.master[ $scope.selected ];

        dataservice.import( args );
    };

    $scope.styles = function( args )
    {
        var style =
        {
            viewer:
            {
                horizontal:
                {
                    height: data.size.height + 2 + px
                },
                vertical:
                {
                    width: data.size.width * 1.2 + px,
                    height: data.size.height * 3 + 6 + px,
                }
            },
            item:
            {
                horizontal:
                {
                    width: data.size.width + px,
                    height: data.size.height + px,
                    "line-height": data.size.height + px,
                    transform: args.item ? "translate3d( " + args.item.translate.x + ", 0, " + args.item.translate.z + " ) rotateY( " + args.item.rotate + "deg )" : null
                },
                vertical:
                {
                    width: data.size.width + px,
                    height: data.size.height + px,
                    "line-height": data.size.height + px,
                    transform: args.item ? "translate3d( 0, " + args.item.translate.x + ", " + args.item.translate.z + " ) rotateX( " + -args.item.rotate + "deg )" : null
                }
            },
            self:
            {
                horizontal:
                {
                    left: hack * data.size.width / 2 + px
                },
                vertical:
                {
                    top: hack * data.size.height / 2 + px
                }
            }
        };

        return style[ args.name ][ args.class ];
    };
} );
