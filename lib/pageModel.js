const Model = require("./model");


class PageModel extends Model {


    /**
     * What "name" should this page be given in navigation bars
     * @returns {*}
     */
    getNavigationName() {
        if (this.navigationName) return this.navigationName;
        return this.name;
    }

    /**
     *
     * @returns {pageTitle}
     */
    getPageTitle() {
        if (this.pageTitle) return this.pageTitle;
        return this.name;
    }

    /**
     * This will return the relative URL for this specific page
     * @returns {string}
     */
    getUrl() {
        var slug = this.slug
        if (slug == "index") slug = ""
        return `${this.constructor.getBaseUrl()}/${slug}`
    }

    /**
     * Basic routing functionality at a page level
     * @param url
     * @returns {boolean}
     */
    matchesUrl(url) {
        if (this._trimUrl(this.getUrl()) == this._trimUrl(url)) return true;
    }

    /**
     * Trims and cleans up a URL for comparison
     * @param url
     * @returns {XML|string}
     * @private
     */
    _trimUrl(url) {
        return url.replace(/\/+$/, "").replace(/^\/+/g, '');
    }

    /**
     * If this page ought to redirect, returns an object specified below
     * @param url       {string} The current URL being requested
     * @param request   {{*}}    The express request object
     * @returns {{code: *, location: *}}
     */
    getRedirect() {
        return false;
    }

    /**
     * What template file should be used on this page?
     * @returns {string}
     */
    getTemplateFile() {
        return this.file;
    }

    /**
     * Returns the base of the url for the given model type.  ex: For a product page, `/products` would be
     * returned, so that for a page with a slug of `/widget`'s full URL would be `/products/widget`
     * @returns {string}
     */
    static getBaseUrl() {
        return ""
    }

}

module.exports = PageModel;