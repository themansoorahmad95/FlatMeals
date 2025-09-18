import { useState, useEffect } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { CreateGroupScreen } from "./components/CreateGroupScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { HomeScreen } from "./components/HomeScreen";
import { WeeklyPlanScreen } from "./components/WeeklyPlanScreen";
import { DailyHeadcountScreen } from "./components/DailyHeadcountScreen";
import { CookSummaryScreen } from "./components/CookSummaryScreen";
import { CookUnavailableScreen } from "./components/CookUnavailableScreen";
import { BottomNavigation } from "./components/BottomNavigation";
import {
  projectId,
  publicAnonKey,
} from "./utils/supabase/info";

interface UserData {
  id: string;
  dietType: "veg" | "non-veg";
  rotiCount: number;
  favoriteDishes: string[];
  dislikes: string;
}

interface GroupData {
  id: string;
  name: string;
  members: UserData[];
  mealPlan: any;
  settings: any;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [activeTab, setActiveTab] = useState("home");
  const [userData, setUserData] = useState<UserData | null>(
    null,
  );
  const [groupData, setGroupData] = useState<GroupData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Generate user ID if not exists
  const getUserId = () => {
    let userId = localStorage.getItem("flatmeals_user_id");
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      localStorage.setItem("flatmeals_user_id", userId);
    }
    return userId;
  };

  // Generate sample data for demo mode
  const generateDemoData = () => {
    const userId = getUserId();
    const demoUserData = {
      id: userId,
      dietType: "veg" as const,
      rotiCount: 3,
      favoriteDishes: [
        "Rajma Chawal 🍛",
        "Palak Paneer 🥬",
        "Dal Tadka 🥄",
      ],
      dislikes: "",
    };

    const demoGroupData = {
      id: `demo_group_${userId}`,
      name: "Demo Flat",
      members: [demoUserData],
      mealPlan: {
        Mon: {
          lunch: "Rajma Chawal 🍛",
          dinner: "Palak Paneer 🥬",
        },
        Tue: { lunch: "Dal Tadka 🥄", dinner: "Aloo Gobi 🥔" },
        Wed: {
          lunch: "Sambhar Rice 🍚",
          dinner: "Mixed Veg 🥕",
        },
        Thu: {
          lunch: "Chole Bhature 🥙",
          dinner: "Paneer Butter Masala 🧈",
        },
        Fri: {
          lunch: "Veg Biryani 🍚",
          dinner: "Kadhi Chawal 🥄",
        },
        Sat: { lunch: "Palak Dal 🥬", dinner: "Rasam 🍜" },
        generatedAt: new Date().toISOString(),
        locked: false,
      },
      settings: {
        lunchDeadline: "10:00",
        dinnerDeadline: "16:00",
      },
    };

    return { userData: demoUserData, groupData: demoGroupData };
  };

  // API helper with timeout and error handling
  const apiCall = async (
    endpoint: string,
    options: any = {},
  ) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      5000,
    ); // 5 second timeout

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-931651d3${endpoint}`,
        {
          ...options,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
            ...options.headers,
          },
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      console.log(`API call failed for ${endpoint}:`, error);

      if (error.name === "AbortError") {
        throw new Error("Request timeout");
      }

      throw error;
    }
  };

  // Load user data on app start
  useEffect(() => {
    const loadUserData = async () => {
      // Set a maximum loading time of 3 seconds
      const loadingTimeout = setTimeout(() => {
        console.log(
          "Force ending loading state due to timeout",
        );
        setLoading(false);
      }, 3000);

      try {
        const userId = getUserId();

        // Check for invite link in URL
        const urlParams = new URLSearchParams(
          window.location.search,
        );
        const inviteCode = urlParams.get("invite");

        if (inviteCode) {
          localStorage.setItem("pending_invite", inviteCode);
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        }

        // Try to load cached data first for immediate UI
        const cachedUserData = localStorage.getItem(
          "flatmeals_cached_user",
        );
        const cachedGroupData = localStorage.getItem(
          "flatmeals_cached_group",
        );

        if (cachedUserData && cachedGroupData) {
          console.log("Loading from cache immediately...");
          setUserData(JSON.parse(cachedUserData));
          setGroupData(JSON.parse(cachedGroupData));
          setCurrentScreen("home");
          setActiveTab("home");
          setIsOfflineMode(true);
          clearTimeout(loadingTimeout);
          setLoading(false);
          return; // Exit early with cached data
        }

        // Try API call with very short timeout
        try {
          const result = await apiCall(`/user/${userId}/group`);

          if (result && result.group) {
            setGroupData(result.group);
            const user = result.group.members.find(
              (m: any) => m.id === userId,
            );
            if (user) {
              setUserData(user);
              setCurrentScreen("home");
              setActiveTab("home");
            }
            // Cache the data for next time
            localStorage.setItem(
              "flatmeals_cached_group",
              JSON.stringify(result.group),
            );
            if (user) {
              localStorage.setItem(
                "flatmeals_cached_user",
                JSON.stringify(user),
              );
            }
          } else {
            // Check if there's a pending invite
            const pendingInvite =
              localStorage.getItem("pending_invite");
            if (pendingInvite) {
              setCurrentScreen("onboarding");
            }
          }
        } catch (apiError) {
          console.log("API failed, using welcome flow");
          setIsOfflineMode(true);

          // Check if there's a pending invite
          const pendingInvite =
            localStorage.getItem("pending_invite");
          if (pendingInvite) {
            setCurrentScreen("onboarding");
          }
        }
      } catch (error) {
        console.log("Critical error, using fallback:", error);
        setIsOfflineMode(true);
      } finally {
        clearTimeout(loadingTimeout);
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const showBottomNav =
    ![
      "welcome",
      "create-group",
      "join-group",
      "onboarding",
      "cook-unavailable",
    ].includes(currentScreen) && groupData;

  const handleCreateGroup = async (groupName: string) => {
    try {
      const userId = getUserId();

      if (isOfflineMode) {
        // Create demo group for offline mode
        const { userData: demoUser, groupData: demoGroup } =
          generateDemoData();
        demoGroup.name = groupName;
        setGroupData(demoGroup);
        setUserData(demoUser);

        // Cache data
        localStorage.setItem(
          "flatmeals_cached_user",
          JSON.stringify(demoUser),
        );
        localStorage.setItem(
          "flatmeals_cached_group",
          JSON.stringify(demoGroup),
        );

        return demoGroup.id;
      }

      const result = await apiCall("/groups", {
        method: "POST",
        body: JSON.stringify({
          name: groupName,
          creatorId: userId,
          creatorData: userData,
        }),
      });

      if (result.success) {
        setGroupData(result.groupData);
        // Cache data
        localStorage.setItem(
          "flatmeals_cached_group",
          JSON.stringify(result.groupData),
        );
        return result.groupId;
      }
    } catch (error) {
      console.log(
        "Error creating group, falling back to offline mode:",
        error,
      );
      setIsOfflineMode(true);

      // Create demo group as fallback
      const userId = getUserId();
      const { userData: demoUser, groupData: demoGroup } =
        generateDemoData();
      demoGroup.name = groupName;
      setGroupData(demoGroup);
      setUserData(demoUser);

      // Cache data
      localStorage.setItem(
        "flatmeals_cached_user",
        JSON.stringify(demoUser),
      );
      localStorage.setItem(
        "flatmeals_cached_group",
        JSON.stringify(demoGroup),
      );

      return demoGroup.id;
    }
  };

  const handleOnboardingComplete = async (preferences: any) => {
    const userId = getUserId();
    const newUserData = { id: userId, ...preferences };
    setUserData(newUserData);

    // Cache user data
    localStorage.setItem(
      "flatmeals_cached_user",
      JSON.stringify(newUserData),
    );

    if (groupData) {
      // Join existing group logic would go here
      setCurrentScreen("home");
      setActiveTab("home");
    } else {
      // For now, just proceed to home
      setCurrentScreen("home");
      setActiveTab("home");
    }
  };

  const handleGenerateMealPlan = async () => {
    if (!groupData) return;

    try {
      if (isOfflineMode) {
        // Generate offline meal plan
        const offlinePlan = {
          Mon: {
            lunch: "Rajma Chawal 🍛",
            dinner: "Palak Paneer 🥬",
          },
          Tue: {
            lunch: "Dal Tadka 🥄",
            dinner: "Aloo Gobi 🥔",
          },
          Wed: {
            lunch: "Sambhar Rice 🍚",
            dinner: "Mixed Veg 🥕",
          },
          Thu: {
            lunch: "Chole Bhature 🥙",
            dinner: "Paneer Butter Masala 🧈",
          },
          Fri: {
            lunch: "Veg Biryani 🍚",
            dinner: "Kadhi Chawal 🥄",
          },
          Sat: { lunch: "Palak Dal 🥬", dinner: "Rasam 🍜" },
          generatedAt: new Date().toISOString(),
          locked: false,
        };

        const updatedGroup = {
          ...groupData,
          mealPlan: offlinePlan,
        };
        setGroupData(updatedGroup);
        localStorage.setItem(
          "flatmeals_cached_group",
          JSON.stringify(updatedGroup),
        );

        return offlinePlan;
      }

      const result = await apiCall(
        `/groups/${groupData.id}/generate-plan`,
        {
          method: "POST",
        },
      );

      if (result.success) {
        const updatedGroup = {
          ...groupData,
          mealPlan: result.mealPlan,
        };
        setGroupData(updatedGroup);
        localStorage.setItem(
          "flatmeals_cached_group",
          JSON.stringify(updatedGroup),
        );
        return result.mealPlan;
      }
    } catch (error) {
      console.log("Error generating meal plan:", error);
      // Could show an error toast here
    }
  };

  const handleLockPlan = async () => {
    if (!groupData) return;

    try {
      if (isOfflineMode) {
        const updatedGroup = {
          ...groupData,
          mealPlan: { ...groupData.mealPlan, locked: true },
        };
        setGroupData(updatedGroup);
        localStorage.setItem(
          "flatmeals_cached_group",
          JSON.stringify(updatedGroup),
        );
        return;
      }

      await apiCall(`/groups/${groupData.id}/lock-plan`, {
        method: "POST",
      });

      const updatedGroup = {
        ...groupData,
        mealPlan: { ...groupData.mealPlan, locked: true },
      };
      setGroupData(updatedGroup);
      localStorage.setItem(
        "flatmeals_cached_group",
        JSON.stringify(updatedGroup),
      );
    } catch (error) {
      console.log("Error locking meal plan:", error);
    }
  };

  const handleHeadcountSubmit = async (
    lunch: boolean,
    dinner: boolean,
  ) => {
    if (!groupData || !userData) return;

    try {
      if (isOfflineMode) {
        // Just show success in offline mode
        console.log("Offline headcount submission:", {
          lunch,
          dinner,
        });
        return;
      }

      const today = new Date().toISOString().split("T")[0];
      await apiCall(`/groups/${groupData.id}/headcount`, {
        method: "POST",
        body: JSON.stringify({
          userId: userData.id,
          date: today,
          lunch,
          dinner,
        }),
      });
    } catch (error) {
      console.log("Error submitting headcount:", error);
    }
  };

  const handleSendCookNotification = async () => {
    if (!groupData) return;

    try {
      if (isOfflineMode) {
        // Generate demo notification message
        const demoMessage = `🍲 *FlatMeals Order for ${new Date().toLocaleDateString()}*

