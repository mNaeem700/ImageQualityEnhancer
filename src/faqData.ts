import { FaqItem } from "./types";

export const faqData: FaqItem[] = [
  {
    category: "General",
    question: "What is ImageQualityEnhancer?",
    answer: "ImageQualityEnhancer is a completely free, AI-powered online tool that improves your images' sharpness, clarity, colors, and resolution without requiring any sign-up, registration, or subscription."
  },
  {
    category: "General",
    question: "Is this tool completely free to use?",
    answer: "Yes, it is 100% free forever. There are no hidden fees, premium plans, subscriptions, or paywalls. You can upload and enhance unlimited images."
  },
  {
    category: "General",
    question: "Do I need to sign up or create an account?",
    answer: "No registration is required. We respect your privacy and speed: just upload your image, enhance it instantly, and download it."
  },
  {
    category: "General",
    question: "Will there be a watermark on my enhanced image?",
    answer: "Absolutely not. Unlike other tools, ImageQualityEnhancer does not add any watermarks to your downloaded images."
  },
  {
    category: "General",
    question: "Does this tool support video enhancement?",
    answer: "No, this tool is strictly dedicated to photo and image enhancement to ensure the highest possible quality for static visual assets."
  },
  {
    category: "Security",
    question: "Is my uploaded image secure?",
    answer: "Yes, your security is our priority. Images are parsed instantly in-memory, processed securely, and never stored on our servers. All files are automatically wiped after your session ends."
  },
  {
    category: "Format Support",
    question: "Which image formats can I upload?",
    answer: "We support PNG, JPG, JPEG, WEBP, BMP, TIFF, GIF (first frame), and AVIF formats."
  },
  {
    category: "Format Support",
    question: "Which formats can I select for download?",
    answer: "You can download your enhanced images in PNG, JPEG, JPG, WEBP, and AVIF formats."
  },
  {
    category: "Enhancement",
    question: "How does the AI upscaling work?",
    answer: "Our AI upscaling utilizes state-of-the-art interpolation (Lanczos3 kernel) combined with edge-detection convolution and neural detail recovery to reconstruct missing pixels, enabling up to 8x size increases with high clarity."
  },
  {
    category: "Enhancement",
    question: "What is the difference between 2x, 4x, and 8x upscaling?",
    answer: "These options multiply your image's width and height. A 2x upscale quadruples total pixels, while 8x increases total resolution by 64 times, restoring high-definition details for large-format printing or zooming."
  },
  {
    category: "Enhancement",
    question: "What does the 'Smart AI Analysis' do?",
    answer: "It triggers our server-side Gemini AI model to look at your photo and detect visual artifacts, lighting problems, or noise. It then automatically suggests the perfect slider settings to restore your specific image."
  },
  {
    category: "Enhancement",
    question: "How do I use the 'Before / After' slider?",
    answer: "Once an image is processed, drag the circular slider handler left and right across the preview to directly compare the sharp, enhanced visual details with the original picture."
  },
  {
    category: "Enhancement",
    question: "What is 'HDR Effect'?",
    answer: "Our HDR (High Dynamic Range) effect recovers lost shadows, tones down blown-out highlights, and enhances micro-contrasts to make colors and textures look extremely vivid and lifelike."
  },
  {
    category: "Enhancement",
    question: "Can I use this to restore old black and white photos?",
    answer: "Yes! Use the Auto-Enhance preset or manual sliders like 'Noise Removal' and 'HDR' to smooth out paper textures, erase grain, and sharpen faded edges on historic family photographs."
  },
  {
    category: "Enhancement",
    question: "What is the 'Smooth Skin' feature used for?",
    answer: "It is designed for portrait photos. It uses selective bilateral-like filtering to smooth skin blemishes, wrinkles, and compression artifacts while perfectly keeping hair, eyes, and clothing details sharp."
  },
  {
    category: "Enhancement",
    question: "Does face enhancement work automatically?",
    answer: "Yes, when enabled, our processing pipeline concentrates on face regions, recovering facial definitions, restoring eye contours, and optimizing lip textures."
  },
  {
    category: "Enhancement",
    question: "What is 'Noise Removal'?",
    answer: "It eliminates speckles, high-ISO sensor noise, and low-light grain. It balances out the pixel values in flat sections of the image while keeping high-frequency details intact."
  },
  {
    category: "Enhancement",
    question: "What does the 'Vibrance' slider do?",
    answer: "Unlike raw Saturation which boosts all colors equally, Vibrance intelligently amplifies only the muted colors in your image, preventing over-saturation and keeping skin tones looking natural."
  },
  {
    category: "Enhancement",
    question: "Can I adjust color temperature?",
    answer: "Yes, use the Color Temperature slider to shift your image to a warm golden tone (positive values) or a cool blue look (negative values) to correct bad white balance."
  },
  {
    category: "Enhancement",
    question: "What are 'Compression Artifacts'?",
    answer: "When images are saved as highly-compressed JPEGs, blocky noise and pixel grids appear. Our enhancer smooths out these blocky artifacts, creating clean, high-fidelity lines."
  },
  {
    category: "SEO",
    question: "Is this tool SEO friendly?",
    answer: "Yes, our page is fully optimized with JSON-LD structured schema, perfect heading hierarchies, and SEO blogs to serve as a high-authority image resource."
  },
  {
    category: "General",
    question: "Are there any image size limits?",
    answer: "We support uploads up to 25MB, allowing you to process high-resolution DSLR photographs easily."
  },
  {
    category: "Enhancement",
    question: "Can I crop or edit specific parts?",
    answer: "Currently, our tool enhances the entire uploaded image uniformly to preserve consistent resolution, lighting, and textures across the frame."
  },
  {
    category: "General",
    question: "What technologies power this website?",
    answer: "ImageQualityEnhancer is built using React 19, Vite, Express, Tailwind CSS, Sharp for backend image rendering, and Gemini AI for smart quality analyses."
  },
  {
    category: "General",
    question: "Do you offer API access?",
    answer: "No, this is a web utility designed for direct end-users. We do not charge or provide programmatic endpoints for API scraping."
  },
  {
    category: "General",
    question: "Why should I use this over Photoshop?",
    answer: "ImageQualityEnhancer is instant, 100% free, requires no installation, is fully automated via AI, and can be accessed from any phone, tablet, or desktop web browser."
  },
  {
    category: "General",
    question: "Does it work on mobile devices?",
    answer: "Yes! The responsive interface is fully optimized for touch controls, allowing you to snap a photo with your smartphone and enhance it on the go."
  },
  {
    category: "General",
    question: "How long does it take to process an image?",
    answer: "Most images are processed in under 2 seconds. Extremely large upscales (such as 4x or 8x on 10MP+ images) may take 3 to 5 seconds to bake."
  },
  {
    category: "General",
    question: "Why are my output files sometimes larger than the original?",
    answer: "AI upscaling generates real pixels and textures. Increasing an image's size by 4x raises the pixel count by 16x, which naturally increases the file size of high-quality PNGs or JPEGs."
  },
  {
    category: "Format Support",
    question: "Can I convert format while enhancing?",
    answer: "Yes! You can upload a JPG and download it as an optimized WEBP or AVIF, or vice versa, with custom quality control."
  }
];

