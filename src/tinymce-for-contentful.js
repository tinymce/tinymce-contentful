window.contentfulExtension.init(function (api) {
  function tinymceForContentful(api) {
    function tweak(param) {
      var t = param.trim();
      if (t === 'false') {
        return false;
      } else if (t === '') {
        return undefined;
      } else {
        return t;
      }
    }

    var p = tweak(api.parameters.instance.plugins);
    var tb = tweak(api.parameters.instance.toolbar);
    var mb = tweak(api.parameters.instance.menubar);

    api.window.startAutoResizer();

    tinymce.init({
      selector: '#editor',
      plugins: p,
      toolbar: tb,
      menubar: mb,
      min_height: 600,
      max_height: 750,
      autoresize_bottom_margin: 15,
      resize: false,
      image_caption: true,
      style_formats: [
        { title: 'Large Heading', block: 'h1', attributes: { class: '' } },
        { title: 'Medium Heading', block: 'h2', attributes: { class: '' } },
        { title: 'Small Heading', block: 'h3', attributes: { class: '' } },
        { title: 'Editorial', block: 'p', attributes: { class: 'editorial' } },
        {
          title: 'Large Body',
          block: 'p',
          attributes: { class: 'body-large' },
        },
        { title: 'Medium Body', block: 'p', attributes: { class: '' } },
        {
          title: 'Small Body',
          block: 'p',
          attributes: { class: 'body-small' },
        },
      ],
      content_style:
        'h1 { font-size: 1.5rem; font-weight: 400; }' +
        'h2 { font-size: 1.25rem; font-weight: 500; }' +
        'h3 { font-size: 1rem; font-weight: 500; }' +
        '.body-large { font-size: 1rem; font-weight: 500; }' +
        '.body-medium { font-size: 1rem; font-weight: 400; }' +
        '.body-small { font-size: 0.75rem; font-weight: 400; }' +
        '.editorial { font-size: 1.25rem; font-weight: 400; }' +
        '.cta-large { font-size: 1.25rem; font-weight: 500; }' +
        '.cta-medium { font-size: 1rem; font-weight: 500; }' +
        '.cta-small { font-size: 0.75rem; font-weight: 500; }',
      link_class_list: [
        { title: 'Inline', value: '' },
        { title: 'Large CTA', value: 'cta-large' },
        { title: 'Medium CTA', value: 'cta-medium' },
        { title: 'Small CTA', value: 'cta-small' },
      ],
      init_instance_callback: function (editor) {
        var listening = true;

        function getEditorContent() {
          return editor.getContent() || '';
        }

        function getApiContent() {
          return api.field.getValue() || '';
        }

        function setContent(x) {
          var apiContent = x || '';
          var editorContent = getEditorContent();
          if (apiContent !== editorContent) {
            //console.log('Setting editor content to: [' + apiContent + ']');
            editor.setContent(apiContent);
          }
        }

        setContent(api.field.getValue());

        api.field.onValueChanged(function (x) {
          if (listening) {
            setContent(x);
          }
        });

        function onEditorChange() {
          var editorContent = getEditorContent();
          var apiContent = getApiContent();

          if (editorContent !== apiContent) {
            //console.log('Setting content in api to: [' + editorContent + ']');
            listening = false;
            api.field
              .setValue(editorContent)
              .then(function () {
                listening = true;
              })
              .catch(function (err) {
                console.log('Error setting content', err);
                listening = true;
              });
          }
        }

        var throttled = _.throttle(onEditorChange, 500, { leading: true });
        editor.on('change keyup setcontent blur', throttled);
      },
    });
  }

  function loadScript(src, onload) {
    var script = document.createElement('script');
    script.setAttribute('src', src);
    script.onload = onload;
    document.body.appendChild(script);
  }

  var sub =
    location.host == 'contentful.staging.tiny.cloud' ? 'cdn.staging' : 'cdn';
  var apiKey = api.parameters.installation.apiKey;
  var channel = api.parameters.installation.channel;
  var tinymceUrl =
    'https://' +
    sub +
    '.tiny.cloud/1/' +
    apiKey +
    '/tinymce/' +
    channel +
    '/tinymce.min.js';

  loadScript(tinymceUrl, function () {
    tinymceForContentful(api);
  });
});
