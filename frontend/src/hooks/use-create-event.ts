import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent, getAuthToken } from "@/services";
import { useToast } from "@/hooks/use-toast";

interface EventFormData {
  title: string;
  description: string;
  max_participants: string;
  event_date: string;
  location: string;
  price: string;
}

interface UseCreateEventReturn {
  loading: boolean;
  submitEvent: (formData: EventFormData, image?: File | null) => Promise<void>;
}

/**
 * Custom hook for creating events with validation and authentication checks
 */
export function useCreateEvent(): UseCreateEventReturn {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const submitEvent = useCallback(
    async (formData: EventFormData, image?: File | null) => {
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
      const requiredFields = ["title", "description", "max_participants", "event_date", "location"];
      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof EventFormData],
      );

      if (missingFields.length > 0) {
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
        if (image) {
          formDataToSend.append("image", image);
        }

        console.log("Creating event with FormData");
        console.log("Using token:", token ? "Token present" : "No token");
        console.log("Image attached:", image ? "Yes" : "No");

        await createEvent(formDataToSend);

        console.log("Event created successfully, redirecting to explore...");

        toast({
          title: "Success!",
          description: "Event created successfully!",
          className: "bg-green-500 text-white border-green-600",
          duration: 1500,
        });

        navigate("/explore");
      } catch (error: any) {
        console.error("CreateEvent error:", error);
        console.error("Error response:", error.response);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);

        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to create event",
          variant: "destructive",
          duration: 1500,
        });
      } finally {
        setLoading(false);
      }
    },
    [toast, navigate],
  );

  return {
    loading,
    submitEvent,
  };
}
