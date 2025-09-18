import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { AlertTriangle, Users, Pizza, Package, MapPin } from "lucide-react";

interface CookUnavailableScreenProps {
  onVoteSubmitted: () => void;
}

export function CookUnavailableScreen({ onVoteSubmitted }: CookUnavailableScreenProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const options = [
    { id: "order-in", label: "Order-in together", icon: "🍕", description: "Split the cost, order from our favorite places" },
    { id: "self-manage", label: "I'll manage myself", icon: "🥡", description: "Cook for myself or order individually" },
    { id: "not-home", label: "Not home anyway", icon: "🚶", description: "Won't be home for meals" }
  ];

  const currentVotes = {
    "order-in": 2,
    "self-manage": 1,
    "not-home": 0
  };

  const handleSubmitVote = () => {
    if (selectedOption) {
      setVoteSubmitted(true);
      setTimeout(onVoteSubmitted, 2000);
    }
  };

  if (voteSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 px-4 py-6 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="text-8xl mb-6">✅</div>
          <h2 className="text-2xl mb-3">Vote Submitted!</h2>
          <p className="text-gray-600 mb-6">
            We'll notify everyone once all votes are in
          </p>
          <div className="p-4 bg-green-100 rounded-xl border-2 border-green-300">
            <p className="text-green-800 text-sm mb-2">
              <strong>Current Results:</strong>
            </p>
            <div className="space-y-1 text-left">
              <p className="text-green-700 text-sm">🍕 Order-in together: {currentVotes["order-in"] + (selectedOption === "order-in" ? 1 : 0)} votes</p>
              <p className="text-green-700 text-sm">🥡 Self-manage: {currentVotes["self-manage"] + (selectedOption === "self-manage" ? 1 : 0)} votes</p>
              <p className="text-green-700 text-sm">🚶 Not home: {currentVotes["not-home"] + (selectedOption === "not-home" ? 1 : 0)} votes</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 px-4 py-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">❌</div>
          <h1 className="text-2xl mb-2 text-red-800">Cook Not Available</h1>
          <p className="text-gray-600">Cook can't make it tomorrow. What's your plan?</p>
        </div>

        {/* Alert Card */}
        <Card className="mb-6 border-0 shadow-lg border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-medium text-red-800">Tomorrow (Tuesday)</p>
                <p className="text-red-600 text-sm">Cook informed us they won't be available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voting Options */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <h3 className="text-lg">Choose your option:</h3>
            <p className="text-gray-600 text-sm">Help us plan the best solution for everyone</p>
          </CardHeader>
          
          <CardContent>
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-4">
              {options.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xl">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {currentVotes[option.id as keyof typeof currentVotes]} votes
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Current Group Status */}
        <Card className="mb-6 border-0 shadow-sm bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800 font-medium">Group Status</span>
            </div>
            <p className="text-blue-700 text-sm">
              3/4 flatmates have voted. Waiting for your vote!
            </p>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmitVote}
          disabled={!selectedOption}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white py-4 rounded-xl text-lg"
        >
          <span className="mr-2">🗳️</span>
          Submit Vote
        </Button>

        {/* Popular restaurants hint */}
        {selectedOption === "order-in" && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <Pizza className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800 font-medium">Popular choices nearby:</span>
            </div>
            <p className="text-yellow-700 text-sm">
              Domino's • Swiggy • Zomato • Local favorites
            </p>
          </div>
        )}
      </div>
    </div>
  );
}