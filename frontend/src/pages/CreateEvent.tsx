import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Users, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createEvent, getAuthToken } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    max_participants: '',
    event_date: '',
    location: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  React.useEffect(() => {
    const token = getAuthToken();
    const user = localStorage.getItem('currentUser');
    
    if (!token || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create events",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, or WebP image",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedImage(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      toast({
        title: "Please Sign In",
        description: "You need to sign in to create events",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    const requiredFields = ['title', 'description', 'max_participants', 'event_date', 'location'];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Check if user has a valid token
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create events",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      // Create FormData to handle both text fields and image upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('max_participants', formData.max_participants);
      formDataToSend.append('event_date', formData.event_date);
      formDataToSend.append('location', formData.location);

      // Add image if selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      console.log('Creating event with FormData');
      console.log('Using token:', token ? 'Token present' : 'No token');
      console.log('Image attached:', selectedImage ? 'Yes' : 'No');

      await createEvent(formDataToSend);
      
      console.log('Event created successfully, redirecting to explore...');
      
      toast({
        title: "Success!",
        description: "Event created successfully!",
        className: "bg-green-500 text-white border-green-600",
      });
      
      navigate('/explore');
    } catch (error: any) {
      console.error('CreateEvent error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create event",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Host a Culinary Event</h1>
            <p className="text-muted-foreground">
              Create a culinary event and connect with fellow students
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Event Details
                </CardTitle>
                <CardDescription>
                  Tell us about your culinary event
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Title */}
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Pasta Night with Friends"
                      required
                    />
                  </div>

                  {/* Event Description */}
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Event Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe what participants will learn and experience..."
                      rows={3}
                      required
                    />
                  </div>

                  {/* Max Participants and Event Date */}
                  <div>
                    <Label htmlFor="max_participants">Max Participants</Label>
                    <Input
                      id="max_participants"
                      name="max_participants"
                      type="number"
                      value={formData.max_participants}
                      onChange={handleInputChange}
                      placeholder="6"
                      min="1"
                      max="20"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="event_date">Event Date & Time</Label>
                    <Input
                      id="event_date"
                      name="event_date"
                      type="datetime-local"
                      value={formData.event_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="md:col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Dorm Kitchen 3A, Student Center Kitchen"
                      required
                    />
                  </div>

                  {/* Event Image Upload */}
                  <div className="md:col-span-2">
                    <Label htmlFor="event-image">Event Image (Optional)</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload an image for your event (Max 5MB, JPEG/PNG/WebP)
                    </p>

                    {!imagePreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Input
                          id="event-image"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <label htmlFor="event-image" className="cursor-pointer">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Click to upload event image
                          </p>
                          <p className="text-xs text-gray-500">
                            JPEG, PNG or WebP (max. 5MB)
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Event preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/explore')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Creating Event..." : "Create Event"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}