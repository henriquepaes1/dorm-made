import { useState, useEffect, useCallback } from "react";
import { getUser, updateUser, getUserEvents } from "@/services";
import { User, Event } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface UseProfileReturn {
  user: User | null;
  loading: boolean;
  isEditing: boolean;
  editingUser: User | null;
  saving: boolean;
  userEvents: Event[];
  loadingEvents: boolean;
  setIsEditing: (editing: boolean) => void;
  updateEditingUser: (updates: Partial<User>) => void;
  handleSave: (userId: string) => Promise<void>;
  handleCancel: () => void;
  loadUser: (userId: string) => Promise<void>;
  isOwnProfile: () => boolean;
}

/**
 * Custom hook for managing user profile data and operations
 */
export function useProfile(userId?: string): UseProfileReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const { toast } = useToast();

  const loadUserEvents = useCallback(async (targetUserId: string) => {
    try {
      setLoadingEvents(true);
      const events = await getUserEvents(targetUserId);
      setUserEvents(events);
    } catch (error: any) {
      console.error("Error loading user events:", error);
      // Don't show toast error - user might not have events
      setUserEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  const loadUser = useCallback(
    async (targetUserId: string) => {
      if (!targetUserId) return;

      try {
        setLoading(true);
        console.log("Loading user with ID:", targetUserId);
        const userData = await getUser(targetUserId);
        console.log("User data loaded:", userData);
        setUser(userData);
        setEditingUser({ ...userData });
        // Load events after user is loaded
        await loadUserEvents(userData.id);
      } catch (error: any) {
        console.error("Error loading user:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);

        // Fallback to localStorage if backend fails
        const currentUserStr = localStorage.getItem("currentUser");
        if (currentUserStr) {
          try {
            const currentUser = JSON.parse(currentUserStr);
            if (currentUser.id === targetUserId) {
              console.log("Using user data from localStorage");
              setUser(currentUser);
              setEditingUser({ ...currentUser });
              await loadUserEvents(currentUser.id);
              return;
            }
          } catch (e) {
            console.error("Error parsing currentUser from localStorage:", e);
          }
        }

        const errorMessage =
          error.response?.data?.detail ||
          error.message ||
          "Não foi possível carregar o perfil do usuário";

        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
          duration: 1500,
        });
      } finally {
        setLoading(false);
      }
    },
    [toast, loadUserEvents],
  );

  const handleSave = useCallback(
    async (targetUserId: string) => {
      if (!editingUser || !targetUserId) return;

      try {
        setSaving(true);
        const updatedUser = await updateUser(targetUserId, {
          university: editingUser.university || null,
          description: editingUser.description || null,
          profile_picture: editingUser.profile_picture || null,
        });

        setUser(updatedUser);
        setEditingUser({ ...updatedUser });
        setIsEditing(false);

        // Update localStorage
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        toast({
          title: "Sucesso!",
          description: "Perfil atualizado com sucesso",
          className: "bg-green-500 text-white border-green-600",
          duration: 1500,
        });
      } catch (error: any) {
        console.error("Error updating user:", error);
        toast({
          title: "Erro",
          description: error.response?.data?.detail || "Não foi possível atualizar o perfil",
          variant: "destructive",
          duration: 1500,
        });
      } finally {
        setSaving(false);
      }
    },
    [editingUser, toast],
  );

  const handleCancel = useCallback(() => {
    if (user) {
      setEditingUser({ ...user });
    }
    setIsEditing(false);
  }, [user]);

  const updateEditingUser = useCallback((updates: Partial<User>) => {
    setEditingUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const isOwnProfile = useCallback(() => {
    const currentUserStr = localStorage.getItem("currentUser");
    if (currentUserStr && user) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        return currentUser.id === user.id;
      } catch (e) {
        return false;
      }
    }
    return false;
  }, [user]);

  // Load user on mount or when userId changes
  useEffect(() => {
    if (userId) {
      loadUser(userId);
    } else {
      // If no userId, try to use localStorage
      const currentUserStr = localStorage.getItem("currentUser");
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          setUser(currentUser);
          setEditingUser({ ...currentUser });
          loadUserEvents(currentUser.id);
        } catch (e) {
          console.error("Error parsing currentUser:", e);
        }
      }
      setLoading(false);
    }
  }, [userId, loadUser, loadUserEvents]);

  return {
    user,
    loading,
    isEditing,
    editingUser,
    saving,
    userEvents,
    loadingEvents,
    setIsEditing,
    updateEditingUser,
    handleSave,
    handleCancel,
    loadUser,
    isOwnProfile,
  };
}
