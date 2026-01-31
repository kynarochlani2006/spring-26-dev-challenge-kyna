import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CartView from "@/components/CartView";

const navItems = ["Women", "Men", "Kids", "Classics", "Sport", "Sale"];

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader navItems={navItems} />
      <main>
        <CartView />
      </main>
      <SiteFooter />
    </div>
  );
}
