import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { componentsAPI } from '../../services/api';

export default function AddComponent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [loadingComponent, setLoadingComponent] = useState(isEditMode);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    quantity: '',
    supplier: '',
    price: '',
    status: 'Available',
    description: ''
  });
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // Load component data when in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchComponent();
    }
  }, [isEditMode, id]);

  const fetchComponent = async () => {
    try {
      setLoadingComponent(true);
      const response = await componentsAPI.getById(parseInt(id));

      if (response.data.success) {
        const component = response.data.data;
        setFormData({
          name: component.name || '',
          type: component.type || '',
          quantity: component.quantity?.toString() || '',
          supplier: component.supplier || '',
          price: component.price?.toString() || '',
          status: component.status || 'Available',
          description: component.description || ''
        });
        setCurrentImageUrl(component.image_url || '');
      }
    } catch (error) {
      console.error('Error fetching component:', error);
      setError('Failed to load component data');
    } finally {
      setLoadingComponent(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      if (image) {
        submitData.append('image', image);
      }

      let response;
      if (isEditMode) {
        response = await componentsAPI.update(parseInt(id), submitData);
      } else {
        response = await componentsAPI.create(submitData);
      }

      if (response.data.success) {
        navigate('/dashboard/components');
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} component:`, error);
      setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} component`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingComponent) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading component data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {isEditMode ? 'Edit Component' : 'Add New Component'}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode ? 'Update component information' : 'Add a new spare part to your inventory'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Component Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g., iPhone 12 Screen, USB Cable"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Type/Category
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select type</option>
              <option value="Phone Parts">Phone Parts</option>
              <option value="Laptop Parts">Laptop Parts</option>
              <option value="Electronic Components">Electronic Components</option>
              <option value="Cables & Adapters">Cables & Adapters</option>
              <option value="Batteries">Batteries</option>
              <option value="Tools">Tools</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Price (USD)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Supplier
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Supplier name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Available">Available</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Component Image
          </label>

          {currentImageUrl && (
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-2">Current image:</p>
              <img
                src={currentImageUrl}
                alt="Current component"
                className="h-20 w-20 object-cover rounded-lg border border-border"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-sm text-muted-foreground mt-1">
            {isEditMode ? 'Upload a new image to replace the current one (JPG, PNG)' : 'Upload an image of the component (JPG, PNG)'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Additional details about the component..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            {loading
              ? (isEditMode ? 'Updating...' : 'Adding...')
              : (isEditMode ? 'Update Component' : 'Add Component')
            }
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/components')}
            className="px-6 py-2 border border-border text-foreground rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}