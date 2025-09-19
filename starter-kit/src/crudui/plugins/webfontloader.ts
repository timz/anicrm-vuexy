/**
 * plugins/webfontloader.js
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */

export async function loadFonts() {
  const webFontLoader = await import(/* webpackChunkName: "webfontloader" */ 'webfontloader')

  webFontLoader.load({
    google: {
      families: ['Open+Sans:ital,wght@0,300..800;1,300..800&display=swap'],
    },
  })
}

export default function () {
  loadFonts()
}
