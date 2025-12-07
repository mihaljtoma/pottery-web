import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';

// ============ CATEGORIES ============

export async function getCategories() {
  try {
    const categories = await kv.get('categories');
    
    if (!categories || !Array.isArray(categories)) {
      return [];
    }
    
    return categories.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('getCategories error:', error);
    return [];
  }
}

export async function getCategoryById(id) {
  const categories = await getCategories();
  return categories.find(cat => cat.id === id);
}

export async function getCategoryBySlug(slug) {
  const categories = await getCategories();
  return categories.find(cat => cat.slug === slug);
}

export async function createCategory(categoryData) {
  const categories = await getCategories();
  const newCategory = {
    id: uuidv4(),
    name: categoryData.name,
    slug: categoryData.slug,
    description: categoryData.description || '',
    image: categoryData.image || '', // Image URL support
    order: categoryData.order || categories.length,
    visible: categoryData.visible !== undefined ? categoryData.visible : true,
    createdAt: new Date().toISOString()
  };
  categories.push(newCategory);
  await kv.set('categories', categories);
  return newCategory;
}

export async function updateCategory(id, updates) {
  const categories = await getCategories();
  const index = categories.findIndex(cat => cat.id === id);
  if (index === -1) return null;
  
  categories[index] = { 
    ...categories[index], 
    ...updates,
    // Ensure image field is updated
    image: updates.image !== undefined ? updates.image : categories[index].image
  };
  await kv.set('categories', categories);
  return categories[index];
}

export async function deleteCategory(id) {
  const categories = await getCategories();
  const filtered = categories.filter(cat => cat.id !== id);
  await kv.set('categories', filtered);
  return true;
}

// ============ PRODUCTS ============

export async function getProducts(filters = {}) {
  try {
    let products = await kv.get('products');
    
    // If products is null or not an array, return empty array
    if (!products || !Array.isArray(products)) {
      console.log('No products found or invalid format');
      return [];
    }

    console.log('Found products in DB:', products.length);
    
    let filtered = [...products];

    // Apply filters
    if (filters.categoryId) {
      filtered = filtered.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters.availability) {
      filtered = filtered.filter(p => p.availability === filters.availability);
    }
    
    // FIX: Check for featured properly
    if (filters.featured === 'true' || filters.featured === true) {
      console.log('Filtering for featured products');
      filtered = filtered.filter(p => p.featured === true);
      console.log('Featured products found:', filtered.length);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(search) || 
        p.description?.toLowerCase().includes(search)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('getProducts error:', error);
    return [];
  }
}

export async function getProductById(id) {
  const products = await kv.get('products') || [];
  return products.find(p => p.id === id);
}

export async function createProduct(productData) {
  const products = await kv.get('products') || [];
  const newProduct = {
    id: uuidv4(),
    ...productData,
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  await kv.set('products', products);
  return newProduct;
}

export async function updateProduct(id, updates) {
  const products = await kv.get('products') || [];
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...updates };
  await kv.set('products', products);
  return products[index];
}

export async function deleteProduct(id) {
  const products = await kv.get('products') || [];
  const filtered = products.filter(p => p.id !== id);
  await kv.set('products', filtered);
  return true;
}

// ============ HOME SECTIONS ============

export async function getHomeSections() {
  const sections = await kv.get('home_sections') || getDefaultHomeSections();
  return sections.sort((a, b) => a.order - b.order);
}

export async function updateHomeSection(id, updates) {
  const sections = await getHomeSections();
  const index = sections.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  sections[index] = { ...sections[index], ...updates };
  await kv.set('home_sections', sections);
  return sections[index];
}

function getDefaultHomeSections() {
  return [
    { id: '1', type: 'hero', order: 1, visible: true, data: { title: 'Handcrafted Pottery', subtitle: 'Unique pieces made with love' } },
    { id: '2', type: 'featured-products', order: 2, visible: true, data: { title: 'Featured Work' } },
    { id: '3', type: 'categories', order: 3, visible: true, data: { title: 'Browse by Category' } },
    { id: '4', type: 'recent', order: 4, visible: true, data: { title: 'Recent Creations', limit: 6 } },
    { id: '5', type: 'about-preview', order: 5, visible: true, data: {} },
    { id: '6', type: 'contact', order: 6, visible: true, data: { title: 'Get in Touch' } }
  ];
}

// ============ CONTACT SUBMISSIONS ============

export async function saveContactSubmission(data) {
  const submissions = await kv.get('contact_submissions') || [];
  const newSubmission = {
    id: uuidv4(),
    ...data,
    submittedAt: new Date().toISOString(),
    replied: false
  };
  submissions.push(newSubmission);
  await kv.set('contact_submissions', submissions);
  return newSubmission;
}

export async function getContactSubmissions() {
  return await kv.get('contact_submissions') || [];
}

// ============ SETTINGS ============

// ============ SETTINGS ============

export async function getSettings() {
  const settings = await kv.get('settings');
  return settings || {
    siteName: 'Pottery Studio',
    tagline: 'Handcrafted Pottery with Love',
    aboutText: '',
    contactEmail: 'contact@potterystudio.com',
    contactPhone: '+1 (555) 123-4567',
    studioAddress: '123 Pottery Lane\nArtisan Quarter\nCreative City, CC 12345',
    instagramUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    businessHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '10:00 AM - 3:00 PM',
      sunday: 'Closed'
    }
  };
}

export async function updateSettings(updates) {
  const currentSettings = await getSettings();
  const newSettings = { ...currentSettings, ...updates };
  await kv.set('settings', newSettings);
  return newSettings;
}