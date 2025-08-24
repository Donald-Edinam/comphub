import { useState, useEffect } from 'react';
import { componentsAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Components() {
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        fetchComponents();
    }, []);

    const fetchComponents = async () => {
        try {
            const response = await componentsAPI.getAll();
            if (response.data.success) {
                setComponents(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching components:', error);
            setError('Failed to load components');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this component?')) {
            try {
                await componentsAPI.delete(id);
                setComponents(components.filter(comp => comp.id !== id));
            } catch (error) {
                console.error('Error deleting component:', error);
                setError('Failed to delete component');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p>Loading components...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">All Components</h1>
                    <p className="text-muted-foreground">Manage your repair shop inventory</p>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 hover:cursor-pointer transition-colors" 
                onClick={() => navigate("./add")}
                >
                    Add New Component
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {components.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-lg">
                    <div className="text-muted-foreground mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No components found</h3>
                    <p className="text-muted-foreground mb-4">Get started by adding your first component to track.</p>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                        Add Your First Component
                    </button>
                </div>
            ) : (
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Component
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                                {components.map((component) => (
                                    <tr key={component.id} className="hover:bg-accent">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {component.image_url && (
                                                    <img
                                                        className="h-10 w-10 rounded-lg object-cover mr-3"
                                                        src={component.image_url}
                                                        alt={component.name}
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-foreground">{component.name}</div>
                                                    <div className="text-sm text-muted-foreground">{component.supplier}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                            {component.type || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                            {component.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                            ${component.price || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${component.status === 'Available' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                                component.status === 'Low Stock' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                                                    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                                }`}>
                                                {component.status || 'Available'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button 
                                                onClick={() => navigate(`/dashboard/components/edit/${component.id}`)}
                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(component.id)}
                                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}