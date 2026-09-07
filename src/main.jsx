import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, ShoppingCart, Heart, UserRound, ChevronLeft, Menu, X,
  Flame, Tag, Zap, ShieldCheck, Headphones, Grid2X2, Trophy, Car,
  Swords, Compass, Dice5, Home, Check, Gamepad2
} from "lucide-react";
import "./styles.css";

const games = [
  { id:1, t:"Red Dead Redemption 2", g:"أكشن", p:17.99, o:59.99, d:70, img:"https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg" },
  { id:2, t:"EA SPORTS FC 24", g:"رياضة", p:27.99, o:69.99, d:60, img:"https://cdn.akamai.steamstatic.com/steam/apps/1222670/header.jpg" },
  { id:3, t:"Cyberpunk 2077", g:"مغامرات", p:19.99, o:59.99, d:67, img:"https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg" },
  { id:4, t:"Grand Theft Auto V", g:"أكشن", p:20.99, o:59.99, d:65, img:"https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg" },
  { id:5, t:"The Witcher 3: Wild Hunt", g:"مغامرات", p:9.99, o:39.99, d:75, img:"https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg" },
  { id:6, t:"Elden Ring", g:"تقمص الأدوار", p:34.99, o:59.99, d:42, img:"https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg" },
  { id:7, t:"Hogwarts Legacy", g:"مغامرات", p:21.99, o:59.99, d:63, img:"https://cdn.akamai.steamstatic.com/steam/apps/990080/header.jpg" },
  { id:8, t:"Forza Horizon 5", g:"سيارات", p:24.99, o:59.99, d:58, img:"https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg" }
];

const descriptions = {
  1:{ar:"عش مغامرة ملحمية في عالم الغرب الأمريكي المفتوح، مع قصة عميقة وشخصيات لا تُنسى.",en:"Experience an epic journey through the American frontier with a deep story and unforgettable characters."},
  2:{ar:"عش أجواء كرة القدم الحماسية، وابنِ فريقك ونافس لاعبين من جميع أنحاء العالم.",en:"Experience fast-paced football, build your squad, and compete with players around the world."},
  3:{ar:"ادخل مدينة Night City المستقبلية في عالم مفتوح مليء بالمهمات والقصص والاختيارات.",en:"Enter the futuristic Night City in an open world packed with missions, stories, and choices."},
  4:{ar:"استكشف مدينة Los Santos في عالم مفتوح مليء بالمهمات والمطاردات والمغامرات.",en:"Explore Los Santos in an open world packed with missions, chases, and adventures."},
  5:{ar:"مغامرة فانتازيا ضخمة تجمع بين القصة القوية والعالم المفتوح والقتالات الممتعة.",en:"A massive fantasy adventure combining a powerful story, open-world exploration, and rewarding combat."},
  6:{ar:"رحلة فانتازية مظلمة وصعبة في عالم واسع مليء بالأعداء والزعماء والأسرار.",en:"A dark and challenging fantasy journey through a vast world filled with enemies, bosses, and secrets."},
  7:{ar:"استكشف عالم السحر الشهير، تعلم التعويذات، واكتشف أسرار مدرسة Hogwarts.",en:"Explore a magical world, learn powerful spells, and uncover the secrets of Hogwarts."},
  8:{ar:"انطلق في عالم مفتوح مليء بالسيارات والسباقات والمناظر الطبيعية الخلابة.",en:"Race through a huge open world filled with cars, events, and stunning landscapes."}
};

const categories = [
  ["كل الألعاب", "All Games", Grid2X2],
  ["ألعاب الأكشن", "Action", Swords],
  ["مغامرات", "Adventure", Compass],
  ["تقمص الأدوار", "RPG", ShieldCheck],
  ["ألعاب الرياضة", "Sports", Trophy],
  ["ألعاب السيارات", "Racing", Car],
  ["ألعاب الاستراتيجية", "Strategy", () => <span className="crosshair">✦</span>],
  ["ألعاب الرعب", "Horror", Dice5]
];

