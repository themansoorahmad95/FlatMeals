import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface OnboardingScreenProps {
  onBack: () => void;
  onComplete: (userData: any) => void;
}

export function OnboardingScreen({ onBack, onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    dietType: "" as "veg" | "non-veg" | "",
    rotiCount: 3,
    favoriteDishes: [] as string[],
    dislikes: ""
  });

  const vegDishes = [
    "Rajma Chawal 🍛",
    "Palak Paneer 🥬",
    "Sambhar Rice 🍚",
    "Chole Bhature 🥙",
    "Dal Tadka 🥄",
    "Aloo Gobi 🥔",
    "Paneer Butter Masala 🧈",
    "Rasam 🍜",
    "Veg Biryani 🍚",
    "Kadhi Chawal 🥄",
    "Mixed Veg 🥕",
    "Palak Dal 🥬"
  ];

  const nonVegDishes = [
    "Chicken Curry 🍗",
    "Fish Curry 🐟",
    "Mutton Curry 🍖",
    "Chicken Biryani 🍚",
    "Egg Curry 🥚",
    "Prawn Curry 🦐",
    "Chicken Tikka 🍗",
    "Fish Fry 🐟"
  ];

  // Get dishes based on diet preference
  const getAvailableDishes = () => {
    if (preferences.dietType === "veg") {
      return vegDishes;
    } else if (preferences.dietType === "non-veg") {
      return [...vegDishes, ...nonVegDishes]; // Non-veg people can eat both
    }
    return [...vegDishes, ...nonVegDishes]; // Show all if no preference selected yet
  };

  const progress = (step / 4) * 100;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const toggleDish = (dish: string) => {
    const updated = preferences.favoriteDishes.includes(dish)
      ? preferences.favoriteDishes.filter(d => d !== dish)
      : [...preferences.favoriteDishes, dish];
    
    setPreferences({ ...preferences, favoriteDishes: updated });
  };

  const handleDietChange = (dietType: "veg" | "non-veg") => {
    // Clear favorite dishes if switching diet type to avoid conflicts
    const clearedFavorites = preferences.dietType !== dietType ? [] : preferences.favoriteDishes;
    setPreferences({ 
      ...preferences, 
      dietType, 
      favoriteDishes: clearedFavorites
    });
  };

  const canContinue = () => {
    switch (step) {
      case 1: return preferences.dietType !== "";
      case 2: return true;
      case 3: return preferences.favoriteDishes.length >= 3;
      case 4: return true;
      default: return false;
    }
  };

  const availableDishes = getAvailableDishes();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 mx-4">
            <Progress value={progress} className="h-2" />
          </div>
          <span className="text-sm text-gray-600">{step}/4</span>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <h2 className="text-2xl mb-2">Set Up Your Profile</h2>
            <p className="text-gray-600">Help us plan better meals for you! 🍽️</p>
          </CardHeader>
          
          <CardContent className="p-6">
            {step === 1 && (
              <div className="text-center space-y-6">
                <div className="text-5xl mb-4">🥗</div>
                <h3 className="text-xl">What's your diet preference?</h3>
                <div className="space-y-3">
                  <Button
                    variant={preferences.dietType === "veg" ? "default" : "outline"}
                    onClick={() => handleDietChange("veg")}
                    className="w-full py-4 rounded-xl"
                  >
                    <span className="mr-3">🥬</span>
                    Vegetarian
                  </Button>
                  <Button
                    variant={preferences.dietType === "non-veg" ? "default" : "outline"}
                    onClick={() => handleDietChange("non-veg")}
                    className="w-full py-4 rounded-xl"
                  >
                    <span className="mr-3">🍗</span>
                    Non-Vegetarian
                  </Button>
                </div>
                {preferences.dietType && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      {preferences.dietType === "veg" 
                        ? "Great! We'll only show you vegetarian dishes 🌱" 
                        : "Perfect! You'll see both veg and non-veg options 🍽️"
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="text-center space-y-6">
                <div className="text-5xl mb-4">🥖</div>
                <h3 className="text-xl">How many rotis do you usually eat?</h3>
                <div className="flex justify-center space-x-3">
                  {[2, 3, 4, 5].map(count => (
                    <Button
                      key={count}
                      variant={preferences.rotiCount === count ? "default" : "outline"}
                      onClick={() => setPreferences({ ...preferences, rotiCount: count })}
                      className="w-12 h-12 rounded-full"
                    >
                      {count}
                    </Button>
                  ))}
                </div>
                <p className="text-gray-600 text-sm">
                  This helps us calculate the right portions for everyone
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">❤️</div>
                  <h3 className="text-xl">Pick your favorite dishes</h3>
                  <p className="text-gray-600 text-sm">
                    Select at least 3 {preferences.dietType === "veg" ? "vegetarian " : ""}dishes you love
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                  {availableDishes.map(dish => (
                    <Badge
                      key={dish}
                      variant={preferences.favoriteDishes.includes(dish) ? "default" : "outline"}
                      onClick={() => toggleDish(dish)}
                      className="p-3 cursor-pointer text-sm justify-center hover:bg-green-100"
                    >
                      {dish}
                    </Badge>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-600">
                  Selected: {preferences.favoriteDishes.length}/{availableDishes.length}
                </p>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">🚫</div>
                  <h3 className="text-xl">Any dislikes or allergies?</h3>
                  <p className="text-gray-600 text-sm">Optional - help us avoid foods you can't eat</p>
                </div>
                <Textarea
                  value={preferences.dislikes}
                  onChange={(e) => setPreferences({ ...preferences, dislikes: e.target.value })}
                  placeholder="e.g., No onions, allergic to nuts, don't like spicy food..."
                  className="min-h-24 rounded-xl border-2 border-gray-200 focus:border-green-500"
                />
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 text-sm">
                    💡 <strong>Tip:</strong> Be specific! This helps your cook plan better meals for everyone.
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={handleNext}
              disabled={!canContinue()}
              className="w-full mt-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-4 rounded-xl"
            >
              {step === 4 ? (
                <>
                  <span className="mr-2">✅</span>
                  Save Profile
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}