//Load the page if the user is already verified by captcha
var loadPage = function() {
    //$('#formBody').css('display', 'block');
    $('#formBody').removeClass('hide-form');
    if (!cookies.isNotRobot) {
        setCookie();
    }
}

// Setting cookie after captcha validation
var setCookie = function() {
    console.log('Setting cookie -> isNotRobot=true ');
    document.cookie = "isNotRobot=true";
}

// Showing captcha while page loading
var showCaptcha = function() {
    vg1 = grecaptcha.render(document.getElementById('html_element'), {
        'sitekey': '6Ld0ygkUAAAAANdPiQx0Szl-JfbcpzPD8t5Aeg_e',
        'callback': loadPage
    });
};

// overriding postman default properties
$.postJSON = function(url, data, callback) {
    return jQuery.ajax({
        'type': 'POST',
        'url': url,
        'contentType': 'application/json',
        'accept': 'application/json',
        'data': data,
        'dataType': 'json',
        'success': callback
    });
};

// init method.
var init = function() {
    // $('#formBody').css('display', 'none');
    $('#formBody').addClass('hide-form');
    var c = document.cookie;
    cookies = {};
    C = c.split('=');
    cookies[C[0]] = C[1];
    if (cookies.isNotRobot) {
        console.log("Valid User");
        loadPage();
    } else {
        setTimeout(function() {
            showCaptcha();
        }, 200);

    }
}

// Calling REST service for revature signup
$("#submit").click(function() {
    event.preventDefault();
    var url = "http://localhost:8080/resources/interns/signup";
    var data = {
        fullName: Base64.encode($('#fname').val()),
        email: Base64.encode($('#email').val())
    };
    if (data.fullName != "" && data.email != "") {
        var posting = $.postJSON(url, Base64.encode(JSON.stringify(data)));
        console.log(data);
        posting.done(function(data) {
            console.log('success');
            setTimeout(function() {
                window.open('http://localhost/revatureApp', '_blank');
            }, 1000);

        });
    }


});

// Base 64 implementation ---------- STARTS
var Base64 = {


        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",


        encode: function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },


        decode: function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64._utf8_decode(output);

            return output;

        },

        _utf8_encode: function(string) {
            string = string.toString();
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        _utf8_decode: function(utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    }
    // Base 64 implementation ---------- ENDS.
    // Initialising process.
init();