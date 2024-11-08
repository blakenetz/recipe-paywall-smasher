# Recipe Paywall Smasher 💥

Hacky paywall avoidance extension for:

- [The New York Times](https://www.nytimes.com/)
- [NYT cooking](https://cooking.nytimes.com/)
- [Bon Appetit](https://www.bonappetit.com/)
- [Epicurious](https://www.epicurious.com/)
- [Molly Baz](https://mollybaz.com/)

## Installation

```bash
$ yarn
$ yarn build
```

Then follow instructions for individual browsers...

## Firefox

There's a couple options for developing in FF.
In either option, you must first downgrade the `manifest_version` to `2` in `manifest.json`.

### Temporary installation

[Follow these instructions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#Installing)

### Self-distributed

- Create a [Mozilla profile/add-on key](https://addons.mozilla.org/developers/addon/api/key/)
- Create an .env file
- Populate `AMO_JWT_ISSUER` and `AMO_JWT_SECRET` values from key generated above
- Run the sign and build commands:

```cli
$ yarn sign:android && yarn build:android
```

- [Install in browser](https://extensionworkshop.com/documentation/publish/distribute-sideloading/)

## Chrome

- Visit [extensions settings](chrome://extensions/)
- Toggle on `Developer mode`
- Click `Load unpacked` and select root directory

Alternatively, follow [these instructions](https://developer.chrome.com/docs/extensions/mv2/getstarted/#manifest)

## Safari

You can use a [safari-web-extension-converter](https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari) to build the extension.

I would recommend moving this into a sibling directory and updating the bundle identifier to something of your fancy.

```cli
$ mkdir ../nyt-paywall-safari
$ cd nyt-paywall-safari
$ xcrun safari-web-extension-converter ../nyt-paywall --bundle-identifier com.[YOUR NAME HERE].nytPaywallSmasher
```

- Open Xcode (if it didn't automatically open)
- Select macOS scheme (`Product` > `Scheme` > `nytPaywallSmasher (macOS)`)
- Run build (`Product` > `Build`)

- Open Safari
- Toggle on `Allow Unsigned Extensions` in `Develop` menu
- Toggle on `NYT Paywall Smasher` in `Preferences` > `Extensions`
