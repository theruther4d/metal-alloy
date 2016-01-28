convertToFrontMatter = function( fm ) {
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

    console.log( 'convertted: ', output );

    return output;
}
