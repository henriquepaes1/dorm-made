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
import { useCreateEventForm } from "@/hooks/use-create-event-form";

export default function SelectMeal() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose the event meal</h1>
        <p className="text-muted-foreground">Select the meal that will be served at this event</p>
      </div>
    </div>
  );
}
