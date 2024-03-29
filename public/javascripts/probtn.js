;
(function($) {

    $.path = {};

    var V = {
        rotate: function(p, degrees) {
            var radians = degrees * Math.PI / 180,
                c = Math.cos(radians),
                s = Math.sin(radians);
            return [c * p[0] - s * p[1], s * p[0] + c * p[1]];
        },
        scale: function(p, n) {
            return [n * p[0], n * p[1]];
        },
        add: function(a, b) {
            return [a[0] + b[0], a[1] + b[1]];
        },
        minus: function(a, b) {
            return [a[0] - b[0], a[1] - b[1]];
        }
    };

    $.fx.step.path = function(fx) {
        var css = fx.end.css(1 - fx.pos);
        if (css.prevX != null) {
            $.cssHooks.transform.set(fx.elem, "rotate(" + Math.atan2(css.prevY - css.y, css.prevX - css.x) + ")");
        }
        fx.elem.style.top = css.top;
        fx.elem.style.left = css.left;
    };

})(jQuery);



(function($) {

    //load nessesary libraries and show button
    $.fn.StartButton = function(options) {

        String.prototype.ProBtnHashCode = function() {
            var hash = 0;
            //, i, char;
            var char1 = 0;
            var i = 0;
            if (this.length === 0) return hash;
            for (i = 0, l = this.length; i < l; i++) {
                char1 = this.charCodeAt(i);
                hash = ((hash << 5) - hash) + char1;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };

        var ProBtnControl = {
            currentDomain: document.domain.replace("www.", ""),
            realDomain: document.domain.replace("www.", ""),
            initializedActiveZones: {},
            //curent app version
            mainVersion: "1.17.1832_08042015_dev",
            hintText: undefined, //hinttext object with additional functions
            pizzabtn: undefined,

            contentTime: {
                contentOpenedTime: 0,
                startTimer: function() {
                    if (this.intervalId !== undefined) {} else {
                        clearInterval(ProBtnControl.contentTime.intervalId);
                    }
                    ProBtnControl.contentTime.contentOpenedTime = 0;

                    ProBtnControl.contentTime.intervalId = setInterval(function() {
                        ProBtnControl.contentTime.contentOpenedTime++;
                    }, 1000);
                },
                endTimer: function() {
                    clearInterval(ProBtnControl.contentTime.intervalId);
                },
                intervalId: undefined
            },
            userData: {},
            geolocation: {
                getLocation: function() {
                    try {

                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(ProBtnControl.geolocation.getPosition);
                        } else {
                            console.log("Geolocation is not supported by this browser.");
                        }
                    } catch (ex) {
                        console.log(ex);
                    }
                },
                getPosition: function(position) {
                    try {
                        if (ProBtnControl.params.Debug) console.log(position);
                        ProBtnControl.geolocation.longitude = position.coords.latitude;
                        ProBtnControl.geolocation.latitude = position.coords.longitude;
                    } catch (ex) {
                        console.log(ex);
                    }
                },
                longitude: null,
                latitude: null
            },
            //get user data - information about browser, os and so on
            userDataFunction: function() {
                try {
                    var unknown = 'Unbekannt';

                    // screen
                    var screenSize = '';
                    var width = '';
                    var height = '';
                    if (screen.width) {
                        width = (screen.width) ? screen.width : '';
                        height = (screen.height) ? screen.height : '';
                        screenSize += '' + width + " x " + height;
                    }

                    //browser
                    var nVer = navigator.appVersion;
                    var nAgt = navigator.userAgent;
                    var browser = navigator.appName;
                    var version = '' + parseFloat(navigator.appVersion);
                    var majorVersion = parseInt(navigator.appVersion, 10);
                    var nameOffset, verOffset, ix;

                    // Opera
                    if ((verOffset = nAgt.indexOf('Opera')) != -1) {
                        browser = 'Opera';
                        version = nAgt.substring(verOffset + 6);
                        if ((verOffset = nAgt.indexOf('Version')) != -1) {
                            version = nAgt.substring(verOffset + 8);
                        }
                    }
                    // MSIE
                    else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
                        browser = 'Microsoft Internet Explorer';
                        version = nAgt.substring(verOffset + 5);
                    }
                    // Chrome
                    else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
                        browser = 'Chrome';
                        version = nAgt.substring(verOffset + 7);
                    }
                    // Safari
                    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
                        browser = 'Safari';
                        version = nAgt.substring(verOffset + 7);
                        if ((verOffset = nAgt.indexOf('Version')) != -1) {
                            version = nAgt.substring(verOffset + 8);
                        }
                    }
                    // Firefox
                    else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
                        browser = 'Firefox';
                        version = nAgt.substring(verOffset + 8);
                    }
                    // Other browsers
                    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
                        browser = nAgt.substring(nameOffset, verOffset);
                        version = nAgt.substring(verOffset + 1);
                        if (browser.toLowerCase() == browser.toUpperCase()) {
                            browser = navigator.appName;
                        }
                    }
                    // trim the version string
                    if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
                    if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);

                    majorVersion = parseInt('' + version, 10);
                    if (isNaN(majorVersion)) {
                        version = '' + parseFloat(navigator.appVersion);
                        majorVersion = parseInt(navigator.appVersion, 10);
                    }

                    // mobile version
                    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

                    // cookie
                    var cookieEnabled = (navigator.cookieEnabled) ? true : false;

                    if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
                        document.cookie = 'testcookie';
                        cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
                    }

                    // system
                    var os = unknown;
                    var clientStrings = [{
                        s: 'Windows 3.11',
                        r: /Win16/
                    }, {
                        s: 'Windows 95',
                        r: /(Windows 95|Win95|Windows_95)/
                    }, {
                        s: 'Windows ME',
                        r: /(Win 9x 4.90|Windows ME)/
                    }, {
                        s: 'Windows 98',
                        r: /(Windows 98|Win98)/
                    }, {
                        s: 'Windows CE',
                        r: /Windows CE/
                    }, {
                        s: 'Windows 2000',
                        r: /(Windows NT 5.0|Windows 2000)/
                    }, {
                        s: 'Windows XP',
                        r: /(Windows NT 5.1|Windows XP)/
                    }, {
                        s: 'Windows Server 2003',
                        r: /Windows NT 5.2/
                    }, {
                        s: 'Windows Vista',
                        r: /Windows NT 6.0/
                    }, {
                        s: 'Windows 7',
                        r: /(Windows 7|Windows NT 6.1)/
                    }, {
                        s: 'Windows 8.1',
                        r: /(Windows 8.1|Windows NT 6.3)/
                    }, {
                        s: 'Windows 8',
                        r: /(Windows 8|Windows NT 6.2)/
                    }, {
                        s: 'Windows NT 4.0',
                        r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
                    }, {
                        s: 'Windows ME',
                        r: /Windows ME/
                    }, {
                        s: 'Android',
                        r: /Android/
                    }, {
                        s: 'Open BSD',
                        r: /OpenBSD/
                    }, {
                        s: 'Sun OS',
                        r: /SunOS/
                    }, {
                        s: 'Linux',
                        r: /(Linux|X11)/
                    }, {
                        s: 'iOS',
                        r: /(iPhone|iPad|iPod)/
                    }, {
                        s: 'Mac OS X',
                        r: /Mac OS X/
                    }, {
                        s: 'Mac OS',
                        r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
                    }, {
                        s: 'QNX',
                        r: /QNX/
                    }, {
                        s: 'UNIX',
                        r: /UNIX/
                    }, {
                        s: 'BeOS',
                        r: /BeOS/
                    }, {
                        s: 'OS/2',
                        r: /OS\/2/
                    }, {
                        s: 'Search Bot',
                        r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
                    }];

                    try {
                        for (var id in clientStrings) {
                            var cs = clientStrings[id];
                            if (cs.r.test(nAgt)) {
                                os = cs.s;
                                break;
                            }
                        }

                        var osVersion = unknown;

                        if (/Windows/.test(os)) {
                            osVersion = /Windows (.*)/.exec(os)[1];
                            os = 'Windows';
                        }
                        switch (os) {
                            case 'Mac OS X':
                                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                                break;

                            case 'Android':
                                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                                break;

                            case 'iOS':
                                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                                break;

                        }
                    } catch (ex) {
                        os = unknown;
                    }

                    var isiPad = navigator.userAgent.match(/iPad/i) != null;

                    var result = {
                        screen: screenSize,
                        screenWidth: width,
                        screenHeight: height,
                        browser: browser,
                        browserVersion: version,
                        browserMajorVersion: majorVersion,
                        mobile: mobile,
                        os: os,
                        osVersion: osVersion,
                        cookies: cookieEnabled,
                        isiPad: isiPad
                    };
                    ProBtnControl.userData = result;
                    return result;
                } catch (ex) {
                    return undefined;
                };
            },
            XProBtnToken: "b04bb84b22cdacb0d57fd8f8fd3bfeb8ad430d1b",
            //main server url
            serverUrl: "//admin.probtn.com",
            GetDeviceUID: function() {
                var probtnId = "1234";
                if (ProBtnControl.cookieFunctions.readCookie("probtnId") != null) {} else {
                    //set cookie
                    var currentdate = new Date();
                    currentdate = currentdate.getTime();
                    probtnId = currentdate.toString() + "-" + navigator.userAgent.toString().ProBtnHashCode();
                    ProBtnControl.cookieFunctions.createCookie("probtnId", probtnId, 365);
                };
                probtnId = ProBtnControl.cookieFunctions.readCookie("probtnId");
                return probtnId;
            },
            cookieFunctions: {
                createCookie: function(name, value, days) {
                    var expires = "";
                    if (days) {
                        var date = new Date();
                        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                        expires = "; expires=" + date.toGMTString();
                    }
                    document.cookie = name + "=" + value + expires + "; path=/";
                },
                readCookie: function(name) {
                    var nameEQ = name + "=";
                    var ca = document.cookie.split(';');
                    for (var i = 0; i < ca.length; i++) {
                        var c = ca[i];
                        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
                    }
                    return null;
                },
                eraseCookie: function(name) {
                    ProBtnControl.cookieFunctions.createCookie(name, "", -1);
                }
            },
            allButtonInit: false,
            params: {},
            HpmdFunctions: {
                probtnHpmdTrack: function(i) {
                    if (ProBtnControl.params.isHPMD) {
                        try {
                            if (i === undefined) {
                                i = 1;
                            }
                            //fancybox closed
                            ProBtnControl.params.hpmd.trackEvent("probtn" + i);
                        } catch (ex) {}
                    }
                },
                closeHpmdTrack: function() {
                    ProBtnControl.contentTime.endTimer();
                    if (ProBtnControl.params.isHPMD) {
                        try {
                            //fancybox closed
                            ProBtnControl.params.hpmd.trackEvent("hpmd.close");
                            //track opened time
                            ProBtnControl.params.hpmd.trackEvent("hpmd.time-expanded", {
                                weight: ProBtnControl.contentTime.contentOpenedTime
                            });
                        } catch (ex) {}
                    }
                },
                expandHpmdTrack: function() {
                    //start opened content timer
                    ProBtnControl.contentTime.startTimer();
                    if (ProBtnControl.params.isHPMD) {
                        try {
                            //fancybox closed
                            ProBtnControl.params.hpmd.trackEvent("hpmd.expand");
                        } catch (ex) {
                            console.log(ex);
                        }
                    }
                }
            },
            randomElements: {
                probtnId: "probtn_button_" //+ ProBtnControl.additionalButtonFunctions.randomString(12)
            },
            statistics: {
                sendAreaActivatedStats: function(areaName, callback) {
                    if (ProBtnControl.params.isServerCommunicationEnabled) {
                        var probtnId = "1234";
                        probtnId = ProBtnControl.GetDeviceUID();
                        $.getJSON(ProBtnControl.serverUrl + "/1/functions/updateUserStatistic?BundleID=" + ProBtnControl.currentDomain + "&DeviceType=web&CampaignID=" + ProBtnControl.params.CampaignID + "&Version=1.0&DeviceUID=" + probtnId + "&localDomain=" + ProBtnControl.realDomain + "&Statistic=" + "{\"ContentShowed\": \"1\"}&" + "X-ProBtn-Token=b04bb84b22cdacb0d57fd8f8fd3bfeb8ad430d1b&AZName=" + areaName + "&callback=?",
                            function() {}).done(function() {

                        }).fail(function() {}).always(function() {
                            if ((callback !== null) && (callback !== undefined)) {
                                callback();
                            }
                        });
                    }
                },
                ///
                /// send information about browser version, resolution and some other data
                ///
                SendBrowserStatsInfo: function() {
                    try {
                        if (ProBtnControl.params.isServerCommunicationEnabled) {
                            ProBtnControl.statistics.SendStatisticsData("Resolution", jscd.screen, 1);
                            ProBtnControl.statistics.SendStatisticsData("Browser", jscd.browser, 1);
                            ProBtnControl.statistics.SendStatisticsData("BrowserVersion", jscd.browserVersion, 1);
                            ProBtnControl.statistics.SendStatisticsData("OS", jscd.os + ' ' + jscd.osVersion, 1);
                        }
                    } catch (ex) {}
                },
                ///
                /// Function used to send "custom" statistics
                /// for example information about resolution, OS, browser, browser version
                /// This information would be rewriten by last resived data for deviceUID each time when it send to server
                ///
                SendCustomStat: function(name, value, probtnId, currentDomain) {
                    if (ProBtnControl.params.isServerCommunicationEnabled) {
                        $.getJSON(ProBtnControl.serverUrl + "/1/functions/updateCustomStatistic?BundleID=" + currentDomain + "&DeviceType=web&CampaignID=" + ProBtnControl.params.CampaignID + "&Version=1.0&DeviceUID=" + probtnId + "&localDomain=" + realDomain + "&Statistic=" + "{\"" + name + "\": \"" + value + "\"}&" + "X-ProBtn-Token=b04bb84b22cdacb0d57fd8f8fd3bfeb8ad430d1b&callback=?",
                            function() {}).done(function() {

                        }).fail(function() {}).always(function() {
                            if ((callback !== null) && (callback !== undefined)) {
                                callback();
                            }
                        });
                    }
                },
                ///
                /// Send stats to probtn
                /// <values>
                /// paramName - name for statistics parameter
                /// value - value of this paarameter. Default is 1
                /// custom - if set to 1, this param and it's value will be send as custom stats
                /// </values>
                ///
                SendStatisticsData: function(paramName, value, custom, callback) {
                    if (ProBtnControl.params.isServerCommunicationEnabled) {
                        var probtnId = "1234";

                        if (paramName == "" || paramName == null) {
                            paramName = "Opened";
                        };
                        if (value == "" || value == null) {
                            value = 1;
                        };
                        probtnId = ProBtnControl.GetDeviceUID();

                        if (custom == "" || custom == null) {
                            ProBtnControl.statistics.SendStat(paramName, value, probtnId, ProBtnControl.currentDomain, callback);
                        } else {
                            ProBtnControl.statistics.SendCustomStat(paramName, value, probtnId, ProBtnControl.currentDomain, callback);
                        };
                    }
                },
                SendStat: function(name, value, probtnId, currentDomain, callback) {
                    if (ProBtnControl.params.isServerCommunicationEnabled) {
                        $.getJSON(ProBtnControl.serverUrl + "/1/functions/updateUserStatistic?BundleID=" + currentDomain + "&Version=1.0&DeviceType=web&CampaignID=" + ProBtnControl.params.CampaignID + "&DeviceUID=" + probtnId + "&localDomain=" + ProBtnControl.realDomain + "&Statistic=" + "{\"" + name + "\": \"" + value + "\"}&" + "X-ProBtn-Token=b04bb84b22cdacb0d57fd8f8fd3bfeb8ad430d1b&callback=?",
                            function(data1) {
                                if (ProBtnControl.params.Debug) console.log(data1);
                            }).done(function() {}).fail(function() {}).always(function() {
                            if (ProBtnControl.params.Debug) console.log("SendStat always");
                            if ((callback !== null) && (callback !== undefined)) {
                                callback();
                            }
                        });
                    }
                }
            },
            additionalButtonFunctions: {
                MinimizeWrapper: function(callback1, time) {
                    var callback = callback1;

                    function minimize() {

                        var pizzabtn_wrapper = undefined;
                        pizzabtn_wrapper = $("#probtn_wrapper");

                        var opts = {
                            width: "auto",
                            height: "auto",
                            position: "fixed"
                        };

                        if ((ProBtnControl.params.TrackingLink !== null) && (ProBtnControl.params.TrackingLink !== null) && (ProBtnControl.params.TrackingLink !== "")) {
                            opts['background'] = 'url(' + ProBtnControl.params.TrackingLink + ') no-repeat';
                        }

                        try {
                            $.pep.toggleAll(false);
                            pizzabtn_wrapper.css(opts);
                            $.pep.toggleAll(true);
                        } catch (ex) {
                            pizzabtn_wrapper.css(opts);
                        }

                        if ((callback !== null) && (callback !== undefined)) {
                            callback();
                        }
                    }

                    if (time !== null) {
                        setTimeout(minimize, time)
                    } else {
                        minimize();
                    }
                },
                //maximiza button wrapper
                MaximizeWrapper: function(callback) {
                    var pizzabtn_wrapper = undefined;
                    pizzabtn_wrapper = $("#probtn_wrapper");

                    var opts = {
                        width: $(window).width(),
                        height: $(window).height(),
                        position: "fixed"
                    };

                    if ((ProBtnControl.params.TrackingLink !== null) && (ProBtnControl.params.TrackingLink !== null) && (ProBtnControl.params.TrackingLink !== "")) {
                        opts['background'] = 'url(' + ProBtnControl.params.TrackingLink + ') no-repeat';
                    }

                    pizzabtn_wrapper.css(opts);

                    try {
                        var scrollLeft = 0;
                        scrollLeft = $(window).scrollLeft();
                        if ((ProBtnControl.pizzabtn.offset().left - scrollLeft) > pizzabtn_wrapper.width()) {
                            var newleft = pizzabtn_wrapper.width() - ProBtnControl.pizzabtn.width();
                            ProBtnControl.pizzabtn.css({
                                left: newleft + 'px'
                            });
                        };
                    } catch (ex) {};
                    try {
                        var scrollTop = 0;
                        scrollTop = $(window).scrollTop();

                        if ((ProBtnControl.pizzabtn.offset().top - scrollTop) > pizzabtn_wrapper.height()) {
                            var newtop = pizzabtn_wrapper.height() - ProBtnControl.pizzabtn.height();
                            ProBtnControl.pizzabtn.css({
                                top: newtop + 'px'
                            });
                        };
                    } catch (ex) {};

                    try {
                        callback();
                    } catch (ex) {};
                },
                animation: {
                    animationRuning: false,
                    checkAndRunAnimation: function() {
                        setTimeout(function() {
                            if (ProBtnControl.params.isAnimation == "anim1") {
                                //$.pep.toggleAll(false);
                                var initLeft = ProBtnControl.pizzabtn.position().left;
                                var initTop = ProBtnControl.pizzabtn.position().top;

                                if (ProBtnControl.params.Debug) console.log("initLeft");
                                if (ProBtnControl.params.Debug) console.log(initLeft);

                                if (ProBtnControl.params.Debug) console.log("initTop");
                                if (ProBtnControl.params.Debug) console.log(initTop);

                                ProBtnControl.additionalButtonFunctions.animation.animationRuning = true;

                                var parabolic = function() {

                                    this.css = function(p) {
                                        if (ProBtnControl.params.Debug) console.log(p);

                                        //this.css('left', (body.innerWidth() - this.width()) * closex + $(window).scrollLeft() + 'px');

                                        var maxHeight = window.innerHeight - initLeft + ProBtnControl.pizzabtn.width();
                                        var maxWidth = $("body").innerWidth() - initTop - ProBtnControl.pizzabtn.height();
                                        var y = maxHeight - (maxHeight * p) + initTop;

                                        if ((window.innerHeight - ProBtnControl.pizzabtn.height()) < y) {
                                            y = (window.innerHeight - ProBtnControl.pizzabtn.height());
                                        }

                                        var x = maxWidth - (maxWidth * p) + initLeft;
                                        if (($("body").innerWidth() - ProBtnControl.pizzabtn.width()) < x) {
                                            x = ($("body").innerWidth() - ProBtnControl.pizzabtn.width());
                                        }

                                        var outCss = {
                                            'top': y + "px",
                                            'left': x + "px",
                                            'opacity': p
                                        };
                                        if (ProBtnControl.params.Debug) console.log(outCss);
                                        return outCss;
                                    }
                                };

                                ProBtnControl.additionalButtonFunctions.MaximizeWrapper(function() {
                                    ProBtnControl.pizzabtn.animate({
                                        path: new parabolic
                                    }, ProBtnControl.params.animationDuration, ProBtnControl.additionalButtonFunctions.animation.doneAnimation);
                                })

                            }
                        }, 2000);
                    },
                    doneAnimation: function() {
                        ProBtnControl.additionalButtonFunctions.animation.animationRuning = false;

                        if ((ProBtnControl.params.ButtonAnimationDoneImage != "") && (ProBtnControl.params.ButtonAnimationDoneImage != undefined)) {
                            ProBtnControl.params.ButtonImage = ProBtnControl.params.ButtonAnimationDoneImage;
                            $("#pizzabtnImg", ProBtnControl.pizzabtn).attr('src', ProBtnControl.params.ButtonAnimationDoneImage);
                        }

                        ProBtnControl.additionalButtonFunctions.MinimizeWrapper();
                    }
                },
                //search for active zone by name
                getCurrentActiveArea: function(areaName) {
                    if (((ProBtnControl.params.ActiveZones !== null) || (ProBtnControl.params.ActiveZones.length > 0)) && (ProBtnControl.params.ButtonType == "button_and_active_zones")) {

                        for (var i = 0; i < ProBtnControl.params.ActiveZones.length; i++) {
                            var currentActiveZone = ProBtnControl.params.ActiveZones[i];
                            if (currentActiveZone.Name == areaName) {
                                //we found this area
                                return currentActiveZone;
                            }
                        }
                        return null;
                    } else {
                        return null;
                    }
                },
                randomString: function(length) {
                    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
                },
                //check for orientation - landscape or not
                isLandscape: function() {
                    return ($(window).width() > $(window).height());
                },
                getFancyboxMargins: function() {
                    if ((ProBtnControl.params.ContentInsets.T < 0) || (ProBtnControl.params.ContentInsets.B < 0) || (ProBtnControl.params.ContentInsets.L < 0) || (ProBtnControl.params.ContentInsets.R < 0)) {
                        var isMobileLandscape = (ProBtnControl.additionalButtonFunctions.isLandscape() && ProBtnControl.userData.mobile);
                        var margins = (isMobileLandscape) ? [ProBtnControl.params.ButtonSize.H / 4, ProBtnControl.params.ButtonSize.H / 4 + 5, ProBtnControl.params.ButtonSize.H / 4, ProBtnControl.params.ButtonSize.H / 4 + 5] : [ProBtnControl.params.ButtonSize.H + 5, ProBtnControl.params.ButtonSize.H / 2, ProBtnControl.params.ButtonSize.H + 5, ProBtnControl.params.ButtonSize.H / 2];

                        if ((ProBtnControl.userData.mobile) && (ProBtnControl.params.ButtonSize.H > 70)) {
                            margins = [ProBtnControl.params.ButtonSize.H / 8, ProBtnControl.params.ButtonSize.H / 8, ProBtnControl.params.ButtonSize.H / 8, ProBtnControl.params.ButtonSize.H / 8];
                        } else {
                            if (ProBtnControl.params.ButtonSize.H > 70) {
                                margins = [70, 70, 70, 70];
                            };
                        };
                    } else {
                        var margins = [ProBtnControl.params.ContentInsets.T, ProBtnControl.params.ContentInsets.R, ProBtnControl.params.ContentInsets.B, ProBtnControl.params.ContentInsets.L];
                    }
                    return margins;
                },
                setIfameSizes: function() {
                    if (ProBtnControl.userData.mobile) {
                        //$(".fancybox-iframe").first().attr("scrolling", "no");
                        //$(".fancybox-iframe").first().width($(".fancybox-inner").first().width());
                    }

                    if ((ProBtnControl.params.iframeScaleMinWidth !== 0) && (ProBtnControl.params.iframeScaleMinWidth > $(".fancybox-inner").first().width())) {
                        ProBtnControl.params.iframeScale = $(".fancybox-inner").first().width() / ProBtnControl.params.iframeScaleMinWidth;

                        $(".fancybox-iframe").first().css("margin-bottom", "-5000px");
                        $(".fancybox-iframe").css("margin-bottom", "-5000px");
                    } else {}

                    if (ProBtnControl.params.iframeScale != 1) {
                        $(".fancybox-iframe").first().css("transform", "scale(" + ProBtnControl.params.iframeScale + ")");
                        $(".fancybox-iframe").first().css("-moz-transform", "scale(" + ProBtnControl.params.iframeScale + ")");
                        $(".fancybox-iframe").first().css("-webkit-transform", "scale(" + ProBtnControl.params.iframeScale + ")");
                        $(".fancybox-iframe").first().css("-o-transform", "scale(" + ProBtnControl.params.iframeScale + ")");
                        $(".fancybox-iframe").first().css("-ms-transform", "scale(" + ProBtnControl.params.iframeScale + ")");

                        $(".fancybox-iframe").first().css("transform-origin", "top left");
                        $(".fancybox-iframe").first().css("-webkit-transform-origin", "top left");
                        $(".fancybox-iframe").first().css("-moz-transform-origin", "top left");

                        $(".fancybox-iframe").first().width($(".fancybox-inner").first().width() / ProBtnControl.params.iframeScale);
                        $(".fancybox-iframe").first().height($(".fancybox-inner").first().height() / ProBtnControl.params.iframeScale);
                    }
                }
            }
        };

        ProBtnControl.userDataFunction();
        //console.log(ProBtnControl.additionalButtonFunctions.randomString(14));

        ProBtnControl.HpmdFunctions.probtnHpmdTrack(1);

        $(window).bind("load", function() {
            console.log("windows bind load");
            if (ProBtnControl.allButtonInit === false) {
                ProBtnControl.allButtonInit = true;
                allButton();
            }
        });

        ProBtnControl.HpmdFunctions.probtnHpmdTrack(1);

        /*$(document).ready(function () {
        console.log("documentready");
        ProBtnControl.allButtonInit = true;
        allButton();
        });*/

        setTimeout(function() {
            if (ProBtnControl.params.Debug) console.log("setTimeout");
            if (ProBtnControl.allButtonInit === false) {
                ProBtnControl.allButtonInit = true;
                allButton();
            }
        }, 2000);

        function allButton() {
            if ((ProBtnControl.userData.browserMajorVersion > "8") || (ProBtnControl.userData.browser !== "Microsoft Internet Explorer")) {

                ProBtnControl.params = $.extend({

                    MainButtonClickable: true,
                    ActiveZones: [{
                        Name: "Area1",
                        Position: {
                            X: 0.5,
                            Y: 0.5
                        },
                        ActiveImage: "//admin.probtn.com/eqwid_btn_nonpress.png",
                        InactiveImage: "//admin.probtn.com/eqwid_btn_nonpress.png",
                        ActiveSize: {
                            W: 64,
                            H: 64
                        },
                        InactiveSize: {
                            W: 64,
                            H: 64
                        },
                        ActionURL: "https://admin.probtn.com/probtn_demo_page.html",
                        ClickCounterLink: "",
                        VisibleOnlyInteraction: true,
                        InactiveOpacity: 0.8,
                        ActiveOpacity: 1
                    }],

                    hpmd: undefined, //main hpmd object

                    isServerCommunicationEnabled: true,
                    localSettingsPath: "settings.json",
                    useLocalFileSettings: false,

                    ClickCounterLink: "",

                    isSmartBanner: false,
                    smartbannerJsPath: '//cdn.probtn.com/libs/jquery.smartbanner.js',
                    smartbannerCssPath: '//cdn.probtn.com/libs/jquery.smartbanner.css',

                    animationDuration: 5000,
                    isAnimation: "",
                    ButtonAnimationDoneImage: "",

                    //smartbanner settings
                    smartbanner: {
                        iosAppId: null,
                        androidAppId: null,
                        isFixed: false,
                        isFixedMode: 'default', //default - position fixed over content
                        // extrusion - banner is fixed, but content moved down (banner height) - so banner don't close any content at page

                        title: null, // What the title of the app should be in the banner (defaults to <title>)
                        author: null, // What the author of the app should be in the banner (defaults to <meta name="author"> or hostname)
                        price: 'FREE', // Price of the app
                        appStoreLanguage: 'us', // Language code for App Store
                        inAppStore: 'On the App Store', // Text of price for iOS
                        inGooglePlay: 'In Google Play', // Text of price for Android
                        inAmazonAppStore: 'In the Amazon Appstore',
                        inWindowsStore: 'In the Windows Store', // Text of price for Windows
                        GooglePlayParams: null, // Aditional parameters for the market
                        icon: null, // The URL of the icon (defaults to <meta name="apple-touch-icon">)
                        iconGloss: null, // Force gloss effect for iOS even for precomposed
                        url: null, // The URL for the button. Keep null if you want the button to link to the app store.
                        button: 'VIEW', // Text for the install button
                        scale: 'auto', // Scale based on viewport size (set to 1 to disable)
                        speedIn: 300, // Show animation speed of the banner
                        speedOut: 400, // Close animation speed of the banner
                        daysHidden: 0, // Duration to hide the banner after being closed (0 = always show banner)
                        daysReminder: 0, // Duration to hide the banner after "VIEW" is clicked *separate from when the close button is clicked* (0 = always show banner)
                        force: null, // Choose 'ios', 'android' or 'windows'. Don't do a browser check, just always show this banner
                        hideOnInstall: true, // Hide the banner after "VIEW" is clicked.
                        layer: false, // Display as overlay layer or slide down the page
                        iOSUniversalApp: true, // If the iOS App is a universal app for both iPad and iPhone, display Smart Banner to iPad users, too.
                        appendToSelector: 'body' //Append the banner to a specific selector
                    },

                    //params for dfp google ads network
                    dfp: {
                        isDFP: false,
                        clickUrlEsc: "",
                        cacheBuster: ""
                    },

                    showInParent: false,
                    isHPMD: false,
                    iframeScaleMinWidth: 0,
                    iframeScale: 1.0,
                    Debug: false,

                    VideoPoster: '',
                    ButtonOnClick: 'function start1() { try { var video = $("#video_probtn").get(0); video.play(); } catch(ex) { } }; start1(); setTimeout(start1 , 2000);',
                    ButtonType: 'fancybox',
                    VideoSize: {
                        X: 1920,
                        Y: 1080
                    },
                    ButtonContentType: "iframe",
                    FancyboxType: "iframe",

                    TrackingLink: null,
                    MinimizeWrapperTime: 600,
                    OpenExternal: false,
                    CampaignID: null,
                    NeverClose: true,
                    MaxHeight: 0,
                    MaxWidth: 0,
                    domain: "",
                    fancyboxJsPath: "//cdn.probtn.com/libs/jquery.fancybox.min.js",
                    //"//cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js",
                    //"//cdn.jsdelivr.net/fancybox/2.1.5/jquery.fancybox.min.js",
                    fancyboxCssPath: "//cdn.probtn.com/libs/jquery.fancybox.min.css",
                    //"//cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.css",
                    //"//cdn.jsdelivr.net/fancybox/2.1.5/jquery.fancybox.min.css",
                    mainStyleCss: "//cdn.probtn.com/style.css",
                    jqueryPepPath: "//cdn.probtn.com/libs/jquery.pep.min.js",
                    //"//cdn.jsdelivr.net/jquery.pep/0.6.3/jquery.pep.min.js",
                    buttonAnimationTimeAfterFancybox: 40,

                    HideAfterFirstShow: false,

                    LoadFancyboxCSS: true,

                    //base params
                    ContentURL: "http://app.ecwid.com/jsp/2557212/m", //site url address
                    BaseInsets: { // Базовое смещение от краев экрана с учетом статус бара
                        T: 4.0,
                        B: 4.0,
                        L: 4.0,
                        R: 4.0
                    },
                    ButtonEnabled: false, // Включена / выключена
                    ButtonVisible: false, // видна / не видна
                    // Кнопка
                    ButtonOpenInsets: { // Смещение в открытом состоянии
                        T: 32.0,
                        B: 32.0,
                        L: 32.0,
                        R: 32.0
                    },
                    ButtonPosition: { // Позиция
                        X: 0.5, // По умолчанию центр экрана
                        Y: 0.5 // По умолчанию центр экрана
                    },
                    ButtonSize: { // Размер
                        W: 64.0,
                        H: 64.0
                    },
                    ButtonDragSize: { // Размер при перемещении
                        W: 68.0,
                        H: 68.0
                    },
                    ButtonOpenSize: { // Размер в открытом состоянии
                        W: 64.0,
                        H: 64.0
                    },
                    ButtonInactiveSize: { // Размер в неактивном состоянии
                        W: 64.0,
                        H: 64.0
                    },
                    ButtonOpacity: 0.8, // Прозрачность
                    ButtonDragOpacity: 1.0, // Прозрачность при перемещении
                    ButtonOpenOpacity: 1.0, // Прозрачность в открытом состоянии
                    ButtonInactiveOpacity: 0.5, // Прозрачность в неактивном состоянии
                    ButtonImage: "//cdnjs.cloudflare.com/ajax/libs/probtn/1.0.0/images/probtn/gray.png",
                    ButtonDragImage: "//cdnjs.cloudflare.com/ajax/libs/probtn/1.0.0/images/probtn/drag_gray.png",
                    ButtonOpenImage: "//cdnjs.cloudflare.com/ajax/libs/probtn/1.0.0/images/probtn/drag_gray.png",
                    ButtonInactiveImage: "//cdnjs.cloudflare.com/ajax/libs/probtn/1.0.0/images/probtn/drag_gray.png",

                    ClosePosition: { // Позиция
                        X: 0.5, // По умолчанию центр экрана
                        Y: 0.85 // По умолчанию центр экрана
                    },
                    CloseSize: { // Размер
                        W: 64,
                        H: 64
                    },
                    CloseActiveSize: { // Размер в активном состоянии
                        W: 72,
                        H: 72
                    },
                    CloseOpacity: 0.6, // Прозрачность
                    CloseActiveOpacity: 1.0, // Прозрачность в активном состоянии
                    CloseImage: "//cdnjs.cloudflare.com/ajax/libs/probtn/1.0.0/images/probtn/close.png", // Ссылка на изображение
                    CloseActiveImage: "//cdnjs.cloudflare.com/ajax/libs/probtn/1.0.0/images/probtn/close.png", // Ссылка на изображение в активном состоянии

                    HintInsets: { // Смещение от краев
                        T: 4.0,
                        B: 4.0,
                        L: 4.0,
                        R: 4.0
                    },
                    HintLabelInsets: { // Смещение для текста
                        T: 4.0,
                        B: 4.0,
                        L: 4.0,
                        R: 4.0
                    },
                    HintImageInsets: { // Бордюры для изображения
                        T: 8.0,
                        B: 8.0,
                        L: 8.0,
                        R: 8.0
                    },
                    HintText: "Press me", // Текст
                    HintFont: { // Шрифт
                        Family: "Arial",
                        Size: 18
                    },
                    HintFontColor: { // Цвет
                        R: 1.0,
                        G: 1.0,
                        B: 1.0,
                        A: 1.0
                    },
                    VendorText: "",
                    VendorSite: "#",
                    VendorTextFont: {
                        "Family": "Arial",
                        "Size": 10
                    },
                    VendorTextColor: {
                        "R": 1,
                        "G": 1,
                        "B": 1,
                        "A": 1
                    },
                    VendorOpacity: 0.4,
                    VendorColor: {
                        "R": 0,
                        "G": 0,
                        "B": 0,
                        "A": 1
                    },

                    HintOpacity: 0.8, // Прозрачность подсказки
                    HintImage: "//cdnjs.cloudflare.com/ajax/libs/probtn/1.0.0/images/probtn/hint.png", // Ссылка на изображение

                    HintArrowSize: { // Размер стрелки
                        W: 8.0,
                        H: 8.0
                    },
                    HintArrowOffset: { // Нахлест стрелки
                        T: 0.0,
                        B: 0.0,
                        L: 0.0,
                        R: 0.0
                    },
                    HintArrowImageT: "", // Ссылка на изображение
                    HintArrowImageB: "", // Ссылка на изображение
                    HintArrowImageL: "", // Ссылка на изображение
                    HintArrowImageR: "", // Ссылка на изображение

                    ContentSize: {
                        W: 100,
                        H: 100,
                        X: "90%",
                        Y: "90%"
                    },
                    IsManualSize: true,

                    // Контент
                    ContentInsets: { // Смещение от краев
                        T: -2.0,
                        B: -2.0,
                        L: -2.0,
                        R: -2.0
                    },
                    ContentWebViewInsets: { // Смещение для WebView
                        T: 12.0,
                        B: 12.0,
                        L: 12.0,
                        R: 12.0
                    },
                    ContentImageInsets: { // Бордюры для изображения
                        T: 32.0,
                        B: 32.0,
                        L: 32.0,
                        R: 32.0
                    },
                    ContentOpacity: 1.0, // Прозрачность
                    ContentBackOpacity: 1.0, // Прозрачность фоновой части контента
                    ContentBackColor: { // Цвет фоновой части контента
                        R: 0.0,
                        G: 0.0,
                        B: 0.0,
                        A: 1.0
                    },
                    ContentActivityColor: { // Цвет индикатора загрузки
                        R: 0.0,
                        G: 0.0,
                        B: 0.0,
                        A: 1.0
                    },
                    ContentImage: "", // Ссылка на изображение

                    ContentArrowSize: { // Размер стрелки
                        W: 14.0,
                        H: 14.0
                    },
                    ContentArrowOffset: { // Нахлест стрелки
                        T: 8.0,
                        B: 8.0,
                        L: 9.0,
                        R: 9.0
                    },
                    ContentArrowImageT: "", // Ссылка на изображение
                    ContentArrowImageB: "", // Ссылка на изображение
                    ContentArrowImageL: "", // Ссылка на изображение
                    ContentArrowImageR: "", // Ссылка на изображение

                    // Настройки анимации

                    DefaultDuration: 0.1, // Стандартная длительность анимации
                    DefaultDelay: 0.0, // Стандартная задежка анимации

                    OpenDuration: 0.2, // Длительность анимации "Открытия"
                    OpenDelay: 0.5, // Задержка анимации "Открытия"
                    CloseDuration: 0.2, // Длительность анимации "Закрытия"
                    CloseDelay: 0.5, // Задержка анимации "Закрытия"

                    ButtonShowDuration: 0.2, // Длительность анимации "Показать"
                    ButtonShowDelay: 0.0, // Задержка анимации "Показать"
                    ButtonHideDuration: 0.2, // Длительность анимации "Скрыть"
                    ButtonHideDelay: 0.0, // Задержка анимации "Скрыть"
                    ButtonDragDuration: 0.1, // Длительность анимации "Начать перемещать"
                    ButtonDragDelay: 0.0, // Задержка анимации "Начать перемещать"
                    ButtonUndragDuration: 0.2, // Длительность анимации "Перестать перемещать"
                    ButtonUndragDelay: 0.0, // Задержка анимации "Перестать перемещать"
                    ButtonInactiveDuration: 0.1, // Длительность анимации "Переход в неактивное состояние"
                    ButtonInactiveDelay: 5.0, // Время простоя перед переходом в неактивное состояние
                    ButtonInertiaSpeed: 512.0, // Скорость анимации "Инерция"
                    ButtonInertiaSpeedMin: 32.0, // Максимальная скорость анимации "Инерция"
                    ButtonInertiaSpeedMax: 1024.0, // Минимальная скорость анимации "Инерция"
                    ButtonInertiaFactor: 6.0, // Множитель анимации "Инерция"

                    CloseShowDuration: 0.1, // Длительность анимации "Показать область закрытия"
                    CloseShowDelay: 0.0, // Задержка анимации "Показать область закрытия"
                    CloseHideDuration: 0.2, // Длительность анимации "Скрыть область закрытия"
                    CloseHideDelay: 0.0, // Задержка анимации "Скрыть область закрытия"
                    CloseActiveDuration: 0.1, // Длительность анимации "Активировать область закрытия"
                    CloseActiveDelay: 0.0, // Задержка анимации "Активировать область закрытия"
                    CloseUnactiveDuration: 0.1, // Длительность анимации "Деактивировать область закрытия"
                    CloseUnactiveDelay: 0.0, // Задержка анимации "Деактивировать область закрытия"

                    HintLaunchDuration: 30000.0, // Длительность анимации "Показать при запуске подсказку"
                    HintLaunchDelay: 0.0, // Задержка анимации "Показать при запуске подсказку"
                    HintShowDuration: 0.1, // Длительность анимации "Показать подсказку"
                    HintShowDelay: 0.0, // Задержка анимации "Показать подсказку"
                    HintHideDuration: 0.2, // Длительность анимации "Скрыть подсказку"
                    HintHideDelay: 0.0, // Задержка анимации "Скрыть подсказку"

                    ContentShowDuration: 0.1, // Длительность анимации "Показать контент"
                    ContentShowDelay: 0.0, // Задержка анимации "Показать контент"
                    ContentHideDuration: 0.2, // Длительность анимации "Скрыть контент"
                    ContentHideDelay: 0.0, // Задержка анимации "Скрыть контент",

                    HideInFrame: true, // Скрывать, если кнопка показывается внутри другой кнопки

                    ZCustomCss: ""
                }, options);

                function changeBodySize() {
                    var opts = {
                        width: window.availWidth,
                        height: window.availHeight
                    }
                    if (ProBtnControl.userData.browser === "Microsoft Internet Explorer") {
                        opts.overflow = "auto";
                    }
                    try {
                        $('body').css(opts);
                    } catch (ex) {}
                }

                // hint style
                var hintTextStyle = {
                    "opacity": ProBtnControl.params.HintOpacity,
                    "font-size": ProBtnControl.params.HintFont.Size,
                    "font-family": ProBtnControl.params.HintFont.Family,
                    "color": "white",
                    "padding": "4px",
                    "background": "url('" + ProBtnControl.params.HintImage + "')"
                };

                if ((ProBtnControl.params.HintText == "") || (ProBtnControl.params.HintText == null)) {
                    hintTextStyle.display = "none";
                    hintTextStyle.opacity = "0.0";
                }

                //undefined until we init close button
                var closeButton = undefined; //initCloseButton();

                //$(document).ready(function () {
                ProBtnControl.currentDomain = document.domain.replace("www.", "");
                if (ProBtnControl.currentDomain == "" || ProBtnControl.currentDomain == null) {
                    ProBtnControl.currentDomain = "example.com";
                };

                ProBtnControl.realDomain = ProBtnControl.currentDomain;
                //rewrite domain if it specified in plugins params
                if ((ProBtnControl.params.domain != "") && (ProBtnControl.params.domain != null)) {
                    ProBtnControl.currentDomain = ProBtnControl.params.domain;
                } else {};

                // orientation
                var supportsOrientationChange = "onorientationchange" in window;
                var orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

                var windowHeight = window.innerHeight;
                var windowWidth = window.innerWidth;

                var closeAfterOrientationChange = false;

                //when window is resized or changed orientation on device

                function onOrientationChange(e) {
                    if (ProBtnControl.pizzabtn.position().left > (window.innerWidth - ProBtnControl.params.ButtonSize.W)) {
                        ProBtnControl.pizzabtn.css("left", window.innerWidth - ProBtnControl.params.ButtonSize.W);
                    }
                    if (ProBtnControl.pizzabtn.position().top > (window.innerHeight - ProBtnControl.params.ButtonSize.H)) {
                        ProBtnControl.pizzabtn.css("top", window.innerHeight - ProBtnControl.params.ButtonSize.H);
                    }

                    //check is fancybox is open at current moment
                    var isOpen = false;
                    try {
                        if ($.fancybox !== undefined) {
                            isOpen = $.fancybox.isOpen;
                        }
                    } catch (ex) {}

                    if (($.fancybox !== undefined) || (ProBtnControl.params.ButtonType == "fullscreen")) {
                        if ((isOpen) || (ProBtnControl.params.ButtonType == "fullscreen")) {
                            //resizefancybox

                            var contentSizeX = ProBtnControl.params.ContentSize.X;
                            var contentSizeY = ProBtnControl.params.ContentSize.Y;

                            //get fancybox margins
                            var margins = ProBtnControl.additionalButtonFunctions.getFancyboxMargins();

                            var newFancyboxWidth = window.innerWidth - margins[1] - margins[3];;
                            var newFancyboxHeight = window.innerHeight - margins[0] - margins[2];

                            //get fancybox sizes
                            if (ProBtnControl.params.IsManualSize === true) {
                                if (ProBtnControl.params.ContentSize.X.indexOf('%') !== -1) {
                                    newFancyboxWidth = window.innerWidth * (parseFloat(ProBtnControl.params.ContentSize.X) / 100);
                                    contentSizeX = (parseFloat(ProBtnControl.params.ContentSize.X) / 100);
                                } else {
                                    newFancyboxWidth = ProBtnControl.params.ContentSize.X;
                                }
                                if (ProBtnControl.params.ContentSize.Y.indexOf('%') !== -1) {
                                    newFancyboxHeight = window.innerHeight * (parseFloat(ProBtnControl.params.ContentSize.Y) / 100);
                                    contentSizeY = (parseFloat(ProBtnControl.params.ContentSize.Y) / 100);
                                } else {
                                    newFancyboxHeight = ProBtnControl.params.ContentSize.Y;
                                }
                            } else {
                                //if isManualSize is not set, then fancybox should be sized in px
                                newFancyboxHeight = ProBtnControl.params.ContentSize.H;
                                newFancyboxWidth = ProBtnControl.params.ContentSize.W;
                            }

                            newFancyboxHeight = newFancyboxHeight - margins[0] - margins[2];
                            newFancyboxWidth = newFancyboxWidth - margins[1] - margins[3];

                            function setFancyboxSizes() {
                                //if (params.IsManualSize === true) {
                                $('.fancybox-wrap').width(newFancyboxWidth);
                                $('.fancybox-wrap').height(newFancyboxHeight);

                                $('.fancybox-inner').width(newFancyboxWidth);
                                $('.fancybox-inner').height(newFancyboxHeightInner);
                                //}

                                if (ProBtnControl.params.ButtonType == "fullscreen") {
                                    $('.fancybox-wrap').css("left", margins[1]);
                                    $('.fancybox-wrap').css("top", margins[0]);
                                    $('.fancybox-wrap').css("bottom", margins[2]);
                                    $('.fancybox-wrap').css("right", margins[3]);
                                }

                                ProBtnControl.additionalButtonFunctions.setIfameSizes();
                            }

                            var newFancyboxWidthInner = newFancyboxWidth - $(".fancybox-title").width();
                            var newFancyboxHeightInner = newFancyboxHeight - $(".fancybox-title").height();

                            setFancyboxSizes();

                            if (newFancyboxWidth > newFancyboxHeight) {
                                var videoHeight = $('.fancybox-inner').height();
                                var videoWidth = (videoHeight / ProBtnControl.params.VideoSize.Y) * ProBtnControl.params.VideoSize.X;
                            } else {
                                var videoWidth = $('.fancybox-inner').width();
                                var videoHeight = (videoHeight / ProBtnControl.params.VideoSize.X) * ProBtnControl.params.VideoSize.Y;
                            }

                            //set video sizes
                            $(".probtn_video_wrapper2").width($('.fancybox-inner').width());
                            $(".probtn_video_wrapper2").height($('.fancybox-inner').height());
                            $(".probtn_video").width(videoWidth);
                            $(".probtn_video").height(videoHeight);

                            setFancyboxSizes();
                        }
                    }
                }


                var operator = null;
                var settingsUrl = "";

                function CheckAndRunButtonAtParent() {
                    if ((ProBtnControl.params.showInParent) && (window.self !== window.top)) {
                        ProBtnControl.params.showInParent = false;
                        ProBtnControl.params.HideInFrame = true;

                        // https://cdn.probtn.com/includepb.min.js
                        var oHead = window.top.document.getElementsByTagName('HEAD').item(0);

                        function loadJS(src, callback) {
                            var s = window.top.document.createElement('script');
                            s.src = src;
                            s.async = true;
                            s.onreadystatechange = s.onload = function() {
                                var state = s.readyState;
                                if (!callback.done && (!state || /loaded|complete/.test(state))) {
                                    callback.done = true;
                                    callback();
                                }
                            };
                            window.top.document.getElementsByTagName('head')[0].appendChild(s);
                        }

                        loadJS('//cdn.probtn.com/includepb.min.js', function() {});
                    }
                }

                //check settings and run smartbanner

                function startAppBanner() {
                    if ((ProBtnControl.params.ButtonType == "smartbanner") || (ProBtnControl.params.IsSmartBanner == true)) {

                        function initSmartBanner() {
                            if (ProBtnControl.params.Debug) console.log(ProBtnControl.params.smartbanner);
                            ProBtnControl.statistics.SendStatisticsData("Opened", 1);
                            ProBtnControl.statistics.SendStatisticsData("Showed", 1);

                            try {
                                try {
                                    if ((!ProBtnControl.params.smartbanner.androidAppId) || (ProBtnControl.params.smartbanner.androidAppId == "")) {
                                        if (!$('meta[name=apple-itunes-app]').length) {
                                            $('head').append('<meta name="apple-itunes-app" content="app-id=' + ProBtnControl.params.smartbanner.iosAppId + '" />');
                                        }
                                    }
                                    if ((!ProBtnControl.params.smartbanner.androidAppId) || (ProBtnControl.params.smartbanner.androidAppId == "")) {
                                        if (!$('meta[name=google-play-app]').length) {
                                            $('head').append('<meta name="google-play-app" content="app-id=' + ProBtnControl.params.smartbanner.androidAppId + '" />');
                                        }
                                    }
                                } catch (ex1) {
                                    console.log(ex1);
                                }

                                /*try {
                                    if ((!ProBtnControl.params.smartbanner.androidAppId) || (ProBtnControl.params.smartbanner.androidAppId == "")) {
                                        ProBtnControl.params.smartbanner.androidAppId = "empty";
                                    }
                                    if ((!ProBtnControl.params.smartbanner.iosAppId) || (ProBtnControl.params.smartbanner.iosAppId == "")) {
                                        ProBtnControl.params.smartbanner.iosAppId = "empty";
                                    }
                                    //delete smartbannerParams.iosAppId;
                                    //delete smartbannerParams.androidAppId;

                                    console.log(smartbannerParams);
                                } catch (ex1) {
                                    console.log(ex1);
                                }*/

                                //appendToSelector
                                if (ProBtnControl.params.smartbanner.isFixedMode == 'extrusion') {
                                    ProBtnControl.params.smartbanner.appendToSelector = 'html';
                                }

                                $.smartbanner(ProBtnControl.params.smartbanner);

                                if (ProBtnControl.params.Debug) console.log(ProBtnControl.params.smartbanner.isFixed);
                                if (ProBtnControl.params.smartbanner.isFixed == true) {
                                    $("#smartbanner").css("position", "fixed");
                                }

                                $("#smartbanner .sb-info").append('<div style="margin-left: -1px;" class="rating"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>');
                                //★ ☆
                                if (ProBtnControl.params.smartbanner.isFixedMode == 'extrusion') {
                                    if (ProBtnControl.params.Debug) console.log("extrusion");
                                    $("#smartbanner").css("position", "fixed");
                                    $("body").css("top", "78px");
                                    $("body").css("margin", "0px");
                                    $("body").css("position", "absolute");
                                    $("body").css("width", "100%");
                                }

                                $("#smartbanner .sb-button").attr("target", "_blank");

                                $("#smartbanner .sb-button").click(function() {
                                    if (ProBtnControl.params.Debug) console.log("smartbanner click");
                                    ProBtnControl.statistics.SendStatisticsData("ContentShowed", 1);
                                });

                                $("#smartbanner a.sb-close").click(function() {
                                    if (ProBtnControl.params.Debug) console.log("smartbanner close");
                                    ProBtnControl.statistics.SendStatisticsData("Closed", 1);
                                    ProBtnControl.statistics.SendStatisticsData("Hidded", 1);
                                    if (ProBtnControl.params.smartbanner.isFixedMode == 'extrusion') {
                                        $("body").css("top", "0px");
                                    }
                                });

                            } catch (ex) {
                                console.log(ex);
                            }
                        }

                        if (typeof $.smartbanner == 'function') {
                            initSmartBanner();
                            return true;
                        } else {
                            $('head').append('<link rel="stylesheet" href="' + ProBtnControl.params.smartbannerCssPath + '" type="text/css" />');
                            $.getScript(ProBtnControl.params.smartbannerJsPath, function() {
                                initSmartBanner();
                            });
                            return true;
                        }
                        //return false;
                    } else {
                        return false;
                    }
                }

                function CheckInFrameAndEnabled() {
                    var isStartAppBanner = startAppBanner();
                    CheckAndRunButtonAtParent();

                    if ((ProBtnControl.params.HideInFrame === true && window.self !== window.top) || (isStartAppBanner)) {
                        //do nothing
                        if (ProBtnControl.params.Debug) console.log("do nothing");
                    } else {
                        if (ProBtnControl.params.ButtonEnabled == true) {

                            if (ProBtnControl.params.LoadFancyboxCSS === true) {
                                $('head').append('<link rel="stylesheet" href="' + ProBtnControl.params.fancyboxCssPath + '" type="text/css" />');
                            }

                            //add custom css to head
                            if ((ProBtnControl.params.ZCustomCss !== "") && (ProBtnControl.params.ZCustomCss !== null) && (ProBtnControl.params.ZCustomCss !== undefined)) {
                                $('head').append('<style type="text/css">' + ProBtnControl.params.ZCustomCss + '</style>');
                            }

                            //init close button
                            closeButton = initCloseButton();

                            //bind orientation change events
                            $(window).bind("orientationchange", onOrientationChange);
                            $(window).bind("resize", onOrientationChange);

                            BeginButtonProcess();
                        }
                    }
                }

                function getSettingsAndLaunchButton(operator) {
                    if (ProBtnControl.params.Debug) console.log("getSettingsAndLaunchButton");
                    var retina = 1;
                    if ((ProBtnControl.userData.os === "iOS") || (ProBtnControl.userData.os === "Mac OS") || (ProBtnControl.userData.os === "Mac OS X")) {
                        retina = window.devicePixelRatio;
                    };

                    settingsUrl = ProBtnControl.serverUrl + "/1/functions/getClientSettings?BundleID=" +
                        ProBtnControl.currentDomain + "&DeviceType=web&DeviceUID=" + ProBtnControl.GetDeviceUID() +
                        "&Location[Longitude]=0&Location[Latitude]=0&Version=" + ProBtnControl.mainVersion +
                        "&X-ProBtn-Token=" + ProBtnControl.XProBtnToken + "&random=" + Math.random() +
                        "&ScreenResolutionX=" + ProBtnControl.userData.screenHeight + "&ScreenResolutionY=" +
                        ProBtnControl.userData.screenWidth + "&Retina=" + retina + "&callback=?";

                    function parseResultData(data) {
                        if (ProBtnControl.params.Debug) console.log(data);
                        try {
                            if (ProBtnControl.params.Debug) console.log(data);

                            try {
                                //var HintText = utf8_encode(data.result.HintText);
                                data.result.HintText = HintText;
                            } catch (ex) {}

                            if (data.code == 100) {
                                if (data.MSMediaKeyNeededEvent.location == 1) {
                                    ProBtnControl.geolocation.getLocation();
                                }
                            } else {
                                if (ProBtnControl.params.Debug) console.log(ProBtnControl.params);
                                if (ProBtnControl.params.Debug) console.log(options);
                                $.extend(true, ProBtnControl.params, data.result, options);

                                //get one more additional params
                                try {
                                    if ($("#probtn_additional_params").length > 0) {
                                        var textData = $("#probtn_additional_params").text();
                                        textData = JSON.parse(textData);

                                        $.extend(true, ProBtnControl.params, ProBtnControl.params, textData);
                                    }
                                } catch (ex) {
                                    console.log(ex);
                                }

                                //check params for html code

                                function checkHtmlInObject(inObject) {
                                    try {
                                        for (var property in inObject) {
                                            if (inObject.hasOwnProperty(property)) {
                                                if (typeof(inObject[property]) == "string") {
                                                    try {
                                                        var before = inObject[property];
                                                        //inObject[property] = inObject[property].replace(/<\/?[^>]+(>|$)/g, ""); //$(inObject[property]).text();
                                                        inObject[property] = inObject[property].split('<style>').join('')
                                                            .split('</style>').join('')
                                                            .split('<script>').join('')
                                                            .split('</script>').join('');
                                                    } catch (ex) {
                                                        console.log(ex);
                                                    }
                                                }
                                            }
                                        }
                                    } catch (ex) {
                                        console.log(ex);
                                    }
                                }

                                checkHtmlInObject(ProBtnControl.params);

                                //show button if we have probtnDebug hash in url
                                if (window.location.hash == "#probtnDebug") {
                                    ProBtnControl.params.ButtonVisible = true;
                                    ProBtnControl.params.ButtonEnabled = true;
                                    ProBtnControl.params.Debug = true;
                                }

                                hintTextStyle = {
                                    "opacity": ProBtnControl.params.HintOpacity,
                                    "font-size": ProBtnControl.params.HintFont.Size,
                                    "font-family": ProBtnControl.params.HintFont.Family,
                                    "color": "rgb(" + ProBtnControl.params.HintFontColor.R * 100 + "%, " + ProBtnControl.params.HintFontColor.G * 100 + "%, " + ProBtnControl.params.HintFontColor.B * 100 + "%)",
                                    "padding-left": ProBtnControl.params.HintLabelInsets.L,
                                    "padding-top": ProBtnControl.params.HintLabelInsets.T,
                                    "padding-right": ProBtnControl.params.HintLabelInsets.R,
                                    "padding-bottom": ProBtnControl.params.HintLabelInsets.B,
                                    "background": "url('" + ProBtnControl.params.HintImage + "')"
                                };
                                if ((ProBtnControl.params.HintText == "") || (ProBtnControl.params.HintText == null)) {
                                    hintTextStyle.display = "none";
                                    hintTextStyle.opacity = "0.0";
                                }
                            }
                        } catch (ex) {
                            console.log(ex);
                        };
                    }

                    if (ProBtnControl.params.useLocalFileSettings) {
                        settingsUrl = ProBtnControl.params.localSettingsPath;
                    }

                    if ((ProBtnControl.params.isServerCommunicationEnabled) || (ProBtnControl.params.useLocalFileSettings)) {
                        $.getJSON(settingsUrl, parseResultData).done(function() {
                            console.log('done settings load');
                        }).fail(function(jqXHR, textStatus, errorThrown) {
                            if (ProBtnControl.params.Debug) console.log(errorThrown);
                            if (ProBtnControl.params.Debug) console.log(textStatus);
                        }).always(CheckInFrameAndEnabled);
                    } else {
                        console.log("Dont load settings");
                    }
                }

                getSettingsAndLaunchButton(null);

                //BEGIN BUTTON PROCESS

                function BeginButtonProcess() {
                    ProBtnControl.HpmdFunctions.probtnHpmdTrack(2);
                    //add button styles
                    $('head').append('<link rel="stylesheet" href="' + ProBtnControl.params.mainStyleCss + '" type="text/css" />');

                    //add classes for ios devices
                    if (ProBtnControl.userData.os === "iOS") {
                        $("body").addClass("btn_os_ios");
                        if (ProBtnControl.userData.isiPad === true) {
                            $("body").addClass("btn_device_ipad");
                        } else {
                            $("body").addClass("btn_device_iphone");
                        }
                    }

                    if ((ProBtnControl.userData.mobile)) {
                        $('head').append("<style type='text/css'> .fancybox-inner { -webkit-overflow-scrolling: touch !important; overflow: scroll !important; } </style>");
                    } else {
                        $('head').append("<style type='text/css'> .fancybox-inner { -webkit-overflow-scrolling: touch !important; overflow: hidden !important; } </style>");
                    };

                    //var closeButton = initCloseButton();
                    $('#probtn_closeButton').attr('src', ProBtnControl.params.CloseImage);

                    // append pizzabtn and close btn styles
                    if (ProBtnControl.params.NeverClose == false) {
                        $('head').append(
                            $('<style/>', {
                                id: 'probtn_style',
                                type: "text/css",
                                html: [
                                    '#probtn_button.pizzabtn_normal { display: block; clear: both; position: device-fixed !important; }',
                                    '.close_pro_button_normal{ width:' + ProBtnControl.params.CloseSize.W + 'px; height:' + ProBtnControl.params.CloseSize.H + 'px; opacity:' + ProBtnControl.params.CloseOpacity + '; display: block; clear: both; }',
                                ].join("\n")
                            })
                        );
                    };

                    if ((ProBtnControl.params.ButtonType == "fullscreen_fancybox") || (ProBtnControl.params.ButtonType == "fullscreen")) {
                        ProBtnControl.params.ButtonVisible = false;
                    }

                    // get or create pizzabtn
                    ProBtnControl.pizzabtn = initPizzaButton();

                    console.log("initActiveZones");
                    initActiveZones();

                    //if not fullscreen - load pep and fancybox
                    if (ProBtnControl.params.ButtonType !== "fullscreen") {
                        // load fancybox and jquery.pep
                        if (typeof $.fancybox == 'function') {
                            loadPep();
                        } else {
                            $.getScript(ProBtnControl.params.fancyboxJsPath, loadPep); //fancybox end
                        }
                    } else {
                        fullscreenInitAndShow();
                    }

                    function loadPep() {
                        try {
                            if (typeof $.pep.toggleAll == 'function') {
                                AllLoadedButtonProcess();
                            } else {
                                $.getScript(ProBtnControl.params.jqueryPepPath, AllLoadedButtonProcess);
                            };
                        } catch (ex) {
                            $.getScript(ProBtnControl.params.jqueryPepPath, AllLoadedButtonProcess);
                        }
                    }

                    ///

                    function AllLoadedButtonProcess() {
                        ProBtnControl.statistics.SendStatisticsData();

                        ProBtnControl.statistics.SendBrowserStatsInfo();

                        // show button
                        if (ProBtnControl.params.ButtonEnabled && ProBtnControl.params.ButtonVisible) {
                            ProBtnControl.pizzabtn.show();
                        }

                        if (ProBtnControl.params.ButtonType == "fullscreen_fancybox") {
                            onButtonTap();
                        }

                        if (ProBtnControl.params.ButtonType == "fullscreen") {
                            fullscreenInitAndShow();
                        }

                        if (ProBtnControl.params.ButtonVisible) {
                            ProBtnControl.statistics.SendStatisticsData("Showed", 1);
                        }

                        //hide hint after params.HintLaunchDuration time (in seconds)
                        ProBtnControl.pizzabtn.hideHintDelay();

                        //show hint with nessesary animation
                        ProBtnControl.pizzabtn.showHint();


                        // help vars
                        var overlaped = false;

                        ProBtnControl.pizzabtn.moved = false;
                        ProBtnControl.pizzabtn.pep({
                            // hardwareAccelerate: false,
                            useCSSTranslation: false,
                            constrainTo: 'parent',
                            // cssEaseString: 'cubic-bezier(0.225, 0.500, 0.580, 1.000)', //default
                            // cssEaseString: 'cubic-bezier(0, 1, 1, 1)', // fast
                            // cssEaseString: 'cubic-bezier(0, 0, 1, 1)', // linear
                            // cssEaseString: 'cubic-bezier(.42, 0, .58, 1)', // ease-in-out
                            // cssEaseString: 'cubic-bezier(0, 0, .58, 1)', // ease-out
                            cssEaseString: 'cubic-bezier(0, .50, .50, 1)',
                            cssEaseDuration: 300,
                            velocityMultiplier: 1.0,
                            startThreshold: [1, 1],
                            droppable: '.probtn_active_zone',
                            initiate: changeBodySize,
                            start: function() {

                                if (ProBtnControl.additionalButtonFunctions.animation.animationRuning) {
                                    ProBtnControl.additionalButtonFunctions.animation.doneAnimation();
                                }

                                $.each(ProBtnControl.initializedActiveZones, function(index, activeZone) {
                                    if (activeZone.currentActiveZone.VisibleOnlyInteraction) {
                                        activeZone.show();
                                    }
                                });

                                ProBtnControl.additionalButtonFunctions.MaximizeWrapper(function() {

                                    if (ProBtnControl.pizzabtn.moved == false) {
                                        ProBtnControl.pizzabtn.dragAnimate();
                                    };
                                    ProBtnControl.pizzabtn.moved = true;
                                    //hide hint
                                    if (ProBtnControl.pizzabtn.hintTextActive) {
                                        ProBtnControl.pizzabtn.hideHint();
                                    }
                                    // show close button
                                    if (ProBtnControl.params.NeverClose == false) {
                                        closeButton.show();
                                    };
                                    ProBtnControl.statistics.SendStatisticsData("Moved", 1);
                                });
                            },
                            drag: function(ev, obj) {
                                ProBtnControl.additionalButtonFunctions.MaximizeWrapper(function() {
                                    var pizzabtnRect = ProBtnControl.pizzabtn[0].getBoundingClientRect();
                                    var closeButtonRect = closeButton[0].getBoundingClientRect();

                                    if ((pizzabtnRect.top + pizzabtnRect.height) > $(window).height()) {}

                                    var overlap = !(pizzabtnRect.right < closeButtonRect.left || pizzabtnRect.left > closeButtonRect.right || pizzabtnRect.bottom < closeButtonRect.top || pizzabtnRect.top > closeButtonRect.bottom);
                                    if (overlap && closeButtonRect.width !== 0) {
                                        if (!overlaped) {
                                            closeButton.overlayActive();
                                            overlaped = true;
                                        }
                                    } else {
                                        if (overlaped) {
                                            closeButton.overlayUnactive();
                                            overlaped = false;
                                        }
                                    }
                                });

                                try {
                                    //if (ProBtnControl.params.Debug) console.log('There are ' + this.activeDropRegions.length + 'active drop regions.');
                                    if (this.activeDropRegions.length > 0) {
                                        var currentZoneName = jQuery(this.activeDropRegions[0]).attr("rel");

                                        var activeZone = ProBtnControl.initializedActiveZones[currentZoneName];
                                        //console.log(activeZone);
                                        activeZone.attr("src", activeZone.currentActiveZone.ActiveImage);
                                        activeZone.css({
                                            width: activeZone.currentActiveZone.ActiveSize.W,
                                            width: activeZone.currentActiveZone.ActiveSize.H
                                        });
                                    } else {
                                        $.each(ProBtnControl.initializedActiveZones, function(index, activeZone) {
                                            //reset zone images to inactive
                                            activeZone.attr("src", activeZone.currentActiveZone.InactiveImage);
                                            activeZone.css({
                                                width: activeZone.currentActiveZone.InactiveSize.W,
                                                width: activeZone.currentActiveZone.InactiveSize.H
                                            });
                                        });
                                    }
                                } catch (ex) {

                                }

                            },
                            stop: function() {
                                //check is there is some active zone after we stop using button
                                if (this.activeDropRegions.length > 0) {
                                    try {
                                        //get zone name
                                        var currentZoneName = jQuery(this.activeDropRegions[0]).attr("rel");
                                        if (ProBtnControl.params.Debug) console.log(currentZoneName);
                                        //get zone object
                                        var activeZone = ProBtnControl.initializedActiveZones[currentZoneName];

                                        //ProBtnControl.statistics.sendAreaActivatedStats(currentZoneName);

                                        activeZone.requestClickCounterLink();
                                        onButtonTap(activeZone.currentActiveZone.ActionURL, currentZoneName);
                                    } catch (ex) {
                                        if (ProBtnControl.params.Debug) console.log(ex);
                                    }
                                }
                                //hide zones and set inactive sizes
                                $.each(ProBtnControl.initializedActiveZones, function(index, activeZone) {
                                    if (activeZone.currentActiveZone.VisibleOnlyInteraction) {
                                        activeZone.attr("src", activeZone.currentActiveZone.InactiveImage);
                                        activeZone.css({
                                            width: activeZone.currentActiveZone.InactiveSize.W,
                                            width: activeZone.currentActiveZone.InactiveSize.H
                                        });
                                        activeZone.hide();
                                    }
                                });

                                if (!ProBtnControl.pizzabtn.moved) {
                                    //if button clicked
                                    ProBtnControl.additionalButtonFunctions.MaximizeWrapper(function() {
                                        if (ProBtnControl.params.ButtonContentType !== 'video') {
                                            onButtonTap();
                                        } else {
                                            if (ProBtnControl.userData.os !== "iOS") {
                                                onButtonTap();
                                            }
                                        }
                                    });
                                } else {
                                    ProBtnControl.additionalButtonFunctions.MinimizeWrapper(function() {}, ProBtnControl.params.MinimizeWrapperTime);

                                    if (overlaped) {
                                        ProBtnControl.statistics.SendStatisticsData("Closed", 1);
                                        ProBtnControl.statistics.SendStatisticsData("Hidded", 1);
                                        ProBtnControl.pizzabtn.hide();
                                    } else {
                                        ProBtnControl.pizzabtn.undragAnimate();
                                    };
                                }
                                closeButton.hide();
                                ProBtnControl.pizzabtn.moved = false;
                                overlaped = false;
                            }
                        });

                        function onButtonTap(currentContentURL, areaName) {

                            if (ProBtnControl.params.MainButtonClickable === false) {
                                if (ProBtnControl.params.Debug) console.log("ProBtnControl.params.ActiveZoneMainButtonClickEnabled " + ProBtnControl.params.MainButtonClickable);
                                if ((areaName == "") || (areaName == null) || areaName == undefined) {
                                    if (ProBtnControl.params.Debug) console.log("areaname empty");
                                    return;
                                }
                            }

                            if ((currentContentURL !== null) && (currentContentURL !== undefined) && (currentContentURL !== "")) {} else {
                                currentContentURL = ProBtnControl.params.ContentURL;
                            }

                            ProBtnControl.HpmdFunctions.expandHpmdTrack();

                            if (ProBtnControl.additionalButtonFunctions.animation.animationRuning) {
                                ProBtnControl.additionalButtonFunctions.animation.doneAnimation();
                            }

                            //click for dfp
                            if (ProBtnControl.params.dfp.isDFP) {
                                try {
                                    if (ProBtnControl.params.dfp.clickUrlEsc != "") {
                                        $.get(ProBtnControl.params.dfp.clickUrlEsc,
                                            function(data) {
                                                //we send get request for dfp
                                            }
                                        );
                                    }
                                } catch (ex) {
                                    console.log(ex);
                                }
                            }

                            //custom click
                            if ((ProBtnControl.params.ClickCounterLink) && (ProBtnControl.params.ClickCounterLink !== "")) {
                                try {
                                    $.get(ProBtnControl.params.ClickCounterLink,
                                        function(data) {
                                            //we send get request
                                        }
                                    );
                                } catch (ex) {
                                    console.log(ex);
                                }
                            }

                            ProBtnControl.additionalButtonFunctions.MaximizeWrapper(function() {});

                            var isMobileLandscape = (ProBtnControl.additionalButtonFunctions.isLandscape() && ProBtnControl.userData.mobile),
                                position = ProBtnControl.pizzabtn.position(),
                                buttonTop = position.top,
                                buttonLeft = position.left,
                                winWidth = window.innerWidth,
                                winHeight = window.innerHeight,
                                finishTop = '0px',
                                finishLeft = '0px',
                                widthCenter = (winWidth + ProBtnControl.params.ButtonSize.W) / 2,
                                heightCenter = (winHeight + ProBtnControl.params.ButtonSize.H) / 2;

                            // top or bottom
                            if (heightCenter <= buttonTop) {
                                finishTop = (winHeight - ProBtnControl.params.ButtonSize.H) + 'px';
                            }
                            // left or right
                            if (widthCenter <= buttonLeft) {
                                finishLeft = (winWidth - ProBtnControl.params.ButtonSize.W) + 'px';
                            }

                            var margins = ProBtnControl.additionalButtonFunctions.getFancyboxMargins();

                            var positionObj = {
                                property: (isMobileLandscape) ? "left" : "top",
                                currentValue: (isMobileLandscape) ? buttonLeft : buttonTop,
                                finishValue: (isMobileLandscape) ? finishLeft : finishTop
                            }

                            var InitLeft = $("#probtn_button").offset().left;
                            var InitTop = $("#probtn_button").offset().top;

                            $.pep.toggleAll(false);

                            var fancyboxParams = {
                                href: currentContentURL, //ProBtnControl.params.ContentURL,
                                sandbox: "allow-same-origin allow-scripts allow-popups allow-forms",
                                type: 'iframe',

                                autoCenter: true,
                                titlePosition: 'inside',
                                scrolling: 'yes',
                                margin: margins,
                                scrollOutside: true,
                                speedIn: 1000,
                                openSpeed: 1000,
                                closeSpeed: 0,
                                speedOut: 0,
                                openOpacity: false,
                                padding: "0px",
                                height: "100%",
                                minWidth: 100,
                                minHeight: 100,
                                autoHeight: false,
                                autoWidht: false,
                                autoResize: false,
                                autoSize: false,
                                iframe: {
                                    sandbox: "allow-same-origin allow-scripts allow-popups allow-forms",
                                    preload: false,
                                    scrolling: "yes"
                                },
                                helpers: {
                                    overlay: {
                                        locked: false,
                                        speedIn: 0,
                                        speedOut: 0, // duration of fadeOut animation
                                        showEarly: true // indicates if should be opened immediately or wait until the content is ready
                                    },
                                    title: {
                                        type: 'inside'
                                    }
                                },
                                beforeLoad: function() {
                                    ProBtnControl.hintText.hide();

                                    $(".fancybox-iframe").first().attr("sandbox", "allow-same-origin allow-scripts allow-popups allow-forms");

                                    ProBtnControl.pizzabtn.css(positionObj.property, positionObj.finishValue);
                                    if (positionObj.property == 'top') {
                                        ProBtnControl.pizzabtn.css('left', InitLeft + 'px');
                                    } else {
                                        ProBtnControl.pizzabtn.css('top', InitTop + 'px');
                                    }

                                    if (ProBtnControl.userData.os === "iOS") {
                                        $(document.body).bind("touchmove", function(e) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.returnValue = false; // ie
                                        });
                                    }
                                    $('html').css("overflow", "hidden");
                                },
                                afterShow: function() {
                                    var pizzabtn_wrapper = $("#probtn_wrapper");
                                    var opts = {
                                        width: $(window).width(),
                                        height: $(window).height(),
                                        position: "fixed"
                                    };

                                    pizzabtn_wrapper.css(opts);

                                    $(".fancybox-iframe").first().attr("sandbox", "allow-same-origin allow-scripts allow-popups allow-forms");
                                    try {
                                        $(".fancybox-iframe").first().contents().find("html").css("visibility", "visible !important");
                                    } catch (ex) {}

                                    ProBtnControl.additionalButtonFunctions.setIfameSizes();

                                    ProBtnControl.pizzabtn.bind("click", $.fancybox.close);

                                    if (ProBtnControl.params.ButtonContentType === "video") {
                                        onOrientationChange(null);
                                        try {
                                            var video = $("#video_probtn").get(0);
                                            video.play();
                                        } catch (ex) {}
                                    }
                                },
                                afterClose: function() {

                                    if (ProBtnControl.params.ButtonContentType === "video") {
                                        var video = $("#video_probtn").get(0);
                                        video.pause();
                                    }

                                    ProBtnControl.additionalButtonFunctions.MinimizeWrapper(function() {}, ProBtnControl.params.MinimizeWrapperTime);
                                    if (ProBtnControl.userData.os === "iOS") {
                                        $(document.body).unbind('touchmove');
                                    }
                                    $('html').css("overflow", "auto");
                                    ProBtnControl.pizzabtn.unbind('click');
                                    $.pep.toggleAll(true);
                                    if (closeAfterOrientationChange) {
                                        ProBtnControl.pizzabtn.center();
                                        closeAfterOrientationChange = false;
                                    } else {
                                        ProBtnControl.pizzabtn.css(positionObj.property, positionObj.currentValue + 'px');
                                    }

                                    if (ProBtnControl.params.HideAfterFirstShow == true) {
                                        ProBtnControl.statistics.SendStatisticsData("Closed", 1);
                                        ProBtnControl.statistics.SendStatisticsData("Hidded", 1);
                                        ProBtnControl.pizzabtn.hide();
                                    };

                                    ProBtnControl.HpmdFunctions.closeHpmdTrack();
                                }
                            };

                            fancyboxParams.type = ProBtnControl.params.FancyboxType;
                            if (ProBtnControl.params.ButtonContentType === "video") {
                                fancyboxParams.href = "#video_item";
                                fancyboxParams.type = "inline";
                            }

                            function formatTitle() {
                                return '<div id="button_fancybox_title">' + ProBtnControl.params.VendorText + '</div>';
                            }

                            if (ProBtnControl.params.Debug === true) {
                                var outVendorText = ProBtnControl.params.VendorText + " " + ProBtnControl.mainVersion;
                            } else {
                                var outVendorText = ProBtnControl.params.VendorText;
                            }

                            if ((outVendorText !== "") && (ProBtnControl.params.ButtonEnabled === true) && (ProBtnControl.params.ButtonVisible === true)) {
                                try {
                                    fancyboxParams.titleShow = true;
                                    fancyboxParams.title = "<style>.fancybox-title-inside-wrap {color: rgba(" + ProBtnControl.params.VendorColor.R + "," + ProBtnControl.params.VendorColor.G + "," + ProBtnControl.params.VendorColor.B + "," + ProBtnControl.params.VendorColor.A + "); text-align: center; } </style><a style='font-family: " + ProBtnControl.params.VendorTextFont.Family + "; font-size: " + ProBtnControl.params.VendorTextFont.Size + "px; color: rgba(" + ProBtnControl.params.VendorTextColor.R + "," + ProBtnControl.params.VendorTextColor.G + "," + ProBtnControl.params.VendorTextColor.B + "," + ProBtnControl.params.VendorTextColor.A + ")' href='" + ProBtnControl.params.VendorSite + "' target='_blank'>" + outVendorText + "</a>";
                                } catch (ex) {}
                            }

                            if (ProBtnControl.params.IsManualSize === true) {
                                fancyboxParams.width = ProBtnControl.params.ContentSize.X;
                                fancyboxParams.height = ProBtnControl.params.ContentSize.Y;
                                //fancyboxParams.autoScale = false;
                            } else {
                                //if IsManualSize is false, we set sizes in px
                                fancyboxParams.width = ProBtnControl.params.ContentSize.W;
                                fancyboxParams.height = ProBtnControl.params.ContentSize.H;
                            }
                            if (ProBtnControl.params.MaxWidth > 0) {
                                fancyboxParams.maxWidth = ProBtnControl.params.MaxWidth;
                            };
                            if (ProBtnControl.params.MaxHeight > 0) {
                                fancyboxParams.maxHeight = ProBtnControl.params.MaxHeight;
                            };

                            ////console.log("params.OpenExternal - "+params.OpenExternal);
                            if (ProBtnControl.params.OpenExternal === true) {
                                ProBtnControl.statistics.SendStatisticsData("ContentShowed", 1);
                                $.pep.toggleAll(true);
                                window.open(ProBtnControl.params.ContentURL, '_blank');

                            } else {
                                if (ProBtnControl.params.ButtonContentType == "anchor") {
                                    if (ProBtnControl.params.ContentURL.charAt(0) == "#") {
                                        $.pep.toggleAll(true);
                                        window.location.hash = "";
                                        window.location.hash = ProBtnControl.params.ContentURL;
                                    } else {
                                        ProBtnControl.statistics.SendStatisticsData("ContentShowed", 1, null, function() {
                                            $.pep.toggleAll(true);
                                            window.open(ProBtnControl.params.ContentURL, '_top');
                                        });
                                    }
                                } else {
                                    if ((areaName !== null) && (areaName !== undefined)) {
                                        ProBtnControl.statistics.sendAreaActivatedStats(areaName);
                                    } else {
                                        // send content showed stat
                                        ProBtnControl.statistics.SendStatisticsData("ContentShowed", 1);
                                    }

                                    var pizzabtn_wrapper = $("#probtn_wrapper");
                                    var opts = {
                                        width: $(window).width(),
                                        height: $(window).height(),
                                        position: "fixed"
                                    };
                                    pizzabtn_wrapper.css(opts);

                                    $.fancybox.open(fancyboxParams);
                                }
                            };

                            //});
                        }
                    } //onButtonTap

                    ProBtnControl.additionalButtonFunctions.animation.checkAndRunAnimation();

                };

                //}); //document ready end
            } else {
                //console.log("IE8 not supported.");
            }

            // XXX CONSTRUCTORS
            // close button constructor

            function initCloseButton() {
                var btn = $('<img/>', {
                    id: 'probtn_closeButton',
                    'src': ProBtnControl.params.CloseImage,
                    'class': 'close_pro_button_normal probtn_active_zone',
                    css: {
                        position: 'fixed',
                        display: 'none'
                    }
                }).prependTo('body');

                btn.active = false;
                btn.rect = {};

                btn.css({
                    '-webkit-transform': 'translateZ(0)',
                    '-moz-transform': 'translateZ(0)',
                    '-ms-transform': 'translateZ(0)',
                    '-o-transform': 'translateZ(0)',
                    'transform': 'translateZ(0)',

                    '-webkit-backface-visibility': 'hidden',
                    '-moz-backface-visibility': 'hidden',
                    '-ms-backface-visibility': 'hidden',
                    'backface-visibility': 'hidden',

                    '-webkit-perspective': 1000,
                    '-moz-perspective': 1000,
                    '-ms-perspective': 1000,
                    'perspective': 1000,

                    'transition-property': 'opacity, width, height, left, top',
                    'timing-function': 'linear',

                    '-webkit-transition-property': 'opacity, width, height, left, top',
                    '-webkit-timing-function': 'linear',

                    '-moz-transition-property': 'opacity, width, height, left, top',
                    '-moz-timing-function': 'linear',

                    '-o-transition-property': 'opacity, width, height, left, top',
                    '-o-timing-function': 'linear'
                });

                btn.center = function() {
                    var body = $('body');
                    var closex = ProBtnControl.params.ClosePosition.X;
                    var closey = ProBtnControl.params.ClosePosition.Y;
                    this.css('top', (window.innerHeight - this.height()) * closey + 'px'); //(body.innerHeight() - this.height())*closey + $(window).scrollTop() + 'px');
                    this.css('left', (body.innerWidth() - this.width()) * closex + $(window).scrollLeft() + 'px');
                }

                btn.show = function() {
                    var me = this;
                    me.center();
                    setTimeout(function() {
                        me.stop(true, true).fadeIn(ProBtnControl.params.CloseShowDuration * 1000);
                    }, ProBtnControl.params.CloseShowDelay * 1000);
                }

                btn.hide = function() {
                    var me = this;
                    setTimeout(function() {
                        me.stop(true, true).fadeOut(ProBtnControl.params.CloseHideDuration * 1000);
                    }, ProBtnControl.params.CloseHideDelay * 1000);
                }

                btn.setTransitionDuration = function(duration) {
                    var val = duration + 's';
                    this.css({
                        'transition-duration': val,
                        '-webkit-transition-duration': val,
                        '-moz-transition-duration': val,
                        '-o-transition-duration': val
                    });
                }

                // Animation when close button become active - change size and opacity
                btn.overlayActive = function() {
                    var me = this;
                    var position = me.position();
                    me.setTransitionDuration(ProBtnControl.params.CloseActiveDuration);
                    setTimeout(function() {
                        me.css({
                            opacity: ProBtnControl.params.CloseActiveOpacity,
                            width: ProBtnControl.params.CloseActiveSize.W,
                            height: ProBtnControl.params.CloseActiveSize.H
                            //left: position.left - ((params.CloseActiveSize.W - params.CloseSize.W) / 2),
                            //top: position.top - ((params.CloseActiveSize.H - params.CloseSize.H) / 2)
                        });
                    }, ProBtnControl.params.CloseActiveDelay * 1000);
                }

                // Animation when button become inactive - restore close button size and opacity
                btn.overlayUnactive = function() {
                    var me = this;
                    var body = $('body');
                    var closex = ProBtnControl.params.ClosePosition.X;
                    var closey = ProBtnControl.params.ClosePosition.Y;
                    var top = (window.innerHeight - this.height()) * closey + 'px';
                    //(body.innerHeight() - closeButton.height())*closey + $(window).scrollTop();
                    ///+$(window).scrollTop()
                    var left = (body.innerWidth() - closeButton.width()) * closex + $(window).scrollLeft(); ///+$(window).scrollLeft()

                    me.setTransitionDuration(ProBtnControl.params.CloseUnactiveDuration);
                    setTimeout(function() {
                        var options = {
                            opacity: ProBtnControl.params.CloseOpacity,
                            width: ProBtnControl.params.CloseSize.W,
                            height: ProBtnControl.params.CloseSize.H
                            //left: left,
                            //top: top
                        };

                        me.css(options);
                    }, ProBtnControl.params.CloseUnactiveDelay * 1000);
                };

                btn.setTransitionDuration(ProBtnControl.params.CloseActiveDuration);

                btn.center();

                return btn;
            }

            // pizza button constructor

            function initPizzaButton() {

                var pizzabtn_wrapper = $("<div/>", {
                    id: "probtn_wrapper"
                }).prependTo('body');

                try {
                    //$("body").on('click', "#probtn_wrapper", function() {
                    //MinimizeWrapper(function() {}, 0);
                    //});
                } catch (ex) {
                    console.log(ex);
                }

                if (ProBtnControl.params.ButtonContentType === 'video') {
                    var content = '<div id="video_item" class="probtn_video_wrapper2" style="display: none; width: auto; height: auto; margin: 0 auto; vertical-align: middle; background: black;"> \
        <table class="probtn_video_wrapper2" style="width: auto; height: auto; margin: 0 auto;"><tr><td style="vertical-align: middle; text-align: center;"><video poster="' + ProBtnControl.params.VideoPoster + '" id="video_probtn" class="probtn_video"  controls="controls" width="100%"height="100%" style="background: black; margin: 0 auto; vertical-align: middle; width: 100%; height: 100%; display: inline-block;"> \
          <source src="' + ProBtnControl.params.ContentURL + '" type="video/mp4"> \
            Your browser does not support the video tag. \
        </video></td></tr></table> \
    </div>';
                    $('body').append(content);


                    var newFancyboxWidth = window.innerWidth - 30;
                    var newFancyboxHeight = window.innerHeight - 60;
                    if (ProBtnControl.params.IsManualSize === true) {
                        if (ProBtnControl.params.ContentSize.X.indexOf('%') !== -1) {
                            newFancyboxWidth = window.innerWidth * (parseFloat(ProBtnControl.params.ContentSize.X) / 100);
                        } else {
                            newFancyboxWidth = ProBtnControl.params.ContentSize.X;
                        }

                        if (ProBtnControl.params.ContentSize.Y.indexOf('%') !== -1) {
                            newFancyboxHeight = window.innerHeight * (parseFloat(ProBtnControl.params.ContentSize.Y) / 100);
                        } else {
                            newFancyboxHeight = ProBtnControl.params.ContentSize.Y;
                        }
                    } else {}

                    var videoHeight = 0;
                    var videoWidth = 0;
                    if (newFancyboxWidth > newFancyboxHeight) {
                        videoHeight = newFancyboxHeight;
                        videoWidth = (videoHeight / ProBtnControl.params.VideoSize.Y) * ProBtnControl.params.VideoSize.X;
                    } else {
                        videoWidth = newFancyboxWidth;
                        videoHeight = (videoWidth / ProBtnControl.params.VideoSize.X) * ProBtnControl.params.VideoSize.Y;

                    }

                    $(".probtn_video_wrapper").width(newFancyboxWidth);
                    $(".probtn_video_wrapper").height(newFancyboxHeight);
                    $(".probtn_video").width(videoWidth);
                    $(".probtn_video").height(videoHeight);
                }

                var opts = {
                    width: "auto",
                    height: "auto",
                    position: "fixed"
                };

                if ((ProBtnControl.params.TrackingLink !== null) && (ProBtnControl.params.TrackingLink !== null) && (ProBtnControl.params.TrackingLink !== "")) {
                    opts['background'] = 'url(' + ProBtnControl.params.TrackingLink + ') no-repeat';
                }
                pizzabtn_wrapper.css(opts);

                //var btn = undefined;
                var btn = $("#probtn_button");

                if (btn.length === 0) {
                    btn = $("<div/>", {
                        id: "probtn_button"
                    }).prependTo(pizzabtn_wrapper);
                };

                btn.addClass("pizzabtn_normal");
                btn.addClass("probtn_normal");

                if (ProBtnControl.userData.mobile) {
                    btn.attr("onclick", ProBtnControl.params.ButtonOnClick);
                }

                //restore!!
                btn.css({
                    'display': 'none',

                    '-webkit-transform': 'translateZ(0)',
                    '-moz-transform': 'translateZ(0)',
                    '-ms-transform': 'translateZ(0)',
                    '-o-transform': 'translateZ(0)',
                    'transform': 'translateZ(0)',

                    '-webkit-backface-visibility': 'hidden',
                    '-moz-backface-visibility': 'hidden',
                    '-ms-backface-visibility': 'hidden',
                    'backface-visibility': 'hidden',

                    '-webkit-perspective': 1000,
                    '-moz-perspective': 1000,
                    '-ms-perspective': 1000,
                    'perspective': 1000,

                    /*'-webkit-transition': 'top, left ' + ProBtnControl.params.buttonAnimationTimeAfterFancybox + 'ms linear',
                    '-moz-transition': 'top, left ' + ProBtnControl.params.buttonAnimationTimeAfterFancybox + 'ms linear',
                    '-ms-transition': 'top, left ' + ProBtnControl.params.buttonAnimationTimeAfterFancybox + 'ms linear',
                    '-o-transition': 'top, left ' + ProBtnControl.params.buttonAnimationTimeAfterFancybox + 'ms linear',
                    'transition': 'top, left ' + ProBtnControl.params.buttonAnimationTimeAfterFancybox + 'ms linear',*/
                    'width': ProBtnControl.params.ButtonSize.W,
                    'height': ProBtnControl.params.ButtonSize.H
                });

                // add image
                var pizzabtnImg = $("<img/>", {
                    id: "pizzabtnImg",
                    src: ProBtnControl.params.ButtonImage,
                    css: {
                        'width': ProBtnControl.params.ButtonSize.W,
                        'height': ProBtnControl.params.ButtonSize.H,
                        'opacity': ProBtnControl.params.ButtonOpacity,

                        'transition-property': 'opacity, width, height',
                        'timing-function': 'linear',

                        '-webkit-transition-property': 'opacity, width, height',
                        '-webkit-timing-function': 'linear',

                        '-moz-transition-property': 'opacity, width, height',
                        '-moz-timing-function': 'linear',

                        '-o-transition-property': 'opacity, width, height',
                        '-o-timing-function': 'linear'
                    }
                }).appendTo(btn);

                // add hint text
                ProBtnControl.hintText = $("<span/>", {
                    id: "probtn_hintText",
                    css: {
                        opacity: 0,

                        'transition-property': 'opacity',
                        'timing-function': 'linear',

                        '-webkit-transition-property': 'opacity',
                        '-webkit-timing-function': 'linear',

                        '-moz-transition-property': 'opacity',
                        '-moz-timing-function': 'linear',

                        '-o-transition-property': 'opacity',
                        '-o-timing-function': 'linear',

                        'transition-duration': ProBtnControl.params.HintShowDuration + 's',
                        '-webkit-transition-duration': ProBtnControl.params.HintShowDuration + 's',
                        '-moz-transition-duration': ProBtnControl.params.HintShowDuration + 's',
                        '-o-transition-duration': ProBtnControl.params.HintShowDuration + 's'
                    },
                    html: ProBtnControl.params.HintText.replace(/ /g, "&nbsp;")
                }).appendTo(btn);
                btn.hintTextActive = false;

                ProBtnControl.additionalButtonFunctions.MinimizeWrapper(function() {}, ProBtnControl.params.MinimizeWrapperTime);

                ProBtnControl.hintText.makeInvisible = function() {
                    this.css({
                        'transition-duration': ProBtnControl.params.HintHideDuration + 's',
                        '-webkit-transition-duration': ProBtnControl.params.HintHideDuration + 's',
                        '-moz-transition-duration': ProBtnControl.params.HintHideDuration + 's',
                        '-o-transition-duration': ProBtnControl.params.HintHideDuration + 's'
                    });
                    this.css('opacity', 0);
                }

                btn.center = function() {
                    var body = $('#probtn_wrapper');
                    this.css('top', (body.innerHeight() - this.height()) / 2 + $(window).scrollTop() + 'px');
                    this.css('left', (body.innerWidth() - this.width()) / 2 + $(window).scrollLeft() + 'px');
                }

                btn.show = function() {
                    var me = this;
                    setTimeout(function() {
                        me.stop(true, true).fadeIn(ProBtnControl.params.ButtonShowDuration * 1000);
                    }, ProBtnControl.params.ButtonShowDelay * 1000);
                }

                btn.hide = function() {
                    var me = jQuery("#probtn_button");
                    setTimeout(function() {
                        me.stop(true, true).fadeOut(ProBtnControl.params.ButtonHideDuration * 1000);
                    }, ProBtnControl.params.ButtonHideDelay * 1000);
                }

                //aditional actions
                window.proBtn = {};
                window.proBtn.hide = btn.hide;
                window.proBtn.hideContent = function() {
                    $.fancybox.close();
                };
                window.proBtn.performAction = function() {
                    if (ProBtnControl.params.CampaignID !== null) {
                        $.getJSON(ProBtnControl.serverUrl + "/1/functions/performAction?DeviceType=web&DeviceUID=" + ProBtnControl.GetDeviceUID() + "&X-ProBtn-Token=" + XProBtnToken + "&CampaignID=" + ProBtnControl.params.CampaignID + "&random=" + Math.random() + "&callback=?",
                            function(data) {

                            }
                        );
                    }
                };

                btn.dragAnimate = function() {
                    pizzabtnImg.attr("src", ProBtnControl.params.ButtonDragImage);
                    setTimeout(function() {
                        pizzabtnImg.css({
                            'transition-duration': ProBtnControl.params.ButtonDragDuration + 's',
                            '-webkit-transition-duration': ProBtnControl.params.ButtonDragDuration + 's',
                            '-moz-transition-duration': ProBtnControl.params.ButtonDragDuration + 's',
                            '-o-transition-duration': ProBtnControl.params.ButtonDragDuration + 's'
                        });
                        pizzabtnImg.css({
                            opacity: ProBtnControl.params.ButtonDragOpacity,
                            width: ProBtnControl.params.ButtonDragSize.W,
                            height: ProBtnControl.params.ButtonDragSize.H
                        });

                    }, ProBtnControl.params.ButtonDragDelay * 1000);
                }

                btn.undragAnimate = function() {
                    pizzabtnImg.attr("src", ProBtnControl.params.ButtonImage);
                    setTimeout(function() {
                        pizzabtnImg.css({
                            'transition-duration': ProBtnControl.params.ButtonUndragDuration + 's',
                            '-webkit-transition-duration': ProBtnControl.params.ButtonUndragDuration + 's',
                            '-moz-transition-duration': ProBtnControl.params.ButtonUndragDuration + 's',
                            '-o-transition-duration': ProBtnControl.params.ButtonUndragDuration + 's'
                        });
                        pizzabtnImg.css({
                            opacity: ProBtnControl.params.ButtonOpacity,
                            width: ProBtnControl.params.ButtonSize.W,
                            height: ProBtnControl.params.ButtonSize.H
                        });

                    }, ProBtnControl.params.ButtonUndragDelay * 1000);
                }

                btn.showHint = function() {
                    var me = this;
                    setTimeout(function() {
                        ProBtnControl.hintText.css(hintTextStyle);
                        me.hintTextActive = true;

                        /*var textOffset = (($('#hintText').width() - params.ButtonSize.W) / 2);
                        $("#hintText").css("margin-left", "-" + textOffset + "px");*/
                        var textOffset = ((ProBtnControl.hintText.width() - ProBtnControl.params.ButtonSize.W) / 2);
                        ProBtnControl.hintText.css("margin-left", "-" + textOffset + "px");

                    }, ProBtnControl.params.HintLaunchDelay * 1000);
                }

                btn.hideHint = function() {
                    var me = this;
                    ProBtnControl.hintText.makeInvisible();
                    setTimeout(function() {
                        me.animateDuringHintHide();
                    }, 100)
                    me.hintTextActive = false;
                }

                btn.hideHintDelay = function() {
                    setTimeout(function() {
                        ProBtnControl.hintText.makeInvisible();
                    }, ProBtnControl.params.HintLaunchDuration * 1000);
                }

                btn.animateDuringHintHide = function() {
                    var me = this;
                    var hintWidth = ProBtnControl.hintText.outerWidth();
                    var diffWidth = (hintWidth - ProBtnControl.params.ButtonSize.W) / 2;
                    if (diffWidth > 0) {
                        me.css({
                            width: ProBtnControl.params.ButtonSize.W,
                            height: ProBtnControl.params.ButtonSize.H,
                            left: me.position().left + diffWidth
                        });
                    }
                }

                try {
                    var top = (window.innerHeight - (ProBtnControl.params.ButtonSize.H / 2)) * (ProBtnControl.params.ButtonPosition.Y);
                    var left = ($('body').innerWidth() - (ProBtnControl.params.ButtonSize.W / 2)) * (ProBtnControl.params.ButtonPosition.X) + $(window).scrollLeft() + 'px';
                    btn.css({
                        left: left,
                        top: top,
                        position: 'absolute'
                    });
                } catch (ex) {}

                changeBodySize();

                return btn;
            }

            //init active zones if enabled in options

            function initActiveZones() {
                if (((ProBtnControl.params.ActiveZones !== null) || (ProBtnControl.params.ActiveZones.length > 0)) && (ProBtnControl.params.ButtonType == "button_and_active_zones")) {
                    //check every zone
                    for (var i = 0; i < ProBtnControl.params.ActiveZones.length; i++) {
                        var currentActiveZone = ProBtnControl.params.ActiveZones[i];
                        var activeZoneBtn = $('<img/>', {
                            id: 'probtn_active_zone_' + currentActiveZone.Name,
                            'src': currentActiveZone.InactiveImage, //'//probtnexample1.azurewebsites.net/img/logo.png',
                            'class': 'probtn_active_zone',
                            'rel': currentActiveZone.Name,
                            css: {
                                position: 'fixed',
                                width: currentActiveZone.InactiveSize.W,
                                width: currentActiveZone.InactiveSize.H
                            }
                        }).prependTo('body');

                        if (currentActiveZone.VisibleOnlyInteraction) {
                            activeZoneBtn.hide();
                        }

                        activeZoneBtn.currentActiveZone = currentActiveZone;
                        activeZoneBtn.setPosition = function() {
                            var body = $('body');
                            var activex = this.currentActiveZone.Position.X;
                            var activey = this.currentActiveZone.Position.Y;
                            this.css('top', (window.innerHeight - this.height()) * activey + 'px');
                            this.css('left', (body.innerWidth() - this.width()) * activex + $(window).scrollLeft() + 'px');
                        }

                        activeZoneBtn.requestClickCounterLink = function() {
                            if ((this.currentActiveZone.ClickCounterLink) && (this.currentActiveZone.ClickCounterLink !== "")) {
                                try {
                                    $.get(this.currentActiveZone.ClickCounterLink,
                                        function(data) {
                                            //we send get request for ClickCounterLink
                                            if (ProBtnControl.params.Debug) {
                                                console.log(data);
                                            }
                                        }
                                    );
                                } catch (ex) {
                                    console.log(ex);
                                }
                            }
                        }

                        activeZoneBtn.setPosition();
                        ProBtnControl.initializedActiveZones[currentActiveZone.Name] = activeZoneBtn;
                    }
                    console.log(ProBtnControl.initializedActiveZones);
                }
            }

            //show fullscreen

            function fullscreenInitAndShow() {
                //if HideAfterFirstShow
                var cookieHideAfterClose = null;
                if (ProBtnControl.params.HideAfterFirstShow === true) {
                    cookieHideAfterClose = ProBtnControl.cookieFunctions.readCookie("probtnCloseFlag");
                } else {
                    ProBtnControl.cookieFunctions.eraseCookie("probtnCloseFlag");
                }

                if (cookieHideAfterClose === null) {
                    //add ower own block (with applying fancybox styles to it)
                    $('body').append('<div class="fancybox-overlay fancybox-overlay-fixed" style="width: auto; height: auto; display: block;"></div>');
                    $('body').append('<div id="fullscreen_probtn">' +
                        '<div class="fancybox-wrap fancybox-mobile fancybox-type-iframe fancybox-opened" tabindex="-1" ' +
                        'style="margin: 0 auto; height: auto; position: fixed; opacity: 1; overflow: visible;">' +
                        '<div class="fancybox-skin" style="padding: 0px; width: auto; height: auto;">' +
                        '<div class="fancybox-outer">' +
                        '<div class="fancybox-inner" style="overflow: scroll; ">' +
                        '<iframe class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" scrolling="auto" src="' + ProBtnControl.params.ContentURL + '"' +
                        ' sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe></div></div>' +
                        '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a></div></div>' +
                        '</div');

                    ProBtnControl.HpmdFunctions.expandHpmdTrack();

                    //run it to update width and margins for ower 'fullscreen'
                    onOrientationChange(null);

                    //listen for click event's on items - to close our 'fullscreen'
                    $('body').on('click', "#fullscreen_probtn .fancybox-close, .fancybox-overlay", function() {
                        $('#fullscreen_probtn').hide();
                        $('.fancybox-overlay').hide();

                        ProBtnControl.HpmdFunctions.closeHpmdTrack();
                    });
                    if (ProBtnControl.params.HideAfterFirstShow === true) {
                        //and now add cookie to add flag that we are open fullscreen once
                        ProBtnControl.cookieFunctions.createCookie("probtnCloseFlag", true, 60);
                    } else {}
                }
            }
        }
    }

})(jQuery);