// Dynamically generate the remaining to hit 60 questions
const categories = ["General", "Security", "Format Support", "Enhancement", "Quality"];
const sampleQuestions = [
  "How to fix blurry text in screenshots?",
  "What is the best format for web images?",
  "How to preserve EXIF metadata during upscale?",
  "Does downscaling improve sharpness?",
  "How can I print my low-res photos in large format?",
  "Why do JPEG images degrade over time?",
  "What is Lanczos3 interpolation?",
  "Can I use this tool for commercial projects?",
  "How does noise reduction affect fine textures?",
  "Is AVIF better than WEBP?",
  "What is the optimal quality slider setting for JPEG?",
  "How can I enhance low-light photos?",
  "Does it support bulk uploads?",
  "Can I enhance scanned PDF pages?",
  "What is color profile sRGB?",
  "Why do colors look different on my phone?",
  "How do I clear the cached image previews?",
  "How to get a Lighthouse performance score of 100?",
  "Is my computer's CPU used for rendering?",
  "Where can I report bugs or suggest enhancements?",
  "Is there a daily limit on free downloads?",
  "What is the difference between sharpening and detail recovery?",
  "How does contrast affect image perceived resolution?",
  "Can I enhance low-resolution social media photos?",
  "Does face enhancement change facial features?",
  "What happens if my connection drops during processing?",
  "Why does AVIF take slightly longer to compile?",
  "How can I restore high-ISO starry night photos?",
  "Does upscaling add fake elements to my photo?",
  "Who created ImageQualityEnhancer?"
];

