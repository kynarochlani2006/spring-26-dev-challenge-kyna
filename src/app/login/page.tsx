import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AuthView from "@/components/AuthView";

const navItems = ["Women", "Men", "Kids", "Classics", "Sport", "Sale"];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader navItems={navItems} />
      <main>
        <AuthView mode="login" />
      </main>
      <SiteFooter />
    </div>
  );
}
