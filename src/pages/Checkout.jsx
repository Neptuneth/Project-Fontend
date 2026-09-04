import { useState } from "react";
import { products } from "../utils/data.js";
import { getCartTotal, saveCart } from "../utils/cart.js";
import { formatPrice, goTo } from "../utils/index.js";
import Icon from "../components/Icon.jsx";

const paymentMethods = [
  {
    value: "Thai QR Payment / Mobile Banking",
    icon: "smartphone",
    title: "Thai QR Payment / Mobile Banking",
    description: "ชำระเงินออนไลน์ผ่านโมบายแบงก์กิ้งทุกธนาคาร",
  },
  {
    value: "บัตรเครดิต",
    icon: "card",
    title: "บัตรเครดิต / เดบิต",
    description: "Visa, Mastercard, JCB พร้อมระบบรักษาความปลอดภัย 3D Secure",
  },
  {
    value: "เก็บเงินปลายทาง",
    icon: "bank",
    title: "บริการเก็บเงินปลายทาง (COD)",
    description: "ชำระด้วยเงินสดเมื่อได้รับสินค้าหน้าบ้านคุณ",
  },
];

export default function Checkout({ cart, setCart }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    payment: paymentMethods[0].value,
  });
  const total = getCartTotal(cart, products);
  const submit = (event) => {
    event.preventDefault();
    if (!cart.size) return alert("ตะกร้าว่างอยู่ ไม่สามารถสั่งซื้อได้");
    localStorage.setItem(
      "shoppe-last-order",
      JSON.stringify({ ...form, items: [...cart], total: formatPrice(total) }),
    );
    setCart(new Map());
    saveCart(new Map());
    alert(`สั่งซื้อสำเร็จแล้ว! ขอบคุณ ${form.name} ที่ช้อปกับเรา`);
    goTo("home");
  };
  return (
    <main className="checkout-page">
      <div className="checkout-layout">
      <section className="checkout-form-card">
        <div className="page-header">
          <h1>ข้อมูลการจัดส่งและชำระเงิน</h1>
        </div>
        <form className="checkout-form" onSubmit={submit}>
          <label>
            ชื่อ-นามสกุล ผู้รับ *
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              placeholder="สมชาย รักดี"
            />
          </label>
          <label>
            เบอร์โทรศัพท์ติดต่อ *
            <input
              required
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              placeholder="081-234-5678"
            />
          </label>
          <label>
            ที่อยู่การจัดส่งอย่างละเอียด *
            <textarea
              required
              rows="4"
              value={form.address}
              onChange={(event) =>
                setForm({ ...form, address: event.target.value })
              }
              placeholder="ชั้น 4 อาคารเรียนวิทยาการคอมพิวเตอร์ ถนนพัฒนาการ แขวงสวนหลวง เขตสวนหลวง กรุงเทพมหานคร 10250"
            />
          </label>
          <fieldset className="payment-fieldset">
            <legend>วิธีการชำระเงิน</legend>
            <div className="payment-options">
              {paymentMethods.map((method) => (
                <label
                  className={`payment-option ${form.payment === method.value ? "selected" : ""}`}
                  key={method.value}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={form.payment === method.value}
                    onChange={(event) =>
                      setForm({ ...form, payment: event.target.value })
                    }
                  />
                  <span className="payment-icon">
                    <Icon name={method.icon} />
                  </span>
                  <span className="payment-copy">
                    <strong>{method.title}</strong>
                    <small>{method.description}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit" className="primary-btn">
            ยืนยันการสั่งซื้อและชำระเงิน
          </button>
        </form>
      </section>
      <aside className="checkout-summary">
        <h2>สรุปคำสั่งซื้อ</h2>
        <div className="checkout-items">
          {[...cart.entries()].map(([id, quantity]) => {
            const product = products.find((item) => item.id === id);
            return (
              <div className="checkout-item" key={id}>
                <img src={product.image} alt={product.name} />
                <div className="checkout-item-copy">
                  <strong>{product.name}</strong>
                  <p>ตัวเลือก: สีเทา (ขนาด)</p>
                  <p>จำนวน: {quantity} ชิ้น</p>
                </div>
                <strong>{formatPrice(product.price * quantity)}</strong>
              </div>
            );
          })}
        </div>
        <div className="summary-row">
          <span>ค่าจัดส่ง</span>
          <span><del>{formatPrice(45)}</del> <strong className="free-shipping">ฟรี</strong></span>
        </div>
        <div className="summary-row total-row">
          <strong>ยอดชำระเงินทั้งหมด</strong>
          <strong>{formatPrice(total)}</strong>
        </div>
        <p className="checkout-note">เมื่อกดปุ่ม คุณยอมรับเงื่อนไขนโยบายคุ้มครองข้อมูลและความปลอดภัยของ Mellow Shop</p>
      </aside>
      </div>
      <section className="checkout-benefits" aria-label="บริการของร้าน">
        <article><span><Icon name="truck" /></span><div><strong>ส่งไว</strong><small>จัดส่งภายใน 24 ชั่วโมง</small></div></article>
        <article><span><Icon name="check" /></span><div><strong>รับประกัน</strong><small>คืนได้ภายใน 7 วัน</small></div></article>
        <article><span><Icon name="message" /></span><div><strong>ติดต่อได้ง่าย</strong><small>ยินดีตอบคำถามก่อนซื้อ</small></div></article>
      </section>
    </main>
  );
}
