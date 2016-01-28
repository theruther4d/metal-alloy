Meteor.publish( 'articles', () => {
    return Articles.find();
});
