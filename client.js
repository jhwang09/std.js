var Class = require('./Class')

var mobileRegex = /mobile/i;

var Client = Class(function() {
	
	this.init = function(userAgent) {
		this._userAgent = userAgent
		this._parseClient()
		this._parseOS()
	}
	
	this._parseClient = function() {
		(this.isChrome = this._isClient('Chrome'))
			|| (this.isFirefox = this._isClient('Firefox'))
			|| (this.isIE = this._isClient('MSIE'))
			|| (this.isSafari = this._isClient('Safari', 'Version'))
		
		if (this.isSafari) {
			(this.isIPhone = this._isClient('iPhone', 'Version'))
				|| (this.isIPad = this._isClient('iPad', 'Version'))
				|| (this.isIPod = this._isClient('iPod', 'Version'))
				|| (this.isAndroid = this._isClient('Android', 'Version'))
		}
		
		if (this.isIPhone || (this.isAndroid && this._userAgent.match(mobileRegex))) {
			this.isMobile = true
		}
		
		this.isTablet = this.isIPad || (this.isAndroid && !this.isMobile)
		this.isTouch = this.isTablet || this.isMobile
	}
	
	this._parseOS = function() {
		if (this.isSafari) {
			this.isIOS = (this.isIPhone || this.isIPad || this.isIPod)
			if (this.isIOS) { this.osVersion = parseFloat(this._userAgent.match(/ OS (\d+_\d+)/)[1].replace('_', '.'), 10) }
		}
		return this
	}
	
	this.isQuirksMode = function(doc) {
		// in IE, if compatMode is undefined (early ie) or explicitly set to BackCompat, we're in quirks
		return this.isIE && (!doc.compatMode || doc.compatMode == 'BackCompat')
	}
	
	this._isClient = function(name, versionString) {
		var agent = this._userAgent,
			index = agent.indexOf(name)
		if (index < 0) { return false }
		if (versionString) { index = agent.indexOf(versionString) }
		this.version = parseFloat(agent.substr(index + (versionString || name).length + 1))
		this.name = name
		return true
	}
	
})

if (typeof window != 'undefined') { module.exports = new Client(window.navigator.userAgent) }
else { module.exports = {} }

module.exports.parse = function(userAgent) { return new Client(userAgent) }
