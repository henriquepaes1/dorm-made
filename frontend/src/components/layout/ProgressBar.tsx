import { Progress } from "../ui/progress";

interface CreateEventProgressBarProps {
  progressPercentage: number;
  isCompleted?: boolean;
}

export const CreateEventProgressBar = ({
  progressPercentage,
  isCompleted = false,
}: CreateEventProgressBarProps) => {
  if (isCompleted) {
    return (
      <div className="w-full mb-6">
        <div className="text-center mb-2">
          <span className="text-sm text-green-600 font-medium">✓ Successfully create Event</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-green-500 h-1.5 rounded-full w-full" />
        </div>
      </div>
    );
  }

  return <Progress value={progressPercentage} />;
};