const genreEn = {
  "أكشن":"Action",
  "رياضة":"Sports",
  "مغامرات":"Adventure",
  "تقمص الأدوار":"RPG",
  "سيارات":"Racing"
};

function Logo({ lang }) {
  return (
    <a className="logo" href="#home" aria-label={lang === "ar" ? "توي جيمز" : "ToyGames"}>
      <img src={lang === "ar" ? "/arabiclogo.png" : "/englogo.png"} alt={lang === "ar" ? "توي جيمز" : "ToyGames"} />
    </a>
  );
}

function Header({ q, setQ, count, lang, setLang, onCart }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header>
        <div className="head">
          <button className="icon mobile-menu" onClick={() => setOpen(true)} aria-label="Menu"><Menu /></button>
          <Logo lang={lang} />
          <nav>
            <a className="active" href="#home">{lang === "ar" ? "الرئيسية" : "Home"}</a>
            <a href="#games">{lang === "ar" ? "كل الألعاب" : "All Games"}</a>
            <a href="#offers">{lang === "ar" ? "العروض" : "Offers"}</a>
            <a href="#best">{lang === "ar" ? "الأكثر مبيعًا" : "Best Sellers"}</a>
            <a href="#categories">{lang === "ar" ? "الأقسام" : "Categories"}</a>
          </nav>
          <div className="actions">
            <div className="search">
              <Search />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder={lang === "ar" ? "إبحث عن لعبة ..." : "Search for a game ..."} />
            </div>
            <button className="icon desktop" aria-label="Wishlist"><Heart /></button>
            <button className="icon desktop" aria-label="Account"><UserRound /></button>
            <button className="lang-toggle" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>{lang === "ar" ? "EN" : "عربي"}</button>
            <button className="cart" aria-label={lang === "ar" ? "فتح السلة" : "Open cart"} onClick={onCart}>
              <ShoppingCart /><b>{count}</b>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="drawer" onClick={() => setOpen(false)}>
          <aside onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setOpen(false)}><X /></button>
            <Logo lang={lang} />
            <a href="#home" onClick={() => setOpen(false)}>{lang === "ar" ? "الرئيسية" : "Home"}</a>
            <a href="#games" onClick={() => setOpen(false)}>{lang === "ar" ? "كل الألعاب" : "All Games"}</a>
            <a href="#offers" onClick={() => setOpen(false)}>{lang === "ar" ? "العروض" : "Offers"}</a>
            <a href="#best" onClick={() => setOpen(false)}>{lang === "ar" ? "الأكثر مبيعًا" : "Best Sellers"}</a>
            <a href="#categories" onClick={() => setOpen(false)}>{lang === "ar" ? "الأقسام" : "Categories"}</a>
            <button className="drawer-lang" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>{lang === "ar" ? "English" : "العربية"}</button>
          </aside>
        </div>
      )}
    </>
  );
}

function Hero({ lang }) {
  return (
    <section className={"hero " + lang}>
      <div className="hero-content">
        <span className="eyebrow"><Flame /> {lang === "ar" ? "عروض الأسبوع" : "Weekly Offers"}</span>
        <h1>{lang === "ar" ? <>ألعاب أكثر<br /><strong>متعة .. بأسعار أفضل</strong></> : <>More games.<br /><strong>Better prices.</strong></>}</h1>
        <p>{lang === "ar" ? <>استمتع بأضخم مكتبة ألعاب رقمية<br />مع أفضل العروض المخصصة لك.</> : <>Enjoy a huge digital game library<br />with offers made for you.</>}</p>
        <a className="primary" href="#offers">{lang === "ar" ? "تصفح العروض" : "Browse Offers"} <ChevronLeft /></a>
      </div>
      <div className="dots"><i className="on" /><i /><i /></div>
    </section>
  );
}

