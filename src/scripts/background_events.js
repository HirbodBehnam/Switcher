



//Suggest Switcher ADD-ONS home page in omnibox     
browser.omnibox.onInputStarted.addListener(function () {
	browser.omnibox.setDefaultSuggestion({
		description: "Go to Switcher ADD-ONS page"
	});
});

//Go to Switcher ADD-ONS home page on firefox ADD-ONS
browser.omnibox.onInputEntered.addListener(function () {
	browser.tabs.update({ url: "http://addons.mozilla.org/en-US/firefox/addon/switcher_proxy/" });
});





















