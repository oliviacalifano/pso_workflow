/*
This model just holds the progress data of the upload which is fed to it from the collection
*/

YieldTools.updateModalModel = Backbone.Model.extend({
	defaults: {
		progress: 0,
		finalStatus: {}
	}
});