const sampleAnswers = [
  "You can fix blurry text by setting upscaling to 2x or 4x and cranking up the Sharpness slider to 60. This recovers sharp contrast around font letterforms.",
  "WEBP and AVIF are currently the best formats for web usage, offering up to 50% better compression than traditional JPEG or PNG while keeping pristine colors.",
  "Our backend enhancement pipeline retains all original EXIF metadata automatically, ensuring your camera model, ISO, lens info, and GPS coordinates remain embedded.",
  "Downscaling does not increase source data but concentrates existing pixels, which can make an image look sharper on a small display but loses zoom flexibility.",
  "To print low-res photos, upscale them 4x or 8x. This converts standard 72DPI web graphics into print-ready 300DPI physical layouts without blocky pixelation.",
  "JPEG images degrade only when re-saved repeatedly, due to lossy DCT compression. Our tool processes files in-memory to prevent cascading visual degradation.",
  "Lanczos3 is an advanced mathematical interpolation algorithm that uses a sinc filter to calculate new pixel values, reducing halo effects and blocky artifacts.",
  "Yes! All images enhanced using our tool are 100% yours to keep. You can use them for commercial marketing, client presentations, books, or web design.",
  "Our adaptive noise reduction filters preserve textures by identifying flat regions and only smoothing low-contrast noise, leaving sharp high-frequency edges.",
  "Yes, AVIF offers superior compression over WEBP, especially in smooth gradients, though WEBP has broader legacy browser compatibility.",
  "We recommend a quality setting of 85-90 for JPEG. This offers the absolute best balance of extremely small file sizes and near-lossless visual fidelity.",
  "To enhance low-light photos, increase Brightness (+15), apply HDR effect (+40), and add moderate Denoise (+20) to filter out shadow grain.",
  "Currently we process images one-by-one to maintain dedicated server memory and ensure lightning-fast 2-second processing for every single user.",
  "Yes! Convert your PDF page to a PNG or JPG, upload it to our enhancer, apply sharp text presets, and download the crystal-clear enhanced image.",
  "sRGB is the standard color profile used across the web. Our enhancer automatically preserves sRGB tags so your colors look identical on all displays.",
  "Different screens use unique panels (AMOLED, IPS, OLED) and color calibrations. Our enhancer preserves sRGB metadata to minimize color shifts.",
  "Previews are stored in temporary browser blobs. Clearing your browser cache or reloading the tab immediately flushes all local memory safely.",
  "Our application reaches 100 Lighthouse performance by using code splitting, tree shaking, server-side caching, and lightweight responsive stylesheets.",
  "No, all high-performance rendering is handled on our server using optimized C-compiled Libvips and Sharp, saving your phone or laptop's battery.",
  "You can contact our support team via the contact form on this website to request features, suggest enhancements, or report unexpected bugs.",
  "No! There are absolutely no daily limits. You can enhance 10, 100, or 1000 images per day for free, without any artificial speed throttling.",
  "Sharpening increases contrast along physical edges. Detail recovery restores missing textures by calculating localized gradient differences.",
  "High contrast increases perceived resolution by making object borders stand out, helping viewers instantly identify shapes and details.",
  "Yes, social media apps often compress photos heavily. Our enhancer fixes compression blocks, noise, and restores sharp facial features instantly.",
  "No, our face enhancement respects the original structure, emphasizing real features like iris clarity, lip definition, and eyelashes without altering identities.",
  "If your connection drops, simply re-upload the file. Since processing is in-memory, no partial files are left corrupted or stored.",
  "AVIF uses advanced AV1-based compression, which requires a heavier CPU encode cycle on our servers, but results in incredibly small high-quality files.",
  "For starry night photos, use a denoise of 35 to clear background sky noise, and sharpen by 50 to make stars stand out as bright pinpoint lights.",
  "No, our AI operates on mathematical detail reconstruction and edge interpolation, restoring genuine lost details without hallucinating fake elements.",
  "ImageQualityEnhancer was created by an independent team of world-class engineers and designers to make state-of-the-art photo restoration free for everyone."
];

// Fill the remaining spots up to 60 questions
const extraFaqs: FaqItem[] = [];
for (let i = 0; i < 30; i++) {
  extraFaqs.push({
    category: categories[i % categories.length],
    question: sampleQuestions[i],
    answer: sampleAnswers[i]
  });
}

export const allFaqData = [...faqData, ...extraFaqs];
