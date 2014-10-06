Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    // TODO: check effectiveness, may have to take out comments
    return [Meteor.subscribe('posts'), Meteor.subscribe('notifications')];
  }
});

Router.map(function() {
  this.route('postsList', {path: '/'});
  
  this.route('postPage', {
    path: '/posts/:_id',
    waitOn: function() {
      return Meteor.subscribe('comments', this.params._id);
    },
    data: function() { return Posts.findOne(this.params._id); }
  });

  this.route('postEdit', {
    path: '/posts/:_id/edit',
    data: function() { return Posts.findOne(this.params._id); }
  });

  this.route('postSubmit', {
    path: '/submit'
  });
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      this.render('accessDenied');
    this.pause();
  }
}


Router.onBeforeAction(function(){ clearErrors() });
Router.onBeforeAction(requireLogin, {only: 'postSubmit'})
