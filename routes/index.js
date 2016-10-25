var express = require('express');
var path = require('path');
var router = express.Router();

function detect_browser(req) {
    var http_accept = req.header('Accept');
    var user_agent = req.header('User-Agent');
    var browser = 'web';
    var mobile_browser = 0;
    
    if (http_accept &&
        http_accept.indexOf('application/vnd.wap.xhtml+xml') >= 0) {
        req['wap2'] = 1;
    }
    else if (user_agent.indexOf('iPod') >= 0) {
        req['iphone'] = 1;
    }
    else if (user_agent.indexOf('iPhone') >= 0) {
        reqT['iphone'] = 1;
    }
    else if (user_agent.indexOf('Android') >= 0) {
        req['Android'] = 1;
    }
    else if (user_agent.indexOf('IEMobile') >= 0) {
        req['IEMobile'] = 1;
    }
    else if ((user_agent.indexOf('DoCoMo') >= 0) 
        || (user_agent.indexOf('portalmmm') >= 0)) {
        req['imode'] = 1;
    }
    else if (user_agent.indexOf('text/vnd.wap.wml') >= 0) {
        req['wap'] = 1;
    }
    else if (user_agent.indexOf('text/html') >= 0) {
        req['html'] = 1;
    }
    
    var wap = req.get('wap') || req.get('wap2') || req.get('imode') || req.get('html') || req.get('Android') || req.get('iphone') || req.get('IEMobile');
    if (wap) {
        var WIRELESS_PROTOCOL = '';
        if (req.get('wap')) {
            WIRELESS_PROTOCOL = 'wap';
        } else if (req.get('wap2')) {
            WIRELESS_PROTOCOL = 'wap2';
        } else if (req.get('iphone')) {
            WIRELESS_PROTOCOL = 'iphone';
        } else if (req.get('imode')) {
            WIRELESS_PROTOCOL = 'imode';
        } else if (req.get('IEMobile')) {
            WIRELESS_PROTOCOL = 'IEMobile';
        } else if (req.get('html')) {
            WIRELESS_PROTOCOL = 'html';
        } else if (req.get('Android')) {
            WIRELESS_PROTOCOL = 'Android';
        }
        
        if (WIRELESS_PROTOCOL == 'wap') {
            browser = "mobile";
        }
        else if (WIRELESS_PROTOCOL == 'wap2') {
            browser = "mobile";
        }
        else if (WIRELESS_PROTOCOL == 'imode') {
            browser = "mobile";
        }
        else if (WIRELESS_PROTOCOL == 'iphone') {
            browser = "smartphone";
        }
        else if (WIRELESS_PROTOCOL == 'Android') {
            browser = "smartphone";
        }
        else if (WIRELESS_PROTOCOL == 'IEMobile') {
            browser = "smartphone";
        }
        else if (WIRELESS_PROTOCOL == 'html') {
            var http_accept_low = http_accept.toLowerCase();
            var user_agent_low = user_agent.toLowerCase();
            if (user_agent_low.match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone)/i')) {
                mobile_browser++;
            }
            
            if ((http_accept_low.indexOf('application/vnd.wap.xhtml+xml') >= 0) 
                || ((req.get('HTTP_X_WAP_PROFILE') || req.get('HTTP_PROFILE')))) {
                mobile_browser++;
            }
            
            var mobile_ua = user_agent_low.substr(0, 4);
            var mobile_agents = [
                'w3c ', 'acs-', 'alav', 'alca', 'amoi', 'audi', 'avan', 'benq', 'bird', 'blac',
                'blaz', 'brew', 'cell', 'cldc', 'cmd-', 'dang', 'doco', 'eric', 'hipt', 'inno',
                'ipaq', 'java', 'jigs', 'kddi', 'keji', 'leno', 'lg-c', 'lg-d', 'lg-g', 'lge-',
                'maui', 'maxo', 'midp', 'mits', 'mmef', 'mobi', 'mot-', 'moto', 'mwbp', 'nec-',
                'newt', 'noki', 'oper', 'palm', 'pana', 'pant', 'phil', 'play', 'port', 'prox',
                'qwap', 'sage', 'sams', 'sany', 'sch-', 'sec-', 'send', 'seri', 'sgh-', 'shar',
                'sie-', 'siem', 'smal', 'smar', 'sony', 'sph-', 'symb', 't-mo', 'teli', 'tim-',
                'tosh', 'tsm-', 'upg1', 'upsi', 'vk-v', 'voda', 'wap-', 'wapa', 'wapi', 'wapp',
                'wapr', 'webc', 'winw', 'winw', 'xda', 'xda-'];
            
            if (mobile_agents.indexOf(mobile_ua)) {
                mobile_browser++;
            }
            
            if (user_agent_low.indexOf('iemobile') >= 0) {
                mobile_browser++;
            }
            if (user_agent_low.indexOf('windows') >= 0) {
                mobile_browser = 0;
            }
            
            
            if (mobile_browser > 0) {
                // do something wap
                browser = "mobile";
            }
            else { // non-mobile
                req.session['Browser_d'] = "web";
                browser = "web";
            }
        } else {
            // do something else html
            req.session['Browser_d'] = "web";
            browser = "web";
        }
    }
    else {
        var http_accept_low = http_accept.toLowerCase();
        var user_agent_low = user_agent.toLowerCase();
        if (user_agent_low.match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone)/i')) {
            mobile_browser++;
        }
        
        if ((http_accept_low.indexOf('application/vnd.wap.xhtml+xml') >= 0) 
                || ((req.get('HTTP_X_WAP_PROFILE') || req.get('HTTP_PROFILE')))) {
            mobile_browser++;
        }
        
        var mobile_ua = user_agent_low.substr(0, 4);
        var mobile_agents = [
            'w3c ', 'acs-', 'alav', 'alca', 'amoi', 'audi', 'avan', 'benq', 'bird', 'blac',
            'blaz', 'brew', 'cell', 'cldc', 'cmd-', 'dang', 'doco', 'eric', 'hipt', 'inno',
            'ipaq', 'java', 'jigs', 'kddi', 'keji', 'leno', 'lg-c', 'lg-d', 'lg-g', 'lge-',
            'maui', 'maxo', 'midp', 'mits', 'mmef', 'mobi', 'mot-', 'moto', 'mwbp', 'nec-',
            'newt', 'noki', 'oper', 'palm', 'pana', 'pant', 'phil', 'play', 'port', 'prox',
            'qwap', 'sage', 'sams', 'sany', 'sch-', 'sec-', 'send', 'seri', 'sgh-', 'shar',
            'sie-', 'siem', 'smal', 'smar', 'sony', 'sph-', 'symb', 't-mo', 'teli', 'tim-',
            'tosh', 'tsm-', 'upg1', 'upsi', 'vk-v', 'voda', 'wap-', 'wapa', 'wapi', 'wapp',
            'wapr', 'webc', 'winw', 'winw', 'xda', 'xda-'];
        
        if (mobile_agents.indexOf(mobile_ua) >= 0) {
            mobile_browser++;
        }
        
        if (user_agent_low.indexOf('iemobile') >= 0) {
            mobile_browser++;
        }
        if (user_agent_low.indexOf('windows') >= 0) {
            mobile_browser = 0;
        }
    }
    
    if (mobile_browser > 0) {
        // do something wap
        browser = "mobile";
    }
    
    else// non-mobile
    {
        req.session['Browser_d'] = "web";
        browser = "web";
    }
    
    return browser;
}

/* GET home page. */
router.get('/', function (req, res) {
    var browser = detect_browser(req);
    if (browser == 'smartphone') {
        res.sendFile(path.join(__dirname, '../public', 'smartphone.html'));
    } else {
        res.sendFile(path.join(__dirname, '../public', 'web.html'));
    }
});

module.exports = router;