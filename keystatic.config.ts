import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local', // For development. Later we can switch to 'github'
  },
  collections: {
    roster: collection({
      label: 'Roster (Artists)',
      slugField: 'name',
      path: 'src/content/roster/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        image: fields.image({ label: 'Image', directory: 'public/assets', publicPath: '/assets' }),
        bio: fields.text({ label: 'Bio', multiline: true }),
        spotify: fields.text({ label: 'Spotify Link' }),
        instagram: fields.text({ label: 'Instagram Link' }),
        youtube: fields.text({ label: 'YouTube Link' }),
        tiktok: fields.text({ label: 'TikTok Link' }),
        appleMusic: fields.text({ label: 'Apple Music Link' }),
        website: fields.text({ label: 'Website' }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
      },
    }),
    merch: collection({
      label: 'Merch Items',
      slugField: 'name',
      path: 'src/content/merch/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Product Name' } }),
        price: fields.text({ label: 'Price' }),
        desc: fields.text({ label: 'Description', multiline: true }),
        image: fields.image({ label: 'Image', directory: 'public/assets', publicPath: '/assets' }),
        link: fields.text({ label: 'Checkout Link (e.g. Stripe)' }),
      },
    }),
  },
  singletons: {
    home: singleton({
      label: 'Home Page',
      path: 'src/content/home',
      format: { data: 'json' },
      schema: {
        heroTitle: fields.text({ label: 'Hero Title' }),
        heroImage: fields.image({ label: 'Hero Background', directory: 'public/assets', publicPath: '/assets' }),
        showRelease: fields.checkbox({ label: 'Show Latest Release Overlay', defaultValue: true }),
        releaseTitle: fields.text({ label: 'Release Section Title', defaultValue: 'Πρόσφατη Κυκλοφορία' }),
        releaseCover: fields.image({ label: 'Release Cover', directory: 'public/assets', publicPath: '/assets' }),
        releaseSong: fields.text({ label: 'Release Song Title' }),
        releaseDesc: fields.text({ label: 'Release Description', multiline: true }),
        releaseLinkUrl: fields.text({ label: 'Release Link URL' }),
        releaseLinkType: fields.select({
          label: 'Platform',
          options: [{ label: 'Spotify', value: 'Spotify' }, { label: 'YouTube', value: 'YouTube' }],
          defaultValue: 'Spotify',
        }),
        releasesPlaylistUrl: fields.text({ label: 'Releases Playlist URL (Spotify)' }),
        aboutTitle: fields.text({ label: 'About Title', defaultValue: 'About Flowless Music' }),
        aboutImage: fields.image({ label: 'About Image', directory: 'public/assets', publicPath: '/assets' }),
        aboutText: fields.text({ label: 'About Text', multiline: true }),
        aboutTagline: fields.text({ label: 'About Tagline' }),
      },
    }),
    radio: singleton({
      label: 'Soundcheck Radio',
      path: 'src/content/radio',
      format: { data: 'json' },
      schema: {
        bannerImage: fields.image({ label: 'Banner Image', directory: 'public/assets', publicPath: '/assets' }),
        heroTagline: fields.text({ label: 'Hero Tagline' }),
        introTitle: fields.text({ label: 'Intro Title' }),
        introText: fields.text({ label: 'Intro Text', multiline: true }),
        introImage: fields.image({ label: 'Intro Image', directory: 'public/assets', publicPath: '/assets' }),
        status: fields.text({ label: 'Status Text' }),
        showSpotify: fields.checkbox({ label: 'Show Spotify', defaultValue: true }),
        youtubeLink: fields.text({ label: 'YouTube Embed Link' }),
        spotifyLink: fields.text({ label: 'Spotify Embed Link' }),
      },
    }),
    appearance: singleton({
      label: 'Appearance',
      path: 'src/content/appearance',
      format: { data: 'json' },
      schema: {
        accent: fields.text({ label: 'Accent Color', defaultValue: '#00FFD1' }),
      },
    }),
  },
});
