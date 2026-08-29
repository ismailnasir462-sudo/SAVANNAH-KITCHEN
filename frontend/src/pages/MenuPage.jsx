import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Search } from 'lucide-react';
import {
  MargheritaPizza,
  PepperoniPizza,
  BBQPizza,
  VegetarianPizza,
  HawaiianPizza,
  FourCheesePizza,
  MeatLovers,
  SeafoodPizza,
  ClassicCheeseburger,
  BaconBBQBurger,
  CrispyChickenBurger,
  DoubleBeefDeluxeBurger,
  SpaghettiBolognese,
  FettuccineAlfredo,
  PenneArrabbiata,
  LasagnaClassica,
  SeafoodLinguine,
  SpaghettiCarbonara,
  PestoPasta,
   CaesarSalad,
  GreekSalad,
  GardenFreshSalad,
  CobbSalad,
  ChocolateLavaCake,
  NewYorkCheesecake,
  Tiramisu,
  BrowniewithVanillaIceCream,
  ApplePie,
  PannaCotta,
  ChocolateMousse,
  CrèmeBrûlée,
  BelgianWaffles,
  GlazedDonuts,
  IceCreamSundae,
  RedVelvetCake,
  sparklingwater
} from '../assets/images';
const menuItems = [
  // 🍕 PIZZAS (8)
  { id: 1, name: "Margherita Pizza", category: "Pizza", price: 16, rating: 4.8, img: MargheritaPizza, desc: "San Marzano tomatoes, fresh mozzarella, organic basil, and extra virgin olive oil." },
  { id: 2, name: "Pepperoni Pizza", category: "Pizza", price: 18, rating: 4.9, img: PepperoniPizza, desc: "Crispy artisan pepperoni slices, rich tomato sauce, and melted mozzarella." },
  { id: 3, name: "BBQ Chicken Pizza", category: "Pizza", price: 19, rating: 4.8, img: BBQPizza, desc: "Grilled chicken breast, tangy BBQ glaze, red onions, and fresh cilantro." },
  { id: 4, name: "Vegetarian Pizza", category: "Pizza", price: 17, rating: 4.7, img: VegetarianPizza, desc: "Bell peppers, black olives, sweet corn, mushrooms, red onions, and mozzarella." },
  { id: 5, name: "Hawaiian Pizza", category: "Pizza", price: 18, rating: 4.6, img: HawaiianPizza, desc: "Savory smoked ham, sweet caramelized pineapple, and double mozzarella." },
  { id: 6, name: "Four Cheese (Quattro Formaggi)", category: "Pizza", price: 20, rating: 4.9, img: FourCheesePizza, desc: "A velvety blend of Gorgonzola, Fontina, Parmigiano-Reggiano, and Mozzarella." },
  { id: 7, name: "Meat Lovers Pizza", category: "Pizza", price: 22, rating: 4.9, img: MeatLovers, desc: "Loaded with Italian sausage, crispy bacon, pepperoni, and seasoned ground beef." },
  { id: 8, name: "Seafood Pizza", category: "Pizza", price: 24, rating: 4.8, img: SeafoodPizza, desc: "Succulent jumbo shrimp, calamari, garlic butter glaze, and fresh herbs." },

  // 🍔 BURGERS (4)
  { id: 9, name: "Classic Cheeseburger", category: "Burgers", price: 17, rating: 4.8, img: ClassicCheeseburger, desc: "Prime Angus beef patty, aged cheddar, crisp lettuce, tomato, pickles, and house sauce." },
  { id: 10, name: "Bacon BBQ Burger", category: "Burgers", price: 19, rating: 4.9, img:BaconBBQBurger, desc: "Smokey bacon strips, crispy onion rings, cheddar cheese, and signature BBQ drip." },
  { id: 11, name: "Crispy Chicken Burger", category: "Burgers", price: 18, rating: 4.8, img: CrispyChickenBurger, desc: "Golden fried buttermilk chicken breast, creamy coleslaw, and spicy mayo on brioche." },
  { id: 12, name: "Double Beef Deluxe Burger", category: "Burgers", price: 22, rating: 5.0, img:DoubleBeefDeluxeBurger, desc: "Two smash patties, double american cheese, grilled onions, and special Savannah relish." },

  // 🍝 PASTA (7)
  // 🍝 PASTA
  { id: 13, name: "Spaghetti Bolognese", category: "Pasta", price: 21, rating: 4.9, img: SpaghettiBolognese, desc: "Slow-simmered rich beef ragù with red wine, tomatoes, and aged Parmesan." },
  { id: 14, name: "Fettuccine Alfredo", category: "Pasta", price: 20, rating: 4.8, img: FettuccineAlfredo, desc: "Fresh ribbon pasta tossed in silky heavy cream, butter, and freshly grated Parmigiano." },
  { id: 15, name: "Penne Arrabbiata", category: "Pasta", price: 18, rating: 4.7, img: PenneArrabbiata, desc: "Penne pasta enveloped in a spicy San Marzano tomato sauce infused with chili and garlic." },
  { id: 16, name: "Lasagna Classica", category: "Pasta", price: 23, rating: 4.9, img: LasagnaClassica, desc: "Layered pasta sheets, rich meat ragù, creamy béchamel, and melted mozzarella." },
  { id: 17, name: "Seafood Linguine", category: "Pasta", price: 27, rating: 5.0, img: SeafoodLinguine, desc: "Fresh linguine cooked with jumbo prawns, mussels, clams, and cherry tomatoes in white wine sauce." },
  { id: 18, name: "Spaghetti Carbonara", category: "Pasta", price: 22, rating: 4.9, img: SpaghettiCarbonara, desc: "Traditional Roman style pasta with crispy guanciale, egg yolk, and Pecorino Romano." },
  { id: 19, name: "Pesto Pasta (Basil Pesto)", category: "Pasta", price: 19, rating: 4.8, img: PestoPasta, desc: "Penne coated in vibrant pine nut and fresh basil pesto, topped with toasted pine nuts." },

  // 🥗 SALADS (4)
 // 🥗 SALADS
  { id: 20, name: "Caesar Salad", category: "Salads", price: 14, rating: 4.8, img: CaesarSalad, desc: "Crisp romaine heart leaves, garlic herbal croutons, parmesan ribbons, and homemade Caesar dressing." },
  { id: 21, name: "Greek Salad", category: "Salads", price: 15, rating: 4.7, img: GreekSalad, desc: "Ripe tomatoes, crunchy cucumbers, Kalamata olives, red onions, and authentic Greek feta block." },
  { id: 22, name: "Garden Fresh Salad", category: "Salads", price: 12, rating: 4.6, img: GardenFreshSalad, desc: "Mixed baby greens, radishes, cherry tomatoes, cucumbers, and house balsamic vinaigrette." },
  { id: 23, name: "Cobb Salad", category: "Salads", price: 16, rating: 4.9, img: CobbSalad, desc: "Grilled chicken, hard-boiled eggs, crispy bacon, avocado, blue cheese, and tomatoes." },

  // 🍰 DESSERTS (12)
 // 🍰 DESSERTS
  { id: 24, name: "Chocolate Lava Cake", category: "Desserts", price: 12, rating: 5.0, img: ChocolateLavaCake, desc: "Warm Belgian chocolate cake with a molten center, served alongside vanilla gelato." },
  { id: 25, name: "New York Cheesecake", category: "Desserts", price: 11, rating: 4.9, img: NewYorkCheesecake, desc: "Rich and creamy baked cheesecake with a graham cracker crust and fresh strawberry drizzle." },
  { id: 26, name: "Tiramisu", category: "Desserts", price: 11, rating: 4.9, img: Tiramisu, desc: "Espresso-soaked ladyfingers layered with mascarpone cream and dusted with dark cocoa." },
  { id: 27, name: "Brownie with Vanilla Ice Cream", category: "Desserts", price: 10, rating: 4.8, img: BrowniewithVanillaIceCream, desc: "Fudgy warm chocolate walnut brownie topped with a scoop of Madagascar vanilla bean ice cream." },
  { id: 28, name: "Apple Pie", category: "Desserts", price: 9, rating: 4.7, img: ApplePie, desc: "Flaky golden pastry shell packed with cinnamon-spiced caramelized apples." },
  { id: 29, name: "Panna Cotta", category: "Desserts", price: 10, rating: 4.8, img: PannaCotta, desc: "Silky smooth Italian vanilla bean cream set served with a wild berry compote." },
  { id: 30, name: "Chocolate Mousse", category: "Desserts", price: 10, rating: 4.8, img: ChocolateMousse, desc: "Decadent dark chocolate mousse whipped to airy perfection with chocolate curls." },
  { id: 31, name: "Crème Brûlée", category: "Desserts", price: 12, rating: 4.9, img: CrèmeBrûlée, desc: "Rich custard base crowned with a contrasting layer of hard caramelized sugar." },
  { id: 32, name: "Belgian Waffles", category: "Desserts", price: 11, rating: 4.8, img: BelgianWaffles, desc: "Warm golden crisp waffle topped with maple syrup, fresh berries, and whipped cream." },
  { id: 33, name: "Glazed Donuts", category: "Desserts", price: 8, rating: 4.6, img: GlazedDonuts, desc: "Fluffy artisan fried dough coated in a glossy vanilla sugar glaze." },
  { id: 34, name: "Ice Cream Sundae", category: "Desserts", price: 9, rating: 4.7, img: IceCreamSundae, desc: "Tri-color ice cream scoops drizzled with hot fudge, crushed nuts, and a maraschino cherry." },
  { id: 35, name: "Red Velvet Cake", category: "Desserts", price: 11, rating: 4.9, img: RedVelvetCake, desc: "Moist cocoa layered cake with smooth cream cheese frosting and fine cake crumbs." },

  // 🍹 DRINKS (14)
  { id: 36, name: "Coca-Cola", category: "Drinks", price: 4, rating: 4.5, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80", desc: "Chilled classic cola served over crushed ice with a lime slice." },
  { id: 37, name: "Fresh Orange Juice", category: "Drinks", price: 6, rating: 4.8, img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80", desc: "100% freshly squeezed sun-ripened organic oranges." },
  { id: 38, name: "Classic Lemonade", category: "Drinks", price: 5, rating: 4.7, img: "https://images.unsplash.com/photo-1523371054106-bbf80586c38c?auto=format&fit=crop&w=600&q=80", desc: "Freshly squeezed lemon juice, organic cane sugar, and fresh mint leaves." },
  { id: 39, name: "Iced Tea", category: "Drinks", price: 5, rating: 4.6, img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80", desc: "House-brewed black tea lightly sweetened and served with lemon wheels." },
  { id: 40, name: "Espresso", category: "Drinks", price: 4, rating: 4.9, img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80", desc: "Rich and concentrated shot of dark roasted Italian coffee beans." },
  { id: 41, name: "Americano", category: "Drinks", price: 5, rating: 4.7, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80", desc: "Double shot of espresso diluted with hot water for a smooth coffee profile." },
  { id: 42, name: "Cappuccino", category: "Drinks", price: 6, rating: 4.9, img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80", desc: "Equal parts espresso, steamed milk, and velvety foam topped with cocoa dust." },
  { id: 43, name: "Caffè Latte", category: "Drinks", price: 6, rating: 4.8, img: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80", desc: "Espresso combined with silky steamed milk and a thin layer of micro-foam art." },
  { id: 44, name: "Hot Chocolate", category: "Drinks", price: 6, rating: 4.9, img: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80", desc: "Rich melted dark chocolate whisked with hot milk, topped with mini marshmallows." },
  { id: 45, name: "Iced Coffee", category: "Drinks", price: 6, rating: 4.8, img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80", desc: "Chilled espresso poured over ice with choice of milk and vanilla syrup." },
  { id: 46, name: "Chocolate Milkshake", category: "Drinks", price: 8, rating: 4.9, img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80", desc: "Thick double-chocolate ice cream blend crowned with whipped cream and chocolate syrup." },
  { id: 47, name: "Strawberry Smoothie", category: "Drinks", price: 8, rating: 4.8, img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80", desc: "Blended fresh strawberries, Greek yogurt, honey, and crushed ice." },
  { id: 48, name: "Virgin Mojito", category: "Drinks", price: 9, rating: 4.9, img: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=600&q=80", desc: "Muddled fresh mint and lime wedge topped with sparkling soda water over ice." },
  { id: 49, name: "Sparkling Water", category: "Drinks", price: 5, rating: 4.6, img: sparklingwater, desc: "Chilled premium Italian mineral water with fine natural effervescence." }
];

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const categories = ["All", "Pizza", "Burgers", "Pasta", "Salads", "Desserts", "Drinks"];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeTab === "All" || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch;
  });

 return (
    <div className="py-16 px-5 md:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Header with Scroll Animation */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <p className="font-script text-[#C79A44] text-3xl mb-1">Culinary Delights</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">Our Full Menu</h1>
        <div className="w-24 h-0.5 bg-[#C79A44] mx-auto mt-4" />
      </motion.div>

      {/* Controls Bar with Scroll Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
      >
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === cat 
                  ? 'bg-[#C79A44] text-[#12100e] shadow-lg scale-105' 
                  : 'bg-white/5 text-stone-300 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1714] border border-white/15 rounded-full py-2.5 pl-10 pr-4 text-xs text-white placeholder-stone-400 outline-none focus:border-[#C79A44] transition-colors"
          />
          <Search size={15} className="absolute left-3.5 top-3 text-stone-400" />
        </div>
      </motion.div>

      {/* Food Items Grid with Staggered Scroll Animations */}
      {/* Food Items Grid with Smooth GPU-Accelerated Animations */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {filteredItems.map((item, index) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      // 'once: true' stops Framer Motion from recalculating DOM layouts constantly on scroll
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
      // transform-gpu and will-change-transform force GPU acceleration to stop image flickering
      className="bg-[#1a1714] border border-white/10 rounded-2xl overflow-hidden hover:border-[#C79A44]/50 transition-all group flex flex-col justify-between hover:shadow-xl transform-gpu will-change-transform"
    >
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-[#12100e]">
          <img 
            src={item.img} 
            alt={item.name} 
            loading="lazy" // Lazy load images so off-screen assets don't block the UI thread
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 transform-gpu" 
          />
          <span className="absolute top-3 right-3 bg-[#12100e]/80 backdrop-blur px-2.5 py-1 rounded-full text-[11px] text-[#C79A44] font-bold flex items-center gap-1">
            <Star size={12} className="fill-[#C79A44]" /> {item.rating}
          </span>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-sans text-lg font-bold text-white">{item.name}</h3>
            <span className="font-sans font-bold text-[#C79A44] text-lg">${item.price}</span>
          </div>
          <p className="text-stone-400 text-xs leading-relaxed">{item.desc}</p>
        </div>
      </div>
      <div className="p-5 pt-0">
        <button className="w-full bg-[#C79A44]/10 hover:bg-[#C79A44] text-[#C79A44] hover:text-[#12100e] font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-colors flex items-center justify-center gap-2 border border-[#C79A44]/30">
          <ShoppingBag size={14} /> Add To Order
        </button>
      </div>
    </motion.div>
        ))}
      </div>
    </div>
  );
}