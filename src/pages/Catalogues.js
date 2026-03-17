import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { seeds as localSeeds } from '../data/seeds';

export default function Catalogues() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');

  // Filter seeds based on crop and search term
  const filteredSeeds = useMemo(() => {
    return localSeeds.filter(seed => {
      const matchesCrop = selectedCrop === 'all' || seed.crop_type === selectedCrop;
      const matchesSearch =
        seed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seed.variety.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCrop && matchesSearch;
    });
  }, [selectedCrop, searchTerm]);

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
        </Card>

        {/* Seeds Table */}
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
      </div>
    </div>
  );
}