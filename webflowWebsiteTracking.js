
var input = document.querySelector("#phone");
var iti = window.intlTelInput(input, {
utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
localizedCountries: { 'sg': "Singapore"},
preferredCountries: ['sg', 'in']
});

const elements = 
const config = 

const observer = new MutationObserver(function(mutationList, observer) { 
    for(const mutation of mutationList) { 
        if(mutation.oldValue == null) {
            analytics.track("Contact Form Loaded");
        }
    } 
});

Array.from(document.getElementsByClassName("modal-wrapper")).forEach((element) => {
    observer.observe(element, {attributeOldValue: true});
})

$("#email-form").submit(function(e) {
	if (iti.isValidNumber()) {
		$("#phone").val(iti.getNumber());
    }
    analytics.identify($('#email').val(), {
		"first_name": $('#first_name').val(),
		"phone" : $('#phone').val(),
		"email": $('#email').val()
	});
    analytics.track("Contact Form Submitted", {
			"first_name": $('#first_name').val(),
			"email": $('#email').val()
	});
    return true; 
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