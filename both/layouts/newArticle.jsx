NewArticle = React.createClass({
    getInitialState() {
        return {
            text: ''
        }
    },
    handleSubmit( e ) {
        e.preventDefault();
        console.log( e );

        var newArticle = {
            attributes: {
                title: ReactDOM.findDOMNode( this.refs.title ).value,
                layout: 'articles.html',
                parentDirectory: 'articles',
                date: new Date()
            },
            body: ReactDOM.findDOMNode( this.refs.wysiwyg ).querySelector( '.wysiwyg__editor' ).innerHTML, // WYSIWYG content will go here!!!
        };

        Meteor.call( 'createArticle', newArticle );
    },
    handleTextChange: function( val ) {
        this.setState({
            text: val
        });

        console.log( val );
    },
    checkForSelection( e ) {
        alert( 'checkForSelection triggered' );
        console.log( e );
        console.log( document.getSelection().toString() );
    },
    render() {
        return (
            <div className="new">
                <a href="/">Main Page</a>
                <h1>New Post:</h1>
                <form onSubmit={this.handleSubmit}>
                    <input ref="title" />
                    <WYSIWYG
                        ref="wysiwyg"
                        buttons={[
                            [
                                {
                                    label: 'Italic',
                                    type: 'italic',
                                    useIcon: true,
                                    icon: 'icon--italic'
                                },
                                {
                                    label: 'Bold',
                                    type: 'bold',
                                    useIcon: true,
                                    icon: 'icon--bold'
                                },
                                {
                                    label: 'Underline',
                                    type: 'underline',
                                    useIcon: true,
                                    icon: 'icon--underline'
                                },
                                {
                                    label: 'OL',
                                    type: 'insertOrderedList',
                                },
                                {
                                    label: 'UL',
                                    type: 'insertUnorderedList'
                                },
                                {
                                    label: 'Clear',
                                    type: 'removeFormat'
                                }
                            ],
                        ]}
                        formats={[
                            {
                                label: 'p',
                                tag: 'p',
                                class: ''
                            },
                            {
                                label: 'h1 primary',
                                tag: 'h1',
                                class: 'primary'
                            },
                            {
                                label: 'h1 secondary',
                                tag: 'h1',
                                class: 'secondary'
                            },
                            {
                                label: 'h1',
                                tag: 'h1',
                            },
                            {
                                label: 'h2',
                                tag: 'h2',
                                class: ''
                            },
                        ]}
                    />
                    <input type="submit" value="submit" onClick={this.handleSubmit} />
                </form>
            </div>
        );
    }
})
