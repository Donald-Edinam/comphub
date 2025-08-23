import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { componentsAPI } from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    inStock: 0,
    lowStock: 0
  });
  const [recentComponents, setRecentComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await componentsAPI.getAll();
      if (response.data.success) {
        const components = response.data.data;
        
        // Calculate stats
        const total = components.length;
        const inStock = components.filter(c => c.status === 'Available').length;
        const lowStock = components.filter(c => c.status === 'Low Stock').length;
        
        setStats({ total, inStock, lowStock });
        setRecentComponents(components.slice(0, 5)); // Show last 5 components
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-blue-50 border border-blue-200 aspect-video rounded-xl flex items-center justify-center">
          <div className="text-center">
            <h3 className="font-semibold text-blue-900">Total Components</h3>
            <p className="text-2xl font-bold text-blue-600">{loading ? '...' : stats.total}</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 aspect-video rounded-xl flex items-center justify-center">
          <div className="text-center">
            <h3 className="font-semibold text-green-900">In Stock</h3>
            <p className="text-2xl font-bold text-green-600">{loading ? '...' : stats.inStock}</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 aspect-video rounded-xl flex items-center justify-center">
          <div className="text-center">
            <h3 className="font-semibold text-red-900">Low Stock</h3>
            <p className="text-2xl font-bold text-red-600">{loading ? '...' : stats.lowStock}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white border rounded-xl p-6 min-h-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Components</h2>
          <div className="space-x-2">
            <Link 
              to="/dashboard/components/add"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add Component
            </Link>
            <Link 
              to="/dashboard/components"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p>Loading...</p>
          </div>
        ) : recentComponents.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No components found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first component to track.</p>
            <Link 
              to="/dashboard/components/add"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add Your First Component
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Component</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Quantity</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentComponents.map((component) => (
                  <tr key={component.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center">
                        {component.image_url && (
                          <img 
                            className="h-8 w-8 rounded object-cover mr-3" 
                            src={component.image_url} 
                            alt={component.name}
                          />
                        )}
                        <span className="font-medium">{component.name}</span>
                      </div>
                    </td>
                    <td className="py-3">{component.type || 'N/A'}</td>
                    <td className="py-3">{component.quantity}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        component.status === 'Available' ? 'bg-green-100 text-green-800' :
                        component.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {component.status || 'Available'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}