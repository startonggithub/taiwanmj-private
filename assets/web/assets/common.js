// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: 'AIzaSyDjczaLDcWnO1KpgHnUXBrGlAgiaYhCdnA',
    projectId: 'taiwanmj'
});
  
var db = firebase.firestore();

var collectionSettings = db.collection("settings");
var collectionInstructions = db.collection("instructions");
var collectionPoints = db.collection("points");
var collectionRooms = db.collection("rooms");
var collectionRecords = db.collection("records");
var collectionTransactions = db.collection("transactions");

var allPlayers = ['e','s','w','n'];
var allPairs = ['es','ew','en','se','sw','sn','we','ws','wn','ne','ns','nw'];
var halfPairs = ['es','ew','en','sw','sn','wn'];
var swapPlayers = [['e','s'],['w','n']];
var swapPairs = [['es','se'],['ew','sn'],['en','sw'],['we','ns'],['ws','ne'],['wn','nw']];

var elementsPerRow = 6;
var gameResultDetails = [es_point_negative = 0, es_point_positive = 0, es_punish = 0, es_reward = 0, es_adjust_negative = 0, es_adjust_positive = 0,
						 ew_point_negative = 0, ew_point_positive = 0, ew_punish = 0, ew_reward = 0, ew_adjust_negative = 0, ew_adjust_positive = 0,
						 en_point_negative = 0, en_point_positive = 0, en_punish = 0, en_reward = 0, en_adjust_negative = 0, en_adjust_positive = 0,
						 sw_point_negative = 0, sw_point_positive = 0, sw_punish = 0, sw_reward = 0, sw_adjust_negative = 0, sw_adjust_positive = 0,
						 sn_point_negative = 0, sn_point_positive = 0, sn_punish = 0, sn_reward = 0, sn_adjust_negative = 0, sn_adjust_positive = 0,
						 wn_point_negative = 0, wn_point_positive = 0, wn_punish = 0, wn_reward = 0, wn_adjust_negative = 0, wn_adjust_positive = 0];

function getUUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (dt + Math.random()*16)%16 | 0;
		dt = Math.floor(dt/16);
		return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function getMobileOS() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
		return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
		return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		return "iOS";
    }

    return "unknown";
}


window.Clipboard = (function(window, document, navigator) {
    var textArea,
		copy;

//    function isOS() {
//		return navigator.userAgent.match(/ipad|iphone/i);
//    }

    function createTextArea(text) {
		textArea = document.createElement('textArea');
		textArea.value = text;
		document.body.appendChild(textArea);
    }

    function selectText() {
		var range,
		    selection;

		//if (isOS()) {
		if (getMobileOS() == "iOS") {
		    range = document.createRange();
		    range.selectNodeContents(textArea);
		    selection = window.getSelection();
		    selection.removeAllRanges();
		    selection.addRange(range);
		    textArea.setSelectionRange(0, 999999);
		} else {
		    textArea.select();
		}
    }

    function copyToClipboard() {		
		document.execCommand('copy');
		document.body.removeChild(textArea);
    }

    copy = function(text) {
		createTextArea(text);
		selectText();
		copyToClipboard();
    };

    return {
		copy: copy
    };
})(window, document, navigator);


