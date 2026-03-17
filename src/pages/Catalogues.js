import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import api from '../utils/api';
import { toast } from 'sonner';

export default function Catalogues() {
  const [seeds, setSeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');

  const fetchSeeds = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCrop !== 'all') params.crop_type = selectedCrop;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/seeds', { params });
      setSeeds(response.data);
    } catch (error) {
      console.error('Error fetching seeds:', error);
      toast.error('Failed to load catalogue');
    } finally {
      setLoading(false);
    }
  }, [selectedCrop, searchTerm]);

  useEffect(() => {
    fetchSeeds();
  }, [fetchSeeds]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSeeds();
  };

  const filteredSeeds = seeds.filter(seed =>
    seed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seed.variety.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-4xl text-gray-900 mb-4">Seed Catalogues</h1>
          <p className="text-base text-gray-600">
            Browse officially released seed varieties in Sierra Leone
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 bg-white shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by variety name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="All Crops" />
                </SelectTrigger>
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
            <Button type="submit" className="bg-sierra-green hover:bg-green-700 text-white">
              Search
            </Button>
          </form>
        </Card>

        {/* Seeds Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading catalogue...</p>
          </div>
        ) : (
          <Card className="overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Variety Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Crop Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Maturity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quality</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSeeds.map((seed) => (
                    <tr key={seed.seed_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{seed.name}</p>
                          <p className="text-sm text-gray-600">{seed.variety}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 capitalize">{seed.crop_type}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{seed.maturity_days ? `${seed.maturity_days} days` : 'N/A'}</td>
                      <td className="px-6 py-4">
                        {seed.quality_grade ? (
                          <Badge className="bg-sierra-green/10 text-sierra-green border-sierra-green/20">{seed.quality_grade}</Badge>
                        ) : (
                          <span className="text-sm text-gray-500">Not graded</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={seed.certification_status === 'certified' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                          {seed.certification_status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}