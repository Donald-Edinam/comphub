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
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 aspect-video rounded-xl flex items-center justify-center">
          <div className="text-center">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Total Components</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{loading ? '...' : stats.total}</p>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 aspect-video rounded-xl flex items-center justify-center">
          <div className="text-center">
            <h3 className="font-semibold text-green-900 dark:text-green-100">In Stock</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{loading ? '...' : stats.inStock}</p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 aspect-video rounded-xl flex items-center justify-center">
          <div className="text-center">
            <h3 className="font-semibold text-red-900 dark:text-red-100">Low Stock</h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{loading ? '...' : stats.lowStock}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6 min-h-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Components</h2>
          <div className="space-x-2">
            <Link 
              to="/dashboard/components/add"
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 cursor-pointer transition-colors"
            >
              Add Component
            </Link>
            <Link 
              to="/dashboard/components"
              className="px-4 py-2 border border-border text-foreground rounded hover:bg-accent transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : recentComponents.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <div className="text-muted-foreground mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No components found</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first component to track.</p>
            <Link 
              to="/dashboard/components/add"
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Add Your First Component
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-foreground">Component</th>
                  <th className="text-left py-2 text-foreground">Type</th>
                  <th className="text-left py-2 text-foreground">Quantity</th>
                  <th className="text-left py-2 text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentComponents.map((component) => (
                  <tr key={component.id} className="border-b border-border hover:bg-accent">
                    <td className="py-3">
                      <div className="flex items-center">
                        {component.image_url && (
                          <img 
                            className="h-8 w-8 rounded object-cover mr-3" 
                            src={component.image_url} 
                            alt={component.name}
                          />
                        )}
                        <span className="font-medium text-foreground">{component.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-foreground">{component.type || 'N/A'}</td>
                    <td className="py-3 text-foreground">{component.quantity}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        component.status === 'Available' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                        component.status === 'Low Stock' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
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