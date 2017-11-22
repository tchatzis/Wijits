// routes
app.config( function( $routeProvider, $locationProvider )
{
    $routeProvider
        /*.when( '/',
            {
                templateUrl: 'widgets/login.html',
                controller: 'loginCtrl'
            } )
        */
        .when( '/',
            {
                templateUrl: 'views/samples/index.html'
            } )
        .when( '/samples/:name',
            {
                templateUrl: function( args )
                {
                    return 'views/samples/' + args.name + ".html";
                }
            } )
        /*.when( '/:obj/:id',
            {
                templateUrl: 'views/forms/edit.html'
            } )
        .when( '/cocktails',
            {
                templateUrl: 'views/cocktails/cocktails.html',
                controller: 'cocktailsCtrl'
            } )
        .when( '/cocktails/edit/:id',
            {
                templateUrl: 'views/cocktails/edit.html',
                controller: 'editCocktailsCtrl'
            } )
        .when( '/liquors',
            {

            } )
        .when( '/liquors/brand',
            {
                templateUrl: 'views/liquors/brand.html'
            } )
        .when( '/apt',
            {
                templateUrl: 'apt/index.html'
            } )
        .when( '/wines',
            {
                templateUrl: 'views/wines/wines.html',
                controller: 'winesCtrl'
            } )
        .when( '/wines/:id',
            {
                templateUrl: 'views/wines/wine.html'
            } )*/

    $locationProvider.html5Mode( true );
} );