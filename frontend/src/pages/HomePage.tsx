import { Link } from "react-router-dom";
import {
  ShoppingCart,
  ArrowRight,
  Star,
  Truck,
  Shield,
  Headphones,
  RotateCcw,
  Play,
  CheckCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchProducts,
  fetchCategories,
  setFeaturedProducts,
} from "../store/slices/productSlice";
import { mockProducts, mockCategories } from "../utils/mockData";
import { useEffect, useState } from "react";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/ui/Button";
import Slider from "../components/ui/Slider";
import FadingSlider from "../components/ui/FadingSlider";
import VideoModal from "../components/ui/VideoModal";
import ProductDemo from "../components/ui/ProductDemo";
import DiscountedProductsSection from "../components/sections/DiscountedProductsSection";
import {
  TopBanner,
  SeasonalPromoAd,
  BrandSpotlightAd,
  FooterCtaAd,
  ProductDemoVideoAd,
  TutorialYouTubeAd,
} from "../components/ads/AdComponents";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.products);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchProducts({ limit: 20 }));
        await dispatch(fetchCategories());
        await dispatch(fetchProducts({ isFeatured: true, limit: 8 }));
      } catch (error) {
        console.error("Failed to load homepage data:", error);
        dispatch(setFeaturedProducts(mockProducts.filter((p) => p.isFeatured)));
      }
    };
    loadData();
  }, [dispatch]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Thank you for subscribing! You'll receive a confirmation email shortly.");
      setNewsletterEmail("");
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const featuredProductsList = products.filter((p) => p.isFeatured).slice(0, 4);
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);
  const bestSellers = products.slice(0, 4);

  const heroImages = [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop&crop=center",
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div>
        </div>
      )}

      {/* Top Banner */}
      <TopBanner />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-white via-primary-50/70 to-secondary-50 dark:border-gray-800 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 dark:border-primary-800 dark:bg-primary-900/20">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary-500"></span>
                <span className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-400">
                  New Season Sale
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl font-black leading-tight tracking-tight text-gray-900 dark:text-white lg:text-6xl">
                  Shop With{" "}
                  <span className="text-gradient-primary">Confidence</span>
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-gray-500 dark:text-gray-400">
                  Discover curated collections from premium brands with lightning-fast delivery,
                  seamless checkout, and support that feels personal.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/products">
                  <Button size="lg" className="w-full sm:w-auto">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Start Shopping
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Play className="mr-2 h-4 w-4" />
                  See Demo
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { label: "Free shipping over $100", icon: Truck },
                  { label: "60-day returns", icon: RotateCcw },
                  { label: "Secure checkout", icon: Shield },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-2 text-sm text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-300"
                    >
                      <Icon className="h-4 w-4 text-secondary-500" />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right - Image Slider */}
            <div className="relative hidden lg:block">
              <div className="rounded-[28px] border border-white/80 bg-white/80 p-2 shadow-[0_20px_80px_-25px_rgba(15,23,42,0.35)] backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
                <div className="overflow-hidden rounded-[22px] border border-gray-200 dark:border-gray-800">
                  <FadingSlider
                    images={heroImages}
                    autoPlay={true}
                    autoPlayInterval={5000}
                    showDots={false}
                    className="h-full w-full"
                    transitionDuration={1200}
                  />
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 rounded-2xl border border-gray-200 bg-white p-3.5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-2.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current text-amber-400" />
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">4.9/5</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">50K+ reviews</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-5 -top-5 rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-left shadow-lg dark:border-primary-900/40 dark:bg-primary-950/40">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300">
                  Curated picks
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Fresh arrivals weekly</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-gray-950 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 divide-x divide-gray-800">
            {[
              { value: "50K+", label: "Happy Customers" },
              { value: "24/7", label: "Customer Support" },
              { value: "Free", label: "Shipping Available" },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-4 py-2">
                <div className="text-2xl font-bold text-primary-400">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Why Shop With Us
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Premium experience, trusted by thousands
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Truck className="w-6 h-6 text-white" />,
                color: "bg-secondary-500",
                bg: "bg-secondary-50 dark:bg-secondary-900/10",
                title: "Fast Delivery",
                desc: "Free shipping on orders over $100. Delivered within 24 hours to your doorstep.",
              },
              {
                icon: <Shield className="w-6 h-6 text-white" />,
                color: "bg-primary-500",
                bg: "bg-primary-50 dark:bg-primary-900/10",
                title: "Secure Payment",
                desc: "256-bit SSL encryption with fraud protection. Your data is always safe.",
              },
              {
                icon: <Headphones className="w-6 h-6 text-white" />,
                color: "bg-blue-500",
                bg: "bg-blue-50 dark:bg-blue-900/10",
                title: "24/7 Support",
                desc: "AI-powered chatbot + human support team available round the clock.",
              },
              {
                icon: <RotateCcw className="w-6 h-6 text-white" />,
                color: "bg-orange-500",
                bg: "bg-orange-50 dark:bg-orange-900/10",
                title: "Easy Returns",
                desc: "60-day return policy with free pickup. No questions asked, instant refunds.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`${feature.bg} border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-200`}
              >
                <div className={`w-11 h-11 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Demo Video ── */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              See Our Products in Action
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Watch how our premium products can enhance your lifestyle
            </p>
          </div>
          <ProductDemoVideoAd />
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Browse Collections
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Explore our carefully curated categories
              </p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockCategories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-xl h-56 block"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-base leading-tight">
                    {category.name}
                  </h3>
                  <div className="flex items-center mt-1.5 text-white/70 text-xs font-medium">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tutorial YouTube Ad ── */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Learn & Discover More
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Get insider tips and tutorials on making the most of your shopping experience
            </p>
          </div>
          <TutorialYouTubeAd />
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Featured
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Handpicked premium products curated by our experts
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProductsList.map((product: any, index: number) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <ProductCard product={product} variant="featured" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seasonal Promo Ad ── */}
      <section className="py-10 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SeasonalPromoAd />
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Fresh Arrivals
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                The latest trends and innovations, just landed
              </p>
            </div>
            <Link to="/products?filter=new">
              <Button variant="outline" size="sm">
                View New
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {newProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Trending Now
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Most loved by our community this month
              </p>
            </div>
            <Link to="/products?sort=popularity">
              <Button variant="outline" size="sm">
                View Trending
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bestSellers.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Discounted Products ── */}
      <DiscountedProductsSection
        products={mockProducts}
        isVisible={true}
        sectionTitle="Incredible Savings"
        sectionSubtitle="Handpicked products with amazing discounts - Limited time offers you don't want to miss"
        accentColor="emerald"
        maxProducts={8}
        showCountdown={true}
        countdownHours={23}
        countdownMinutes={45}
        countdownSeconds={12}
      />

      {/* ── Flash Sale Slider ── */}
      <section className="py-20 bg-gray-950 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-3">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wide">Flash Sale</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">Hot Deals</h2>
              <p className="text-gray-400 text-sm">
                Don't miss out on these incredible discounts while supplies last
              </p>
            </div>
            {/* Countdown */}
            <div className="flex items-center gap-3 bg-gray-900 dark:bg-gray-800 rounded-xl px-5 py-3 border border-gray-800 dark:border-gray-700">
              {[
                { value: "23", label: "Hrs" },
                { value: "45", label: "Min" },
                { value: "12", label: "Sec" },
              ].map((t, i) => (
                <div key={t.label} className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{t.value}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">{t.label}</div>
                  </div>
                  {i < 2 && <span className="text-gray-600 font-bold">:</span>}
                </div>
              ))}
            </div>
          </div>

          <Slider
            autoPlay={true}
            autoPlayInterval={3500}
            showArrows={true}
            showDots={true}
            className="min-h-80"
            itemsPerView={3}
          >
            {mockProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="px-2.5">
                <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors duration-200">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                      -{Math.floor(Math.random() * 50 + 20)}%
                    </div>
                  </div>
                  <div className="p-3.5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? "text-amber-400 fill-current"
                              : "text-gray-200 dark:text-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-base font-bold text-red-500 dark:text-red-400">
                        ${(product.price * 0.7).toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <Button
                      className="w-full text-xs"
                      size="sm"
                    >
                      Grab Deal
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              What Customers Say
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Join thousands of satisfied customers
            </p>
          </div>

          <Slider
            autoPlay={true}
            autoPlayInterval={4500}
            showArrows={true}
            showDots={false}
            className="min-h-72"
            itemsPerView={1}
          >
            {[
              {
                text: "Amazing quality and lightning fast shipping. I'm impressed with every purchase!",
                name: "Sarah Johnson",
                role: "Fashion Designer",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b000?w=80&h=80&fit=crop&crop=face",
                rating: 5,
              },
              {
                text: "The AI recommendations are spot on. Shopping experience has never been better.",
                name: "Michael Chen",
                role: "Tech Entrepreneur",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
                rating: 5,
              },
              {
                text: "Customer service is exceptional. Returns were hassle-free and super quick!",
                name: "Emily Rodriguez",
                role: "Interior Designer",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
                rating: 5,
              },
              {
                text: "Best online shopping platform I've used. Premium quality at great prices!",
                name: "David Thompson",
                role: "Business Owner",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="px-4">
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 sm:p-12 max-w-3xl mx-auto">
                  <div className="flex justify-center mb-5 gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-8 text-center leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800"
                    />
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* ── Brand Partners ── */}
      <section className="py-14 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Trusted Partners
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Partnering with the world's best brands
            </p>
          </div>

          <Slider
            autoPlay={true}
            autoPlayInterval={2500}
            showArrows={false}
            showDots={false}
            className="h-16"
            itemsPerView={5}
          >
            {[
              { name: "Apple", logo: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png" },
              { name: "Google", logo: "https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png" },
              { name: "Microsoft", logo: "https://logos-world.net/wp-content/uploads/2020/09/Microsoft-Logo.png" },
              { name: "Amazon", logo: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png" },
              { name: "Netflix", logo: "https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png" },
            ].map((brand, index) => (
              <div key={index} className="px-3">
                <div className="flex items-center justify-center h-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-8 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20 bg-gray-950 dark:bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Get Special Offers
          </h2>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            Join our newsletter for exclusive deals, early access to sales, and
            personalized recommendations
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-600 transition-colors"
            />
            <Button
              type="submit"
              disabled={isSubscribing}
              size="md"
            >
              {isSubscribing ? "..." : "Subscribe"}
            </Button>
          </form>
          <p className="text-xs text-gray-600 mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>

          <div className="grid grid-cols-3 gap-8 mt-14 pt-10 border-t border-gray-800">
            {[
              { value: "50K+", label: "Subscribers" },
              { value: "15%", label: "Welcome Offer" },
              { value: "Weekly", label: "New Deals" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-primary-400">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Spotlight Ad ── */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BrandSpotlightAd />
        </div>
      </section>

      {/* ── Footer CTA Ad ── */}
      <section className="py-14 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FooterCtaAd />
        </div>
      </section>

      {/* Modals */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title="ShopSphere Experience Demo"
        description="See how ShopSphere transforms your online shopping journey"
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
        onSwitchToDemo={() => setIsDemoOpen(true)}
      />
      <ProductDemo isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
};

export default HomePage;
