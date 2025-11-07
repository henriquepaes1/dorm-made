import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useCreateEvent } from "@/hooks/use-create-event";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    max_participants: "",
    event_date: "",
    location: "",
    price: "",
  });

  const navigate = useNavigate();
  const { selectedImage, imagePreview, handleImageChange, handleRemoveImage } = useImageUpload();
  const { loading, submitEvent } = useCreateEvent();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitEvent(formData, selectedImage);
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
                <CardDescription>Tell us about your culinary event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid-cols-2 gap-6">
                  {/* Event Title */}
                  <div className="col-span-2">
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
                  <div className="col-span-2">
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

                  {/* Price */}
                  <div>
                    <Label htmlFor="price">Price (US$)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Optional - Set the price per participant
                    </p>
                  </div>

                  {/* Location */}
                  <div className="col-span-2">
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
                          <p className="text-xs text-gray-500">JPEG, PNG or WebP (max. 5MB)</p>
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
                onClick={() => navigate("/explore")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
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
