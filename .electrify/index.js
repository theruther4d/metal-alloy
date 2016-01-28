var app         = require('app');
var browser     = require('browser-window');
var electrify   = require('electrify')(__dirname);
var fs          = require( 'fs' );
var fm          = require( 'front-matter' );
var chokidar    = require( 'chokidar' );
var jsPath      = `${process.argv[1]}/js`;
var baseDir     = '/Users/josruthe/metal/src/articles';

function readFrontMatter( filepath ) {
    var content = fs.readFileSync( filepath, 'utf8' );

    if( content ) {
        return fm( content );
    }

    return false
}

function convertToFrontMatter( fm ) {
    var output = '---';

    if( 'attributes' in fm ) {
        Object.keys( fm.attributes ).map( ( key ) => {
            output += '\n';
            output += `${key}: '${fm.attributes[key]}'`;
        });

        output += '\n';
        output += '---';
    }

    if( 'body' in fm ) {
        output += '\n';
        output += fm.body;
    }

    return output;
}

function objectMerge( obj1, obj2 ) {
    for( var attr in obj2 ) {
        if( obj2[attr].constructor == Object ) {
            if( obj1[attr] ) {
                objectMerge( obj1[attr], obj2[attr] );
                continue;
            }
        }

        obj1[attr] = obj2[attr];
    }

    return obj1;
};

function generateId() {
    var result  = '',
        chars   = '23456789abcdefghjkmnpqrstuvwxyz';

    for( var i = 17; i > 0; --i ) {
        result += chars[ Math.floor( Math.random() * chars.length ) ];
    }

    return result;
}

function loadArticles() {
    fs.readdir( baseDir, function( err, files ) {
        if( err ) {
            console.log( err );
        } else {
            if( files.length ) {
                var fullFiles = [];

                files.map( ( file ) => {
                    // Ignore hidden files:
                    if( ! /^\..*/.test( file ) ) {
                        var fileData = readFrontMatter( `${baseDir}/${file}` );

                        fullFiles.push( fileData );
                    }
                });

                var articles = JSON.stringify( fullFiles );

                webContents.executeJavaScript( `Meteor.call( 'diffArticles', ${articles} )` );
            }
        }
    });
}

var window    = null;

app.on('ready', function() {

  // electrify start
  electrify.start(function(meteor_root_url) {

    // creates a new electron window
    window = new browser({
      width: 1200,
      height: 900,
      'node-integration': false
    });

    // open up meteor root url
    window.loadURL(meteor_root_url);

    webContents = window.webContents;

    // loadArticles();

    var watcher = chokidar.watch( '.', {
        cwd: baseDir,
        ignoreInitial: true,
        ignored: /[\/\\]\./,
        persistent: true
    });

    // console.log( 'being watched: ', watcher.getWatched() );

    watcher
        .on( 'add', ( path, stats ) => {
            var fileData = readFrontMatter( `${baseDir}/${path}` );

            if( fileData ) {
                fileData._id = path.replace( '.html', '' );
                // var fileId = path.replace( '.html', '' );
                var formattedFileData = JSON.stringify( fileData );
                webContents.executeJavaScript( `Meteor.call( 'fsAddArticle', ${formattedFileData} )` );
            }
        })
        .on( 'change', ( path, stats ) => {
            // console.log( `${path} was changed` );

            var fileData = readFrontMatter( `${baseDir}/${path}` );
            fileData._id = path.replace( '.html', '' );

            if( fileData ) {
                var formattedFileData = JSON.stringify( fileData );
                webContents.executeJavaScript( `Meteor.call( 'fsChangeArticle', ${formattedFileData} )` );
            }

        })
        .on( 'unlink', ( path, stats ) => {
            var fileId = path.replace( '.html', '' );
            // console.log( `fileId: ${fileId}` );

            webContents.executeJavaScript( `Meteor.call( 'fsRemoveArticle', '${fileId}' )` );
        });

  });
});

app.on('window-all-closed', function() {
  app.quit();
});


app.on('will-quit', function terminate_and_quit(event) {

  // if electrify is up, cancel exiting with `preventDefault`,
  // so we can terminate electrify gracefully without leaving child
  // processes hanging in background
  if(electrify.isup() && event) {

    // holds electron termination
    event.preventDefault();

    // gracefully stops electrify
    electrify.stop(function(){

      // and then finally quit app
      app.quit();
    });
  }
});

//
// =============================================================================
//
// the methods bellow can be called seamlessly from your Meteor's
// client and server code, using:
//
//    Electrify.call('methodname', [..args..], callback);
//
// ATENTION:
//    From meteor, you can only call these methods after electrify is fully
//    started, use the Electrify.startup() convenience method for this
//
//
// Electrify.startup(function(){
//   Electrify.call(...);
// });
//
// =============================================================================
//
electrify.methods({
    'getArticles': function( done ) {
        var files   = fs.readdirsync( baseDir ),
            fileIds = [];

        files.map( ( path ) => {
            var fileData = readFrontMatter( `${baseDir}/${path}` );

            if( fileData ) {
                fileData._id = path.replace( '.html', '' );
                fileIds.push( fileData._id );
                var formattedFileData = JSON.stringify( fileData );
                webContents.executeJavaScript( `Meteor.call( 'fsAddArticle', ${formattedFileData} )` );
            }
        });

        done( null, fileIds );
    },
    'createArticle': function( article, done ) {
        var articleId = generateId();

        fs.writeFile( `${baseDir}/${articleId}.html`, article, function( err ) {
            if( err ) {
                done( err, null );
            } else {
                done( null, articleId );
            }
        });
    },
    'editArticle': function( _id, newFm, done ) {
        var oldFm       = readFrontMatter( `${baseDir}/${_id}.html` ),
            combinedFm  = objectMerge( oldFm, newFm ),
            parsedFm    = convertToFrontMatter( combinedFm );

        fs.writeFile( `${baseDir}/${_id}.html`, parsedFm, function( err ) {
            if( err ) {
                done( err, null );
            } else {
                done( null, _id );
            }
        });
    }
});
