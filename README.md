# 🚀 Adrift v0.1.3b

A modern multi-platform streaming companion that lets you watch YouTube streams while keeping up with Twitch chat.

## Features

- 🎮 Watch YouTube streams with embedded Twitch chat
- 🌈 Smooth page transitions and modern UI
- 📱 Responsive design for both desktop and mobile
- ⚡ Built with Next.js 14 and TypeScript
- 🔄 Auto-fallback to channel uploads if live stream isn't found
- 🎨 Dark mode by default with purple accents
- 🚀 Sleek rocket emoji favicon for easy tab identification

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and add your YouTube API key
3. Install dependencies:
```bash
npm install
```
4. Run the development server:
```bash
npm run dev
```

## Environment Variables

- `YOUTUBE_API_KEY`: Your YouTube Data API v3 key
- `NEXT_PUBLIC_DOMAIN`: Domain for Twitch chat embedding (default: "localhost")

## License

MIT License with Commons Clause - See [LICENSE.MD](LICENSE.MD) for details.

# Adrift 🎥✨

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/ravier1)

**Live Demo:** [https://adrift-five.vercel.app/](https://adrift-five.vercel.app/)

**Try with TimTheTatman:** [https://adrift-five.vercel.app/stream?yt=@timthetatman&tw=timthetatman](https://adrift-five.vercel.app/stream?yt=@timthetatman&tw=timthetatman)

Adrift (from "Ad" + "rift") is a cutting-edge video player that combines YouTube streaming with Twitch chat integration. The name reflects the project's purpose - breaking away from traditional streaming platforms and their excessive advertisements. Enjoy your favorite streams in immersive theatre mode across all devices—from browsers and desktops to mobiles and tablets.

## About This Project

This project started as a personal passion project born out of frustration 😤. I was fed up with Twitch—especially the low bitrate, excessive ads, and clunky experience on Firefox, not to mention the disorganized multi-streamer layouts. YouTube, on the other hand, delivered a superior streaming quality with better bitrate, inspiring me to create a tool that brings the best of both worlds together. I wanted a seamless, high-quality viewing experience with the energetic vibe of Twitch chat. And thus, Adrift was born! 🚀💻

## Important Notice

This project:
- Is a free, open-source viewer that combines existing platform features
- Does not modify, block, or interfere with any platform's advertising systems
- Does not store or redistribute any content from YouTube or Twitch
- Requires users to have their own valid YouTube and Twitch accounts
- Complies with both YouTube and Twitch Terms of Service
- Is not monetized or charged for in any way
- Uses official platform APIs and embedding features only

The name "Adrift" refers to moving away from traditional viewing experiences, not bypassing platform features. This project aims to enhance the viewing experience while respecting platform policies.

## Features

* Responsive Design: Optimized for browsers, desktops, tablets, and mobile devices
* YouTube Integration: Enter your YouTube username to access live or archived streams
* Enhanced YouTube Stream Detection: Uses YouTube Data API to accurately find live streams
* Smart Fallback System: Automatically switches to traditional embed when needed
* Twitch Chat Integration: Add your Twitch chat username to overlay real-time chat alongside the video
* Theatre Mode: Experience a distraction-free, cinema-like viewing experience
* Colorful Debug Console: Easy-to-understand, visual debugging in the browser console

### Coming Soon
* 7tv Emote Support: Enrich your chat with popular 7tv emotes
* Redefined Chat Experience: Seamlessly watch YouTube streams paired with parsed Twitch chat VODs

## Getting Started

### Prerequisites

* A modern web browser (Chrome, Firefox, Safari, or Edge)
* Node.js and npm (if building from source)
* An active internet connection
* YouTube Data API key (get one from [Google Cloud Console](https://console.cloud.google.com/))

### Installation

1. Clone the Repository:
```bash
git clone https://github.com/ravier1/adrift.git
```

2. Navigate to the Project Directory:
```bash
cd adrift
```

3. Install Dependencies:
```bash
npm install
```

4. Set Up Environment Variables:
   - Copy `.env.example` to `.env`
   - Add your YouTube API key
   - Set your domain (use `localhost` for development)

```bash
# Create .env file from example
cp .env.example .env

# Edit the .env file with your values
NEXT_PUBLIC_YOUTUBE_API_KEY="your_youtube_api_key_here"
NEXT_PUBLIC_DOMAIN="localhost"
```

5. Start the Development Server:
```bash
npm run dev
```

The application will run at http://localhost:3000

## Technical Implementation

### YouTube Stream Detection

Adrift uses a two-tier approach to provide the best possible streaming experience:

1. **Primary: YouTube Data API** - The system first attempts to find the streamer's live stream using the official YouTube Data API for the most accurate results.

2. **Fallback: Traditional Embed** - If the API doesn't find a live stream or encounters any issues, the system automatically falls back to the traditional YouTube embed method.

This dual system ensures you always get the best available stream from your favorite content creators.

## Dependencies

Adrift relies on these key dependencies:

- **Next.js**: React framework for server-rendered applications
- **React**: UI component library
- **tmi.js**: Twitch Messaging Interface library for chat integration
- **@t3-oss/env-nextjs**: Environment variable validation
- **Zod**: TypeScript-first schema validation
- **Framer Motion**: Animation library for smooth page transitions
- **Geist Sans**: Modern, clean font family
- **Tailwind CSS**: Utility-first CSS framework

## Usage

* Enter YouTube Username: Type in your YouTube username to load your stream content
* Enter Twitch Chat Username: Input your Twitch chat username to enable real-time chat integration
* Activate Theatre Mode: Toggle theatre mode for an enhanced, immersive viewing experience

## Support & Contributions

> *Looking for logo design suggestions! Currently using a rocket emoji as our favicon, but open to creative ideas for a unique brand identity. Feel free to contribute your designs or suggestions!* 

### Donations
If you find Adrift helpful, consider supporting the project:
- Help cover Vercel hosting costs for the public demo
- Support development time and maintenance
- Enable new feature implementations
- Note: Donations are voluntary and don't provide any additional features or ad-removal capabilities

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/ravier1)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For questions, suggestions, or contributions, please [open an issue](https://github.com/ravier1/adrift/issues) on GitHub.

## Credits & Thanks

This project was built using the [T3 Stack](https://create.t3.gg/), a fantastic full-stack framework created by [Theo](https://twitter.com/t3dotgg). Special thanks to Theo for inspiring developers like me to build projects we're passionate about! Check out his amazing content:

- [Theo's YouTube](https://www.youtube.com/@t3dotgg)
- [T3 Documentation](https://create.t3.gg)

### Special Thanks

A heartfelt thank you to:
- Everyone who has supported this project through Ko-fi donations
- The amazing open-source community
- [Theo](https://twitter.com/t3dotgg) for creating the T3 stack and inspiring developers worldwide
- All contributors and supporters who help make Adrift better

## Project Stats

[![Star History Chart](https://api.star-history.com/svg?repos=ravier1/adrift&type=Date)](https://star-history.com/#ravier1/adrift&Date)

---
Happy streaming with Adrift—where YouTube's superior quality meets the lively spirit of Twitch chat! 🎉📺