function Benefits({ lang }) {
  const items = lang === "ar"
    ? [[Tag,"أسعار منافسة","أفضل الأسعار دائمًا"],[Zap,"تسليم فوري","حسابك خلال دقائق"],[ShieldCheck,"دفع آمن","طرق دفع موثوقة"],[Headphones,"دعم سريع","مساعدتك دائمًا"]]
    : [[Tag,"Great Prices","Always competitive"],[Zap,"Instant Delivery","Your account in minutes"],[ShieldCheck,"Secure Payment","Trusted payment methods"],[Headphones,"Fast Support","We're here to help"]];
  return <div className="benefits">{items.map(([I,t,s]) => <div className="benefit" key={t}><I /><span><b>{t}</b><small>{s}</small></span></div>)}</div>;
}

function Categories({ lang, selected, setSelected }) {
  return (
    <section id="categories" className="section">
      <div className="heading">
        <div><small>{lang === "ar" ? "استكشف" : "Explore"}</small><h2>{lang === "ar" ? "الأقسام الرئيسية" : "Main Categories"} <Flame /></h2></div>
        <a className="outline" href="#games">{lang === "ar" ? "عرض الكل" : "View All"} <ChevronLeft /></a>
      </div>
      <div className="categories">
        {categories.map(([ar,en,I]) => {
          const name = lang === "ar" ? ar : en;
          return <button className={selected === ar ? "category selected" : "category"} onClick={() => setSelected(ar)} key={ar}><I /><span>{name}</span></button>;
        })}
      </div>
    </section>
  );
}

function Card({ g, onAdd, lang, onOpen }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="card" onClick={() => onOpen(g)}>
      <div className="pic">
        <img src={g.img} loading="lazy" alt={g.t} />
        <div className="card-top">
          <span className="deal-pill">-{g.d}%</span>
          <button className={liked ? "like liked" : "like"} onClick={e => { e.stopPropagation(); setLiked(v => !v); }} aria-label={lang === "ar" ? "إضافة للمفضلة" : "Add to wishlist"}><Heart /></button>
        </div>
        <div className="card-bottom"><span>{lang === "ar" ? "حساب" : "Account"}</span></div>
      </div>
      <div className="info">
        <div className="meta"><small>{lang === "ar" ? g.g : (genreEn[g.g] || g.g)}</small><span>STEAM</span></div>
        <h3 title={g.t}>{g.t}</h3>
        <div className="price-row">
          <div className="price"><del>${g.o.toFixed(2)}</del><strong>${g.p.toFixed(2)}</strong></div>
          <button className="add-cart" onClick={e => { e.stopPropagation(); onAdd(g); }} aria-label={lang === "ar" ? "إضافة للسلة" : "Add to cart"}><ShoppingCart /><span>{lang === "ar" ? "أضف للسلة" : "Add to cart"}</span></button>
        </div>
      </div>
    </article>
  );
}

function Games({ id, title, list, q, onAdd, lang, onOpen, selectedCategory }) {
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return list.filter(x => {
      const matchesSearch = !term || (x.t + " " + x.g + " " + (genreEn[x.g] || "")).toLowerCase().includes(term);
      const matchesCategory = selectedCategory === "كل الألعاب" || (
        (selectedCategory === "ألعاب الأكشن" && x.g === "أكشن") ||
        (selectedCategory === "مغامرات" && x.g === "مغامرات") ||
        (selectedCategory === "تقمص الأدوار" && x.g === "تقمص الأدوار") ||
        (selectedCategory === "ألعاب الرياضة" && x.g === "رياضة") ||
        (selectedCategory === "ألعاب السيارات" && x.g === "سيارات")
      );
      return matchesSearch && matchesCategory;
    });
  }, [list, q, selectedCategory]);

  return (
    <section id={id} className="section">
      <div className="heading">
        <div><small>{lang === "ar" ? "اختياراتنا" : "Our Picks"}</small><h2>{title} <Flame /></h2></div>
        <a className="outline" href="#games">{lang === "ar" ? "عرض الكل" : "View All"} <ChevronLeft /></a>
      </div>
      {filtered.length ? <div className="grid">{filtered.map(g => <Card key={g.id} g={g} lang={lang} onAdd={onAdd} onOpen={onOpen} />)}</div> : <div className="empty">{lang === "ar" ? "لا توجد ألعاب مطابقة 😔" : "No matching games 😔"}</div>}
    </section>
  );
}

