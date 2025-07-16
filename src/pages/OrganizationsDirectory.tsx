import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  Brain, 
  Heart, 
  Users, 
  Stethoscope,
  GraduationCap,
  Home,
  Activity
} from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  category: string;
  description: string;
  services: string[];
  location: string;
  phone: string;
  website: string;
  rating: number;
  reviews: number;
  featured: boolean;
  pricing: string;
  specialties: string[];
}

const organizationsData: Organization[] = [
  {
    id: '1',
    name: 'NeuroRehab Solutions',
    category: 'Cognitive Rehabilitation',
    description: 'Comprehensive cognitive rehabilitation services for traumatic brain injury recovery with personalized treatment plans.',
    services: ['Cognitive Therapy', 'Memory Training', 'Executive Function Training', 'Attention Training'],
    location: 'Downtown Medical Center, Suite 405',
    phone: '(555) 123-4567',
    website: 'www.neurorehab-solutions.com',
    rating: 4.8,
    reviews: 127,
    featured: true,
    pricing: '$150-$250/session',
    specialties: ['TBI', 'Stroke Recovery', 'Dementia Care']
  },
  {
    id: '2',
    name: 'BrainFit Wellness Center',
    category: 'Brain Training',
    description: 'Evidence-based brain training programs designed to improve cognitive function and mental wellness.',
    services: ['Brain Games', 'Neurofeedback', 'Cognitive Assessment', 'Group Classes'],
    location: 'Wellness Plaza, 2nd Floor',
    phone: '(555) 234-5678',
    website: 'www.brainfit-wellness.com',
    rating: 4.6,
    reviews: 89,
    featured: true,
    pricing: '$75-$120/session',
    specialties: ['Memory Enhancement', 'Focus Training', 'Mental Agility']
  },
  {
    id: '3',
    name: 'Therapeutic Minds Clinic',
    category: 'Mental Health',
    description: 'Specialized mental health services for individuals with brain injuries and their families.',
    services: ['Individual Therapy', 'Family Counseling', 'Group Support', 'Crisis Intervention'],
    location: 'Healthcare District, Building B',
    phone: '(555) 345-6789',
    website: 'www.therapeuticminds.com',
    rating: 4.9,
    reviews: 156,
    featured: false,
    pricing: '$120-$180/session',
    specialties: ['TBI Psychology', 'Family Support', 'Adjustment Disorders']
  },
  {
    id: '4',
    name: 'Advanced Physical Therapy',
    category: 'Physical Rehabilitation',
    description: 'Comprehensive physical rehabilitation services specializing in neurological conditions.',
    services: ['Physical Therapy', 'Occupational Therapy', 'Speech Therapy', 'Balance Training'],
    location: 'Rehabilitation Campus, Main Building',
    phone: '(555) 456-7890',
    website: 'www.advancedpt.com',
    rating: 4.7,
    reviews: 203,
    featured: true,
    pricing: '$100-$160/session',
    specialties: ['Neurological PT', 'Balance Disorders', 'Motor Skills']
  },
  {
    id: '5',
    name: 'Community Support Network',
    category: 'Support Services',
    description: 'Peer support and community resources for brain injury survivors and their families.',
    services: ['Peer Support Groups', 'Resource Navigation', 'Educational Workshops', 'Social Activities'],
    location: 'Community Center, Room 120',
    phone: '(555) 567-8901',
    website: 'www.brainjury-support.org',
    rating: 4.5,
    reviews: 74,
    featured: false,
    pricing: 'Free - $25/workshop',
    specialties: ['Peer Support', 'Family Education', 'Community Integration']
  },
  {
    id: '6',
    name: 'TechAssist Solutions',
    category: 'Assistive Technology',
    description: 'Cutting-edge assistive technology solutions to support independence and daily living.',
    services: ['Technology Assessment', 'Device Training', 'Home Modifications', 'App Recommendations'],
    location: 'Innovation Hub, Suite 200',
    phone: '(555) 678-9012',
    website: 'www.techassist-solutions.com',
    rating: 4.4,
    reviews: 61,
    featured: false,
    pricing: '$80-$150/consultation',
    specialties: ['Smart Home Tech', 'Mobile Apps', 'Communication Devices']
  }
];

const categories = [
  'All Categories',
  'Cognitive Rehabilitation',
  'Brain Training',
  'Mental Health',
  'Physical Rehabilitation',
  'Support Services',
  'Assistive Technology'
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Cognitive Rehabilitation':
      return <Brain className="h-5 w-5" />;
    case 'Brain Training':
      return <GraduationCap className="h-5 w-5" />;
    case 'Mental Health':
      return <Heart className="h-5 w-5" />;
    case 'Physical Rehabilitation':
      return <Activity className="h-5 w-5" />;
    case 'Support Services':
      return <Users className="h-5 w-5" />;
    case 'Assistive Technology':
      return <Home className="h-5 w-5" />;
    default:
      return <Stethoscope className="h-5 w-5" />;
  }
};

export default function OrganizationsDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const filteredOrganizations = organizationsData.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Categories' || org.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredOrganizations = filteredOrganizations.filter(org => org.featured);
  const regularOrganizations = filteredOrganizations.filter(org => !org.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Brain Health & Cognitive Rehabilitation Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover trusted organizations and professionals specializing in brain health, 
            cognitive rehabilitation, and support services for your recovery journey.
          </p>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations, services, or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs"
                  >
                    {category !== 'All Categories' && getCategoryIcon(category)}
                    <span className={category !== 'All Categories' ? 'ml-1' : ''}>
                      {category}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Organizations */}
        {featuredOrganizations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500 fill-current" />
              Featured Organizations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredOrganizations.map((org) => (
                <Card key={org.id} className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(org.category)}
                          <CardTitle className="text-xl">{org.name}</CardTitle>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {org.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{org.rating}</span>
                          <span className="text-sm text-muted-foreground">({org.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{org.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Services:</h4>
                      <div className="flex flex-wrap gap-1">
                        {org.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Specialties:</h4>
                      <div className="flex flex-wrap gap-1">
                        {org.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{org.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{org.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-blue-600">{org.website}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium text-green-600">{org.pricing}</span>
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                        Contact Organization
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Organizations */}
        {regularOrganizations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">All Organizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularOrganizations.map((org) => (
                <Card key={org.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(org.category)}
                        <CardTitle className="text-lg">{org.name}</CardTitle>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{org.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{org.rating}</span>
                          <span className="text-sm text-muted-foreground">({org.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">{org.description}</p>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{org.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{org.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-medium text-green-600">{org.pricing}</span>
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredOrganizations.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="text-6xl">🔍</div>
                <h3 className="text-xl font-semibold">No organizations found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or category filters.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All Categories');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Strategic Information Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="text-2xl font-bold">Partner with Us</h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Are you a healthcare organization, therapy clinic, or support service provider? 
              Join our directory to connect with individuals seeking brain health and cognitive rehabilitation services.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                List Your Organization
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Partnership Opportunities
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}