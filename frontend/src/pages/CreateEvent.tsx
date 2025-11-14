import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/home/Footer";
import { CreateEventProgressBar } from "@/components/layout/ProgressBar";
import { Step, useCreateEvent } from "@/hooks/use-create-event";
import SelectMeal from "@/components/events/SelectMeal";
import EventDetailsForm from "@/components/events/EventDetailsForm";
import { Button } from "@/components/ui/button";
import { useCreateEventForm } from "@/hooks/use-create-event-form";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useMeals } from "@/hooks/use-meals";

export default function CreateEvent() {
  const {
    currentStep,
    nextStep,
    prevStep,
    canGoBack,
    canGoNext,
    isLastStep,
    isCompleted,
    getProgressPercentage,
  } = useCreateEvent();

  const { formData, updateFormData, validateEventDetails, submitEvent } =
    useCreateEventForm();

  const {
    selectedImage,
    imagePreview,
    handleImageChange,
    handleRemoveImage,
  } = useImageUpload();

  const { meals, loading: mealsLoading, selectedMeal, selectMeal } = useMeals();

  const handleFinalize = async () => {
    await submitEvent(selectedImage);
  };

  // Check if we can proceed to next step based on current step validation
  const canProceedToNext = () => {
    switch (currentStep) {
      case Step.MEAL:
        return selectedMeal !== null;
      case Step.EVENT_DETAILS:
        return validateEventDetails();
      default:
        return canGoNext();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case Step.MEAL:
        return (
          <SelectMeal
            meals={meals}
            loading={mealsLoading}
            selectedMeal={selectedMeal}
            onSelectMeal={selectMeal}
          />
        );
      case Step.EVENT_DETAILS:
        return (
          <EventDetailsForm
            formData={formData}
            onInputChange={updateFormData}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onRemoveImage={handleRemoveImage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <CreateEventProgressBar
              progressPercentage={getProgressPercentage()}
              isCompleted={isCompleted}
            ></CreateEventProgressBar>
          </div>

          {renderStepContent()}

          {!isCompleted && (
            <div className="p-6 flex justify-between space-x-4 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                disabled={!canGoBack()}
                onClick={() => prevStep()}
                className={`flex-1 ${canGoBack() ? "" : "cursor-not-allowed"}`}
              >
                Back
              </Button>

              <Button
                onClick={isLastStep() ? handleFinalize : nextStep}
                disabled={!canProceedToNext() && !isLastStep()}
                className={`flex-1 ${canProceedToNext() || isLastStep() ? "" : "cursor-not-allowed"}`}
              >
                {isLastStep() ? "Create event" : "Next"}
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
