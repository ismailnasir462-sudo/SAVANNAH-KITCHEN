import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Search, Upload } from 'lucide-react';
import { useTheme } from '../../context/themecontext';
import { useApp } from '../../context/appcontext';

export default function MenuEditor() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useApp();

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(null);

  // New Item Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Pizza');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('15 mins');
  const [calories, setCalories] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Submission Loading State
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['All', 'Pizza', 'Burgers', 'Pasta', 'Salads', 'Desserts', 'Drinks'];

  // Handle local file upload & Base64 conversion
  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result); // Saves Base64 string to state
    };
    reader.readAsDataURL(file);
  }
};

  // Submit New Dish to MySQL Backend
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !description.trim()) {
      alert("Please fill in all required fields (Dish Name, Price, and Description).");
      return;
    }

    setIsSubmitting(true);

    try {
      // Process comma-separated ingredients into an array or JSON string
      const parsedIngredients = ingredients.trim()
        ? ingredients.split(',').map(item => item.trim())
        : ["Fresh Ingredients", "House Seasoning"];

      const success = await addMenuItem({
        name,
        category,
        price: parseFloat(price),
        rating: 5.0,
        description,
        prep_time: prepTime || '15 mins',
        calories: calories ? `${calories} kcal` : null,
        ingredients: JSON.stringify(parsedIngredients),
        image_url: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
      });

      if (success) {
        // Reset form input states upon success
        setName('');
        setPrice('');
        setDescription('');
        setPrepTime('15 mins');
        setCalories('');
        setIngredients('');
        setImageUrl('');
        alert("Dish published successfully to MySQL!");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit dish. Check backend console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Updated Dish to MySQL Backend
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    const updatedData = {
      ...isEditing,
      ingredients: typeof isEditing.ingredients === 'string'
        ? isEditing.ingredients
        : JSON.stringify(isEditing.ingredients || ["Fresh Ingredients"])
    };

    const success = await updateMenuItem(isEditing.id, updatedData);
    if (success) {
      setIsEditing(null);
    }
  };

  const filteredItems = (menuItems || []).filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Menu Management Editor</h1>
          <p className="text-xs text-stone-400 mt-1">Add, update, or remove food items saved in your MySQL database.</p>
        </div>
      </div>

      {/* --- ADD NEW DISH FORM --- */}
      <form 
        onSubmit={handleAddSubmit} 
        className={`p-6 border rounded-3xl space-y-4 transition-colors ${
          isDark ? 'bg-[#1a1714] border-white/10' : 'bg-white border-black/10 shadow-sm'
        }`}
      >
        <h3 className="font-bold text-sm text-[#C79A44] uppercase tracking-wider flex items-center gap-2">
          <Plus size={16} /> Add New Dish To Menu
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Dish Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`border rounded-xl px-4 py-3 text-xs outline-none focus:border-[#C79A44] ${
              isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15'
            }`}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`border rounded-xl px-4 py-3 text-xs outline-none focus:border-[#C79A44] ${
              isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15'
            }`}
          >
            {categories.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="number"
            step="0.01"
            placeholder="Price (₵) *"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`border rounded-xl px-4 py-3 text-xs outline-none focus:border-[#C79A44] ${
              isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15'
            }`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Prep Time (e.g. 15-20 mins)"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            className={`border rounded-xl px-4 py-3 text-xs outline-none focus:border-[#C79A44] ${
              isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15'
            }`}
          />

          <input
            type="text"
            placeholder="Calories (e.g. 780)"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className={`border rounded-xl px-4 py-3 text-xs outline-none focus:border-[#C79A44] ${
              isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15'
            }`}
          />

          <input
            type="text"
            placeholder="Ingredients (comma separated)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className={`border rounded-xl px-4 py-3 text-xs outline-none focus:border-[#C79A44] ${
              isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15'
            }`}
          />
        </div>

        <textarea
          rows={2}
          placeholder="Short Dish Description *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full border rounded-xl p-4 text-xs outline-none focus:border-[#C79A44] ${
            isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15'
          }`}
        />

        {/* Image Upload Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className={`flex-1 w-full border border-dashed rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-colors ${
            isDark ? 'border-white/20 hover:border-[#C79A44] bg-[#12100e]' : 'border-black/20 hover:border-[#C79A44] bg-[#fcfbf7]'
          }`}>
            <Upload size={16} className="text-[#C79A44]" />
            <span className="text-xs text-stone-400 font-medium">
              {imageUrl ? "Change Uploaded Image" : "Upload Dish Image"}
            </span>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImageUrl)} className="hidden" />
          </label>

          {imageUrl && (
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#C79A44]">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setImageUrl('')}
                className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-bl cursor-pointer"
              >
                <X size={10} />
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl hover:bg-[#b3872f] transition-colors cursor-pointer shadow-md disabled:opacity-50"
          >
            {isSubmitting ? "Publishing..." : "Publish To Database"}
          </button>
        </div>
      </form>

      {/* --- FILTERS & SEARCH --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#C79A44] text-[#12100e] border-[#C79A44]'
                  : isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-[#C79A44] ${
              isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-white border-black/15'
            }`}
          />
          <Search size={14} className="absolute left-3 top-3 text-stone-400" />
        </div>
      </div>

      {/* --- DISH GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <p className="text-xs text-stone-400 italic col-span-2">No menu dishes found in database.</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-2xl flex gap-4 items-center justify-between transition-colors ${
                isDark ? 'bg-[#1a1714] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}
            >
              <img
                src={item.image_url || item.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-white/10"
              />

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm truncate">{item.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C79A44]/10 text-[#C79A44]">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#C79A44]">₵{Number(item.price).toFixed(2)}</p>
                <p className="text-[11px] text-stone-400 line-clamp-2">{item.description}</p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setIsEditing(item)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-[#C79A44] hover:text-[#12100e] transition-colors cursor-pointer text-stone-400"
                  title="Edit Dish"
                >
                  <Edit3 size={15} />
                </button>

                <button
                  onClick={() => deleteMenuItem(item.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-colors cursor-pointer"
                  title="Delete Dish"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- EDIT MODAL OVERLAY --- */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsEditing(null)} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative max-w-lg w-full border rounded-3xl p-6 z-10 shadow-2xl transition-colors max-h-[90vh] overflow-y-auto ${
                isDark ? 'bg-[#1a1714] border-white/10 text-white' : 'bg-white border-black/10 text-[#12100e]'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Edit Dish #{isEditing.id}</h3>
                <button onClick={() => setIsEditing(null)} className="p-1 rounded-full hover:bg-white/10 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Dish Name</label>
                  <input
                    type="text"
                    value={isEditing.name || ''}
                    onChange={(e) => setIsEditing({ ...isEditing, name: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none ${
                      isDark ? 'bg-[#12100e] border-white/15' : 'bg-[#fcfbf7] border-black/15'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Category</label>
                    <select
                      value={isEditing.category || 'Pizza'}
                      onChange={(e) => setIsEditing({ ...isEditing, category: e.target.value })}
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none ${
                        isDark ? 'bg-[#12100e] border-white/15' : 'bg-[#fcfbf7] border-black/15'
                      }`}
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={isEditing.price || ''}
                      onChange={(e) => setIsEditing({ ...isEditing, price: parseFloat(e.target.value) })}
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none ${
                        isDark ? 'bg-[#12100e] border-white/15' : 'bg-[#fcfbf7] border-black/15'
                      }`}
                    />
                  </div>
                </div>

                {/* Image Update Row */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Dish Image</label>
                  <div className="flex items-center gap-3">
                    <label className={`flex-1 border border-dashed rounded-xl p-2.5 flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      isDark ? 'border-white/20 hover:border-[#C79A44] bg-[#12100e]' : 'border-black/20 hover:border-[#C79A44] bg-[#fcfbf7]'
                    }`}>
                      <Upload size={14} className="text-[#C79A44]" />
                      <span className="text-xs text-stone-400">Swap Dish Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, (res) => setIsEditing({ ...isEditing, image_url: res }))} 
                        className="hidden" 
                      />
                    </label>

                    {(isEditing.image_url || isEditing.img) && (
                      <img 
                        src={isEditing.image_url || isEditing.img} 
                        alt="Edit preview" 
                        className="w-10 h-10 rounded-lg object-cover border border-[#C79A44]"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={isEditing.description || ''}
                    onChange={(e) => setIsEditing({ ...isEditing, description: e.target.value })}
                    className={`w-full border rounded-xl p-3 text-xs outline-none ${
                      isDark ? 'bg-[#12100e] border-white/15' : 'bg-[#fcfbf7] border-black/15'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-[#b3872f] transition-colors cursor-pointer"
                >
                  Save Dish Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}