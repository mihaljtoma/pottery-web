import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';
import { autoTranslate, translateObject } from './translate';



// ==================== CATEGORIES ====================

export async function getCategories(locale = 'hr') {
  try {
    const categories = await kv.get('categories');
    
    if (!categories || !Array.isArray(categories)) {
      return [];
    }
    
    // Localize categories
    const localized = categories.map(cat => ({
      ...cat,
      name: cat.translations?.[locale]?.name || cat.name,
      description: cat.translations?.[locale]?.description || cat.description,
    }));
    
    return localized.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('getCategories error:', error);
    return [];
  }
}

export async function getCategoryById(id, locale = 'hr') {
  const categories = await getCategories(locale);
  return categories.find(cat => cat.id === id);
}

export async function getCategoryBySlug(slug, locale = 'hr') {
  const categories = await getCategories(locale);
  return categories.find(cat => cat.slug === slug);
}

export async function createCategory(categoryData) {
  try {
    const categories = await kv.get('categories') || [];
    
    // Auto-translate
    const translatedName = await autoTranslate(categoryData.name, 'en');
    const translatedDesc = await autoTranslate(categoryData.description || '', 'en');

    const newCategory = {
      id: uuidv4(),
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description || '',
      image: categoryData.image || '',
      order: categoryData.order || categories.length,
      visible: categoryData.visible !== undefined ? categoryData.visible : true,
      translations: {
        hr: {
          name: categoryData.name,
          description: categoryData.description || '',
        },
        en: {
          name: translatedName,
          description: translatedDesc,
        }
      },
      createdAt: new Date().toISOString()
    };
    
    categories.push(newCategory);
    await kv.set('categories', categories);
    return newCategory;
  } catch (error) {
    console.error('createCategory error:', error);
    throw error;
  }
}

export async function updateCategory(id, updates) {
  try {
    const categories = await kv.get('categories') || [];
    const index = categories.findIndex(cat => cat.id === id);
    if (index === -1) return null;
    
    let translatedUpdates = { ...updates };
    
    // Auto-translate name
    if (updates.name) {
      const translatedName = await autoTranslate(updates.name, 'en');
      translatedUpdates.translations = {
        ...categories[index].translations,
        hr: {
          ...categories[index].translations?.hr,
          name: updates.name,
        },
        en: {
          ...categories[index].translations?.en,
          name: translatedName,
        }
      };
    }
    
    // Auto-translate description
    if (updates.description) {
      const translatedDesc = await autoTranslate(updates.description, 'en');
      translatedUpdates.translations = {
        ...translatedUpdates.translations,
        hr: {
          ...translatedUpdates.translations?.hr,
          description: updates.description,
        },
        en: {
          ...translatedUpdates.translations?.en,
          description: translatedDesc,
        }
      };
    }
    
    categories[index] = {
      ...categories[index],
      ...translatedUpdates,
      image: updates.image !== undefined ? updates.image : categories[index].image
    };
    
    await kv.set('categories', categories);
    return categories[index];
  } catch (error) {
    console.error('updateCategory error:', error);
    throw error;
  }
}

export async function deleteCategory(id) {
  const categories = await kv.get('categories') || [];
  const filtered = categories.filter(cat => cat.id !== id);
  await kv.set('categories', filtered);
  return true;
}
// ============ PRODUCTS ============

export async function getProducts(filters = {}, locale = 'hr') {
  try {
    let products = await kv.get('products');
    
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
    
    if (filters.featured === 'true' || filters.featured === true) {
      console.log('Filtering for featured products');
      filtered = filtered.filter(p => p.featured === true);
      console.log('Featured products found:', filtered.length);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => {
        const name = p.translations?.[locale]?.name?.toLowerCase() || p.name?.toLowerCase();
        const desc = p.translations?.[locale]?.description?.toLowerCase() || p.description?.toLowerCase();
        return name.includes(search) || desc.includes(search);
      });
    }

    // Localize products
    const localized = filtered.map(p => ({
      ...p,
      name: p.translations?.[locale]?.name || p.name,
      description: p.translations?.[locale]?.description || p.description,
    }));

    return localized.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('getProducts error:', error);
    return [];
  }
}

export async function getProductById(id, locale = 'hr') {
  const products = await kv.get('products') || [];
  const product = products.find(p => p.id === id);
  
  if (!product) return null;
  
  // Localize
  return {
    ...product,
    name: product.translations?.[locale]?.name || product.name,
    description: product.translations?.[locale]?.description || product.description,
  };
}

