FlowRouter.route( '/', {
    name: 'home',
    action() {
        ReactLayout.render( MainLayout );
    }
});

FlowRouter.route( '/edit/:id', {
    action( params, queryParams ) {
        ReactLayout.render( EditArticle, { _id: params.id } );
    }
});

FlowRouter.route( '/new', {
    action() {
        ReactLayout.render( NewArticle );
    }
});
