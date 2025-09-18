import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Clock, Users, ChefHat, Calendar, Bell } from "lucide-react";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const todaysMeals = {
    lunch: { dish: "Rajma Chawal 🍛", confirmed: 3, total: 4 },
    dinner: { dish: "Dal Tadka 🥄", confirmed: 2, total: 4 }
  };

  const upcomingMeals = [
    { day: "Tomorrow", lunch: "Chole Bhature 🥙", dinner: "Palak Paneer 🥬" },
    { day: "Wednesday", lunch: "Sambhar Rice 🍚", dinner: "Aloo Gobi 🥔" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50 px-4 py-6 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🏠</div>
          <h1 className="text-2xl mb-1">Good Morning!</h1>
          <p className="text-gray-600">The Hungry Gang</p>
        </div>

        {/* Today's Status */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg">Today's Meals</h2>
              <Badge className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Lunch */}
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌞</span>
                <div>
                  <p className="font-medium">{todaysMeals.lunch.dish}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Users className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">
                      {todaysMeals.lunch.confirmed}/{todaysMeals.lunch.total} confirmed
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-xs flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>2h left</span>
              </Badge>
            </div>

            {/* Dinner */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌙</span>
                <div>
                  <p className="font-medium">{todaysMeals.dinner.dish}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Users className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">
                      {todaysMeals.dinner.confirmed}/{todaysMeals.dinner.total} confirmed
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-xs flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>6h left</span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            onClick={() => onNavigate('headcount')}
            className="flex flex-col items-center space-y-2 p-4 h-auto bg-green-600 hover:bg-green-700 text-white rounded-xl"
          >
            <Users className="w-6 h-6" />
            <span className="text-sm">Confirm Headcount</span>
          </Button>
          
          <Button
            onClick={() => onNavigate('plan')}
            variant="outline"
            className="flex flex-col items-center space-y-2 p-4 h-auto border-2 border-orange-500 text-orange-600 hover:bg-orange-50 rounded-xl"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-sm">View Plan</span>
          </Button>
        </div>

        {/* Upcoming Meals Preview */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <h3 className="text-lg">Upcoming Meals</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingMeals.map((meal, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{meal.day}</p>
                  <p className="text-xs text-gray-600">
                    {meal.lunch} • {meal.dinner}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Planned
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cook Status */}
        <Card className="border-0 shadow-sm bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <ChefHat className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-blue-800 font-medium text-sm">Cook Status</p>
                <p className="text-blue-600 text-xs">
                  Last notified 2 hours ago ✅
                </p>
              </div>
              <Button
                onClick={() => onNavigate('cook')}
                size="sm"
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-100"
              >
                View Summary
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Area */}
        <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-yellow-600" />
            <p className="text-yellow-800 text-sm">
              <strong>Reminder:</strong> Lunch headcount closes at 10 AM ⏰
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}