import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface WelcomeScreenProps {
  onCreateGroup: () => void;
  onJoinGroup: () => void;
}

export function WelcomeScreen({ onCreateGroup, onJoinGroup }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50 flex flex-col items-center justify-center px-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🍲</div>
        <h1 className="text-3xl mb-2 text-gray-900">FlatMeals</h1>
        <p className="text-gray-600 text-lg max-w-sm">
          Plan meals, reduce chaos, and keep your cook updated 🍲
        </p>
      </div>

      <Card className="w-full max-w-sm shadow-lg border-0">
        <CardContent className="p-6 space-y-4">
          <Button 
            onClick={onCreateGroup}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg rounded-xl"
          >
            <span className="mr-2">👥</span>
            Create Flat Group
          </Button>
          
          <Button 
            onClick={onJoinGroup}
            variant="outline" 
            className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 py-6 text-lg rounded-xl"
          >
            <span className="mr-2">🏠</span>
            Join Flat Group
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}