"use client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Share2,
  Bookmark,
} from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

interface BlogPostProps {
  post: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    tags: string[];
  };
}

export function BlogPost({ post }: BlogPostProps) {
  const [isSaved, setIsSaved] = useState(false);

  // 🧠 تحقق عند التحميل إذا المقال محفوظ
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedPosts") || "[]");
    const exists = saved.some((item: any) => item.title === post.title);
    setIsSaved(exists);
  }, [post.title]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      calendar: "gregory", // 👈 مهم جداً لتثبيت التقويم الميلادي
    });
    return formatter.format(date);
  };

  // دالة المشاركة
  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("تمت المشاركة بنجاح ✅");
      } catch (err) {
        console.error("فشل المشاركة:", err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("📋 تم نسخ رابط المقال للحافظة");
    }
  };

  // دالة الحفظ
  const handleToggleSave = () => {
    const saved = JSON.parse(localStorage.getItem("savedPosts") || "[]");
    const exists = saved.some((item: any) => item.title === post.title);

    if (exists) {
      // ❌ إزالة من المحفوظات
      const updated = saved.filter((item: any) => item.title !== post.title);
      localStorage.setItem("savedPosts", JSON.stringify(updated));
      setIsSaved(false);
      toast("🗑️ تم إزالة المقال من المفضلة", { position: "top-center" });
    } else {
      // ✅ إضافة إلى المحفوظات
      saved.push(post);
      localStorage.setItem("savedPosts", JSON.stringify(saved));
      setIsSaved(true);
      toast.success(" تم حفظ المقال في المفضلة", { position: "top-center" });
    }
  };

  // 🕊️ مشاركة على تويتر
  const handleShareTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      post.title
    )}&url=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, "_blank");
  };

  // 💼 مشاركة على لينكدإن
  const handleShareLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-accent/10 to-background py-20 pt-32">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link
                href="/"
                className="hover:text-primary transition-colors arabic-text"
              >
                الرئيسية
              </Link>
              <span>/</span>
              <Link
                href="/blog"
                className="hover:text-primary transition-colors arabic-text"
              >
                المدونة
              </Link>
              <span>/</span>
              <span className="text-foreground arabic-text">{post.title}</span>
            </nav>

            {/* Category & Date */}
            <div className="flex items-center gap-4 mb-8">
              <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg arabic-text">
                {post.category}
              </Badge>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="arabic-text">
                  {post.date
                    ? new Date(post.date).toLocaleDateString(
                        "ar-SA-u-ca-gregory",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : ""}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-8 leading-tight arabic-text">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 arabic-text">
              {post.excerpt}
            </p>

            {/* Author & Meta Info */}
            <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-lg">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground arabic-text">
                      {post.author}
                    </p>
                    <p className="text-sm text-muted-foreground arabic-text">
                      كاتب متخصص
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="arabic-text">{post.readTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                >
                  <Share2 className="h-4 w-4 ml-2" />
                  <span className="arabic-text">مشاركة</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleSave}
                  className={`transition-all duration-300 hover:bg-accent/5 hover:border-accent/30 ${
                    isSaved ? "border-accent text-accent" : ""
                  }`}
                >
                  <Bookmark
                    className={`h-4 w-4 ml-2 transition-colors duration-300 ${
                      isSaved ? "fill-accent text-accent" : ""
                    }`}
                  />
                  <span className="arabic-text">
                    {" "}
                    {isSaved ? "تم الحفظ" : "حفظ"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-12 hover:bg-primary/5 transition-all duration-300 arabic-text"
            asChild
          >
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 rtl-flip" />
              العودة للمدونة
            </Link>
          </Button>

          {/* Featured Image */}
          <div className="aspect-video overflow-hidden rounded-2xl mb-16 shadow-2xl">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-all duration-300 arabic-text"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Article Content */}
          <div className="prose prose-lg prose-slate max-w-none arabic-text">
            {post.content ? (
              <div
                className="space-y-8 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{
                  direction: "rtl",
                  textAlign: "right",
                  lineHeight: "2",
                  fontSize: "1.125rem",
                }}
              />
            ) : (
              <div className="space-y-8 leading-relaxed text-muted-foreground arabic-text text-center py-20">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <p className="text-xl">المحتوى غير متوفر حالياً</p>
                <p className="text-sm">نعمل على إضافة المحتوى قريباً</p>
              </div>
            )}
          </div>

          {/* Social Share */}
          <div className="flex items-center justify-center gap-4 my-16 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10">
            <span className="text-foreground font-medium arabic-text">
              شارك المقال:
            </span>
            <div className="flex gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={handleShareTwitter}
                className="hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
              >
                <Share2 className="h-4 w-4 ml-2" />
                <span className="arabic-text">تويتر</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleShareLinkedIn}
                className="hover:bg-accent/10 hover:border-accent/30 transition-all duration-300"
              >
                <Share2 className="h-4 w-4 ml-2" />
                <span className="arabic-text">لينكدإن</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleToggleSave}
                className={`transition-all duration-300 hover:bg-accent/5 hover:border-accent/30 ${
                  isSaved ? "border-accent text-accent" : ""
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ml-2 transition-colors duration-300 ${
                    isSaved ? "fill-accent text-accent" : ""
                  }`}
                />
                <span className="arabic-text">
                  {isSaved ? "تم الحفظ" : "حفظ"}
                </span>
              </Button>
            </div>
          </div>

          {/* Call to Action */}
          <Card className="mt-20 overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10">
            <CardContent className="p-12 text-center relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>

              <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <User className="h-10 w-10 text-white" />
              </div>

              <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-6 arabic-text">
                هل أعجبك المقال؟
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed arabic-text">
                تواصل معنا لمناقشة مشروعك القادم والحصول على استشارة مجانية من
                خبراء بصمة تصميم
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 !text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 arabic-text"
                  asChild
                >
                  <Link href="/contact" className="flex items-center gap-2">
                    <span>تواصل معنا الآن</span>
                    <ArrowRight className="h-5 w-5 rtl-flip" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/5 transition-all duration-300 arabic-text !text-[#7a4db3]"
                  asChild
                >
                  <Link href="/services">تصفح خدماتنا</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
