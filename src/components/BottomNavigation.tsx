import { Button } from "./ui/button";
import { Home, Calendar, Users, ChefHat } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'plan', label: 'Plan', icon: Calendar },
    { id: 'headcount', label: 'Headcount', icon: Users },
    { id: 'cook', label: 'Cook', icon: ChefHat }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 h-auto ${
                isActive 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-600'}`} />
              <span className={`text-xs ${isActive ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                {tab.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}