🌞 *Lunch: Rajma Chawal 🍛*
👥 People: 1
🥖 Rotis: 3

🌙 *Dinner: Palak Paneer 🥬*
👥 People: 1
🥖 Rotis: 3

Thanks! 🙏 (Demo Mode)`;

        if (navigator.clipboard) {
          navigator.clipboard.writeText(demoMessage);
          alert(
            "Demo cook notification copied to clipboard! 📋",
          );
        }

        return true;
      }

      const today = new Date().toISOString().split("T")[0];
      const summaryResult = await apiCall(
        `/groups/${groupData.id}/headcount/${today}`,
      );

      const result = await apiCall(
        `/groups/${groupData.id}/notify-cook`,
        {
          method: "POST",
          body: JSON.stringify({
            date: today,
            summary: summaryResult,
          }),
        },
      );

      return result.success;
    } catch (error) {
      console.log("Error sending cook notification:", error);
      return false;
    }
  };

  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen);

    // Set appropriate tab when navigating
    if (screen === "home") setActiveTab("home");
    else if (screen === "weekly-plan") setActiveTab("plan");
    else if (screen === "daily-headcount")
      setActiveTab("headcount");
    else if (screen === "cook-summary") setActiveTab("cook");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Navigate to appropriate screen
    if (tab === "home") setCurrentScreen("home");
    else if (tab === "plan") setCurrentScreen("weekly-plan");
    else if (tab === "headcount")
      setCurrentScreen("daily-headcount");
    else if (tab === "cook") setCurrentScreen("cook-summary");
  };

  const renderScreen = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🍲</div>
            <h2 className="text-xl mb-2">
              Loading FlatMeals...
            </h2>
            <p className="text-gray-600">
              Setting up your meal planning experience
            </p>
          </div>
        </div>
      );
    }

    switch (currentScreen) {
      case "welcome":
        return (
          <WelcomeScreen
            onCreateGroup={() =>
              setCurrentScreen("create-group")
            }
            onJoinGroup={() => setCurrentScreen("onboarding")} // Mock join flow
          />
        );

      case "create-group":
        return (
          <CreateGroupScreen
            onBack={() => setCurrentScreen("welcome")}
            onGroupCreated={(groupName) => {
              handleCreateGroup(groupName);
              setCurrentScreen("onboarding");
            }}
          />
        );

      case "onboarding":
        return (
          <OnboardingScreen
            onBack={() =>
              setCurrentScreen(
                groupData ? "welcome" : "create-group",
              )
            }
            onComplete={handleOnboardingComplete}
          />
        );

      case "home":
        return (
          <HomeScreen
            onNavigate={handleNavigation}
            userData={userData}
            groupData={groupData}
          />
        );

      case "weekly-plan":
        return (
          <WeeklyPlanScreen
            groupData={groupData}
            onGeneratePlan={handleGenerateMealPlan}
            onLockPlan={handleLockPlan}
            onPlanLocked={() => {
              // Could show a success message or navigate somewhere
            }}
          />
        );

      case "daily-headcount":
        return (
          <DailyHeadcountScreen
            groupData={groupData}
            userData={userData}
            onHeadcountSubmit={handleHeadcountSubmit}
            onHeadcountConfirmed={() => {
              // Could show success or navigate
            }}
          />
        );

      case "cook-summary":
        return (
          <CookSummaryScreen
            groupData={groupData}
            onSendNotification={handleSendCookNotification}
            onNotificationSent={() => {
              // Could navigate back to home
            }}
          />
        );

      case "cook-unavailable":
        return (
          <CookUnavailableScreen
            onVoteSubmitted={() => {
              setCurrentScreen("home");
              setActiveTab("home");
            }}
          />
        );

      default:
        return (
          <HomeScreen
            onNavigate={handleNavigation}
            userData={userData}
            groupData={groupData}
          />
        );
    }
  };

  return (
    <div className="size-full relative">
      {renderScreen()}

      {showBottomNav && (
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}
    </div>
  );
}