import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, ShoppingCart, Heart, UserRound, ChevronRight, Menu, X,
  Flame, Tag, Zap, ShieldCheck, Headphones, Grid2X2, Trophy, Car,
  Swords, Compass, Dice5, Home, Check, Gamepad2
} from "lucide-react";
import "./styles.css";

const games = [
  { id:1, t:"Red Dead Redemption 2", g:"Action", p:17.99, o:59.99, d:70, img:"https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg" },
  { id:2, t:"EA SPORTS FC 24", g:"Sports", p:27.99, o:69.99, d:60, img:"https://cdn.akamai.steamstatic.com/steam/apps/1222670/header.jpg" },
  { id:3, t:"Cyberpunk 2077", g:"Adventure", p:19.99, o:59.99, d:67, img:"https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg" },
  { id:4, t:"Grand Theft Auto V", g:"Action", p:20.99, o:59.99, d:65, img:"https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg" },
  { id:5, t:"The Witcher 3: Wild Hunt", g:"Adventure", p:9.99, o:39.99, d:75, img:"https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg" },
  { id:6, t:"Elden Ring", g:"RPG", p:34.99, o:59.99, d:42, img:"https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg" },
  { id:7, t:"Hogwarts Legacy", g:"Adventure", p:21.99, o:59.99, d:63, img:"https://cdn.akamai.steamstatic.com/steam/apps/990080/header.jpg" },
  { id:8, t:"Forza Horizon 5", g:"Racing", p:24.99, o:59.99, d:58, img:"https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg" }
];

const descriptions = {
  1:{en:"Experience an epic journey through the American frontier with a deep story and unforgettable characters."},
  2:{en:"Experience fast-paced football, build your squad, and compete with players around the world."},
  3:{en:"Enter the futuristic Night City in an open world packed with missions, stories, and choices."},
  4:{en:"Explore Los Santos in an open world packed with missions, chases, and adventures."},
  5:{en:"A massive fantasy adventure combining a powerful story, open-world exploration, and rewarding combat."},
  6:{en:"A dark and challenging fantasy journey through a vast world filled with enemies, bosses, and secrets."},
  7:{en:"Explore a magical world, learn powerful spells, and uncover the secrets of Hogwarts."},
  8:{en:"Race through a huge open world filled with cars, events, and stunning landscapes."}
};

const categories = [
  ["All Games", Grid2X2],
  ["Action", Swords],
  ["Adventure", Compass],
  ["RPG", ShieldCheck],
  ["Sports", Trophy],
  ["Racing", Car],
  ["Strategy", () => <span className="crosshair">✦</span>],
  ["Horror", Dice5]
];


