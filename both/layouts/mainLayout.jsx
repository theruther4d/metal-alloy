MainLayout = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        var data = {};
        var handle = Meteor.subscribe( 'articles' );

        if( handle.ready() ) {
            data.articles = Articles.find().fetch();
        }

        return data;
    },
    showArticles() {
        if( this.data.articles ) {
            return this.data.articles.map( ( article ) => {
                return (
                    <li className="article" key={article._id}>
                        <h3 className="article__title">{article.title}</h3>
                        <a className="article__edit" href={`/edit/${article._id}`}>Edit</a>
                    </li>
                );
            });
        } else {
            return (
                <p>Loading...</p>
            );
        }
    },
    render() {
        return (
            <div className="home">
                <a href="/new">New!!!</a>
                <ul className="articles">
                    {this.showArticles()}
                </ul>
            </div>
        );
    }
});
