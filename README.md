# ImageQualityEnhancer - Full-Stack AI Image Restorer

ImageQualityEnhancer is a 100% free, production-ready full-stack online image enhancement and upscaling platform. It allows users to instantly upload high-resolution images, analyze and optimize sharpness, contrast, saturation, and dynamic ranges, apply up to 8x resolution increases via Lanczos3 interpolation kernels, and export water-mark free results in multiple file formats (PNG, JPEG, WEBP, AVIF).

---

## 🚀 Key Features

*   **No Login or Registration**: Immediate access with zero emails, subscriptions, or credit card holds.
*   **True AI Restoration**: Leverages a dual processing layer—fast client-side responsive adjustments and heavy-duty, multi-pass server-side C-compiled Sharp rendering.
*   **Smart Gemini AI Analysis**: Ingests original uploaded graphics to detect deficiencies and automatically compute optimal enhancement slider configurations.
*   **Dual Comparison Viewports**: Features an interactive split slider overlay, side-by-side comparative views, real-time zoom (up to 400%), and viewport panning.
*   **Next-Gen Formats Export**: Quality slider control supporting WEBP, AVIF, JPEG, and PNG.
*   **Privacy-First Architecture**: Files are computed directly in-memory, parsed as stream buffers, and instantly wiped without permanent server storage.

---

## 🛠️ Tech Stack & Dependencies

*   **Frontend**: React 19, Vite 6, Tailwind CSS, Lucide Icons, Framer Motion.
*   **Backend**: Node.js, Express, Sharp (C-compiled high-performance graphics layer), @google/genai (Gemini 3.5 Flash).
*   **Packaging & Building**: TypeScript, TSX, Esbuild (Bundles full-stack server into self-contained CommonJS `dist/server.cjs` to eliminate ES path resolution errors).

---

## 📂 Project Folder Structure

```
/
├── public/                  # Static assets served at root
│   ├── robots.txt           # Crawler configuration file
│   ├── sitemap.xml          # Search engine SEO index sitemap
│   └── manifest.json        # PWA application metadata
├── src/
│   ├── components/          # Reusable UI component directories
│   ├── blogData.ts          # 50 fully structured SEO blog articles
│   ├── faqData.ts           # 60 comprehensive categorized FAQs
│   ├── types.ts             # Strict TypeScript shared interface schemas
│   ├── index.css            # Entry style loading Google Fonts (Inter, Space Grotesk)
│   ├── main.tsx             # Frontend mount bootstrap
│   └── App.tsx              # Primary application engine and UI layout
├── server.ts                # Express full-stack API server & Vite development proxy
├── tsconfig.json            # TypeScript configuration compiler limits
├── vite.config.ts           # Vite Bundling config settings
├── netlify.toml             # Redirect rules and edge setups for Netlify
├── package.json             # NPM package manifest
└── README.md                # Technical instructions
```

---

## 💻 Local Installation and Setup

### 1. Prerequisites
Ensure you have Node.js (version 18 or higher) and npm installed.

### 2. Install Dependencies
Run the following command at the root directory:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file or modify `.env.example` to supply your credentials:
```env
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
NODE_ENV="development"
```

### 4. Running the Development Server
Bootstrap the full-stack server with automatic hot module reload proxies:
```bash
npm run dev
```
Open your browser to `http://localhost:3000` to preview the live application.

---

## 🔨 Production Build and Standalone Deployment

To compile the entire application into production-ready static outputs and a highly-optimized single-file server, execute:
```bash
npm run build
```

This script will run:
1. `vite build`: Compiles all frontend assets, styles, and modules into `/dist`.
2. `esbuild server.ts --bundle --platform=node ...`: Bundles the Express server, all relative paths, and TypeScript files into a single, lightning-fast CJS bundle located at `dist/server.cjs`.

### Running the Standalone Bundle
To launch the production application:
```bash
npm run start
```
The server will boot on `0.0.0.0:3000` and automatically serve production files from `/dist` with optimized static caching.

---

## ☁️ Netlify Deployment Details

The root `/netlify.toml` file is pre-configured with the standard build parameters. To deploy directly:
1. Link your repository to Netlify.
2. Set Build Command to `npm run build`.
3. Set Publish Directory to `dist`.
4. Inject your `GEMINI_API_KEY` under Netlify Settings -> Environment Variables.

---

## 🛡️ API Endpoints Reference

### 1. **POST** `/api/enhance`
Processes and compiles the final optimized image with custom adjustments.

*   **Request Payload**:
    ```json
    {
      "image": "data:image/png;base64,...",
      "params": {
        "upscale": 2,
        "brightness": 110,
        "contrast": 105,
        "saturation": 100,
        "sharpness": 40,
        "denoise": 15,
        "hdr": 25,
        "vibrance": 10,
        "smoothSkin": false,
        "faceEnhance": true,
        "colorTemp": 5
      },
      "outputFormat": "webp",
      "quality": 90
    }
    ```
*   **Response Payload**:
    ```json
    {
      "enhancedImage": "data:image/webp;base64,...",
      "width": 1920,
      "height": 1080,
      "size": 245102
    }
    ```

### 2. **POST** `/api/analyze`
Submits image bytes to Gemini Vision to run deep deficiency checks and predict optimal restoration values.

*   **Request Payload**:
    ```json
    {
      "image": "data:image/jpeg;base64,..."
    }
    ```
*   **Response Payload**:
    ```json
    {
      "detectedType": "Portrait",
      "issues": ["Low contrast", "Soft facial focus", "JPEG artifacts"],
      "recommendations": ["Upscale 2x", "Apply bilateral skin smoother", "Enhance brightness (+5)"],
      "suggestedSliders": {
        "upscale": 2,
        "brightness": 105,
        "contrast": 110,
        "saturation": 100,
        "sharpness": 35,
        "denoise": 20,
        "hdr": 15,
        "smoothSkin": true,
        "faceEnhance": true,
        "colorTemp": 0
      },
      "detailedReview": "The image exhibits slight focus de-registration in portrait details and low light contrasts. Bilateral smoothing is advised."
    }
    ```

---

## 🩹 Troubleshooting Guidelines

1.  **Large File Size Upload Errors**: If you encounter `413 Payload Too Large` from Express, confirm that `express.json({ limit: "50mb" })` is set correctly in your `server.ts` initialization.
2.  **Missing Gemini Key Falls Back Gracefully**: If your `GEMINI_API_KEY` secret isn't provided, our server automatically intercepts the query and runs our local expert diagnostics rule-set to ensure the user gets a seamless experience without crashing.
3.  **Vite WebSocket Connection Warns**: These warnings are normal and benign in AI Studio and Cloud Run sandboxed environments where HMR is disabled.

---

## 👨‍💻 Contributing and Licensing

This project is maintained by the **ImageQualityEnhancer collective**. All software is open-source under the Apache-2.0 license.
