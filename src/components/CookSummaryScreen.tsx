import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Share2, Check, Users, Utensils } from "lucide-react";

interface CookSummaryScreenProps {
  onNotificationSent: () => void;
}

export function CookSummaryScreen({ onNotificationSent }: CookSummaryScreenProps) {
  const [notificationSent, setNotificationSent] = useState(false);

  const todaysSummary = {
    lunch: {
      dish: "Rajma Chawal 🍛",
      people: 3,
      rotiCounts: { 2: 1, 3: 1, 4: 1 },
      totalRotis: 9
    },
    dinner: {
      dish: "Dal Tadka 🥄",
      people: 2,
      rotiCounts: { 3: 1, 4: 1 },
      totalRotis: 7
    }
  };

  const handleSendToCook = () => {
    const lunchMessage = `🌞 *Today's Lunch*
Dish: ${todaysSummary.lunch.dish}
People: ${todaysSummary.lunch.people}
Rotis needed: ${todaysSummary.lunch.totalRotis}

🌙 *Today's Dinner*
Dish: ${todaysSummary.dinner.dish}
People: ${todaysSummary.dinner.people}
Rotis needed: ${todaysSummary.dinner.totalRotis}

Thanks! 🙏`;

    // Mock WhatsApp notification
    if (navigator.share) {
      navigator.share({
        title: 'FlatMeals - Today\'s Order',
        text: lunchMessage,
      });
    } else {
      navigator.clipboard.writeText(lunchMessage);
    }
    
    setNotificationSent(true);
    setTimeout(onNotificationSent, 2000);
  };

  if (notificationSent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50 px-4 py-6 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="text-8xl mb-6">✅</div>
          <h2 className="text-2xl mb-3">Cook Notified!</h2>
          <p className="text-gray-600 mb-6">
            Your cook has been sent today's meal summary via WhatsApp
          </p>
          <div className="p-4 bg-green-100 rounded-xl border-2 border-green-300">
            <p className="text-green-800 text-sm">
              "Rajma Chawal for 3 people and Dal Tadka for 2 people. Got it! 👍" - Cook
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50 px-4 py-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">👨‍🍳</div>
          <h1 className="text-2xl mb-2">Cook Summary</h1>
          <p className="text-gray-600">Ready to send today's order!</p>
        </div>

        {/* Lunch Summary */}
        <Card className="mb-4 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌞</span>
                <h3 className="text-lg">Lunch Summary</h3>
              </div>
              <Badge className="bg-orange-100 text-orange-800">
                Final
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium text-lg">{todaysSummary.lunch.dish}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{todaysSummary.lunch.people} people</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Utensils className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{todaysSummary.lunch.totalRotis} rotis</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600 px-3">
              Roti breakdown: 
              {Object.entries(todaysSummary.lunch.rotiCounts).map(([count, people]) => (
                <span key={count} className="ml-2">
                  {people} person(s) × {count} rotis
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dinner Summary */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌙</span>
                <h3 className="text-lg">Dinner Summary</h3>
              </div>
              <Badge className="bg-green-100 text-green-800">
                Final
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-lg">{todaysSummary.dinner.dish}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{todaysSummary.dinner.people} people</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Utensils className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{todaysSummary.dinner.totalRotis} rotis</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600 px-3">
              Roti breakdown: 
              {Object.entries(todaysSummary.dinner.rotiCounts).map(([count, people]) => (
                <span key={count} className="ml-2">
                  {people} person(s) × {count} rotis
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Send Button */}
        <Button
          onClick={handleSendToCook}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg"
        >
          <Share2 className="w-5 h-5 mr-3" />
          Send to Cook via WhatsApp
        </Button>

        {/* Note */}
        <div className="text-center mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            💡 This will send a WhatsApp message with today's meal summary to your cook
          </p>
        </div>
      </div>
    </div>
  );
}