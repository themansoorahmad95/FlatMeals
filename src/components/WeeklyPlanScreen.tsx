import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { RefreshCw, Shuffle, Lock, Users } from "lucide-react";

interface WeeklyPlanScreenProps {
  groupData: any;
  onGeneratePlan: () => Promise<any>;
  onLockPlan: () => Promise<void>;
  onPlanLocked: () => void;
}

export function WeeklyPlanScreen({ groupData, onGeneratePlan, onLockPlan, onPlanLocked }: WeeklyPlanScreenProps) {
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (groupData?.mealPlan) {
      setMealPlan(groupData.mealPlan);
    }
  }, [groupData]);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const newPlan = await onGeneratePlan();
      if (newPlan) {
        setMealPlan(newPlan);
      }
    } catch (error) {
      console.log('Error generating plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLockPlan = async () => {
    setIsLocking(true);
    try {
      await onLockPlan();
      setMealPlan({ ...mealPlan, locked: true });
      onPlanLocked();
    } catch (error) {
      console.log('Error locking plan:', error);
    } finally {
      setIsLocking(false);
    }
  };

  const swapDish = (day: string, meal: 'lunch' | 'dinner') => {
    if (mealPlan?.locked) return;

    // Get available dishes based on group preferences
    const vegMembers = groupData?.members?.filter((m: any) => m.dietType === 'veg') || [];
    const hasVegMembers = vegMembers.length > 0;
    
    let availableDishes: string[] = [];
    groupData?.members?.forEach((member: any) => {
      if (member.favoriteDishes) {
        availableDishes.push(...member.favoriteDishes);
      }
    });

    // Remove duplicates
    availableDishes = [...new Set(availableDishes)];

    // If there are veg members, prioritize veg dishes
    if (hasVegMembers) {
      const vegDishes = availableDishes.filter(dish => 
        !dish.includes('Chicken') && !dish.includes('Fish') && 
        !dish.includes('Mutton') && !dish.includes('Egg') && 
        !dish.includes('Prawn')
      );
      availableDishes = vegDishes.length > 0 ? vegDishes : availableDishes;
    }

    const currentDish = mealPlan[day][meal];
    const otherDishes = availableDishes.filter(dish => dish !== currentDish);
    const randomDish = otherDishes[Math.floor(Math.random() * otherDishes.length)];
    
    if (randomDish) {
      setMealPlan({
        ...mealPlan,
        [day]: {
          ...mealPlan[day],
          [meal]: randomDish
        }
      });
    }
  };

  const getDishIcon = (dish: string) => {
    if (dish.includes('Rice') || dish.includes('Biryani') || dish.includes('Chawal')) return '🍚';
    if (dish.includes('Roti') || dish.includes('Bhature')) return '🥖';
    return '🍛';
  };

  const getGroupInfo = () => {
    if (!groupData?.members) return { total: 0, veg: 0, nonVeg: 0 };
    
    const total = groupData.members.length;
    const veg = groupData.members.filter((m: any) => m.dietType === 'veg').length;
    const nonVeg = total - veg;
    
    return { total, veg, nonVeg };
  };

  const groupInfo = getGroupInfo();

  if (!mealPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50 px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl mb-2">Weekly Meal Plan</h1>
            <p className="text-gray-600">Let's create a delicious plan for your flat! 🍽️</p>
          </div>

          <Card className="mb-6 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl mb-3">No Meal Plan Yet</h3>
              <p className="text-gray-600 mb-6">
                Generate a smart meal plan based on everyone's preferences
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium text-sm">Group Info</span>
                </div>
                <p className="text-blue-700 text-sm">
                  {groupInfo.total} members • {groupInfo.veg} veg • {groupInfo.nonVeg} non-veg
                </p>
              </div>

              <Button 
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-4 rounded-xl"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating Smart Plan...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✨</span>
                    Generate Meal Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-sm">
              💡 <strong>Smart Planning:</strong> We'll consider everyone's diet preferences and favorite dishes!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isLocked = mealPlan?.locked;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50 px-4 py-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl mb-2">This Week's Meal Plan</h1>
          <div className="flex items-center justify-center space-x-2">
            <p className="text-gray-600">Planned for {groupData?.name || 'your flat'}</p>
            {isLocked && <Badge className="bg-green-100 text-green-800">🔒 Locked</Badge>}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {weekDays.map(day => (
            <Card key={day} className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{day}</h3>
                  <Badge variant="outline" className="text-xs">
                    {day === "Mon" ? "Today" : day === "Tue" ? "Tomorrow" : ""}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getDishIcon(mealPlan[day]?.lunch)}</span>
                    <div>
                      <p className="text-sm text-gray-600">Lunch</p>
                      <p className="font-medium">{mealPlan[day]?.lunch}</p>
                    </div>
                  </div>
                  {!isLocked && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => swapDish(day, 'lunch')}
                      className="p-2"
                    >
                      <Shuffle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getDishIcon(mealPlan[day]?.dinner)}</span>
                    <div>
                      <p className="text-sm text-gray-600">Dinner</p>
                      <p className="font-medium">{mealPlan[day]?.dinner}</p>
                    </div>
                  </div>
                  {!isLocked && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => swapDish(day, 'dinner')}
                      className="p-2"
                    >
                      <Shuffle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!isLocked ? (
          <div className="fixed bottom-6 left-4 right-4 max-w-md mx-auto space-y-3">
            <div className="flex space-x-3">
              <Button 
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                variant="outline"
                className="flex-1 py-3 rounded-xl border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Regenerate
              </Button>
              
              <Button 
                onClick={handleLockPlan}
                disabled={isLocking}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
              >
                {isLocking ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Locking...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Lock Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 bg-green-100 rounded-xl border-2 border-green-300">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-green-800 font-medium">Plan Locked!</p>
            <p className="text-green-600 text-sm">Your cook will be notified daily with headcount</p>
            {mealPlan.lockedAt && (
              <p className="text-green-600 text-xs mt-1">
                Locked on {new Date(mealPlan.lockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}