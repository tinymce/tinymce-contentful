# TinyMCE for Contentful

This repository contains the integration of the TinyMCE rich text editor into the 
Contentful headless CMS. 

Please see [this blog post](https://go.tiny.cloud/blog/is-the-headless-cms-the-future-of-content-publishing/)
for an introduction to TinyMCE for Contentful.

# Packaging

This is packaged as Contentful UI Extension. The `extension.json` file defines
the extension and points it to an external web server to serve the extension's files.

In Tiny's case, the files in `src/` are deployed to:
 - https://contentful.tiny.cloud/ (production)
 - https://contentful-staging.tiny.cloud/ (staging)

# Forking

Note that this extension only works when installed using the "src" method, 
not the "srcdoc" method. As such, if you wish to fork this extension, you 
will need to host the files in the `src/` folder on a web server and update
your `extension.json` file to point to it.

# Developing

To deploy experimental changes to the `extension.json` file, you can use 
the contentful CLI: 

    contentful extension update --version=X

Where X is the previous version of the extension installed.
This only affects your own Contentful instance.

To make changes to the files in `src/`, re-deploy them to the appropriate web server. 

Note that you will need to change the extension settings in the Contentful UI
to set your API Key, and to change between the live and staging URLs.

Note that whenever you `contentful extension update` it will forget your settings,
so you'll have to put in your API key and staging URL again.

# Extension URL

To install the extension into Contentful, add an extension using the 
"Install from Github" option, and enter the following URL: 

https://github.com/tinymce/tinymce-contentful/blob/master/extension.json


