var getStartedButtons = document.getElementsByClassName("tve_evt_manager_listen tcb-button-link")
for (var i = 0; i < getStartedButtons.length; i++ ) {
  getStartedButtons[i].addEventListener("click", function() { analytics.track("Contact Form Loaded"); })
}

// Contact me form submission listener
document.getElementById('000002').getElementsByTagName("form")[0].addEventListener("submit", function() {
	if (document.getElementsByName('email')[1].value != "") {
		analytics.identify(document.getElementsByName("email")[1].value, {
			"first_name": document.getElementsByName("first_name")[0].value,
			"email": document.getElementsByName("email")[1].value
		});
	}
	if (document.getElementsByName('email')[1].value != "" && document.getElementsByName("first_name")[0].value != "") {
		analytics.track("Contact Form Submitted", {
			"first_name": document.getElementsByName("first_name")[0].value,
			"email": document.getElementsByName("email")[1].value
		});
	}
});

var convsersationId

function queryForEmailWithConversationId(conversationId, triggerEvent=false) {
	let xhr = new XMLHttpRequest
	xhr.open('get', "https://sprouthsrest.ap-1.evennode.com/conversations/"+conversationId, true)
	xhr.onload = function () { 
		if (JSON.parse(this.responseText) != "") {
			analytics.identify(JSON.parse(this.responseText))
			if (triggerEvent) {
				analytics.track("Contact Chat Submitted", {
					"email": JSON.parse(this.responseText),
				})
			}
		}
	}
	xhr.send()
}

function SetupHubSpotListeners() {
	window.HubSpotConversations.on('conversationStarted', payload => {
		conversationId = payload.conversation.conversationId
		analytics.track("Chat Started")
		queryForEmailWithConversationId(conversationId)
	});
	window.HubSpotConversations.on('contactAssociated', payload => {
		if (conversationId != undefined) {
			queryForEmailWithConversationId(conversationId, true)
		}
	});
}

window.hsConversationsOnReady = [SetupHubSpotListeners]



/*
window.HubSpotConversations.on('conversationClosed', payload => {
	console.log(payload);
});*/