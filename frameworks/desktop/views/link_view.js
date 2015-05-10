// ==========================================================================
// Project:   SproutCore
// Copyright: ©2014 7x7 Software, Inc.
// License:   Licensed under MIT license
// ==========================================================================


/**
  @class

  This view creates a link (i.e. HTML anchor) to a remote resource.  You should
  use this view to create programmatic HTML links, such as links to a PDF or to
  an external site.

  For example,

      //...

      // A link to download the selected employee's resume.
      link: SC.LinkView.extend({

        body: "Current Resume",

        // Compute the fileName on the fly.
        fileNameBinding: SC.Binding.oneWay('MyApp.employeeController.fullName')
          .transform(function (fullName) {
            // ex. "Resume - Tyler Keating.pdf"
            return "Resume - " + fullName + ".pdf";
          }),

        // Compute the href on the fly.
        hrefBinding: SC.Binding.oneWay('MyApp.employeeController.resumePath'),

        toolTip: "Link to current resume"
      }),

      //...

  The example above generates something like the following,

      <a href="/users/22/cur-resume.pdf" class="sc-view sc-link-view" download="Resume - Tyler Keating.pdf" title="Link to current resume">Current Resume</a>

  Note that you can localize the `body` and the `toolTip` by setting the `localize`
  property to true.

  @since SproutCore 1.11
*/
SC.LinkView = SC.View.extend({

  /**
    The WAI-ARIA role for link views.

    @type String
    @default 'link'
    @readOnly
  */
  ariaRole: 'link',

  /**
    The content of the anchor, such as text or an image.

    Note that this will be escaped by default, so any HTML tags will appear
    as text.  To render the body as HTML, set `escapeHTML` to `false` and
    remember to *NEVER* allow user generated content unescaped in your app.

    If you are using text, you may also want to provide localized versions and
    should set the `localize` property to true.

    @type String
    @default ""
   */
  body: "",

  /**
    The class names for the view.

    Note: this is not an observed display property and as such must be predefined on the
    view (You can update class names using `classNameBindings`).

    Note: this is a concatenated property and as such all subclasses will inherit
    the current class names.

    @type Array
    @default ['sc-view', 'sc-link-view']
   */
  classNames: ['sc-link-view'],

  /**
    This is generated by localizing the body property if necessary.

    @readonly
    @type String
    @observes 'body'
    @observes 'localize'
  */
  displayBody: function () {
    var ret = this.get('body');

    return (ret && this.get('localize')) ? SC.String.loc(ret) : (ret || '');
  }.property('body', 'localize').cacheable(),

  /**
    The observed properties that will cause the view to be rerendered if they
    change.

    Note: this is a concatenated property and as such all subclasses will inherit
    the current display properties.

    @type Array
    @default ['displayBody', 'displayToolTip', 'fileName', 'href', 'hreflang']
   */
  displayProperties: ['displayBody', 'displayToolTip', 'fileName', 'href', 'hreflang'],

  /**
    The default file name to use for the linked resource if it will be
    downloaded.

    For example,

        //...

        // The linked resource (/students/2013/list-copy.xml) will be downloaded
        // with the name 'Student List.xml' by default.
        fileName: 'Student List.xml',

        href: '/students/2013/list-copy.xml'

        //...

    This property is observed, allowing you to programmatically set the download
    file name.

    For example as a computed property,

        //...

        // The download file name is computed from the linked resource URL.
        fileName: function () {
          var href = this.get('href'),
            linkedYear,
            ret;

          if (href) {
            // ex. href == "/reports/2012/annual-report.pdf"
            linkedYear = href.match(/\/(\d*)\//)[1];
            ret = "Annual Report " + linkedYear + '.pdf';
          }

          return ret;
        }.property('href').cacheable(),

        hrefBinding: SC.Binding.oneWay('MyApp.reportController.hardlink'),

        //...

    Note: There are no restrictions on allowed values, but authors are cautioned
    that most file systems have limitations with regard to what punctuation is
    supported in file names, and user agents are likely to adjust file names
    accordingly. Also, support for this attribute varies widely between browsers.

    @see http://caniuse.com/#feat=download
    @see http://www.whatwg.org/specs/web-apps/current-work/multipage/links.html#attr-hyperlink-download
   */
  fileName: null,

  /**
    Whether the body and toolTip will be escaped to avoid HTML injection attacks
    or not.

    You should only disable this option if you are sure you are displaying
    non-user generated text.

    Note: this is not an observed display property.  If you change it after
    rendering, you should call `displayDidChange` on the view to update the layer.

    @type Boolean
    @default true
   */
  escapeHTML: true,

  /**
    The linked resource URL.

    @type String
    @default '#'
   */
  href: '#',

  /**
    The alternate language for the linked resource.

    Set this value to modify the 'hreflang' attribute for the linked resource,
    which would otherwise be the current locale's language.

    @type String
    @default null
    @see http://www.whatwg.org/specs/web-apps/current-work/multipage/links.html#attr-hyperlink-hreflang
   */
  language: null,

  /**
    The language attribute of the linked resource.

    This is the current locale's language by default, but may be overridden to
    a specific other language by setting the `language` property.

    @readonly
    @type String
    @observes 'language'
    @observes 'localize'
    @default SC.Locale.currentLocale.language
    @see http://www.whatwg.org/specs/web-apps/current-work/multipage/links.html#attr-hyperlink-hreflang
  */
  hreflang: function () {
    var language = this.get('language'),
      ret;

    ret = language || SC.Locale.currentLocale.language;

    return ret;
  }.property('language', 'localize').cacheable(),

  /**
    An array of URLs to ping when the link is clicked.

    For example, this can be used for tracking the use of off-site links without
    JavaScript or page redirects,

        //...

        // Whenever anyone downloads this resource, we ping our analytics site.
        ping: ['http://tracker.my-app.com/?action="Downloaded PDF Version"'],

        //...

    Note: this is not an updateable display property.  It must be defined before
    creating the layer.

    @type Array
    @default null
    @see http://www.whatwg.org/specs/web-apps/current-work/multipage/links.html#ping
   */
  ping: null,

  /**
    A list of space separated non-case sensitive link type tokens.

    For example,

        //...

        // This link is to the author of the article and the result should be loaded in the browser's sidebar if it has one.
        rel: ['author', 'sidebar'],

        //...

    Note: this is not an updateable display property.  It must be defined before
    creating the layer.

    @type Array
    @default null
    @see http://www.whatwg.org/specs/web-apps/current-work/multipage/links.html#attr-hyperlink-rel
    @see http://www.whatwg.org/specs/web-apps/current-work/multipage/links.html#linkTypes
   */
  rel: null,

  /**
    The tag type to use.

    Note: this is not an updateable display property.  It must be defined before
    creating the layer.

    @type String
    @default 'a'
   */
  tagName: 'a',

  /**
    The target for loading the resource.

    The following keywords have special meanings:

    * _self: Load the response into the same HTML4 frame (or HTML5 browsing context) as the current one.
    * _blank: Load the response into a new unnamed HTML4 window or HTML5 browsing context.
    * _parent: Load the response into the HTML4 frameset parent of the current frame or HTML5 parent browsing context of the current one. If there is no parent, this option behaves the same way as _self.
    * _top: In HTML4: Load the response into the full, original window, canceling all other frames. In HTML5: Load the response into the top-level browsing context (that is, the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as _self.

    Note: this is not an updateable display property.  It must be defined before
    creating the layer.

    @type String
    @default '_blank'
    @see http://www.whatwg.org/specs/web-apps/current-work/multipage/links.html#attr-hyperlink-target
   */
  target: '_blank',

  /**
    The mime type of the link.

    This has little effect, but certain browsers may add display information
    pertaining to the type, such as a small icon for the linked resource type.

    Note: this is not an updateable display property.  It must be defined before
    creating the layer.

    @type String
    @default null
    @see http://www.whatwg.org/specs/web-apps/current-work/multipage/links.html#attr-hyperlink-type
   */
  type: null,

  // ------------------------------------------------------------------------
  // Methods
  //

  /**  @private */
  render: function (context) {
    var displayBody = this.get('displayBody'),
      displayToolTip = this.get('displayToolTip'),
      fileName = this.get('fileName'),
      escapeHTML = this.get('escapeHTML'),
      href = this.get('href'),
      hreflang = this.get('hreflang'),
      ping = this.get('ping'),
      rel = this.get('rel'),
      target = this.get('target'),
      type = this.get('type');

    // Escape the title of the anchor if needed. This prevents potential XSS attacks.
    if (displayToolTip && escapeHTML) {
      displayToolTip = SC.RenderContext.escapeHTML(displayToolTip);
    }

    // Set attributes
    context.setAttr({
      'download': fileName,
      'href': href,
      'hreflang': hreflang,
      'ping': ping ? ping.join(' ') : null,
      'rel': rel ? rel.join(' ') : null,
      'target': target,
      'title': displayToolTip,
      'type': type
    });

    // Escape the body of the anchor if needed. This prevents potential XSS attacks.
    if (displayBody && escapeHTML) {
      displayBody = SC.RenderContext.escapeHTML(displayBody);
    }

    // Insert the body
    context.push(displayBody);
  },

  /**  @private */
  mouseDown: function (evt) {
    evt.allowDefault();
    return true;
  },

  /**  @private */
  mouseUp: function (evt) {
    evt.allowDefault();
    return true;
  },

  /**  @private */
  touchStart: function (touch) {
    touch.allowDefault();
    return true;
  },

  /**  @private */
  touchEnd: function (touch) {
    touch.allowDefault();
    return true;
  },

  /**  @private */
  update: function (jqEl) {
    var displayBody = this.get('displayBody'),
      displayToolTip = this.get('displayToolTip'),
      fileName = this.get('fileName'),
      escapeHTML = this.get('escapeHTML'),
      href = this.get('href'),
      hreflang = this.get('hreflang');

    jqEl.attr('download', fileName);
    jqEl.attr('href', href);
    jqEl.attr('hreflang', hreflang);

    // Escape the title of the anchor if needed. This prevents potential XSS attacks.
    if (displayToolTip && escapeHTML) {
      displayToolTip = SC.RenderContext.escapeHTML(displayToolTip);
    }

    jqEl.attr('title', displayToolTip);

    // Escape the body of the anchor if needed. This prevents potential XSS attacks.
    if (displayBody && escapeHTML) {
      displayBody = SC.RenderContext.escapeHTML(displayBody);
    }
    jqEl.html(displayBody);
  }

});
