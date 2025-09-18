import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ArrowLeft, Share2 } from "lucide-react";

interface CreateGroupScreenProps {
  onBack: () => void;
  onGroupCreated: (groupName: string) => void;
}

export function CreateGroupScreen({ onBack, onGroupCreated }: CreateGroupScreenProps) {
  const [flatName, setFlatName] = useState("");
  const [isCreated, setIsCreated] = useState(false);

  const handleCreateGroup = () => {
    if (flatName.trim()) {
      setIsCreated(true);
    }
  };

  const handleInvite = () => {
    // Generate a real shareable invite link for your deployed app
    const appUrl = window.location.origin; // Gets your actual domain
    const inviteCode = flatName.toLowerCase().replace(/\s+/g, '-');
    const inviteUrl = `${appUrl}?invite=${encodeURIComponent(inviteCode)}`;
    
    const inviteText = `🍲 *Join our FlatMeals group!*

Hey! I've created "${flatName}" on FlatMeals for easy meal planning.

*What is FlatMeals?*
✅ Plan weekly meals together
✅ Confirm daily headcount  
✅ Auto-notify cook via WhatsApp
✅ Smart diet preference handling

*Join our group:*
${inviteUrl}

Let's make meal planning super easy! 🍽️

#FlatMeals #MealPlanning #SharedFlat`;
    
    if (navigator.share) {
      navigator.share({
        title: `Join ${flatName} on FlatMeals`,
        text: inviteText,
        url: inviteUrl
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteText);
      alert('🎉 Invite message copied! Share it in your flat WhatsApp group.');
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = inviteText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('🎉 Invite message copied! Share it in your flat WhatsApp group.');
    }
  };

  const handleContinue = () => {
    onGroupCreated(flatName);
  };

  if (isCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50 px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl mb-2">Group Created!</h2>
            <p className="text-gray-600">"{flatName}" is ready for meal planning</p>
          </div>

          <Card className="mb-6 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg mb-3">Invite your flatmates</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Share this with your flatmates so they can join the group
              </p>
              <Button 
                onClick={handleInvite}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl mb-4"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Invite Link
              </Button>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Tip:</strong> You can invite more people later from the home screen!
                </p>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleContinue}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl"
          >
            Continue to Setup Profile 👤
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="mr-3 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl">Create Flat Group</h1>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="text-5xl mb-3">🏠</div>
            <p className="text-gray-600">Give your flat a fun name!</p>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2">Flat Name</label>
                <Input
                  value={flatName}
                  onChange={(e) => setFlatName(e.target.value)}
                  placeholder="e.g., The Hungry Gang 🍽️"
                  className="py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-green-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This will be visible to all flatmates and your cook
                </p>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  💡 <strong>Pro tip:</strong> Choose a name everyone will recognize! Your cook will see this in notifications.
                </p>
              </div>

              <Button 
                onClick={handleCreateGroup}
                disabled={!flatName.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-4 rounded-xl"
              >
                <span className="mr-2">✨</span>
                Create Group
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}