function Promo({ lang }) {
  return <section id="offers" className="promo"><span className="gift">🎁</span><div><strong>{lang === "ar" ? "عروض خاصة" : "Special Offers"}</strong><b>{lang === "ar" ? "خصومات تصل إلى 80%" : "Up to 80% off"}</b></div><a className="primary small" href="#games">{lang === "ar" ? "تصفح الآن" : "Shop Now"} <ChevronLeft /></a></section>;
}

function GameDetails({ g, lang, onClose, onAdd }) {
  if (!g) return null;
  const checks = lang === "ar" ? ["حساب Steam","تسليم فوري","دعم كامل"] : ["Steam account","Instant delivery","Full support"];
  return (
    <div className="details-overlay" onClick={onClose}>
      <div className="details" onClick={e => e.stopPropagation()}>
        <button className="details-close" onClick={onClose}><X /></button>
        <div className="details-cover"><img src={g.img} alt={g.t} /><div className="details-gradient" /></div>
        <div className="details-body">
          <div className="details-meta"><span>{lang === "ar" ? g.g : (genreEn[g.g] || g.g)}</span><b>STEAM</b></div>
          <h1>{g.t}</h1>
          <p>{descriptions[g.id]?.[lang] || descriptions[g.id]?.en}</p>
          <div className="details-tags">{checks.map(x => <span key={x}><Check /> {x}</span>)}</div>
          <div className="details-buy">
            <div><del>${g.o.toFixed(2)}</del><strong>${g.p.toFixed(2)}</strong><em>-{g.d}%</em></div>
            <button className="details-cart" onClick={() => onAdd(g)}><ShoppingCart /> {lang === "ar" ? "أضف للسلة" : "Add to cart"}</button>
          </div>
          <div className="details-note"><Gamepad2 /> {lang === "ar" ? "منتج رقمي — لا يوجد شحن أو انتظار" : "Digital product — no shipping or waiting"}</div>
        </div>
      </div>
    </div>
  );
}

function Cart({ items, lang, onClose, onIncrease, onDecrease, onRemove, onCheckout }) {
  const total = items.reduce((sum, item) => sum + (Number(item.p) || 0) * item.qty, 0);
  const fmt = n => `$${(Number(n) || 0).toFixed(2)}`;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside className="cart-panel" dir={lang === "ar" ? "rtl" : "ltr"} onClick={e => e.stopPropagation()}>
        <div className="cart-head">
          <div><small>{lang === "ar" ? "مشترياتك" : "Your shopping"}</small><h2>{lang === "ar" ? "سلة التسوق" : "Shopping Cart"}</h2></div>
          <button className="cart-close" onClick={onClose}><X /></button>
        </div>
        <div className="cart-divider" />
        {items.length ? (
          <div className="cart-list">
            {items.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.img} alt={item.t} />
                <div className="cart-item-main">
                  <div className="cart-item-top"><span className="cart-type">{lang === "ar" ? "حساب Steam" : "Steam Account"}</span><button className="cart-remove" onClick={() => onRemove(item.id)}><X /></button></div>
                  <h3>{item.t}</h3>
                  <strong>{fmt(item.p)}</strong>
                  <div className="qty"><button onClick={() => onDecrease(item.id)}>−</button><b>{item.qty}</b><button onClick={() => onIncrease(item.id)}>+</button></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cart-empty"><ShoppingCart /><h3>{lang === "ar" ? "السلة فارغة" : "Your cart is empty"}</h3><p>{lang === "ar" ? "أضف لعبة من المتجر وستظهر هنا." : "Add a game from the store and it will appear here."}</p><button onClick={onClose}>{lang === "ar" ? "متابعة التسوق" : "Continue shopping"}</button></div>
        )}
        <div className="cart-footer">
          <div className="cart-total"><span>{lang === "ar" ? "الإجمالي" : "Total"}</span><strong>{fmt(total)}</strong></div>
          <button className="checkout" disabled={!items.length} onClick={onCheckout}>{lang === "ar" ? "إتمام الشراء" : "Checkout"}</button>
          <small>{lang === "ar" ? "سيتم تفعيل الدفع بعد ربط بوابة الدفع." : "Checkout will be enabled after payment integration."}</small>
        </div>
      </aside>
    </div>
  );
}

