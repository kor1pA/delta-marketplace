import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FeaturedProducts } from "@/components/featured-products"
import { Categories } from "@/components/categories"
import { UserNav } from "@/components/auth/user-nav"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { Locale } from "@/i18n/config"

// Принимаем функцию перевода и локаль через пропсы
export default function HomePage({
  t,
  locale,
}: {
  t: (key: string) => string
  locale: Locale
}) {
  return (
    <div className="home-container">
      <header className="main-header">
        <div className="header-container">
          <Link href={`/${locale}`} className="logo">
            <span style={{ color: "var(--primary)" }}>Delta</span>{" "}
            <span style={{ color: "var(--accent)" }}>Market</span>
            <span style={{ color: "var(--secondary)" }}>place</span>
          </Link>
          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" />
              <Input type="search" placeholder={t("common.search")} className="search-input" />
            </div>
            <nav className="main-nav">
              <Link href={`/${locale}/products`} className="nav-link">
                {t("navigation.products")}
              </Link>
              <Link href={`/${locale}/categories`} className="nav-link">
                {t("navigation.categories")}
              </Link>
              <Link href={`/${locale}/deals`} className="nav-link">
                {t("navigation.deals")}
              </Link>
            </nav>
            <div className="user-controls">
              <LanguageSwitcher />
              <UserNav />
            </div>
          </div>
        </div>
      </header>
      <main className="main-content">
        <section className="hero-section">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">{t("home.heroTitle")}</h1>
                <p className="hero-description">{t("home.heroDescription")}</p>
                <div className="hero-buttons">
                  <Link href={`/${locale}/products`}>
                    <Button size="lg" className="shop-now-btn">
                      {t("home.shopNow")}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/categories`}>
                    <Button size="lg" variant="outline" className="browse-categories-btn">
                      {t("home.browseCategories")}
                    </Button>
                  </Link>
                </div>
              </div>
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Delta Marketplace Hero"
                className="hero-image"
                width={600}
                height={400}
              />
            </div>
          </div>
        </section>
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t("home.featuredCategories")}</h2>
              <p className="section-description">{t("home.featuredCategoriesDesc")}</p>
            </div>
            <Categories />
          </div>
        </section>
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t("home.featuredProducts")}</h2>
              <p className="section-description">{t("home.featuredProductsDesc")}</p>
            </div>
            <FeaturedProducts />
          </div>
        </section>
      </main>
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">{t("common.appName")}</div>
            <p className="footer-tagline">{t("common.tagline")}</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <div className="footer-heading">{t("footer.company")}</div>
              <nav className="footer-nav">
                <Link href={`/${locale}#`} className="footer-link">
                  {t("footer.about")}
                </Link>
                <Link href={`/${locale}#`} className="footer-link">
                  {t("footer.careers")}
                </Link>
                <Link href={`/${locale}#`} className="footer-link">
                  {t("footer.contact")}
                </Link>
              </nav>
            </div>
            <div className="footer-column">
              <div className="footer-heading">{t("footer.help")}</div>
              <nav className="footer-nav">
                <Link href={`/${locale}#`} className="footer-link">
                  {t("footer.customerSupport")}
                </Link>
                <Link href={`/${locale}#`} className="footer-link">
                  {t("footer.shippingReturns")}
                </Link>
                <Link href={`/${locale}#`} className="footer-link">
                  {t("footer.faq")}
                </Link>
              </nav>
            </div>
            <div className="footer-column">
              <div className="footer-heading">{t("footer.legal")}</div>
              <nav className="footer-nav">
                <Link href={`/${locale}#`} className="footer-link">
                  {t("footer.termsOfService")}
                </Link>
                <Link href={`/${locale}#`} className="footer-link">
                  {t("footer.privacyPolicy")}
                </Link>
                <Link href={`/${locale}#`} className="footer-link">
                  {t("footer.cookiePolicy")}
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
