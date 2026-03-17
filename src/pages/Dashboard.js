import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SeedMap } from '../components/SeedMap';
import { Package, TrendingUp, Users, MapPin, Plus } from 'lucide-react';
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

  const [newSeed, setNewSeed] = useState({
    name: '', variety: '', crop_type: 'rice', region: '', distributor: '',
    distributor_contact: '', stock_quantity: 0, unit: 'kg', price_per_unit: 0,
    quality_grade: '', planting_season: '', maturity_days: 0, description: ''
  });

  const regions = ['Eastern Province', 'Northern Province', 'North West Province', 'Southern Province', 'Western Area'];
  const COLORS = ['#1EB53A', '#0072C6', '#DAA520', '#10B981', '#3B82F6'];

  // fetchDashboardData wrapped in useCallback
  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

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
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAddSeed = async (e) => {
    e.preventDefault();
    try {
      await api.post('/seeds', newSeed);
      toast.success('Seed added successfully!');
      setIsAddDialogOpen(false);
      fetchDashboardData();
      setNewSeed({
        name: '', variety: '', crop_type: 'rice', region: '', distributor: '',
        distributor_contact: '', stock_quantity: 0, unit: 'kg', price_per_unit: 0,
        quality_grade: '', planting_season: '', maturity_days: 0, description: ''
      });
    } catch (error) {
      console.error('Error adding seed:', error);
      toast.error('Failed to add seed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Seeds', value: analytics?.total_seeds || 0, icon: <Package className="w-8 h-8 text-sierra-green" />, color: 'bg-green-50' },
    { title: 'Distributors', value: analytics?.total_distributors || 0, icon: <Users className="w-8 h-8 text-sierra-blue" />, color: 'bg-blue-50' },
    { title: 'Regions Covered', value: analytics?.total_regions || 0, icon: <MapPin className="w-8 h-8 text-harvest-gold" />, color: 'bg-yellow-50' },
    { title: 'Registrations', value: analytics?.total_registrations || 0, icon: <TrendingUp className="w-8 h-8 text-green-600" />, color: 'bg-green-50' }
  ];

  const cropData = Object.entries(analytics?.seeds_by_crop || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const regionData = Object.entries(analytics?.seeds_by_region || {}).map(([name, value]) => ({
    name, seeds: value
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-4xl text-gray-900 mb-2">Dashboard</h1>
            <p className="text-base text-gray-600">Welcome back, {user?.full_name}</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sierra-green hover:bg-green-700 text-white">
                <Plus className="w-5 h-5 mr-2" /> Add Seed
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Add New Seed</DialogTitle></DialogHeader>
              <form onSubmit={handleAddSeed} className="space-y-4">
                {/* Form inputs (name, variety, crop_type, etc.) */}
                {/* ...same as your previous code */}
                <Button type="submit" className="w-full bg-sierra-green hover:bg-green-700 text-white">Add Seed</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <Card key={i} className={`p-6 ${stat.color} border-0`}>
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

        {/* Charts and Map Tabs */}
        <Tabs defaultValue="analytics" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="seeds">Seeds</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {/* PieChart and BarChart */}
          </TabsContent>

          <TabsContent value="map">
            <Card className="p-0 overflow-hidden bg-white shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-heading font-semibold text-xl text-gray-900">Seed Distribution Map</h3>
                <p className="text-sm text-gray-600 mt-1">View seed locations across Sierra Leone</p>
              </div>
              <div className="h-[600px]">
                <SeedMap seeds={seeds} />
              </div>
            </Card>
          </TabsContent>

          {/* Seeds and Registrations tables */}
        </Tabs>
      </div>
    </div>
  );
}