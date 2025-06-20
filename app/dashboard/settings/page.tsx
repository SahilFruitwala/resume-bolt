"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      const primaryEmail = user.primaryEmailAddress?.emailAddress;
      setEmail(primaryEmail || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email }),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      toast.error(
        "An error occurred while updating your profile. Please try again."
      );
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch("/api/user/", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          alert("Account deleted successfully."); // Or simply redirect without alert
          window.location.href = "/";
        } else {
          const errorData = await response.json().catch(() => ({
            message: "Failed to delete account. Please try again.",
          }));
          toast.error(
            errorData.message || "Failed to delete account. Please try again."
          );
        }
      } catch (error) {
        toast.error(
          "An error occurred while deleting your account. Please try again."
        );
      }
    }
  };

  const handleSavePreferences = () => {
    // toast({
    //   title: 'Preferences Saved',
    //   description: 'Your app preferences have been updated.',
    // });
  };

  return (
    // <main className="flex-1 p-6 lg:p-10 space-y-4">
    //     <div className="p-6">
    <div className="max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList> */}

      {/* <TabsContent value="profile" className="space-y-4"> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {/* <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button> */}
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Password</Button>
            </CardFooter>
          </Card> */}
      {/* </TabsContent> */}

      {/* <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>
                Customize how the app works for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and updates
                  </p>
                </div>
                <Switch id="notifications" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="save-history">Save Game History</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep a record of your previous game results
                  </p>
                </div>
                <Switch id="save-history" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations">Show Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable animations throughout the app
                  </p>
                </div>
                <Switch id="animations" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences}>Save Preferences</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Game Preferences</CardTitle>
              <CardDescription>Set default options for games</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slot-duration">
                  Default Slot Machine Spin Duration (seconds)
                </Label>
                <Input
                  id="slot-duration"
                  type="number"
                  defaultValue="3"
                  min="1"
                  max="10"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound-effects">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound effects during games
                  </p>
                </div>
                <Switch id="sound-effects" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences}>
                Save Game Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs> */}
    </div>
  );
}
