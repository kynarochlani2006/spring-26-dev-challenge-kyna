import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WishlistView from "@/components/WishlistView";

const navItems = ["Women", "Men", "Kids", "Classics", "Sport", "Sale"];

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader navItems={navItems} />
      <main>
        <WishlistView />
      </main>
      <SiteFooter />
    </div>
  );
}
