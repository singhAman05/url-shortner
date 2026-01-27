"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Link,
  Calendar,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Zap,
  Shield,
  Sparkles,
} from "lucide-react";

import { Variants } from "framer-motion";

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [expiryDateTime, setExpiryDateTime] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/url/shorten`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: originalUrl,
            cust_expiry: expiryDateTime
              ? new Date(expiryDateTime).toISOString()
              : null,
          }),
        },
      );

      const result: {
        data: any;
        message?: string;
      } = await res.json();

      if (!res.ok) {
        toast.error(result.message ?? "Failed to shorten URL");
        return;
      }

      setShortUrl(result.data.short_key);

      toast.success(result.message ?? "URL shortened successfully");
    } catch (err) {
      console.error(err);
      toast.error("Server unreachable");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;

    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard!", { duration: 1500 });
    setTimeout(() => setCopied(false), 1500);
  };

  const handleRedirect = () => {
    if (!shortUrl) return;
    window.open(shortUrl, "_blank", "noopener,noreferrer");
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const resultVariants: Variants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with animation */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-12 md:py-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 mb-6"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="p-3 bg-linear-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-lg"
            >
              <Link className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Short.ly
            </h1>
          </motion.div>
          <p className="text-lg text-slate-600 dark:text-slate-400 text-center max-w-2xl">
            Create short, memorable links with custom expiry dates
          </p>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Main Form Section - 2/3 width */}
          <div className="md:col-span-2">
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="p-1.5 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg"
                    >
                      <Zap className="h-4 w-4 text-white" />
                    </motion.div>
                    <span className="bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      Shorten Your URL
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Enter your long URL below and set an optional expiry date
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="url"
                          className="flex items-center gap-2"
                        >
                          <Link className="h-4 w-4 text-slate-500" />
                          Original URL
                        </Label>
                        <motion.div whileFocus={{ scale: 1.005 }}>
                          <Input
                            id="url"
                            type="url"
                            placeholder="https://example.com/very-long-url-path"
                            value={originalUrl}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            className="border-slate-300/50 dark:border-slate-700/50 focus:border-slate-900 dark:focus:border-slate-300 transition-all"
                            required
                          />
                        </motion.div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="expiry"
                          className="flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4 text-slate-500" />
                          Expiry Date & Time (Optional)
                        </Label>
                        <motion.div whileFocus={{ scale: 1.005 }}>
                          <Input
                            id="expiry"
                            type="datetime-local"
                            value={expiryDateTime}
                            onChange={(e) => setExpiryDateTime(e.target.value)}
                            className="border-slate-300/50 dark:border-slate-700/50 focus:border-slate-900 dark:focus:border-slate-300 transition-all"
                            min={new Date().toISOString().slice(0, 16)}
                          />
                        </motion.div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Leave empty for no expiration
                        </p>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button
                        type="submit"
                        className="w-full bg-linear-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 dark:from-slate-800 dark:to-slate-700 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all shadow-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                            </motion.div>
                            Shortening...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Short URL
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>

                  {/* Result Section */}
                  <AnimatePresence>
                    {shortUrl && (
                      <motion.div
                        variants={resultVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="mt-8 space-y-4"
                      >
                        <div className="p-4 bg-linear-to-r from-slate-50/50 to-white/50 dark:from-slate-900/30 dark:to-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="p-2 bg-linear-to-br from-green-500 to-emerald-500 rounded-lg"
                              >
                                <Check className="h-4 w-4 text-white" />
                              </motion.div>
                              <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                  Your short URL:
                                </p>
                                <a
                                  href={shortUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors break-all"
                                >
                                  {shortUrl}
                                </a>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleCopy}
                                  className="border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                >
                                  {copied ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleRedirect}
                                  className="border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </div>

                          {expiryDateTime && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                            >
                              <Clock className="h-4 w-4" />
                              <span>
                                Expires:{" "}
                                {new Date(expiryDateTime).toLocaleString()}
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                <CardHeader>
                  <CardTitle className="text-lg">Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="p-2 bg-linear-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                      <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        Instant Shortening
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Get your short URL in seconds
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="p-2 bg-linear-to-br from-green-500/10 to-emerald-600/10 rounded-lg">
                      <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        Custom Expiry
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Set precise expiration date & time
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="p-2 bg-linear-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                      <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        Secure Links
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        All URLs are encrypted and safe
                      </p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* How to Use Card */}
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                <CardHeader>
                  <CardTitle className="text-lg">How to Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">1</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Paste your long URL in the input field
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">2</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Set expiration date/time (optional)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">3</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Click generate and share your short link
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 text-center"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Built with Next.js • Tailwind CSS • Shadcn UI • Framer Motion
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
