EditArticle = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        var data = {};
        var handle = Meteor.subscribe( 'articles' );

        if( handle.ready() ) {
            data.article = Articles.findOne( { _id: this.props._id } );
        }

        return data;
    },
    getBody() {
        return {
            __html: this.data.article.body
        }
    },
    handleSubmit( e ) {
        e.preventDefault();

        var edited = {
            attributes: {
                title: ReactDOM.findDOMNode( this.refs.title ).value
            },
            body: ReactDOM.findDOMNode( this.refs.wysiwyg ).querySelector( '.wysiwyg__editor' ).innerHTML
        };

        Meteor.call( 'editArticle', this.props._id, edited );
    },
    render() {
        return this.data.article ? (
            <div className="edit">
                <a href="/">Back to the main screen</a>
                <h1>You're editing {this.props._id}</h1>

                <form onSubmit={this.handleSubmit}>
                    <input ref="title" type="input" defaultValue={this.data.article.title} />
                    <WYSIWYG
                        content={this.data.article.body}
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
        ) : (
            <div className="edit">
                <a href="/">Back to the main screen</a>
                <p>Loading...</p>
            </div>
        );
    }
});
