const PageModel = require("../pageModel")

class Redirect extends PageModel {

    /**
     * If this page ought to redirect, returns an object specified below
     * @param url       {string} The current URL being requested
     * @param request   {{*}}    The express request object
     * @returns {{code: *, location: *}}
     */
    getRedirect(url, request) {
        return {
            code: this.getRedirectCode(),
            location: this.redirect
        };
    }

    getRedirectCode() {
        if (this.code) return this.code;
        return 301;
    }

}

module.exports = Redirect;