import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent, getAuthToken } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";

export interface EventFormData {
  title: string;
  description: string;
  max_participants: string;
  event_date: string;
  location: string;
  price: string;
}

export function useCreateEventForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    max_participants: "",
    event_date: "",
    location: "",
    price: "",
  });

  // Image state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const token = getAuthToken();
    const user = localStorage.getItem("currentUser");

    if (!token || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create events",
        variant: "destructive",
        duration: 1500,
      });
      navigate("/login");
    }
  }, [navigate, toast]);

  const updateFormData = useCallback((updates: Partial<EventFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const setImage = useCallback((image: File | null) => {
    setSelectedImage(image);
  }, []);

  const validateEventDetails = useCallback(() => {
    const requiredFields: (keyof EventFormData)[] = ["title", "description", "max_participants", "event_date", "location"];
    return requiredFields.every((field) => {
      const value = formData[field];
      return value && value.trim() !== "";
    });
  }, [formData]);

  const submitEvent = useCallback(async () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      toast({
        title: "Please Sign In",
        description: "You need to sign in to create events",
        variant: "destructive",
        duration: 1500,
      });
      return;
    }

    // Validate required fields
    if (!validateEventDetails()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
        duration: 1500,
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
          variant: "destructive",
          duration: 1500,
        });
        navigate("/login");
        return;
      }

      // Create FormData to handle both text fields and image upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("max_participants", formData.max_participants);
      formDataToSend.append("event_date", formData.event_date);
      formDataToSend.append("location", formData.location);

      // Add price if provided
      if (formData.price && formData.price.trim() !== "") {
        formDataToSend.append("price", formData.price);
      }

      // Add image if selected
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      console.log("Creating event with FormData");
      console.log("Using token:", token ? "Token present" : "No token");
      console.log("Image attached:", selectedImage ? "Yes" : "No");

      await createEvent(formDataToSend);

      console.log("Event created successfully, redirecting to explore...");

      toast({
        title: "Success!",
        description: "Event created successfully!",
        className: "bg-green-500 text-white border-green-600",
        duration: 1500,
      });

      navigate("/explore");
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("CreateEvent error:", error);
        console.error("Error response:", error.response);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);
      }

      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create event",
        variant: "destructive",
        duration: 1500,
      });
    } finally {
      setLoading(false);
    }
  }, [formData, selectedImage, toast, navigate, validateEventDetails]);

  return {
    loading,
    formData,
    updateFormData,
    selectedImage,
    setImage,
    validateEventDetails,
    submitEvent,
  };
}
