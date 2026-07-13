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
- [Vercel Sandbox](https://vercel.com/docs/sandbox) and [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for production rendering and storage
- [Next.js](https://nextjs.org) for the web application
- [TailwindCSS](https://tailwindcss.com) for the styling
- [Vercel](https://vercel.com) for hosting

## Getting Started

### Prerequisites

- Node.js 22+ or Bun
- Vercel Blob store attached to the Vercel project for production rendering

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

# Bundle the Remotion project for Vercel Sandbox
bun run bundle

# Create a Vercel Sandbox snapshot for production renders
bun run create-snapshot

# Upgrade Remotion
bunx remotion upgrade
```

## Vercel Sandbox Rendering

In development, the **Export as MP4** button renders locally with the Remotion CLI and saves files under `public/renders/`.

In production, the same endpoint renders with [Vercel Sandbox](https://github.com/remotion-dev/template-vercel), uploads the final MP4 to Vercel Blob, and returns a public download URL.

1. Create a Vercel Blob store and attach it to your Vercel project.
2. Ensure `BLOB_READ_WRITE_TOKEN` is available in the project environment.
3. For local snapshot creation, also set `VERCEL_TOKEN`, `VERCEL_TEAM_ID`, and `VERCEL_PROJECT_ID` if the Sandbox SDK cannot authenticate automatically.
4. Deploy with the configured Vercel build command:

```bash
bun run bundle && bun run build && bun run create-snapshot
```

Run `bun run create-snapshot` again after changing the video template or upgrading Remotion.

## Contributing

If you want to suggest a feature or report a problem, feel free to open an issue or even a pull request 😉.

## Credits

- Animation inspired from this [tweet](https://x.com/Jerrythe2d/status/2013269485210456335) by [Jerry](https://x.com/Jerrythe2d)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
