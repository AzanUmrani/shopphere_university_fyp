import { CartPage as CartPageComponent } from "../components/cart";

const CartPage = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fff7ed_0%,_#fdf2f8_45%,_#f8fafc_100%)] px-3 py-4 dark:bg-[linear-gradient(135deg,_#111827_0%,_#1f2937_45%,_#0f172a_100%)] sm:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <CartPageComponent />
      </div>
    </div>
  );
};

export default CartPage;
