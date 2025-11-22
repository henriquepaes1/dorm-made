import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Plus } from "lucide-react";

export function CreateMealCard() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create-meal");
  };

  return (
    <Card
      className="flex flex-col hover:shadow-lg transition-all cursor-pointer min-w-[85vw] lg:min-w-0 border-dashed border-2"
      onClick={handleClick}
    >
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
        <div className="text-center">
          <Plus className="h-16 w-16 text-primary mx-auto mb-2" />
          <p className="text-lg font-semibold text-primary">Create New Meal</p>
        </div>
      </div>

      <CardContent className="flex flex-col justify-between flex-grow p-4">
        <h3 className="font-semibold text-lg mb-2 text-center">Add a new meal to your profile</h3>
      </CardContent>
    </Card>
  );
}