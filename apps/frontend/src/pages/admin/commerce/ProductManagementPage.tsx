import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManagementPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    product_type: 'single_issue',
    slug: '',
    title: '',
    subtitle: '',
    cover_image_url: '',
    thumbnail_url: '',
    preview_url: '',
    file_key: '',
    file_size_bytes: 0,
    file_type: '',
    page_count: 0,
    word_count: 0,
    isbn: '',
    publisher: '',
    language_code: 'en',
    is_bundle: false,
    is_subscription: false,
    is_premium: false,
    is_featured: false,
    is_digital: true,
    requires_shipping: false,
    active: true,
    status: 'draft',
    published_at: '',
    metadata: '{}',
    seo_title: '',
    seo_description: '',
    stripe_product_id: '',
    images: '',
    track_inventory: false,
    inventory_quantity: 0,
    allow_backorders: false,
    price_cents: 0,
    sort_order: 0,
    category_id: '',
    work_id: '',
    content_grants: '{}'
  });
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/commerce/products');
      setProducts(data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/commerce/products/${id}`);
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product.');
      }
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        file_size_bytes: parseInt(newProduct.file_size_bytes as any),
        page_count: parseInt(newProduct.page_count as any),
        word_count: parseInt(newProduct.word_count as any),
        price_cents: parseInt(newProduct.price_cents as any),
        sort_order: parseInt(newProduct.sort_order as any),
        inventory_quantity: parseInt(newProduct.inventory_quantity as any),
        images: newProduct.images.split(',').map(img => img.trim()),
        metadata: JSON.parse(newProduct.metadata || '{}'),
        content_grants: JSON.parse(newProduct.content_grants || '{}'),
        published_at: newProduct.published_at ? new Date(newProduct.published_at).toISOString() : null,
      };
      await axios.post('/api/commerce/products', { productData });
      setShowCreateModal(false);
      setNewProduct({
        name: '',
        description: '',
        product_type: 'single_issue',
        slug: '',
        title: '',
        subtitle: '',
        cover_image_url: '',
        thumbnail_url: '',
        preview_url: '',
        file_key: '',
        file_size_bytes: 0,
        file_type: '',
        page_count: 0,
        word_count: 0,
        isbn: '',
        publisher: '',
        language_code: 'en',
        is_bundle: false,
        is_subscription: false,
        is_premium: false,
        is_featured: false,
        is_digital: true,
        requires_shipping: false,
        active: true,
        status: 'draft',
        published_at: '',
        metadata: '{}',
        seo_title: '',
        seo_description: '',
        stripe_product_id: '',
        images: '',
        track_inventory: false,
        inventory_quantity: 0,
        allow_backorders: false,
        price_cents: 0,
        sort_order: 0,
        category_id: '',
        work_id: '',
        content_grants: '{}'
      });
      fetchProducts(); // Refresh the list of products
    } catch (err) {
      console.error('Error creating product:', err);
      setError('Failed to create product.');
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const productData = {
        ...editingProduct,
        file_size_bytes: parseInt(editingProduct.file_size_bytes as any),
        page_count: parseInt(editingProduct.page_count as any),
        word_count: parseInt(editingProduct.word_count as any),
        price_cents: parseInt(editingProduct.price_cents as any),
        sort_order: parseInt(editingProduct.sort_order as any),
        inventory_quantity: parseInt(editingProduct.inventory_quantity as any),
        images: Array.isArray(editingProduct.images) ? editingProduct.images.join(', ') : editingProduct.images.split(',').map((img: string) => img.trim()),
        metadata: JSON.parse(editingProduct.metadata || '{}'),
        content_grants: JSON.parse(editingProduct.content_grants || '{}'),
        published_at: editingProduct.published_at ? new Date(editingProduct.published_at).toISOString() : null,
      };
      await axios.put(`/api/commerce/products/${editingProduct.id}`, { productData });
      setShowEditModal(false);
      setEditingProduct(null);
      fetchProducts(); // Refresh the list of products
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product.');
    }
  };

  const openEditModal = (product: any) => {
    setEditingProduct({ 
      ...product, 
      file_size_bytes: product.file_size_bytes || 0,
      page_count: product.page_count || 0,
      word_count: product.word_count || 0,
      price_cents: product.price_cents || 0,
      sort_order: product.sort_order || 0,
      inventory_quantity: product.inventory_quantity || 0,
      images: Array.isArray(product.images) ? product.images.join(', ') : '',
      metadata: JSON.stringify(product.metadata || {}, null, 2),
      content_grants: JSON.stringify(product.content_grants || {}, null, 2),
      published_at: product.published_at ? new Date(product.published_at).toISOString().slice(0, 16) : ''
    });
    setShowEditModal(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="mb-4">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Product
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: any) => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.product_type}</td>
              <td className="border px-4 py-2">{product.active ? 'Active' : 'Inactive'}</td>
              <td className="border px-4 py-2">
                <button 
                  onClick={() => openEditModal(product)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
            <h2 className="text-xl font-bold mb-4">Create New Product</h2>
            <form onSubmit={handleCreateProduct}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_type">Product Type</label>
                <select
                  id="product_type"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.product_type}
                  onChange={(e) => setNewProduct({ ...newProduct, product_type: e.target.value as any })}
                  required
                >
                  <option value="single_issue">Single Issue</option>
                  <option value="bundle">Bundle</option>
                  <option value="chapter_pass">Chapter Pass</option>
                  <option value="arc_pass">Arc Pass</option>
                  <option value="subscription">Subscription</option>
                  <option value="arc_bundle">Arc Bundle</option>
                  <option value="saga_bundle">Saga Bundle</option>
                  <option value="volume_bundle">Volume Bundle</option>
                  <option value="book_bundle">Book Bundle</option>
                  <option value="subscription_tier">Subscription Tier</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">Slug</label>
                <input
                  type="text"
                  id="slug"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.slug}
                  onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subtitle">Subtitle</label>
                <input
                  type="text"
                  id="subtitle"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.subtitle}
                  onChange={(e) => setNewProduct({ ...newProduct, subtitle: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cover_image_url">Cover Image URL</label>
                <input
                  type="text"
                  id="cover_image_url"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.cover_image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, cover_image_url: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="thumbnail_url">Thumbnail URL</label>
                <input
                  type="text"
                  id="thumbnail_url"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.thumbnail_url}
                  onChange={(e) => setNewProduct({ ...newProduct, thumbnail_url: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="preview_url">Preview URL</label>
                <input
                  type="text"
                  id="preview_url"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.preview_url}
                  onChange={(e) => setNewProduct({ ...newProduct, preview_url: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file_key">File Key</label>
                <input
                  type="text"
                  id="file_key"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.file_key}
                  onChange={(e) => setNewProduct({ ...newProduct, file_key: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file_size_bytes">File Size (bytes)</label>
                <input
                  type="number"
                  id="file_size_bytes"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.file_size_bytes}
                  onChange={(e) => setNewProduct({ ...newProduct, file_size_bytes: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file_type">File Type</label>
                <input
                  type="text"
                  id="file_type"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.file_type}
                  onChange={(e) => setNewProduct({ ...newProduct, file_type: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="page_count">Page Count</label>
                <input
                  type="number"
                  id="page_count"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.page_count}
                  onChange={(e) => setNewProduct({ ...newProduct, page_count: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="word_count">Word Count</label>
                <input
                  type="number"
                  id="word_count"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.word_count}
                  onChange={(e) => setNewProduct({ ...newProduct, word_count: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isbn">ISBN</label>
                <input
                  type="text"
                  id="isbn"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.isbn}
                  onChange={(e) => setNewProduct({ ...newProduct, isbn: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisher">Publisher</label>
                <input
                  type="text"
                  id="publisher"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.publisher}
                  onChange={(e) => setNewProduct({ ...newProduct, publisher: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language_code">Language Code</label>
                <input
                  type="text"
                  id="language_code"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.language_code}
                  onChange={(e) => setNewProduct({ ...newProduct, language_code: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="is_bundle">Is Bundle</label>
                <input
                  type="checkbox"
                  id="is_bundle"
                  className="mr-2 leading-tight"
                  checked={newProduct.is_bundle}
                  onChange={(e) => setNewProduct({ ...newProduct, is_bundle: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="is_subscription">Is Subscription</label>
                <input
                  type="checkbox"
                  id="is_subscription"
                  className="mr-2 leading-tight"
                  checked={newProduct.is_subscription}
                  onChange={(e) => setNewProduct({ ...newProduct, is_subscription: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="is_premium">Is Premium</label>
                <input
                  type="checkbox"
                  id="is_premium"
                  className="mr-2 leading-tight"
                  checked={newProduct.is_premium}
                  onChange={(e) => setNewProduct({ ...newProduct, is_premium: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="is_featured">Is Featured</label>
                <input
                  type="checkbox"
                  id="is_featured"
                  className="mr-2 leading-tight"
                  checked={newProduct.is_featured}
                  onChange={(e) => setNewProduct({ ...newProduct, is_featured: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="is_digital">Is Digital</label>
                <input
                  type="checkbox"
                  id="is_digital"
                  className="mr-2 leading-tight"
                  checked={newProduct.is_digital}
                  onChange={(e) => setNewProduct({ ...newProduct, is_digital: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requires_shipping">Requires Shipping</label>
                <input
                  type="checkbox"
                  id="requires_shipping"
                  className="mr-2 leading-tight"
                  checked={newProduct.requires_shipping}
                  onChange={(e) => setNewProduct({ ...newProduct, requires_shipping: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="active">Active</label>
                <input
                  type="checkbox"
                  id="active"
                  className="mr-2 leading-tight"
                  checked={newProduct.active}
                  onChange={(e) => setNewProduct({ ...newProduct, active: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">Status</label>
                <select
                  id="status"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.status}
                  onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                  <option value="deleted">Deleted</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="published_at">Published At</label>
                <input
                  type="datetime-local"
                  id="published_at"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.published_at}
                  onChange={(e) => setNewProduct({ ...newProduct, published_at: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="metadata">Metadata (JSON)</label>
                <textarea
                  id="metadata"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  value={newProduct.metadata}
                  onChange={(e) => setNewProduct({ ...newProduct, metadata: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="seo_title">SEO Title</label>
                <input
                  type="text"
                  id="seo_title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.seo_title}
                  onChange={(e) => setNewProduct({ ...newProduct, seo_title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="seo_description">SEO Description</label>
                <textarea
                  id="seo_description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                  value={newProduct.seo_description}
                  onChange={(e) => setNewProduct({ ...newProduct, seo_description: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stripe_product_id">Stripe Product ID</label>
                <input
                  type="text"
                  id="stripe_product_id"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.stripe_product_id}
                  onChange={(e) => setNewProduct({ ...newProduct, stripe_product_id: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">Images (comma-separated URLs)</label>
                <input
                  type="text"
                  id="images"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.images}
                  onChange={(e) => setNewProduct({ ...newProduct, images: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="track_inventory">Track Inventory</label>
                <input
                  type="checkbox"
                  id="track_inventory"
                  className="mr-2 leading-tight"
                  checked={newProduct.track_inventory}
                  onChange={(e) => setNewProduct({ ...newProduct, track_inventory: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="inventory_quantity">Inventory Quantity</label>
                <input
                  type="number"
                  id="inventory_quantity"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.inventory_quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, inventory_quantity: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allow_backorders">Allow Backorders</label>
                <input
                  type="checkbox"
                  id="allow_backorders"
                  className="mr-2 leading-tight"
                  checked={newProduct.allow_backorders}
                  onChange={(e) => setNewProduct({ ...newProduct, allow_backorders: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price_cents">Price (cents)</label>
                <input
                  type="number"
                  id="price_cents"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.price_cents}
                  onChange={(e) => setNewProduct({ ...newProduct, price_cents: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sort_order">Sort Order</label>
                <input
                  type="number"
                  id="sort_order"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.sort_order}
                  onChange={(e) => setNewProduct({ ...newProduct, sort_order: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category_id">Category ID (Optional)</label>
                <input
                  type="text"
                  id="category_id"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="work_id">Work ID (Optional)</label>
                <input
                  type="text"
                  id="work_id"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newProduct.work_id}
                  onChange={(e) => setNewProduct({ ...newProduct, work_id: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content_grants">Content Grants (JSON)</label>
                <textarea
                  id="content_grants"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  value={newProduct.content_grants}
                  onChange={(e) => setNewProduct({ ...newProduct, content_grants: e.target.value })}
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleEditProduct}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">Name</label>
                <input
                  type="text"
                  id="edit-name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-product_type">Product Type</label>
                <select
                  id="edit-product_type"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.product_type}
                  onChange={(e) => setEditingProduct({ ...editingProduct, product_type: e.target.value })}
                  required
                >
                  <option value="single_issue">Single Issue</option>
                  <option value="bundle">Bundle</option>
                  <option value="chapter_pass">Chapter Pass</option>
                  <option value="arc_pass">Arc Pass</option>
                  <option value="subscription">Subscription</option>
                  <option value="arc_bundle">Arc Bundle</option>
                  <option value="saga_bundle">Saga Bundle</option>
                  <option value="volume_bundle">Volume Bundle</option>
                  <option value="book_bundle">Book Bundle</option>
                  <option value="subscription_tier">Subscription Tier</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-slug">Slug</label>
                <input
                  type="text"
                  id="edit-slug"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.slug}
                  onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-title">Title</label>
                <input
                  type="text"
                  id="edit-title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-subtitle">Subtitle</label>
                <input
                  type="text"
                  id="edit-subtitle"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.subtitle}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-cover_image_url">Cover Image URL</label>
                <input
                  type="text"
                  id="edit-cover_image_url"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.cover_image_url}
                  onChange={(e) => setEditingProduct({ ...editingProduct, cover_image_url: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-thumbnail_url">Thumbnail URL</label>
                <input
                  type="text"
                  id="edit-thumbnail_url"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.thumbnail_url}
                  onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail_url: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-preview_url">Preview URL</label>
                <input
                  type="text"
                  id="edit-preview_url"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.preview_url}
                  onChange={(e) => setEditingProduct({ ...editingProduct, preview_url: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-file_key">File Key</label>
                <input
                  type="text"
                  id="edit-file_key"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.file_key}
                  onChange={(e) => setEditingProduct({ ...editingProduct, file_key: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-file_size_bytes">File Size (bytes)</label>
                <input
                  type="number"
                  id="edit-file_size_bytes"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.file_size_bytes}
                  onChange={(e) => setEditingProduct({ ...editingProduct, file_size_bytes: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-file_type">File Type</label>
                <input
                  type="text"
                  id="edit-file_type"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.file_type}
                  onChange={(e) => setEditingProduct({ ...editingProduct, file_type: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-page_count">Page Count</label>
                <input
                  type="number"
                  id="edit-page_count"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.page_count}
                  onChange={(e) => setEditingProduct({ ...editingProduct, page_count: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-word_count">Word Count</label>
                <input
                  type="number"
                  id="edit-word_count"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.word_count}
                  onChange={(e) => setEditingProduct({ ...editingProduct, word_count: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-isbn">ISBN</label>
                <input
                  type="text"
                  id="edit-isbn"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.isbn}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isbn: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-publisher">Publisher</label>
                <input
                  type="text"
                  id="edit-publisher"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.publisher}
                  onChange={(e) => setEditingProduct({ ...editingProduct, publisher: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-language_code">Language Code</label>
                <input
                  type="text"
                  id="edit-language_code"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.language_code}
                  onChange={(e) => setEditingProduct({ ...editingProduct, language_code: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-is_bundle">Is Bundle</label>
                <input
                  type="checkbox"
                  id="edit-is_bundle"
                  className="mr-2 leading-tight"
                  checked={editingProduct.is_bundle}
                  onChange={(e) => setEditingProduct({ ...editingProduct, is_bundle: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-is_subscription">Is Subscription</label>
                <input
                  type="checkbox"
                  id="edit-is_subscription"
                  className="mr-2 leading-tight"
                  checked={editingProduct.is_subscription}
                  onChange={(e) => setEditingProduct({ ...editingProduct, is_subscription: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-is_premium">Is Premium</label>
                <input
                  type="checkbox"
                  id="edit-is_premium"
                  className="mr-2 leading-tight"
                  checked={editingProduct.is_premium}
                  onChange={(e) => setEditingProduct({ ...editingProduct, is_premium: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-is_featured">Is Featured</label>
                <input
                  type="checkbox"
                  id="edit-is_featured"
                  className="mr-2 leading-tight"
                  checked={editingProduct.is_featured}
                  onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-is_digital">Is Digital</label>
                <input
                  type="checkbox"
                  id="edit-is_digital"
                  className="mr-2 leading-tight"
                  checked={editingProduct.is_digital}
                  onChange={(e) => setEditingProduct({ ...editingProduct, is_digital: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-requires_shipping">Requires Shipping</label>
                <input
                  type="checkbox"
                  id="edit-requires_shipping"
                  className="mr-2 leading-tight"
                  checked={editingProduct.requires_shipping}
                  onChange={(e) => setEditingProduct({ ...editingProduct, requires_shipping: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-active">Active</label>
                <input
                  type="checkbox"
                  id="edit-active"
                  className="mr-2 leading-tight"
                  checked={editingProduct.active}
                  onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-status">Status</label>
                <select
                  id="edit-status"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.status}
                  onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                  <option value="deleted">Deleted</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-published_at">Published At</label>
                <input
                  type="datetime-local"
                  id="edit-published_at"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.published_at}
                  onChange={(e) => setEditingProduct({ ...editingProduct, published_at: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-metadata">Metadata (JSON)</label>
                <textarea
                  id="edit-metadata"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  value={editingProduct.metadata}
                  onChange={(e) => setEditingProduct({ ...editingProduct, metadata: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-seo_title">SEO Title</label>
                <input
                  type="text"
                  id="edit-seo_title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.seo_title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, seo_title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-seo_description">SEO Description</label>
                <textarea
                  id="edit-seo_description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                  value={editingProduct.seo_description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, seo_description: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-stripe_product_id">Stripe Product ID</label>
                <input
                  type="text"
                  id="edit-stripe_product_id"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.stripe_product_id}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stripe_product_id: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-images">Images (comma-separated URLs)</label>
                <input
                  type="text"
                  id="edit-images"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.images}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-track_inventory">Track Inventory</label>
                <input
                  type="checkbox"
                  id="edit-track_inventory"
                  className="mr-2 leading-tight"
                  checked={editingProduct.track_inventory}
                  onChange={(e) => setEditingProduct({ ...editingProduct, track_inventory: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-inventory_quantity">Inventory Quantity</label>
                <input
                  type="number"
                  id="edit-inventory_quantity"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.inventory_quantity}
                  onChange={(e) => setEditingProduct({ ...editingProduct, inventory_quantity: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-allow_backorders">Allow Backorders</label>
                <input
                  type="checkbox"
                  id="edit-allow_backorders"
                  className="mr-2 leading-tight"
                  checked={editingProduct.allow_backorders}
                  onChange={(e) => setEditingProduct({ ...editingProduct, allow_backorders: e.target.checked })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-price_cents">Price (cents)</label>
                <input
                  type="number"
                  id="edit-price_cents"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.price_cents}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price_cents: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-sort_order">Sort Order</label>
                <input
                  type="number"
                  id="edit-sort_order"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.sort_order}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sort_order: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-category_id">Category ID (Optional)</label>
                <input
                  type="text"
                  id="edit-category_id"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.category_id}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-work_id">Work ID (Optional)</label>
                <input
                  type="text"
                  id="edit-work_id"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingProduct.work_id}
                  onChange={(e) => setEditingProduct({ ...editingProduct, work_id: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-content_grants">Content Grants (JSON)</label>
                <textarea
                  id="edit-content_grants"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  value={editingProduct.content_grants}
                  onChange={(e) => setEditingProduct({ ...editingProduct, content_grants: e.target.value })}
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;
