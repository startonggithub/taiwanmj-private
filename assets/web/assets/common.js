// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: 'AIzaSyDjczaLDcWnO1KpgHnUXBrGlAgiaYhCdnA',
    projectId: 'taiwanmj'
});
  
var db = firebase.firestore();

//var collectionSettings = db.collection("settings");
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

function chineseToNumber(chinese) {
    const digits = {
        '零':0, '〇':0,
        '一':1, '二':2, '兩':2, '三':3, '四':4,
        '五':5, '六':6, '七':7, '八':8, '九':9
    };

    const units = {
        '十':10,
        '百':100,
        '千':1000,
        '萬':10000,
        '億':100000000
    };

    let result = 0;
    let section = 0;
    let number = 0;

    for (let i = 0; i < chinese.length; i++) {
        const c = chinese[i];

        if (digits[c] !== undefined) {
            number = digits[c];
        }
        else if (units[c]) {
            const unit = units[c];

            if (unit < 10000) {
                if (number === 0) number = 1;
                section += number * unit;
            } else {
                section += number;
                result += section * unit;
                section = 0;
            }

            number = 0;
        }
    }

    return result + section + number;
}

function replaceChineseNumbers(text) {
    return text.replace(
        /[零〇一二兩三四五六七八九十百千萬億]+/g,
        function(match) {
            return chineseToNumber(match);
        }
    );
}

function normalizeSpeechText(text) {
    text = text.trim();

    // Convert Chinese numbers to digits
    text = replaceChineseNumbers(text);

    return text;
}

let androidSpeechResolve = null;
let androidSpeechReject = null;

function startSpeech() {
    return new Promise((resolve, reject) => {

        // Android WebView native speech path
        if (window.AndroidSpeech && typeof window.AndroidSpeech.startSpeech === "function") {
            androidSpeechResolve = resolve;
            androidSpeechReject = reject;

            window.AndroidSpeech.startSpeech();
            return;
        }

        // Browser fallback path
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.log("不支援語音輸入");
            resolve('');
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = "yue-Hant-HK";
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 3;

        let finalText = "";
        let timeoutId = null;
        let finished = false;

        function finish() {
            clearTimeout(timeoutId);
            if (finished) return;

            finished = true;
            resolve(normalizeSpeechText(finalText));
        }

        function resetTimeout() {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                try {
                    recognition.stop();
                } catch (e) {
                    console.log(e);
                    finish();
                }
            }, 3000);
        }

        recognition.onstart = function () {
            resetTimeout();
        };

        recognition.onresult = function (event) {
            resetTimeout();

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];

                if (result.isFinal) {
                    finalText += result[0].transcript;
                }
            }
        };

        recognition.onerror = function (event) {
            clearTimeout(timeoutId);
            if (finished) return;
            finished = true;
            resolve('');
        };

        recognition.onend = function () {
            finish();
        };

        try {
            recognition.start();
        } catch (e) {
            resolve('');
        }
    });
}

function onAndroidSpeechResult(text) {
    if (androidSpeechResolve) {
        androidSpeechResolve(normalizeSpeechText(text));
    }

    androidSpeechResolve = null;
    androidSpeechReject = null;
}

function onAndroidSpeechError(error) {
    console.log(error);

    if (androidSpeechResolve) {
        androidSpeechResolve('');
    }

    androidSpeechResolve = null;
    androidSpeechReject = null;
}

function getSelfOrEatFromText(text) {
	if (text.includes('食') || text.includes('色') || text.includes('式') || text.includes('值') || text.includes('直') || text.includes('極')|| text.includes('城') || text.includes('成')) {            //hardcode similar pronunciation 食
		return 'eat';
	}
	else if ((text.includes('自') || text.includes('智') || text.includes('志') || text.includes('至') || text.includes('子') || text.includes('爾')) && 		//hardcode similar pronunciation 自摸
             (text.includes('摸') || text.includes('摩') || text.includes('魔'))) {
		return 'self';
	}
	return '';
}

function getAddOrMinusFromText(text) {
	if (text.includes('賞') || text.includes('獎') || text.includes('上') || text.includes('掌') || text.includes('相') || text.includes('長') || text.includes('想')) {            //hardcode similar pronunciation 賞
		return 'add';
	}
	else if (text.includes('罰') || text.includes('佛') || text.includes('拔') || text.includes('伐')) {		//hardcode similar pronunciation 罰
		return 'minus';
	}
	return '';
}

function getPositionFromText(text) {
	if (text.includes('東') || text.includes('當') || text.includes('冬')) {	//hardcode similar pronunciation 東
		return 'e';
	}
	else if (text.includes('南') || text.includes('藍') || text.includes('男')) {	//hardcode similar pronunciation 南
		return 's';
	}
	else if (text.includes('西') || text.includes('篩') || text.includes('犀') || text.includes('妻')) {		//hardcode similar pronunciation 西
		return 'w';
	}
	else if (text.includes('北') || text.includes('畢') || text.includes('不') || text.includes('筆') || text.includes('德') || text.includes('得') || text.includes('白') || text.includes('福')) {		//hardcode similar pronunciation 北
		return 'n';
	}

	return '';
}

function getPointFromText(text) {
	const match = text.match(/\d+/);

	return match ? parseInt(match[0]) : (text.includes('唔') || text.includes('吾') || text.includes('午') ? 5 : 0);
}