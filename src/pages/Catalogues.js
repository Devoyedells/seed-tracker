// src/components/Marketplace.js
import React, { useState, useMemo } from 'react';
import { MapPin, Phone, Package, Search } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { seeds } from '../components/seeds'; 

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const regions = ['Eastern Province', 'Northern Province', 'North West Province', 'Southern Province', 'Western Area'];

  const filteredSeeds = useMemo(() => {
    return seeds.filter(seed => {
      const matchesRegion = selectedRegion === 'all' || seed.region === selectedRegion;
      const matchesCrop = selectedCrop === 'all' || seed.crop_type === selectedCrop;
      const matchesStatus = selectedStatus === 'all' || seed.status === selectedStatus;
      const matchesSearch =
        seed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seed.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seed.distributor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRegion && matchesCrop && matchesStatus && matchesSearch;
    });
  }, [selectedRegion, selectedCrop, selectedStatus, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out_of_stock': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCertificationColor = (status) => {
    switch (status) {
      case 'certified': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-4xl text-gray-900 mb-4">Seed Marketplace</h1>
          <p className="text-base text-gray-600">Find and purchase quality seeds from certified distributors across Sierra Leone</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search seeds by name, variety, or distributor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger><SelectValue placeholder="All Regions" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger><SelectValue placeholder="All Crops" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="maize">Maize</SelectItem>
                <SelectItem value="cassava">Cassava</SelectItem>
                <SelectItem value="groundnut">Groundnut</SelectItem>
                <SelectItem value="sorghum">Sorghum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="mt-4 bg-sierra-green hover:bg-green-700 text-white">Search</Button>
        </Card>

        {/* Seeds Grid */}
        {filteredSeeds.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No seeds found</p>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeeds.map(seed => (
              <Card key={seed.seed_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                  <Package className="w-16 h-16 text-sierra-green" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading font-semibold text-xl text-gray-900 mb-1">{seed.name}</h3>
                      <p className="text-sm text-gray-600">{seed.variety}</p>
                    </div>
                    <Badge className={getStatusColor(seed.status)}>{seed.status.replace('_', ' ')}</Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{seed.region}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{seed.distributor}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Stock</p>
                      <p className="font-semibold text-gray-900">{seed.stock_quantity} {seed.unit}</p>
                    </div>
                    {seed.price_per_unit && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-semibold text-sierra-green">Le {seed.price_per_unit}/{seed.unit}</p>
                      </div>
                    )}
                  </div>
                  <Badge className={`mt-4 ${getCertificationColor(seed.certification_status)}`}>
                    {seed.certification_status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}