function Trust({ lang }) {
  const items = lang === "ar"
    ? [["منصة موثوقة","تجربة شراء آمنة"],["آلاف العملاء السعداء","تقييمات حقيقية"],["متاح في الدول العربية","دعم كامل للعربية"]]
    : [["Trusted Platform","Safe shopping experience"],["Happy Customers","Real reviews"],["Built for gamers","Full English support"]];
  return <div className="trust">{items.map(([a,b]) => <div key={a}><span>✓</span><p><b>{a}</b><small>{b}</small></p></div>)}</div>;
}

function Bottom({ lang }) {
  const items = lang === "ar"
    ? [[Home,"الرئيسية","home"],[Grid2X2,"الأقسام","categories"],[Search,"بحث","games"],[Heart,"المفضلة","best"],[UserRound,"حسابي",""]]
    : [[Home,"Home","home"],[Grid2X2,"Categories","categories"],[Search,"Search","games"],[Heart,"Wishlist","best"],[UserRound,"Account",""]];
  return <div className="bottom">{items.map(([I,t,to],i) => <a className={i === 0 ? "active" : ""} href={to ? `#${to}` : "#"} key={t}><I /><span>{t}</span></a>)}</div>;
}

function App() {
  const [q, setQ] = useState("");
  const [lang, setLang] = useState("ar");
  const [selectedGame, setSelectedGame] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("كل الألعاب");

  const addToCart = g => {
    if (!g) return;
    setCartItems(items => {
      const found = items.find(x => x.id === g.id);
      return found
        ? items.map(x => x.id === g.id ? { ...x, qty: x.qty + 1 } : x)
        : [...items, { ...g, qty: 1 }];
    });
    setCartOpen(true);
    setSelectedGame(null);
  };

  const increase = id => setCartItems(items => items.map(x => x.id === id ? { ...x, qty: x.qty + 1 } : x));
  const decrease = id => setCartItems(items => items.map(x => x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x));
  const remove = id => setCartItems(items => items.filter(x => x.id !== id));
  const count = cartItems.reduce((sum, x) => sum + x.qty, 0);

  const changeLanguage = next => {
    setLang(next);
  };

  return (
    <div className={"app " + lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <Header q={q} setQ={setQ} count={count} lang={lang} setLang={changeLanguage} onCart={() => setCartOpen(true)} />
      <main id="home">
        <Hero lang={lang} />
        <Benefits lang={lang} />
        <Categories lang={lang} selected={selectedCategory} setSelected={setSelectedCategory} />
        <Games id="best" title={lang === "ar" ? "الأكثر مبيعًا" : "Best Sellers"} list={games.slice(0,4)} q={q} lang={lang} selectedCategory={selectedCategory} onAdd={addToCart} onOpen={setSelectedGame} />
        <Promo lang={lang} />
        <Games id="games" title={lang === "ar" ? "ألعاب مميزة" : "Featured Games"} list={games.slice(4)} q={q} lang={lang} selectedCategory={selectedCategory} onAdd={addToCart} onOpen={setSelectedGame} />
        <Trust lang={lang} />
      </main>
      <footer><Logo lang={lang} /><span>© 2026 ToyGames — {lang === "ar" ? "ألعاب أكثر متعة بأسعار أفضل" : "More fun, better prices."}</span></footer>
      <Bottom lang={lang} />
      {selectedGame && <GameDetails g={selectedGame} lang={lang} onClose={() => setSelectedGame(null)} onAdd={addToCart} />}
      {cartOpen && <Cart items={cartItems} lang={lang} onClose={() => setCartOpen(false)} onIncrease={increase} onDecrease={decrease} onRemove={remove} onCheckout={() => {}} />}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
