export function getMockCategories() {
  return [
    { id: 'all', name: 'All', icon: 'LayoutGrid', slug: 'all', order_index: 0 },
    { id: '1', name: 'Food & Dining', icon: 'Utensils', slug: 'food-dining', order_index: 1 },
    { id: '2', name: 'Groceries & Kirana', icon: 'ShoppingBag', slug: 'groceries-kirana', order_index: 2 },
    { id: '3', name: 'Fashion & Clothing', icon: 'Shirt', slug: 'fashion-clothing', order_index: 3 },
    { id: '4', name: 'Electronics & Mobile', icon: 'Smartphone', slug: 'electronics-mobile', order_index: 4 },
    { id: '5', name: 'Home Services', icon: 'Wrench', slug: 'home-services', order_index: 5 },
    { id: '6', name: 'Beauty & Salon', icon: 'Sparkles', slug: 'beauty-salon', order_index: 6 },
    { id: '7', name: 'Medical & Health', icon: 'Stethoscope', slug: 'medical-health', order_index: 7 },
    { id: '8', name: 'Education & Coaching', icon: 'GraduationCap', slug: 'education-coaching', order_index: 8 },
    { id: '9', name: 'Real Estate', icon: 'Home', slug: 'real-estate', order_index: 9 },
    { id: '10', name: 'Automobile', icon: 'Car', slug: 'automobile', order_index: 10 },
    { id: '11', name: 'Furniture & Decor', icon: 'Armchair', slug: 'furniture-decor', order_index: 11 },
    { id: '12', name: 'Events & Wedding', icon: 'PartyPopper', slug: 'events-wedding', order_index: 12 },
    { id: '13', name: 'Jewelry & Gems', icon: 'Gem', slug: 'jewelry-gems', order_index: 13 },
    { id: '14', name: 'Gym & Fitness', icon: 'Dumbbell', slug: 'gym-fitness', order_index: 14 },
    { id: '15', name: 'Travel & Transport', icon: 'Plane', slug: 'travel-transport', order_index: 15 },
    { id: '16', name: 'Pets & Animals', icon: 'Dog', slug: 'pets-animals', order_index: 16 },
    { id: '17', name: 'Hardware & Tools', icon: 'Hammer', slug: 'hardware-tools', order_index: 17 },
    { id: '18', name: 'Legal & Finance', icon: 'Scale', slug: 'legal-finance', order_index: 18 },
    { id: '19', name: 'Books & Stationery', icon: 'BookOpen', slug: 'books-stationery', order_index: 19 },
    { id: '20', name: 'Arts & Crafts', icon: 'Palette', slug: 'arts-crafts', order_index: 20 },
    { id: '21', name: 'Jobs & Consultancy', icon: 'Briefcase', slug: 'jobs-consultancy', order_index: 21 },
    { id: '22', name: 'Other', icon: 'MoreHorizontal', slug: 'other', order_index: 22 }
  ];
}

export function getMockBusinesses(categorySlug?: string) {
  const all = [
    { id: '101', name: 'Delhi Spice Hub', category_id: '1', category_slug: 'food-dining', category_name: 'Food & Dining', description: 'Best North Indian food in the heart of Delhi. We specialize in Tandoori and Mughlai cuisines.', phone: '9876543210', whatsapp: '9876543210', address: 'Connaught Place', city: 'Delhi', state: 'Delhi', pincode: '110001', is_verified: true, is_prime: true, image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
    { id: '102', name: 'Tech World Delhi', category_id: '4', category_slug: 'electronics-mobile', category_name: 'Electronics & Mobile', description: 'All kinds of gadgets, smartphones and accessories. Authorized service center for major brands.', phone: '9876543211', whatsapp: '9876543211', address: 'Nehru Place', city: 'Delhi', state: 'Delhi', pincode: '110019', is_verified: true, is_prime: false, image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80' },
    { id: '103', name: 'Royal Fashion Boutique', category_id: '3', category_slug: 'fashion-clothing', category_name: 'Fashion & Clothing', description: 'Exclusive designer wear for weddings and special occasions. Custom tailoring available.', phone: '9876543212', whatsapp: '9876543212', address: 'South Extension', city: 'Delhi', state: 'Delhi', pincode: '110049', is_verified: true, is_prime: true, image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' },
    { id: '104', name: 'Green Kirana Store', category_id: '2', category_slug: 'groceries-kirana', category_name: 'Groceries & Kirana', description: 'Fresh groceries and daily essentials at best prices. Home delivery available.', phone: '9876543213', whatsapp: '9876543213', address: 'Rohini Sector 7', city: 'Delhi', state: 'Delhi', pincode: '110085', is_verified: false, is_prime: false, image_url: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=800&q=80' },
    { id: '105', name: 'Modern Home Decor', category_id: '11', category_slug: 'furniture-decor', category_name: 'Furniture & Decor', description: 'Contemporary furniture and home styling solutions. Transform your living space.', phone: '9876543214', whatsapp: '9876543214', address: 'Kirti Nagar', city: 'Delhi', state: 'Delhi', pincode: '110015', is_verified: true, is_prime: true, image_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80' },
    { id: '106', name: 'City Health Clinic', category_id: '7', category_slug: 'medical-health', category_name: 'Medical & Health', description: 'Multi-specialty clinic with experienced doctors. Lab tests and pharmacy available.', phone: '9876543215', whatsapp: '9876543215', address: 'Dwarka Sector 10', city: 'Delhi', state: 'Delhi', pincode: '110075', is_verified: true, is_prime: false, image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80' },
  ];
  return categorySlug && categorySlug !== 'all' ? all.filter(b => b.category_slug === categorySlug) : all;
}