function Logo() {
  return (
    <a className="logo" href="#home" aria-label="ToyGames">
      <img src="/englogo.png" alt="ToyGames" />
    </a>
  );
}
function Header({ q, setQ, count, onCart }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header>
        <div className="head">
          <button className="icon mobile-menu" onClick={() => setOpen(true)} aria-label="Menu"><Menu /></button>
          <Logo />
          <nav>
            <a className="active" href="#home">Home</a><a href="#games">All Games</a><a href="#offers">Offers</a><a href="#best">Best Sellers</a><a href="#categories">Categories</a>
          </nav>
          <div className="actions">
            <div className="search"><Search /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search for a game ..." /></div>
            <button className="icon desktop" aria-label="Wishlist"><Heart /></button>
            <button className="icon desktop" aria-label="Account"><UserRound /></button>
            <button className="cart" aria-label="Open cart" onClick={onCart}><ShoppingCart /><b>{count}</b></button>
          </div>
        </div>
      </header>
      {open && <div className="drawer" onClick={() => setOpen(false)}><aside onClick={e => e.stopPropagation()}><button className="close" onClick={() => setOpen(false)}><X /></button><Logo /><a href="#home" onClick={() => setOpen(false)}>Home</a><a href="#games" onClick={() => setOpen(false)}>All Games</a><a href="#offers" onClick={() => setOpen(false)}>Offers</a><a href="#best" onClick={() => setOpen(false)}>Best Sellers</a><a href="#categories" onClick={() => setOpen(false)}>Categories</a></aside></div>}
    </>
  );
}
function Hero() {
  return <section className="hero"><div className="hero-content"><span className="eyebrow"><Flame /> Weekly Offers</span><h1>More games.<br /><strong>Better prices.</strong></h1><p>Enjoy a huge digital game library<br />with offers made for you.</p><a className="primary" href="#offers">Browse Offers <ChevronRight /></a></div><div className="dots"><i className="on" /><i /><i /></div></section>;
}
function Benefits() {
  const items = [[Tag,"Great Prices","Always competitive"],[Zap,"Instant Delivery","Your account in minutes"],[ShieldCheck,"Secure Payment","Trusted payment methods"],[Headphones,"Fast Support","We're here to help"]];
  return <div className="benefits">{items.map(([I,t,s]) => <div className="benefit" key={t}><I /><span><b>{t}</b><small>{s}</small></span></div>)}</div>;
}
function Categories({ selected, setSelected }) {
  return <section id="categories" className="section"><div className="heading"><div><small>Explore</small><h2>Main Categories <Flame /></h2></div><a className="outline" href="#games">View All <ChevronRight /></a></div><div className="categories">{categories.map(([name,I]) => <button className={selected === name ? "category selected" : "category"} onClick={() => setSelected(name)} key={name}><I /><span>{name}</span></button>)}</div></section>;
}
function Card({ g, onAdd, onOpen }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="card" onClick={() => onOpen(g)}>
      <div className="pic">
        <img src={g.img} loading="lazy" alt={g.t} />
        <div className="card-top">
          <span className="deal-pill">-{g.d}%</span>
          <button className={liked ? "like liked" : "like"} onClick={e => { e.stopPropagation(); setLiked(v => !v); }} aria-label={"Add to wishlist"}><Heart /></button>
        </div>
        <div className="card-bottom"><span>{"Account"}</span></div>
      </div>
      <div className="info">
        <div className="meta"><small>{g.g}</small><span>STEAM</span></div>
        <h3 title={g.t}>{g.t}</h3>
        <div className="price-row">
          <div className="price"><del>${g.o.toFixed(2)}</del><strong>${g.p.toFixed(2)}</strong></div>
          <button className="add-cart" onClick={e => { e.stopPropagation(); onAdd(g); }} aria-label={"Add to cart"}><ShoppingCart /><span>{"Add to cart"}</span></button>
        </div>
      </div>
    </article>
  );
}

function Games({ id, title, list, q, onAdd, onOpen, selectedCategory }) {
  const filtered = useMemo(() => { const term=q.trim().toLowerCase(); return list.filter(x => { const matchesSearch=!term || (x.t+" "+x.g).toLowerCase().includes(term); const matchesCategory=selectedCategory==="All Games" || x.g===selectedCategory; return matchesSearch && matchesCategory; }); }, [list,q,selectedCategory]);
  return <section id={id} className="section"><div className="heading"><div><small>Our Picks</small><h2>{title} <Flame /></h2></div><a className="outline" href="#games">View All <ChevronRight /></a></div>{filtered.length ? <div className="grid">{filtered.map(g => <Card key={g.id} g={g} onAdd={onAdd} onOpen={onOpen} />)}</div> : <div className="empty">No matching games 😔</div>}</section>;
}
function Promo() {
  return <section id="offers" className="promo"><span className="gift">🎁</span><div><strong>Special Offers</strong><b>Up to 80% off</b></div><a className="primary small" href="#games">Shop Now <ChevronRight /></a></section>;
}
function GameDetails({ g, onClose, onAdd }) {
  if (!g) return null;
  const checks = ["Steam account","Instant delivery","Full support"];
  return (
    <div className="details-overlay" onClick={onClose}>
      <div className="details" onClick={e => e.stopPropagation()}>
        <button className="details-close" onClick={onClose}><X /></button>
        <div className="details-cover"><img src={g.img} alt={g.t} /><div className="details-gradient" /></div>
        <div className="details-body">
          <div className="details-meta"><span>{g.g}</span><b>STEAM</b></div>
          <h1>{g.t}</h1>
          <p>{descriptions[g.id]?.en}</p>
          <div className="details-tags">{checks.map(x => <span key={x}><Check /> {x}</span>)}</div>
          <div className="details-buy">
            <div><del>${g.o.toFixed(2)}</del><strong>${g.p.toFixed(2)}</strong><em>-{g.d}%</em></div>
            <button className="details-cart" onClick={() => onAdd(g)}><ShoppingCart /> {"Add to cart"}</button>
          </div>
          <div className="details-note"><Gamepad2 /> {"Digital product — no shipping or waiting"}</div>
        </div>
      </div>
    </div>
  );
}

