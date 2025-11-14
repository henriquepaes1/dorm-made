import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UtensilsCrossed, CalendarDays } from "lucide-react";
import { ProfileMyMealsTab } from "./ProfileMyMealsTab";
import { ProfileMyEventsTab } from "./ProfileMyEventsTab";

interface ProfileTabsProps {
  userId: string;
  isOwnProfile: boolean;
  userName: string;
}

export function ProfileTabs({ userId, isOwnProfile, userName }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="events" className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="events" className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>My Events</span>
        </TabsTrigger>
        <TabsTrigger value="meals" className="flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4" />
          <span>My Meals</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="events" className="mt-6">
        <ProfileMyEventsTab userId={userId} isOwnProfile={isOwnProfile} userName={userName} />
      </TabsContent>

      <TabsContent value="meals" className="mt-6">
        <ProfileMyMealsTab userId={userId} isOwnProfile={isOwnProfile} userName={userName} />
      </TabsContent>
    </Tabs>
  );
}