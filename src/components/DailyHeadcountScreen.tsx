import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, Users, Check, X } from "lucide-react";

interface DailyHeadcountScreenProps {
  onHeadcountConfirmed: () => void;
}

export function DailyHeadcountScreen({ onHeadcountConfirmed }: DailyHeadcountScreenProps) {
  const [lunchResponse, setLunchResponse] = useState<'yes' | 'no' | null>(null);
  const [dinnerResponse, setDinnerResponse] = useState<'yes' | 'no' | null>(null);

  const todaysMeals = {
    lunch: "Rajma Chawal 🍛",
    dinner: "Dal Tadka 🥄"
  };

  const headcount = {
    lunch: { confirmed: 3, total: 4 },
    dinner: { confirmed: 2, total: 4 }
  };

  const handleResponse = (meal: 'lunch' | 'dinner', response: 'yes' | 'no') => {
    if (meal === 'lunch') {
      setLunchResponse(response);
    } else {
      setDinnerResponse(response);
    }

    if (lunchResponse !== null && dinnerResponse !== null) {
      setTimeout(onHeadcountConfirmed, 1000);
    }
  };

  const timeLeft = {
    lunch: "2h 30m",
    dinner: "6h 15m"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50 px-4 py-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">📅</div>
          <h1 className="text-2xl mb-2">Today's Headcount</h1>
          <p className="text-gray-600">Let us know if you're eating! 🍽️</p>
        </div>

        {/* Lunch Card */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌞</span>
                <div>
                  <h3 className="text-lg">Today's Lunch</h3>
                  <p className="text-gray-600">{todaysMeals.lunch}</p>
                </div>
              </div>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{timeLeft.lunch} left</span>
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-lg mb-4">Are you eating lunch?</p>
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleResponse('lunch', 'yes')}
                  variant={lunchResponse === 'yes' ? 'default' : 'outline'}
                  className={`flex-1 py-4 rounded-xl ${
                    lunchResponse === 'yes' 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'border-2 border-green-500 text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Yes, Count me in
                </Button>
                
                <Button
                  onClick={() => handleResponse('lunch', 'no')}
                  variant={lunchResponse === 'no' ? 'default' : 'outline'}
                  className={`flex-1 py-4 rounded-xl ${
                    lunchResponse === 'no' 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'border-2 border-red-500 text-red-600 hover:bg-red-50'
                  }`}
                >
                  <X className="w-4 h-4 mr-2" />
                  No, Skip
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 pt-3 border-t">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {headcount.lunch.confirmed + (lunchResponse === 'yes' ? 1 : 0)}/{headcount.lunch.total} confirmed
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Dinner Card */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌙</span>
                <div>
                  <h3 className="text-lg">Today's Dinner</h3>
                  <p className="text-gray-600">{todaysMeals.dinner}</p>
                </div>
              </div>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{timeLeft.dinner} left</span>
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-lg mb-4">Are you eating dinner?</p>
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleResponse('dinner', 'yes')}
                  variant={dinnerResponse === 'yes' ? 'default' : 'outline'}
                  className={`flex-1 py-4 rounded-xl ${
                    dinnerResponse === 'yes' 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'border-2 border-green-500 text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Yes, Count me in
                </Button>
                
                <Button
                  onClick={() => handleResponse('dinner', 'no')}
                  variant={dinnerResponse === 'no' ? 'default' : 'outline'}
                  className={`flex-1 py-4 rounded-xl ${
                    dinnerResponse === 'no' 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'border-2 border-red-500 text-red-600 hover:bg-red-50'
                  }`}
                >
                  <X className="w-4 h-4 mr-2" />
                  No, Skip
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 pt-3 border-t">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {headcount.dinner.confirmed + (dinnerResponse === 'yes' ? 1 : 0)}/{headcount.dinner.total} confirmed
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Reminder */}
        <div className="text-center p-4 bg-orange-100 rounded-xl">
          <div className="text-xl mb-2">⏰</div>
          <p className="text-orange-800 text-sm">
            Lunch headcount closes at 10 AM
          </p>
          <p className="text-orange-600 text-xs">
            Make sure to confirm before the deadline!
          </p>
        </div>
      </div>
    </div>
  );
}