function Cart({ items, onClose, onIncrease, onDecrease, onRemove, onCheckout }) {
  const total = items.reduce((sum, item) => sum + (Number(item.p) || 0) * item.qty, 0);
  const fmt = n => `$${(Number(n) || 0).toFixed(2)}`;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside className="cart-panel" dir="ltr" onClick={e => e.stopPropagation()}>
        <div className="cart-head">
          <div><small>{"Your shopping"}</small><h2>{"Shopping Cart"}</h2></div>
          <button className="cart-close" onClick={onClose}><X /></button>
        </div>
        <div className="cart-divider" />
        {items.length ? (
          <div className="cart-list">
            {items.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.img} alt={item.t} />
                <div className="cart-item-main">
                  <div className="cart-item-top"><span className="cart-type">{"Steam Account"}</span><button className="cart-remove" onClick={() => onRemove(item.id)}><X /></button></div>
                  <h3>{item.t}</h3>
                  <strong>{fmt(item.p)}</strong>
                  <div className="qty"><button onClick={() => onDecrease(item.id)}>−</button><b>{item.qty}</b><button onClick={() => onIncrease(item.id)}>+</button></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cart-empty"><ShoppingCart /><h3>{"Your cart is empty"}</h3><p>{"Add a game from the store and it will appear here."}</p><button onClick={onClose}>{"Continue shopping"}</button></div>
        )}
        <div className="cart-footer">
          <div className="cart-total"><span>{"Total"}</span><strong>{fmt(total)}</strong></div>
          <button className="checkout" disabled={!items.length} onClick={onCheckout}>{"Checkout"}</button>
          <small>{"Checkout will be enabled after payment integration."}</small>
        </div>
      </aside>
    </div>
  );
}

function Trust() {
  const items = [["Trusted Platform","Safe shopping experience"],["Happy Customers","Real reviews"],["Built for gamers","Full English support"]];
  return <div className="trust">{items.map(([a,b]) => <div key={a}><span>✓</span><p><b>{a}</b><small>{b}</small></p></div>)}</div>;
}
function Bottom() {
  const items = [[Home,"Home","home"],[Grid2X2,"Categories","categories"],[Search,"Search","games"],[Heart,"Wishlist","best"],[UserRound,"Account",""]];
  return <div className="bottom">{items.map(([I,t,to],i) => <a className={i === 0 ? "active" : ""} href={to ? `#${to}` : "#"} key={t}><I /><span>{t}</span></a>)}</div>;
}
function App() {
  const [q,setQ]=useState("");
  const [selectedGame,setSelectedGame]=useState(null);
  const [cartOpen,setCartOpen]=useState(false);
  const [cartItems,setCartItems]=useState([]);
  const [selectedCategory,setSelectedCategory]=useState("All Games");
  const addToCart=g=>{ if(!g)return; setCartItems(items=>{const found=items.find(x=>x.id===g.id); return found?items.map(x=>x.id===g.id?{...x,qty:x.qty+1}:x):[...items,{...g,qty:1}];}); setCartOpen(true); setSelectedGame(null); };
  const increase=id=>setCartItems(items=>items.map(x=>x.id===id?{...x,qty:x.qty+1}:x));
  const decrease=id=>setCartItems(items=>items.map(x=>x.id===id?{...x,qty:Math.max(1,x.qty-1)}:x));
  const remove=id=>setCartItems(items=>items.filter(x=>x.id!==id));
  const count=cartItems.reduce((sum,x)=>sum+x.qty,0);
  return <div className="app" dir="ltr"><Header q={q} setQ={setQ} count={count} onCart={()=>setCartOpen(true)}/><main id="home"><Hero/><Benefits/><Categories selected={selectedCategory} setSelected={setSelectedCategory}/><Games id="best" title="Best Sellers" list={games.slice(0,4)} q={q} selectedCategory={selectedCategory} onAdd={addToCart} onOpen={setSelectedGame}/><Promo/><Games id="games" title="Featured Games" list={games.slice(4)} q={q} selectedCategory={selectedCategory} onAdd={addToCart} onOpen={setSelectedGame}/><Trust/></main><footer><Logo/><span>© 2026 ToyGames — More fun, better prices.</span></footer><Bottom/>{selectedGame&&<GameDetails g={selectedGame} onClose={()=>setSelectedGame(null)} onAdd={addToCart}/>} {cartOpen&&<Cart items={cartItems} onClose={()=>setCartOpen(false)} onIncrease={increase} onDecrease={decrease} onRemove={remove} onCheckout={()=>{}}/>}</div>;
}
createRoot(document.getElementById("root")).render(<App />);
