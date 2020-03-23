module.exports = {
    // ...other vue-cli plugin options...
    pwa: {
        name: 'טהרה',
        short_name: 'טהרה',
        themeColor: '#f54291',
        msTileColor: '#000000',
        backgroundColor: '#ffffff',
        manifestOptions: {
            icons: [
                {
                    src: "img/icons/android-chrome-192x192.png",
                    sizes: "192x192",
                    type: "image/png"
                },
                {
                    src: "img/icons/android-chrome-512x512.png",
                    sizes: "512x512",
                    type: "image/png"
                }
            ]
        }
    }
}