export async function createProduct(productData) {
  try {
    const products = await kv.get('products') || [];
    
    // Auto-translate HR → EN
    const translatedName = await autoTranslate(productData.name, 'en');
    const translatedDesc = await autoTranslate(productData.description, 'en');

    const newProduct = {
      id: uuidv4(),
      ...productData,
      translations: {
        hr: {
          name: productData.name,
          description: productData.description,
        },
        en: {
          name: translatedName,
          description: translatedDesc,
        }
      },
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    await kv.set('products', products);
    return newProduct;
  } catch (error) {
    console.error('createProduct error:', error);
    throw error;
  }
}

export async function updateProduct(id, updates) {
  try {
    const products = await kv.get('products') || [];
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    // Auto-translate ako se mijenja name ili description
    let translatedUpdates = { ...updates };
    
    if (updates.name) {
      translatedUpdates.translations = {
        ...products[index].translations,
        hr: {
          ...products[index].translations?.hr,
          name: updates.name,
        },
        en: {
          ...products[index].translations?.en,
          name: await autoTranslate(updates.name, 'en'),
        }
      };
    }
    
    if (updates.description) {
      translatedUpdates.translations = {
        ...translatedUpdates.translations,
        hr: {
          ...translatedUpdates.translations?.hr,
          description: updates.description,
        },
        en: {
          ...translatedUpdates.translations?.en,
          description: await autoTranslate(updates.description, 'en'),
        }
      };
    }
    
    products[index] = { ...products[index], ...translatedUpdates };
    await kv.set('products', products);
    return products[index];
  } catch (error) {
    console.error('updateProduct error:', error);
    throw error;
  }
}

export async function deleteProduct(id) {
  const products = await kv.get('products') || [];
  const filtered = products.filter(p => p.id !== id);
  await kv.set('products', filtered);
  return true;
}

// ============ HOMEPAGE SECTIONS ============

export async function getHomepageSections() {
  try {
    const sections = await kv.get('homepage_sections');
    
    if (!sections || !Array.isArray(sections)) {
      // Return default sections if none exist
      return [
        { id: 'hero', name: 'Hero', enabled: true, order: 0 },
        { id: 'featured-products', name: 'Featured Products', enabled: true, order: 1 },
        { id: 'categories', name: 'Categories Showcase', enabled: true, order: 2 },
        { id: 'social-gallery', name: 'Social Gallery', enabled: true, order: 3 },
        { id: 'testimonials', name: 'Testimonials', enabled: true, order: 4 },
        { id: 'contact', name: 'Contact Form', enabled: true, order: 5 }
      ];
    }
    
    return sections.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('getHomepageSections error:', error);
    return [];
  }
}

export async function updateHomepageSections(sections) {
  try {
    await kv.set('homepage_sections', sections);
    return sections;
  } catch (error) {
    console.error('updateHomepageSections error:', error);
    return null;
  }
}

export async function updateSectionOrder(sections) {
  try {
    const sorted = sections.sort((a, b) => a.order - b.order);
    await kv.set('homepage_sections', sorted);
    return sorted;
  } catch (error) {
    console.error('updateSectionOrder error:', error);
    return null;
  }
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

// ============ TESTIMONIALS ============

export async function getTestimonials(locale = 'hr') {
  try {
    const testimonials = await kv.get('testimonials');
    
    if (!testimonials || !Array.isArray(testimonials)) {
      return [];
    }
    
    // Localize testimonials
    const localized = testimonials.map(t => ({
      ...t,
      text: t.translations?.[locale]?.text || t.text,
    }));
    
    return localized.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('getTestimonials error:', error);
    return [];
  }
}

export async function getTestimonialById(id, locale = 'hr') {
  const testimonials = await getTestimonials(locale);
  return testimonials.find(t => t.id === id);
}

export async function createTestimonial(testimonialData) {
  try {
    const testimonials = await kv.get('testimonials') || [];
    
    // Auto-translate
    const translatedText = await autoTranslate(testimonialData.text, 'en');

    const newTestimonial = {
      id: uuidv4(),
      name: testimonialData.name,
      location: testimonialData.location || '',
      text: testimonialData.text,
      rating: testimonialData.rating || 5,
      image: testimonialData.image || '',
      order: testimonialData.order || testimonials.length,
      visible: testimonialData.visible !== undefined ? testimonialData.visible : true,
      translations: {
        hr: {
          text: testimonialData.text,
        },
        en: {
          text: translatedText,
        }
      },
      createdAt: new Date().toISOString()
    };
    
    testimonials.push(newTestimonial);
    await kv.set('testimonials', testimonials);
    return newTestimonial;
  } catch (error) {
    console.error('createTestimonial error:', error);
    throw error;
  }
}

export async function updateTestimonial(id, updates) {
  try {
    const testimonials = await kv.get('testimonials') || [];
    const index = testimonials.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    let translatedUpdates = { ...updates };
    
    // Auto-translate text
    if (updates.text) {
      const translatedText = await autoTranslate(updates.text, 'en');
      translatedUpdates.translations = {
        ...testimonials[index].translations,
        hr: {
          ...testimonials[index].translations?.hr,
          text: updates.text,
        },
        en: {
          ...testimonials[index].translations?.en,
          text: translatedText,
        }
      };
    }
    
    testimonials[index] = {
      ...testimonials[index],
      ...translatedUpdates,
      image: updates.image !== undefined ? updates.image : testimonials[index].image
    };
    
    await kv.set('testimonials', testimonials);
    return testimonials[index];
  } catch (error) {
    console.error('updateTestimonial error:', error);
    throw error;
  }
}

export async function deleteTestimonial(id) {
  const testimonials = await kv.get('testimonials') || [];
  const filtered = testimonials.filter(t => t.id !== id);
  await kv.set('testimonials', filtered);
  return true;
}