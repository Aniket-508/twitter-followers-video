<div align="center">
  <img src="./public/logo.png" height="80" alt="Logo" />
</div>

<h1 align="center"><a href="https://followers.video/" target="_blank">Twitter Followers Video</a></h1>

<p align="center">
  <strong>Generate animated videos to celebrate and share your Twitter/X follower milestones.</strong>
</p>

<div align="center">

[![Stars](https://img.shields.io/github/stars/Aniket-508/twitter-followers-video?color=yellow&style=flat&label=%E2%AD%90%20Stars)](https://github.com/Aniket-508/twitter-followers-video/stargazers) [![License](https://img.shields.io/:license-MIT-green.svg?style=flat&label=License)](https://github.com/Aniket-508/twitter-followers-video/blob/main/LICENSE) [![Sponsor](https://img.shields.io/static/v1?label=Sponsor&message=❤&logo=GitHub&color=#fe8e86)](https://github.com/sponsors/Aniket-508)

</div>

## Example Output

https://github.com/user-attachments/assets/0840d4b8-1fd0-4dfd-bf75-0a0287a734ec

## Stack

- [Remotion](https://www.remotion.dev/) to create the video
- [Remotion Web Renderer](https://www.remotion.dev/docs/client-side-rendering/) to encode MP4 videos directly in the browser
- [Next.js](https://nextjs.org) for the web application
- [TailwindCSS](https://tailwindcss.com) for the styling
- [Vercel](https://vercel.com) for hosting

## Getting Started

### Prerequisites

- Node.js 22+ or Bun
- A browser with WebCodecs support for exporting videos

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/twitter-followers-video.git
cd twitter-followers-video

# Install dependencies
bun install
```

### Development

```bash
# Start the Next.js dev server
bun run dev

# Open Remotion Studio to preview animations
bun run remotion
```

### Rendering

```bash
# Render a video locally
bunx remotion render

# Upgrade Remotion
bunx remotion upgrade
```

## Browser Rendering

The **Export as MP4** button uses `@remotion/web-renderer` to render and encode the video on the visitor's device. The generated MP4 is downloaded from a local Blob URL; follower data and rendered videos are not uploaded to a rendering service.

Before rendering, the app checks whether the browser can encode a 1080p H.264 MP4. Remote avatar images are fetched with CORS and converted to local Blob URLs, with DiceBear avatars used as a fallback.

Client-side rendering is currently experimental in Remotion. Render speed depends on the visitor's hardware, and keeping the tab visible gives the best performance.

### Remotion license

Set `NEXT_PUBLIC_REMOTION_LICENSE_KEY` in your deployment environment:

```bash
NEXT_PUBLIC_REMOTION_LICENSE_KEY=free-license
```

Use `free-license` only if you qualify for Remotion's free license. Company and Enterprise users should use the public license key from the Remotion dashboard.

## Contributing

If you want to suggest a feature or report a problem, feel free to open an issue or even a pull request 😉.

## Credits

- Animation inspired from this [tweet](https://x.com/Jerrythe2d/status/2013269485210456335) by [Jerry](https://x.com/Jerrythe2d)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
