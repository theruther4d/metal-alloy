// Meteor.startup( () => {
//     Meteor.bindEnvironment(
//         Electrify.startup( () => {
//             console.log( 'electron and meteor both started up' );
//             Electrify.call( 'getArticles', [], function( err, res ) {
//                 console.log( res );
//             });
//         });
//     );
// });

Meteor.startup( function() {
    Meteor.bindEnvironment( function() {
        Electrify.startup( function() {
            Electrify.call( 'getArticles', [], function( err, res ) {
                console.log( 'meteor and electrify startup on server getArticles: ', res );
            });
        });
    });
});

Meteor.methods({
    fsAddArticle( file ) {
        var newArticle = {
            _id: file._id,
            date: new Date(),
            title: file.attributes.title,
            body: file.body
        };

        if( Articles.findOne( { _id: file._id } ) ) {
            console.log( `article already exists with the id ${file._id}, updating instead.` );
            Articles.update( { _id: file._id }, { $set: newArticle } );
        } else {
            console.log( 'article didn\'t already exist, creating it now' );
            newArticle._id = file._id;
            Articles.insert( newArticle );
        }
    },
    fsChangeArticle( file ) {
        console.log( `changing article with id ${file._id}` );
        var updatedArticle = {
            title: file.attributes.title,
            body: file.body
        };

        Articles.update( { _id: file._id }, { $set: updatedArticle } );
    },
    fsRemoveArticle( _id ) {
        Articles.remove( { _id: _id } );
    },
    diffArticles( files ) {
        files.map( ( file ) => {
            Articles.insert({
                title: file.attributes.title,
                date: file.attributes.date,
                body: file.body
            });
        });
    },
    createArticle( article ) {
        console.log( 'called createArticle on the server' );

        Electrify.call( 'createArticle', [ convertToFrontMatter( article ) ], function( err, res ) {
            console.log( 'from the server, the error is: ', err );
            console.log( 'from the server, the result is: ', res );
        });
    },
    editArticle( _id, edits ) {
        Electrify.call( 'editArticle', [ _id, edits ], function( err, res ) {
            if( err ) {
                console.log( 'Meteor Method editArticle threw error: ', err );
            }

            console.log( 'Meteor Method editArticle response: ', res );
        });
    }
});