function resize () {
	if ($(window).width() <= 375 && getMobileOS() == 'Android') {
		$('#header-row-1').removeClass('display-7');
		$('#header-row-1').removeClass('xlarge');
		$('#header-row-1').addClass('display-5');

		$('#player-select').removeClass('display-7');
		$('#player-select').removeClass('xlarge');
		$('#player-select').addClass('display-5');

		$('#table-confirm-transaction-main').removeClass('display-7');
		$('#table-confirm-transaction-main').removeClass('xlarge');
		$('#table-confirm-transaction-main').addClass('display-5');

		$('#table-scores-tbody').css('font-size', 15);
		$('#top-buttons-1, #bottom-buttons-1, #bottom-buttons-2').find('button').each(function () {
			$(this).removeClass('btn-sm');
			$(this).addClass('btn-xs');
		})
		$('#button-retrieve').removeClass('btn-sm');
		$('#button-retrieve').addClass('btn-xs');

		$('#bottom-windposition').removeClass('btn-group-lg');
		$('#bottom-windposition').addClass('btn-group-sm');
	}
	else if ($(window).width() <= 375 && getMobileOS() == 'iOS') {
		$('#header-row-1').removeClass('display-5');
		$('#header-row-1').removeClass('xlarge');
		$('#header-row-1').addClass('display-7');

		$('#player-select').removeClass('display-5');
		$('#player-select').removeClass('xlarge');
		$('#player-select').addClass('display-7');

		$('#table-confirm-transaction-main').removeClass('display-5');
		$('#table-confirm-transaction-main').removeClass('xlarge');
		$('#table-confirm-transaction-main').addClass('display-7');

		$('#table-scores-tbody').css('font-size', 10);
		$('#top-buttons-1, #bottom-buttons-1, #bottom-buttons-2').find('button').each(function () {
			$(this).removeClass('btn-sm');
			$(this).addClass('btn-xs');
		})
		$('#button-retrieve').removeClass('btn-sm');
		$('#button-retrieve').addClass('btn-xs');

		$('#bottom-windposition').removeClass('btn-group-lg');
		$('#bottom-windposition').addClass('btn-group-sm');
	}
	else if ($(window).width() > 375 && getMobileOS() == 'iOS') {
		$('#header-row-1').removeClass('display-7');
		$('#header-row-1').removeClass('xlarge');
		$('#header-row-1').addClass('display-5');

		$('#player-select').removeClass('display-7');
		$('#player-select').removeClass('xlarge');
		$('#player-select').addClass('display-5');

		$('#table-confirm-transaction-main').removeClass('display-7');
		$('#table-confirm-transaction-main').removeClass('xlarge');
		$('#table-confirm-transaction-main').addClass('display-5');

		$('#table-scores-tbody').css('font-size', 12);
		$('#top-buttons-1, #bottom-buttons-1, #bottom-buttons-2').find('button').each(function () {
			$(this).removeClass('btn-xs');
			$(this).addClass('btn-sm');
		})
		$('#button-retrieve').removeClass('btn-xs');
		$('#button-retrieve').addClass('btn-sm');
		
		$('#bottom-windposition').removeClass('btn-group-sm');
		$('#bottom-windposition').addClass('btn-group-lg');
	}
	else {
		$('#header-row-1').removeClass('display-5');
		$('#header-row-1').removeClass('display-7');
		$('#header-row-1').addClass('xlarge');

		$('#player-select').removeClass('display-5');
		$('#player-select').removeClass('display-7');
		$('#player-select').addClass('xlarge');

		$('#table-confirm-transaction-main').removeClass('display-5');
		$('#table-confirm-transaction-main').removeClass('xladisplay-7rge');
		$('#table-confirm-transaction-main').addClass('xlarge');

		$('#table-scores-tbody').css('font-size', 18);
		$('#top-buttons-1, #bottom-buttons-1, #bottom-buttons-2').find('button').each(function () {
			$(this).removeClass('btn-xs');
			$(this).addClass('btn-sm');
		})
		$('#button-retrieve').removeClass('btn-xs');
		$('#button-retrieve').addClass('btn-sm');

		$('#bottom-windposition').removeClass('btn-group-sm');
		$('#bottom-windposition').addClass('btn-group-lg');
    }
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
    });

    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if (window.location.href.indexOf(parameter) > -1){
		urlparameter = getUrlVars()[parameter];
    }

    return urlparameter;
}

function getDateyyyymmddHHmmss() {
    var d = new Date();
    var yyyy = pad(d.getUTCFullYear(), 4);
    var mm = pad(d.getMonth() + 1, 2);
    var dd = pad(d.getDate(), 2);
    var HH = pad(d.getHours(), 2);
    var MM = pad(d.getMinutes(), 2)
    var ss = pad(d.getSeconds(), 2)
    
    return yyyy + mm + dd + HH + MM + ss;
};

function formatDateMMddHHmmss(inputValue) {
    return  inputValue.substr(4,2) + '/' + inputValue.substr(6,2) + ' ' +
		    inputValue.substr(8,2) + ':' + inputValue.substr(10,2) + ':' +
		    inputValue.substr(12,2);
}

function formatDateddMMHHmm(inputValue) {
    return  inputValue.substr(6,2) + '/' + inputValue.substr(4,2) + ' ' +
		    inputValue.substr(8,2) + ':' + inputValue.substr(10,2);
}

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
		str = '0' + str;
    }
    return str;
}
