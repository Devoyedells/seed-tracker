import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Sprout } from 'lucide-react';
import api from '../utils/api';
import { setToken, setUser } from '../utils/auth';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'farmer',
    phone: '',
    organization: '',
    region: ''
  });
  const [loading, setLoading] = useState(false);

  const regions = ['Eastern Province', 'Northern Province', 'North West Province', 'Southern Province', 'Western Area'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      setToken(response.data.access_token);
      setUser(response.data.user);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl p-8 bg-white shadow-xl" data-testid="register-card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-sierra-green to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-heading font-bold text-3xl text-gray-900 mb-2">Create Account</h2>
          <p className="text-sm text-gray-600">Join the Sierra Leone Seed Tracker</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                data-testid="fullname-input"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                data-testid="email-input"
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                data-testid="password-input"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+232 76 123 456"
                data-testid="phone-input"
              />
            </div>

            <div>
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                <SelectTrigger data-testid="role-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer">Farmer</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="regulator">Regulator</SelectItem>
                  <SelectItem value="researcher">Researcher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="region">Region</Label>
              <Select value={formData.region} onValueChange={(value) => setFormData({...formData, region: value})}>
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

            <div className="md:col-span-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                name="organization"
                type="text"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Your company or organization"
                data-testid="organization-input"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-sierra-green hover:bg-green-700 text-white font-semibold"
            disabled={loading}
            data-testid="register-submit-btn"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-sierra-green hover:text-green-700 font-semibold" data-testid="login-link">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}