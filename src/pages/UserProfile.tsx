import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  User,
  Mail,
  Shield,
  ExternalLink,
  Lock,
  Monitor,
  Smartphone,
  Eye,
  Twitter,
  Linkedin,
  Github,
  Music,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const connectedAccounts = [
  {
    name: "Twitter",
    username: "@jessicasmith",
    icon: Twitter,
    color: "text-blue-400",
    bgColor: "bg-blue-50",
  },
  {
    name: "LinkedIn",
    username: "jessica-smith",
    icon: Linkedin,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    name: "GitHub",
    username: "jessica_dev",
    icon: Github,
    color: "text-gray-800",
    bgColor: "bg-gray-50",
  },
  {
    name: "Spotify",
    username: "jessica_tunes",
    icon: Music,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
];

const recentActivity = [
  {
    action: "Logged in",
    description: "From Chrome on Desktop",
    time: "2 hours ago",
    icon: Monitor,
  },
  {
    action: "Profile updated",
    description: "Changed contact email",
    time: "Yesterday",
    icon: User,
  },
  {
    action: "Password changed",
    description: "Successfully updated",
    time: "3 days ago",
    icon: Lock,
  },
  {
    action: "Logged in",
    description: "From Safari on Mobile",
    time: "5 days ago",
    icon: Smartphone,
  },
];

const UserProfile = () => {
  const [user] = useState({
    name: "Jessica Smith",
    email: "jessica.smith@example.com",
    accountType: "Personal User Account",
    avatar: "/placeholder.svg",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded transform rotate-45"></div>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                ProcureFlow
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                JS
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-8 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-6">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 text-2xl">
                    JS
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h3>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{user.accountType}</span>
                </div>
                <div className="space-y-3">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Security Settings
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-500">
                        Manage your password settings.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Connected Accounts */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    <ExternalLink className="h-3 w-3 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Connected Accounts
                  </h3>
                </div>
                <div className="space-y-4">
                  {connectedAccounts.map((account, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            account.bgColor,
                          )}
                        >
                          <account.icon
                            className={cn("h-5 w-5", account.color)}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {account.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {account.username}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600"
                      >
                        Disconnect
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                      <Eye className="h-3 w-3 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Activity
                    </h3>
                  </div>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                        <activity.icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <span className="text-sm text-gray-500">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="ghost" className="text-indigo-600">
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © 2024 ProcureFlow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
