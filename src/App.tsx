import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Sparkles,
  Sliders,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronRight,
  Search,
  X,
  ChevronDown,
  BookOpen,
  Zap,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Mail,
  Shield,
  FileText,
  AlertTriangle,
  FileImage,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { EnhancementParams, ImageMetadata, AiProfile, BlogPost, FaqItem } from "./types";
import { allFaqData } from "./faqData";
import { allBlogArticles } from "./blogData";

// Global SEO schemas
const injectSeoSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://imagequalityenhancer.com/#website",
        "url": "https://imagequalityenhancer.com/",
        "name": "ImageQualityEnhancer",
        "description": "Enhance your images with AI for free. Sharpness, clarity, colors, and upscaling up to 8x.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://imagequalityenhancer.com/?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "ImageQualityEnhancer",
        "operatingSystem": "All",
        "applicationCategory": "MultimediaApplication",
        "browserRequirements": "Requires HTML5 Canvas and Javascript",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        }
      }
    ]
  };

  const scriptId = "seo-structured-data";
  let script = document.getElementById(scriptId) as HTMLScriptElement;
  if (!script) {
    script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema);
};

export default function App() {
  // Page routing and layout tabs
  const [activeView, setActiveView] = useState<"enhancer" | "about" | "features" | "pricing" | "faq" | "blog" | "contact" | "privacy" | "terms">("enhancer");

  // Image upload and processing states
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // File metadata
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [enhancedMetadata, setEnhancedMetadata] = useState<{ width: number; height: number; size: number } | null>(null);

  // AI Insights
  const [aiProfile, setAiProfile] = useState<AiProfile | null>(null);

  // Comparison controls
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingPan, setIsDraggingPan] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"slider" | "sideBySide" | "split">("slider");

  // Form parameters
  const [params, setParams] = useState<EnhancementParams>({
    upscale: 1,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sharpness: 0,
    denoise: 0,
    vibrance: 0,
    hdr: 0,
    smoothSkin: false,
    faceEnhance: false,
    colorTemp: 0
  });

  const [activePreset, setActivePreset] = useState<string>("original");
  const [outputFormat, setOutputFormat] = useState<"png" | "jpeg" | "webp" | "avif">("png");
  const [quality, setQuality] = useState<number>(90);
  const [customFilename, setCustomFilename] = useState<string>("");

  // Blog and FAQ dynamic search/filter
  const [faqSearch, setFaqSearch] = useState<string>("");
  const [faqCategory, setFaqCategory] = useState<string>("All");
  const [blogSearch, setBlogSearch] = useState<string>("");
  const [blogCategory, setBlogCategory] = useState<string>("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Contact form submission
  const [contactName, setContactName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactMessage, setContactMessage] = useState<string>("");
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Inject structured data on mount
  useEffect(() => {
    injectSeoSchema();
  }, []);

  // Listen for paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              handleFileSelect(blob);
            }
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // Presets mapping
  const presets: { [key: string]: Partial<EnhancementParams> } = {
    original: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sharpness: 0,
      denoise: 0,
      vibrance: 0,
      hdr: 0,
      smoothSkin: false,
      faceEnhance: false,
      colorTemp: 0
    },
    auto: {
      brightness: 105,
      contrast: 110,
      saturation: 105,
      sharpness: 35,
      denoise: 10,
      vibrance: 20,
      hdr: 30,
      smoothSkin: false,
      faceEnhance: true,
      colorTemp: 2
    },
    landscape: {
      brightness: 100,
      contrast: 120,
      saturation: 115,
      sharpness: 50,
      denoise: 5,
      vibrance: 40,
      hdr: 60,
      smoothSkin: false,
      faceEnhance: false,
      colorTemp: 5
    },
    portrait: {
      brightness: 105,
      contrast: 98,
      saturation: 100,
      sharpness: 20,
      denoise: 30,
      vibrance: 10,
      hdr: 10,
      smoothSkin: true,
      faceEnhance: true,
      colorTemp: -3
    },
    lowlight: {
      brightness: 130,
      contrast: 115,
      saturation: 105,
      sharpness: 40,
      denoise: 35,
      vibrance: 25,
      hdr: 50,
      smoothSkin: false,
      faceEnhance: true,
      colorTemp: 8
    },
    text: {
      brightness: 100,
      contrast: 150,
      saturation: 30,
      sharpness: 80,
      denoise: 5,
      vibrance: 0,
      hdr: 20,
      smoothSkin: false,
      faceEnhance: false,
      colorTemp: 0
    }
  };

  const applyPreset = (presetName: string) => {
    setActivePreset(presetName);
    const presetParams = presets[presetName];
    if (presetParams) {
      setParams((prev) => ({ ...prev, ...presetParams }));
    }
  };

  // Handle local file upload
  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validation
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/bmp",
      "image/tiff",
      "image/gif",
      "image/avif"
    ];

    if (!validTypes.includes(file.type)) {
      setErrorMsg("Unsupported image format. Please upload PNG, JPG, JPEG, WEBP, BMP, TIFF, GIF, or AVIF.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg("Image is too large. Maximum file size allowed is 25MB.");
      return;
    }

    setErrorMsg(null);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress upload bar
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 25;
      });
    }, 100);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const base64Data = e.target.result as string;
        setOriginalImage(base64Data);
        setEnhancedImage(null);
        setEnhancedMetadata(null);
        setAiProfile(null);
        setZoom(1);
        setPan({ x: 0, y: 0 });

        // Extract native dimensions
        const img = new Image();
        img.onload = () => {
          const calculatedMetadata: ImageMetadata = {
            name: file.name,
            type: file.type.split("/")[1]?.toUpperCase() || "UNKNOWN",
            size: file.size,
            width: img.width,
            height: img.height,
            aspectRatio: `${img.width}:${img.height} (${(img.width / img.height).toFixed(2)})`,
            dpi: 72, // standard fallback
            colorProfile: "sRGB",
            lastModified: file.lastModified
          };
          setMetadata(calculatedMetadata);

          // Auto-fill filename
          const dotIdx = file.name.lastIndexOf(".");
          const pureName = dotIdx !== -1 ? file.name.substring(0, dotIdx) : file.name;
          setCustomFilename(`${pureName}_enhanced`);
          setIsUploading(false);
        };
        img.src = base64Data;
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Call API for Gemini Analysis
  const runAiAnalysis = async () => {
    if (!originalImage) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: originalImage }),
      });
      const data = await response.json();
      if (data && !data.error) {
        setAiProfile(data);
        if (data.suggestedSliders) {
          setParams((prev) => ({ ...prev, ...data.suggestedSliders }));
          setActivePreset("custom");
        }
      } else {
        setErrorMsg(data.error || "AI Analysis failed to run.");
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Call API to Enhance Image
  const applyEnhancements = async () => {
    if (!originalImage) return;
    setIsProcessing(true);
    setProcessingProgress(15);
    setEstimatedTime(3);

    const progressTimer = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + 15;
      });
      setEstimatedTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 400);

    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: originalImage,
          params,
          outputFormat,
          quality,
        }),
      });

      const data = await response.json();
      if (response.ok && data.enhancedImage) {
        setEnhancedImage(data.enhancedImage);
        setEnhancedMetadata({
          width: data.width,
          height: data.height,
          size: data.size,
        });
        setProcessingProgress(100);
      } else {
        setErrorMsg(data.error || "Enhancement failed. Check server parameters.");
      }
    } catch (error: any) {
      setErrorMsg(error?.message || "Enhancement connection failed.");
    } finally {
      clearInterval(progressTimer);
      setIsProcessing(false);
    }
  };

  // Comparison slider movement
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleSliderMove(e.clientX);
    }
  };

  // Zoom / Pan handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(4, prev + 0.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(1, prev - 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const startPanDrag = (clientX: number, clientY: number) => {
    if (zoom === 1) return;
    setIsDraggingPan(true);
    setDragStart({ x: clientX - pan.x, y: clientY - pan.y });
  };

  const handlePanDrag = (clientX: number, clientY: number) => {
    if (!isDraggingPan) return;
    setPan({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const endPanDrag = () => {
    setIsDraggingPan(false);
  };

  // Download functionality
  const executeDownload = () => {
    const targetUrl = enhancedImage || originalImage;
    if (!targetUrl) return;

    const link = document.createElement("a");
    link.href = targetUrl;
    link.download = `${customFilename || "enhanced"}.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear states
  const clearImage = () => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setMetadata(null);
    setEnhancedMetadata(null);
    setAiProfile(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // FAQ Category lists
  const faqCategories = ["All", "General", "Security", "Format Support", "Enhancement"];
  const filteredFaqs = allFaqData.filter((item) => {
    const matchSearch =
      item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearch.toLowerCase());
    const matchCategory = faqCategory === "All" || item.category === faqCategory;
    return matchSearch && matchCategory;
  });

  // Blog Category lists
  const blogCategories = ["All", "AI Enhancement", "Productivity", "Image Formats", "Photo Restoration", "Web Optimization"];
  const filteredBlogPosts = allBlogArticles.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(blogSearch.toLowerCase()) ||
      post.content.toLowerCase().includes(blogSearch.toLowerCase());
    const matchCategory = blogCategory === "All" || post.category === blogCategory;
    return matchSearch && matchCategory;
  });

  // Handle Contact Form Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setContactSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden relative">
      {/* Aurora Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Elegant Header Navigation */}
      <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-md border-b border-white/10 py-4 px-6 md:px-12 flex justify-between items-center transition-all">
        <div
          onClick={() => setActiveView("enhancer")}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/15">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg text-white font-display">
              ImageQuality<span className="text-cyan-400">Enhancer</span>
            </span>
            <span className="block text-[9px] text-cyan-400/80 font-bold tracking-wider uppercase">
              Free AI Photo Restorer
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveView("enhancer")}
            className={`transition ${activeView === "enhancer" ? "text-cyan-400" : "hover:text-white"}`}
          >
            Enhancer
          </button>
          <button
            onClick={() => setActiveView("features")}
            className={`transition ${activeView === "features" ? "text-cyan-400" : "hover:text-white"}`}
          >
            Features
          </button>
          <button
            onClick={() => setActiveView("about")}
            className={`transition ${activeView === "about" ? "text-cyan-400" : "hover:text-white"}`}
          >
            About
          </button>
          <button
            onClick={() => setActiveView("pricing")}
            className={`transition ${activeView === "pricing" ? "text-cyan-400" : "hover:text-white"}`}
          >
            Pricing
          </button>
          <button
            onClick={() => setActiveView("faq")}
            className={`transition ${activeView === "faq" ? "text-cyan-400" : "hover:text-white"}`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveView("blog")}
            className={`transition ${activeView === "blog" ? "text-cyan-400" : "hover:text-white"}`}
          >
            Blog
          </button>
          <button
            onClick={() => setActiveView("contact")}
            className={`transition ${activeView === "contact" ? "text-cyan-400" : "hover:text-white"}`}
          >
            Contact
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <span className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1.5 rounded-full border border-cyan-500/20 font-semibold uppercase tracking-wider hidden sm:inline-block">
            Free Forever
          </span>
          <button
            onClick={() => setActiveView("enhancer")}
            className="relative inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Free
            <Zap className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container Wrapper */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* View: ENHANCER APP */}
          {activeView === "enhancer" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Headings */}
              {!originalImage && (
                <div className="text-center max-w-3xl mx-auto space-y-4 py-8">
                  <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5" /> Complete Free Forever Tool • No Limits
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight font-display">
                    Enhance Image Quality <br />
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-200 bg-clip-text text-transparent">
                      with Real-Time AI
                    </span>
                  </h1>
                  <p className="text-slate-400 text-base md:text-lg">
                    Automatically deblur, sharpen, clean noise, restore colors, and upscale your pictures
                    up to 8x. Instant downloads. No registration, watermarks, or fees required.
                  </p>
                </div>
              )}

              {/* Error Banner */}
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 max-w-3xl mx-auto">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-200">{errorMsg}</p>
                  </div>
                  <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-200 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Landing Page Upload Sandbox OR Editor Panel */}
              {!originalImage ? (
                <div className="max-w-4xl mx-auto space-y-8">
                  {/* Dropzone Sandbox Card */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-white/10 hover:border-cyan-500/50 bg-white/5 hover:bg-white/[0.08] p-12 text-center transition-all duration-300 shadow-2xl flex flex-col items-center justify-center min-h-[360px]"
                  >
                    {/* Glowing effect inside dropzone */}
                    <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/[0.01] transition duration-300 pointer-events-none" />

                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 flex items-center justify-center mb-6 transition duration-300">
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-cyan-400 transition duration-300" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      Drag & drop your image here
                    </h3>
                    <p className="text-slate-400 text-sm max-w-sm mb-6">
                      Supports <span className="text-slate-200">PNG, JPG, JPEG, WEBP, BMP, AVIF, TIFF</span>. Maximum file size 25MB.
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center items-center">
                      <button className="bg-white text-[#050505] px-6 py-2.5 rounded-xl text-sm font-bold shadow transition hover:scale-105 active:scale-95">
                        Browse Files
                      </button>
                      <div className="text-xs text-slate-400 font-mono py-2 px-3 bg-white/5 border border-white/10 rounded-lg">
                        Press Ctrl+V to paste from Clipboard
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                      }}
                    />
                  </div>

                  {/* Dynamic Stats Grid for features */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    {[
                      { title: "No Watermarks", desc: "Clean downloads always" },
                      { title: "8x Resolution", desc: "Extreme upscale fidelity" },
                      { title: "Auto Restoration", desc: "Fix blur & bad light" },
                      { title: "sRGB Preservation", desc: "No color shifting" }
                    ].map((feat, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center">
                        <span className="block font-bold text-white text-base mb-1">{feat.title}</span>
                        <span className="block text-xs text-slate-400">{feat.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Editor Workspace Grid */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Side: Photo Comparison Canvas Panel (Col 8) */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Visual Stage Container Card */}
                    <div className="relative bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                      {/* Top Bar Settings */}
                      <div className="flex justify-between items-center bg-white/[0.02] border-b border-white/10 px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-white max-w-[200px] truncate">
                            {metadata?.name}
                          </span>
                          <span className="text-xs bg-white/5 px-2.5 py-1 rounded-lg text-slate-400 font-mono border border-white/5">
                            {metadata?.width}x{metadata?.height}
                          </span>
                        </div>

                        {/* Comparer Tabs */}
                        <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl gap-1">
                          {[
                            { id: "slider", label: "Split Slider" },
                            { id: "sideBySide", label: "Side-by-Side" }
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setViewMode(tab.id as any)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                viewMode === tab.id
                                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow"
                                  : "text-slate-400 hover:text-white"
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {/* Stage Action Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleZoomOut}
                            className="p-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl hover:bg-white/10 transition text-slate-300"
                            title="Zoom Out"
                          >
                            <ZoomOut className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-mono font-semibold text-cyan-400 px-1">
                            {Math.round(zoom * 100)}%
                          </span>
                          <button
                            onClick={handleZoomIn}
                            className="p-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl hover:bg-white/10 transition text-slate-300"
                            title="Zoom In"
                          >
                            <ZoomIn className="w-4 h-4" />
                          </button>
                          {zoom > 1 && (
                            <button
                              onClick={handleResetZoom}
                              className="text-xs font-semibold bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-1 rounded-lg text-cyan-300 hover:bg-cyan-500/30 transition"
                            >
                              Reset
                            </button>
                          )}
                          <button
                            onClick={() => setFullscreen(!fullscreen)}
                            className="p-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl hover:bg-white/10 transition text-slate-300 ml-2"
                            title="Toggle Fullscreen"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Display Viewport */}
                      <div
                        ref={previewContainerRef}
                        onMouseDown={(e) => startPanDrag(e.clientX, e.clientY)}
                        onMouseMove={(e) => handlePanDrag(e.clientX, e.clientY)}
                        onMouseUp={endPanDrag}
                        onMouseLeave={endPanDrag}
                        className={`relative h-[480px] md:h-[580px] w-full flex items-center justify-center bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] select-none ${
                          zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""
                        }`}
                      >
                        {/* Split-Slider Compare mode */}
                        {viewMode === "slider" && (
                          <div
                            ref={sliderRef}
                            onTouchMove={handleTouchMove}
                            onMouseMove={handleMouseMove}
                            className="relative w-full h-full flex items-center justify-center overflow-hidden"
                          >
                            <div
                              className="relative max-w-full max-h-full aspect-auto transition-transform duration-75"
                              style={{
                                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                                width: "auto",
                                height: "100%",
                              }}
                            >
                              {/* Before Image (Left Background) */}
                              <img
                                src={originalImage}
                                alt="Original Before"
                                className="h-full w-auto object-contain pointer-events-none"
                              />

                              {/* After Image Overlay (Clipped to slider position) */}
                              <div
                                className="absolute inset-0 z-10 overflow-hidden"
                                style={{
                                  clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
                                }}
                              >
                                <img
                                  src={enhancedImage || originalImage}
                                  alt="Enhanced After"
                                  className="h-full w-auto object-contain pointer-events-none"
                                />
                              </div>

                              {/* Interactive Split Bar Handle */}
                              <div
                                className="absolute top-0 bottom-0 w-px bg-white z-20"
                                style={{ left: `${sliderPosition}%` }}
                              >
                                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-500 border border-white flex items-center justify-center shadow-2xl cursor-ew-resize">
                                  <Sliders className="w-4 h-4 text-white transform rotate-90" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Side by Side compare mode */}
                        {viewMode === "sideBySide" && (
                          <div className="grid grid-cols-2 w-full h-full p-4 gap-4">
                            <div className="relative bg-black border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center">
                              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-300 z-10">
                                ORIGINAL BEFORE
                              </span>
                              <img
                                src={originalImage}
                                alt="Before"
                                className="max-w-full max-h-full object-contain pointer-events-none"
                                style={{
                                  transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                                }}
                              />
                            </div>
                            <div className="relative bg-black border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center">
                              <span className="absolute top-3 left-3 bg-cyan-500/80 backdrop-blur border border-cyan-500/20 px-2.5 py-1 rounded-lg text-[10px] font-bold text-black z-10">
                                ENHANCED AFTER
                              </span>
                              <img
                                src={enhancedImage || originalImage}
                                alt="After"
                                className="max-w-full max-h-full object-contain pointer-events-none"
                                style={{
                                  transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Drag and Drop Cover over container in active states */}
                        {isProcessing && (
                          <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8 text-center">
                            <div className="relative w-24 h-24 mb-6">
                              {/* Glowing spin progress */}
                              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
                              <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 animate-spin" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 font-display">Enhancing Image Quality</h3>
                            <p className="text-slate-400 text-sm max-w-xs mb-4">
                              Applying Lanczos3 interpolation & digital edge-sharpening matrices...
                            </p>
                            <div className="w-48 bg-white/5 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                                style={{ width: `${processingProgress}%` }}
                              />
                            </div>
                            <span className="block text-xs font-mono text-gray-500 mt-2">
                              Est. remaining time: {estimatedTime}s
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Meta information Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Original Meta card */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                          <FileImage className="w-3.5 h-3.5" /> Source Metadata
                        </h4>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm font-medium">
                          <div className="text-slate-500">File Type:</div>
                          <div className="text-slate-200 text-right">{metadata?.type}</div>
                          <div className="text-slate-500">Dimensions:</div>
                          <div className="text-slate-200 text-right">{metadata?.width} x {metadata?.height}</div>
                          <div className="text-slate-500">File Size:</div>
                          <div className="text-slate-200 text-right">
                            {metadata ? (metadata.size / 1024 / 1024).toFixed(2) : 0} MB
                          </div>
                          <div className="text-slate-500">Aspect Ratio:</div>
                          <div className="text-slate-200 text-right">{metadata?.aspectRatio}</div>
                        </div>
                      </div>

                      {/* Enhanced Meta card */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" /> Enhanced Output
                        </h4>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm font-medium">
                          <div className="text-slate-500">Output Dimensions:</div>
                          <div className="text-slate-200 text-right">
                            {enhancedMetadata ? `${enhancedMetadata.width} x ${enhancedMetadata.height}` : "Pending compile"}
                          </div>
                          <div className="text-slate-500">Output Size:</div>
                          <div className="text-slate-200 text-right">
                            {enhancedMetadata ? `${(enhancedMetadata.size / 1024 / 1024).toFixed(2)} MB` : "Pending compile"}
                          </div>
                          <div className="text-slate-500">Watermark:</div>
                          <div className="text-cyan-400 text-right font-semibold">FREE / NO WATERMARK</div>
                          <div className="text-slate-500">Color Profile:</div>
                          <div className="text-cyan-400 text-right">sRGB Lossless Preservation</div>
                        </div>
                      </div>
                    </div>

                    {/* AI Smart Analyzer Board */}
                    {aiProfile && (
                      <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-cyan-400" /> AI Vision Diagnostics Profile
                          </h4>
                          <span className="text-xs bg-cyan-500/20 text-cyan-300 font-semibold px-2.5 py-1 rounded-full border border-cyan-500/30">
                            Category: {aiProfile.detectedType}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{aiProfile.detailedReview}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-cyan-500/10">
                          <div>
                            <span className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                              Detected Deficiencies
                            </span>
                            <ul className="space-y-1.5 text-xs text-slate-400 font-medium">
                              {aiProfile.issues.map((issue, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                              Recommended Adjustments
                            </span>
                            <ul className="space-y-1.5 text-xs text-slate-400 font-medium">
                              {aiProfile.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Controls Board (Col 4) */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Clear controls card */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl">
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-cyan-400" /> Process Parameters
                        </h3>
                        <button
                          onClick={clearImage}
                          className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-2.5 py-1.5 rounded-xl transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Clear
                        </button>
                      </div>

                      {/* AI Analyze Action button */}
                      <button
                        onClick={runAiAnalysis}
                        disabled={isAnalyzing}
                        className="w-full flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 py-3 rounded-2xl text-sm font-bold shadow-md transition disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        {isAnalyzing ? "AI Analyzing Context..." : "Smart AI Diagnosis"}
                      </button>

                      {/* Presets List */}
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                          Select Correction Profile
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "original", label: "Original Reset" },
                            { id: "auto", label: "Auto Enhance" },
                            { id: "landscape", label: "Landscape HDR" },
                            { id: "portrait", label: "Portrait Smooth" },
                            { id: "lowlight", label: "Low Light Fix" },
                            { id: "text", label: "Document Sharp" }
                          ].map((preset) => (
                            <button
                              key={preset.id}
                              onClick={() => applyPreset(preset.id)}
                              className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition ${
                                activePreset === preset.id
                                  ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow"
                                  : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Upscale Select */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Resolution Upscale
                          </span>
                          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border border-cyan-500/20">
                            Lanczos3 Kernel
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { val: 1, label: "1x" },
                            { val: 2, label: "2x" },
                            { val: 4, label: "4x" },
                            { val: 8, label: "8x" }
                          ].map((up) => (
                            <button
                              key={up.val}
                              onClick={() => setParams((prev) => ({ ...prev, upscale: up.val as any }))}
                              className={`py-2 rounded-xl text-xs font-mono font-bold border transition ${
                                params.upscale === up.val
                                  ? "bg-cyan-500 border-cyan-400 text-[#050505] shadow-lg shadow-cyan-500/20"
                                  : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                              }`}
                            >
                              {up.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Parameter Sliders */}
                      <div className="space-y-4">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-white/10">
                          Dynamic Sliders
                        </span>

                        {/* Brightness */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Brightness</span>
                            <span className="text-cyan-400 font-mono">{params.brightness}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={params.brightness}
                            onChange={(e) => {
                              setParams((prev) => ({ ...prev, brightness: parseInt(e.target.value, 10) }));
                              setActivePreset("custom");
                            }}
                            className="w-full accent-cyan-500 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* Contrast */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Contrast</span>
                            <span className="text-cyan-400 font-mono">{params.contrast}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={params.contrast}
                            onChange={(e) => {
                              setParams((prev) => ({ ...prev, contrast: parseInt(e.target.value, 10) }));
                              setActivePreset("custom");
                            }}
                            className="w-full accent-cyan-500 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* Saturation */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Saturation</span>
                            <span className="text-cyan-400 font-mono">{params.saturation}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={params.saturation}
                            onChange={(e) => {
                              setParams((prev) => ({ ...prev, saturation: parseInt(e.target.value, 10) }));
                              setActivePreset("custom");
                            }}
                            className="w-full accent-cyan-500 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* Sharpness */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Sharpness (High-Pass)</span>
                            <span className="text-cyan-400 font-mono">+{params.sharpness}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={params.sharpness}
                            onChange={(e) => {
                              setParams((prev) => ({ ...prev, sharpness: parseInt(e.target.value, 10) }));
                              setActivePreset("custom");
                            }}
                            className="w-full accent-cyan-500 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* Noise Reduction */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Noise Removal (Smooth)</span>
                            <span className="text-cyan-400 font-mono">+{params.denoise}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={params.denoise}
                            onChange={(e) => {
                              setParams((prev) => ({ ...prev, denoise: parseInt(e.target.value, 10) }));
                              setActivePreset("custom");
                            }}
                            className="w-full accent-cyan-500 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* HDR Power */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">HDR Tone Recover</span>
                            <span className="text-cyan-400 font-mono">+{params.hdr}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={params.hdr}
                            onChange={(e) => {
                              setParams((prev) => ({ ...prev, hdr: parseInt(e.target.value, 10) }));
                              setActivePreset("custom");
                            }}
                            className="w-full accent-cyan-500 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* Vibrance */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Smart Vibrance Boost</span>
                            <span className="text-cyan-400 font-mono">+{params.vibrance}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={params.vibrance}
                            onChange={(e) => {
                              setParams((prev) => ({ ...prev, vibrance: parseInt(e.target.value, 10) }));
                              setActivePreset("custom");
                            }}
                            className="w-full accent-cyan-500 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* Color Temp */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Color Temperature</span>
                            <span className="text-cyan-400 font-mono">
                              {params.colorTemp > 0 ? `+${params.colorTemp} Warm` : params.colorTemp < 0 ? `${params.colorTemp} Cool` : "Neutral"}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={params.colorTemp}
                            onChange={(e) => {
                              setParams((prev) => ({ ...prev, colorTemp: parseInt(e.target.value, 10) }));
                              setActivePreset("custom");
                            }}
                            className="w-full accent-cyan-500 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Smart Toggle checkboxes */}
                      <div className="space-y-3 pt-2 border-t border-white/10">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={params.smoothSkin}
                            onChange={(e) => setParams((prev) => ({ ...prev, smoothSkin: e.target.checked }))}
                            className="rounded accent-cyan-500 w-4 h-4"
                          />
                          <span className="text-xs font-medium text-slate-300">Skin Smoothing (Bilateral Filter)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={params.faceEnhance}
                            onChange={(e) => setParams((prev) => ({ ...prev, faceEnhance: e.target.checked }))}
                            className="rounded accent-cyan-500 w-4 h-4"
                          />
                          <span className="text-xs font-medium text-slate-300">Facial Definition Enhancement</span>
                        </label>
                      </div>

                      {/* Trigger enhancement execute */}
                      <button
                        onClick={applyEnhancements}
                        disabled={isProcessing}
                        className="w-full relative py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-2xl text-sm shadow-lg shadow-cyan-500/15 transition-all duration-300 hover:shadow-cyan-500/25 active:scale-[0.98]"
                      >
                        Apply Parameters & Recompile
                      </button>
                    </div>

                    {/* Export / Download Configuration Card */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Download className="w-4 h-4 text-cyan-400" /> Export Configuration
                      </h3>

                      {/* Output format picker */}
                      <div className="space-y-2">
                        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Output Format
                        </span>
                        <div className="grid grid-cols-4 gap-2">
                          {["png", "jpeg", "webp", "avif"].map((fmt) => (
                            <button
                              key={fmt}
                              onClick={() => setOutputFormat(fmt as any)}
                              className={`py-1.5 rounded-xl text-xs font-bold uppercase transition border ${
                                outputFormat === fmt
                                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                                  : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                              }`}
                            >
                              {fmt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quality slider */}
                      {outputFormat !== "png" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Encoding Quality</span>
                            <span className="text-cyan-400 font-mono">{quality}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                            className="w-full accent-cyan-500 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      )}

                      {/* Custom filename input */}
                      <div className="space-y-2">
                        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Save File As
                        </span>
                        <input
                          type="text"
                          value={customFilename}
                          onChange={(e) => setCustomFilename(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition"
                          placeholder="Filename..."
                        />
                      </div>

                      <button
                        onClick={executeDownload}
                        className="w-full py-4 bg-white hover:bg-slate-100 text-[#050505] font-extrabold rounded-2xl text-sm transition shadow-lg flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4 text-cyan-600" /> Export Clean Image File
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* View: FEATURES */}
          {activeView === "features" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 max-w-5xl mx-auto space-y-12"
            >
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-display">
                  State-of-the-Art Core Features
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Powered by custom C-compiled Libvips graphics processing kernels and smart Gemini diagnosis model.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Lanczos3 Interpolation",
                    desc: "An advanced math convolution mapping pixel curve paths, reducing aliasing, blur, and jagged edges on scale-up."
                  },
                  {
                    title: "Adaptive Sharp Masking",
                    desc: "High-pass kernel matrices boost high-contrast details along image borders without causing glowing halo artifacts."
                  },
                  {
                    title: "Bilateral Skin Smoother",
                    desc: "Intelligently wipes noise speckles in flat skin color zones while preserving hairs, eyes, and fabrics sharply."
                  },
                  {
                    title: "HDR Tone Recovery",
                    desc: "Expands contrast dynamic thresholds, rescuing lost details in heavy shadows and bright highlights alike."
                  },
                  {
                    title: "Vibrance Mapping",
                    desc: "Intelligently raises saturation only on dull, under-saturated hues to prevent skin pigment burnout."
                  },
                  {
                    title: "Gemini Quality Diagnosis",
                    desc: "Our integrated LLM analyzes uploading files to return custom deficiencies lists and optimal sliders configurations."
                  }
                ].map((feat, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 hover:border-cyan-500/30 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                      <Zap className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{feat.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* View: ABOUT */}
          {activeView === "about" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 max-w-3xl mx-auto space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-display">Our Core Mission</h2>
                <p className="text-cyan-400 font-bold uppercase tracking-wider text-xs">High-Fidelity Free Visual Tools for Everyone</p>
              </div>
              <p className="text-slate-300 text-base leading-relaxed">
                ImageQualityEnhancer was founded in 2026 by an independent collective of passionate software architects, DevOps engineers, and digital design specialists.
                Our goal is to challenge commercial SaaS models that enforce restrictive credit barriers, forced registration logins, and paywalls just to process basic image resolution scales.
              </p>
              <p className="text-slate-300 text-base leading-relaxed">
                We believe top-tier graphics processing and mathematical upscaling kernels should be freely accessible in-browser to all users. By leveraging high-speed cloud container architectures and local browser storage patterns, we maintain a secure environment where files remain entirely confidential.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-start gap-4">
                <Shield className="w-8 h-8 text-cyan-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-base font-bold text-white mb-1">Our Privacy Commitment</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We never sell, analyze, or archive raw or enhanced graphic files. Images are loaded as memory streams, computed dynamically, and immediately wiped on connection closed or refresh.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* View: PRICING */}
          {activeView === "pricing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 max-w-4xl mx-auto space-y-12"
            >
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-display">Free Forever Plan</h2>
                <p className="text-slate-400">No premium tiers. No credit cards required. Just instant utilities.</p>
              </div>

              <div className="bg-white/5 border border-cyan-500/20 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-cyan-500 text-black font-extrabold text-[10px] uppercase tracking-wider py-1.5 px-4 rounded-bl-xl">
                  Active tier
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-white">Infinite Creative Pack</h3>
                  <p className="text-xs text-cyan-400 mt-1">Unlimited uploads and compilations</p>
                </div>
                <div className="text-4xl font-black text-white">$0 <span className="text-base text-slate-500 font-normal">/ lifetime</span></div>

                <div className="border-t border-white/10 pt-6 space-y-3 text-left max-w-xs mx-auto text-sm text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" /> Zero Watermarks
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" /> Up to 8x scale-ups
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" /> Fully custom dynamic sliders
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" /> Gemini Vision diagnosis integration
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" /> No signup required
                  </div>
                </div>

                <button
                  onClick={() => setActiveView("enhancer")}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl text-sm transition hover:scale-105 shadow-lg shadow-cyan-500/15"
                >
                  Start Uploading Now
                </button>
              </div>
            </motion.div>
          )}

          {/* View: FAQ */}
          {activeView === "faq" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 max-w-4xl mx-auto space-y-10"
            >
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-display">Frequently Asked Questions</h2>
                <p className="text-slate-400">Search over 60 direct detailed answers about our enhancement pipeline.</p>
              </div>

              {/* Filtering / Search Controls */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
                    placeholder="Search FAQs (e.g., AVIF, upscale, print)..."
                  />
                </div>
                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none shrink-0">
                  {faqCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFaqCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                        faqCategory === cat
                          ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Faq Grid list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-cyan-500/20">
                        {item.category}
                      </span>
                      <h4 className="text-base font-bold text-white pt-1">{item.question}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-slate-500 py-12">
                    No FAQs matched your query. Try searching for other keywords.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* View: BLOG */}
          {activeView === "blog" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 max-w-6xl mx-auto space-y-10"
            >
              {!selectedPost ? (
                <>
                  <div className="text-center space-y-3">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-display">AI Enhancement Journal</h2>
                    <p className="text-slate-400">Discover 50 complete expert-level guides, comparisons, and processing tips.</p>
                  </div>

                  {/* Filter and Search */}
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={blogSearch}
                        onChange={(e) => setBlogSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
                        placeholder="Search posts..."
                      />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none shrink-0">
                      {blogCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setBlogCategory(cat)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                            blogCategory === cat
                              ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow"
                              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredBlogPosts.length > 0 ? (
                      filteredBlogPosts.map((post, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedPost(post)}
                          className="group cursor-pointer bg-white/5 border border-white/10 hover:border-cyan-500/30 rounded-3xl p-6 space-y-4 hover:bg-white/[0.01] transition duration-300 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                              <span>{post.category}</span>
                              <span className="text-slate-500 font-mono">{post.readTime}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition">
                              {post.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                              {post.excerpt}
                            </p>
                          </div>
                          <div className="flex items-center text-xs font-bold text-cyan-400 pt-3 border-t border-white/10">
                            Read Article <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 text-center text-slate-500 py-12">
                        No articles match your search parameters.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Article Reader Overlay */
                <div className="max-w-3xl mx-auto space-y-6">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-3 py-2 rounded-xl border border-cyan-500/20 transition"
                  >
                    ← Back to Blog list
                  </button>

                  <div className="space-y-4">
                    <div className="flex gap-4 items-center text-xs font-bold text-cyan-400 uppercase tracking-widest">
                      <span>{selectedPost.category}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-500 font-mono">{selectedPost.date}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-500 font-mono">{selectedPost.readTime}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white leading-tight font-display">
                      {selectedPost.title}
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg italic border-l-2 border-cyan-500 pl-4 py-1">
                      {selectedPost.excerpt}
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-6 text-gray-300 space-y-6 text-sm md:text-base leading-relaxed font-normal">
                    {selectedPost.content.split("\n\n").map((para, i) => {
                      if (para.startsWith("###")) {
                        return (
                          <h3 key={i} className="text-lg md:text-xl font-bold text-white pt-4">
                            {para.replace("###", "").trim()}
                          </h3>
                        );
                      }
                      if (para.startsWith("-") || para.startsWith("*") || para.startsWith("1.")) {
                        return (
                          <ul key={i} className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                            {para
                              .split("\n")
                              .map((item, idx) => (
                                <li key={idx}>
                                  {item.replace(/^[-*]|\d+\./, "").trim()}
                                </li>
                              ))}
                          </ul>
                        );
                      }
                      return <p key={i}>{para}</p>;
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* View: CONTACT */}
          {activeView === "contact" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 max-w-lg mx-auto space-y-8"
            >
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-display">Contact Support</h2>
                <p className="text-slate-400 text-sm">Have feature suggestions, custom questions, or bugs reports?</p>
              </div>

              <form onSubmit={handleContactSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl">
                {contactSubmitted ? (
                  <div className="text-center py-12 space-y-3">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h3 className="text-lg font-bold text-white">Message Transmitted</h3>
                    <p className="text-slate-400 text-sm">We appreciate your feedback and will reach out if needed.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Detailed Message</label>
                      <textarea
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition"
                        placeholder="Suggest features or report errors..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl text-sm shadow shadow-cyan-500/15 transition hover:scale-105"
                    >
                      Send Message
                    </button>
                  </>
                )}
              </form>
            </motion.div>
          )}

          {/* View: PRIVACY POLICY */}
          {activeView === "privacy" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 max-w-3xl mx-auto space-y-6"
            >
              <h2 className="text-3xl font-black text-white font-display">Privacy Policy</h2>
              <span className="text-xs text-slate-500 font-mono">Effective: July 15, 2026</span>
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-normal">
                <p>
                  At ImageQualityEnhancer, user privacy is our core mandate. We have structured our system so that we do not collect, store, archive, or inspect the photos or image files that you upload.
                </p>
                <h3 className="text-base font-bold text-white pt-2">1. In-Memory Data Processing</h3>
                <p>
                  Your images are parsed purely inside active memory registers, processed dynamically through optimized compilation kernels, and returned to your browser. No files are written to server hard disks, and all trace indicators are wiped when your session or tab is closed.
                </p>
                <h3 className="text-base font-bold text-white pt-2">2. No Analytics Tracking</h3>
                <p>
                  We do not execute tracking cookies, user profiling logs, or third-party behavioral scrapers on our interface. Your usage metrics are anonymous.
                </p>
              </div>
            </motion.div>
          )}

          {/* View: TERMS OF SERVICE */}
          {activeView === "terms" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 max-w-3xl mx-auto space-y-6"
            >
              <h2 className="text-3xl font-black text-white font-display">Terms of Service</h2>
              <span className="text-xs text-slate-500 font-mono">Effective: July 15, 2026</span>
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-normal">
                <p>
                  By accessing and using ImageQualityEnhancer, you agree to comply with the terms specified here.
                </p>
                <h3 className="text-base font-bold text-white pt-2">1. Acceptable Usage</h3>
                <p>
                  This tool is provided completely free of charge for individual personal or commercial graphics editing. You must not attempt to upload corrupted, executable, malware, or malicious script binaries into our endpoint ports.
                </p>
                <h3 className="text-base font-bold text-white pt-2">2. Proprietary Rights</h3>
                <p>
                  We assert zero intellectual claim over your uploaded or enhanced images. You retain full copyright, commercial distribution licenses, and permissions for all compiled results.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Clean Footer */}
      <footer className="border-t border-white/10 bg-[#050508]/80 backdrop-blur-md py-12 px-6 mt-16 text-center space-y-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <span className="font-extrabold text-base text-white">ImageQualityEnhancer</span>
            <p className="text-xs text-slate-500 mt-1">
              Completely free, watermark-free AI image enhancement and resolution upscaling tool.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-400">
            <button onClick={() => setActiveView("features")} className="hover:text-white transition">Features</button>
            <button onClick={() => setActiveView("about")} className="hover:text-white transition">About Us</button>
            <button onClick={() => setActiveView("pricing")} className="hover:text-white transition">Pricing</button>
            <button onClick={() => setActiveView("faq")} className="hover:text-white transition">FAQ Accordion</button>
            <button onClick={() => setActiveView("blog")} className="hover:text-white transition">Blog articles</button>
            <button onClick={() => setActiveView("privacy")} className="hover:text-white transition">Privacy Policy</button>
            <button onClick={() => setActiveView("terms")} className="hover:text-white transition">Terms of Service</button>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 font-mono">
          &copy; 2026 ImageQualityEnhancer Collective. All rights reserved. Zero watermarks, zero tracking, zero limits.
        </p>
      </footer>
    </div>
  );
}
