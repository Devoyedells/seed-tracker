import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SeedMap } from '../components/SeedMap';
import { Package, TrendingUp, Users, MapPin, Plus, Search } from 'lucide-react';
import api from '../utils/api';
import { getUser, isAuthenticated } from '../utils/auth';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [analytics, setAnalytics] = useState(null);
  const [seeds, setSeeds] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const [newSeed, setNewSeed] = useState({
    name: '',
    variety: '',
    crop_type: 'rice',
    region: '',
    distributor: '',
    distributor_contact: '',
    stock_quantity: 0,
    unit: 'kg',
    price_per_unit: 0,
    quality_grade: '',
    planting_season: '',
    maturity_days: 0,
    description: ''
  });

  const regions = ['Eastern Province', 'Northern Province', 'North West Province', 'Southern Province', 'Western Area'];
  const COLORS = ['#1EB53A', '#0072C6', '#DAA520', '#10B981', '#3B82F6'];

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, seedsRes, registrationsRes] = await Promise.all([
        api.get('/analytics'),
        api.get('/seeds'),
        api.get('/registrations')
      ]);
      
      setAnalytics(analyticsRes.data);
      setSeeds(seedsRes.data);
      setRegistrations(registrationsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSeed = async (e) => {
    e.preventDefault();
    try {
      await api.post('/seeds', newSeed);
      toast.success('Seed added successfully!');
      setIsAddDialogOpen(false);
      fetchDashboardData();
      setNewSeed({
        name: '',
        variety: '',
        crop_type: 'rice',
        region: '',
        distributor: '',
        distributor_contact: '',
        stock_quantity: 0,
        unit: 'kg',
        price_per_unit: 0,
        quality_grade: '',
        planting_season: '',
        maturity_days: 0,
        description: ''
      });
    } catch (error) {
      console.error('Error adding seed:', error);
      toast.error('Failed to add seed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="dashboard-loading">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Seeds',
      value: analytics?.total_seeds || 0,
      icon: <Package className="w-8 h-8 text-sierra-green" />,
      color: 'bg-green-50'
    },
    {
      title: 'Distributors',
      value: analytics?.total_distributors || 0,
      icon: <Users className="w-8 h-8 text-sierra-blue" />,
      color: 'bg-blue-50'
    },
    {
      title: 'Regions Covered',
      value: analytics?.total_regions || 0,
      icon: <MapPin className="w-8 h-8 text-harvest-gold" />,
      color: 'bg-yellow-50'
    },
    {
      title: 'Registrations',
      value: analytics?.total_registrations || 0,
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50'
    }
  ];

  const cropData = Object.entries(analytics?.seeds_by_crop || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const regionData = Object.entries(analytics?.seeds_by_region || {}).map(([name, value]) => ({
    name,
    seeds: value
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-4xl text-gray-900 mb-2" data-testid="dashboard-title">
              Dashboard
            </h1>
            <p className="text-base text-gray-600">Welcome back, {user?.full_name}</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sierra-green hover:bg-green-700 text-white" data-testid="add-seed-btn">
                <Plus className="w-5 h-5 mr-2" />
                Add Seed
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Seed</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSeed} className="space-y-4" data-testid="add-seed-form">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Seed Name *</Label>
                    <Input
                      id="name"
                      required
                      value={newSeed.name}
                      onChange={(e) => setNewSeed({...newSeed, name: e.target.value})}
                      data-testid="seed-name-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="variety">Variety *</Label>
                    <Input
                      id="variety"
                      required
                      value={newSeed.variety}
                      onChange={(e) => setNewSeed({...newSeed, variety: e.target.value})}
                      data-testid="seed-variety-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="crop_type">Crop Type *</Label>
                    <Select value={newSeed.crop_type} onValueChange={(value) => setNewSeed({...newSeed, crop_type: value})}>
                      <SelectTrigger data-testid="crop-type-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="maize">Maize</SelectItem>
                        <SelectItem value="cassava">Cassava</SelectItem>
                        <SelectItem value="groundnut">Groundnut</SelectItem>
                        <SelectItem value="sorghum">Sorghum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="region">Region *</Label>
                    <Select value={newSeed.region} onValueChange={(value) => setNewSeed({...newSeed, region: value})}>
                      <SelectTrigger data-testid="region-select">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="distributor">Distributor *</Label>
                    <Input
                      id="distributor"
                      required
                      value={newSeed.distributor}
                      onChange={(e) => setNewSeed({...newSeed, distributor: e.target.value})}
                      data-testid="distributor-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="distributor_contact">Contact</Label>
                    <Input
                      id="distributor_contact"
                      value={newSeed.distributor_contact}
                      onChange={(e) => setNewSeed({...newSeed, distributor_contact: e.target.value})}
                      data-testid="contact-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      required
                      value={newSeed.stock_quantity}
                      onChange={(e) => setNewSeed({...newSeed, stock_quantity: parseInt(e.target.value)})}
                      data-testid="stock-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit *</Label>
                    <Select value={newSeed.unit} onValueChange={(value) => setNewSeed({...newSeed, unit: value})}>
                      <SelectTrigger data-testid="unit-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kg</SelectItem>
                        <SelectItem value="bags">Bags</SelectItem>
                        <SelectItem value="tons">Tons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price_per_unit">Price per Unit (Le)</Label>
                    <Input
                      id="price_per_unit"
                      type="number"
                      value={newSeed.price_per_unit}
                      onChange={(e) => setNewSeed({...newSeed, price_per_unit: parseFloat(e.target.value)})}
                      data-testid="price-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maturity_days">Maturity Days</Label>
                    <Input
                      id="maturity_days"
                      type="number"
                      value={newSeed.maturity_days}
                      onChange={(e) => setNewSeed({...newSeed, maturity_days: parseInt(e.target.value)})}
                      data-testid="maturity-input"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newSeed.description}
                    onChange={(e) => setNewSeed({...newSeed, description: e.target.value})}
                    data-testid="description-input"
                  />
                </div>
                <Button type="submit" className="w-full bg-sierra-green hover:bg-green-700 text-white" data-testid="submit-seed-btn">
                  Add Seed
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className={`p-6 ${stat.color} border-0`} data-testid={`stat-card-${index}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-heading font-bold text-gray-900">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </Card>
          ))}
        </div>

        {/* Charts and Map */}
        <Tabs defaultValue="analytics" className="mb-8">
          <TabsList className="mb-4" data-testid="dashboard-tabs">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="seeds">Seeds</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-white shadow-sm" data-testid="crops-chart">
                <h3 className="font-heading font-semibold text-xl text-gray-900 mb-4">Seeds by Crop Type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={cropData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {cropData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-white shadow-sm" data-testid="regions-chart">
                <h3 className="font-heading font-semibold text-xl text-gray-900 mb-4">Seeds by Region</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="seeds" fill="#1EB53A" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="map">
            <Card className="p-0 overflow-hidden bg-white shadow-sm" data-testid="map-view">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-heading font-semibold text-xl text-gray-900">Seed Distribution Map</h3>
                <p className="text-sm text-gray-600 mt-1">View seed locations across Sierra Leone</p>
              </div>
              <div className="h-[600px]">
                <SeedMap seeds={seeds} selectedRegion={selectedRegion} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="seeds">
            <Card className="bg-white shadow-sm" data-testid="seeds-table">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-heading font-semibold text-xl text-gray-900">All Seeds</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Crop</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Region</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {seeds.slice(0, 10).map((seed) => (
                      <tr key={seed.seed_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{seed.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 capitalize">{seed.crop_type}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{seed.region}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{seed.stock_quantity} {seed.unit}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            seed.status === 'available' ? 'bg-green-100 text-green-800' :
                            seed.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {seed.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="registrations">
            <Card className="bg-white shadow-sm" data-testid="registrations-table">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-heading font-semibold text-xl text-gray-900">Recent Registrations</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Applicant</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Organization</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {registrations.slice(0, 10).map((reg) => (
                      <tr key={reg.registration_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{reg.applicant_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 capitalize">{reg.applicant_type}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{reg.organization}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            reg.status === 'approved' ? 'bg-green-100 text-green-800' :
                            reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            reg.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {reg.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(reg.submitted_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
