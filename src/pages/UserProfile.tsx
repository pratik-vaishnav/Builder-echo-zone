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
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import Layout from "@/components/shared/Layout";
import ProcureFlowIcon from "@/components/shared/ProcureFlowIcon";

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
    accountType: "Procurement Manager",
    avatar: "/placeholder.svg",
  });

  return (
    <Layout currentPage="user-profile" showSearch={false}>
      <div className="page-container">
        {/* Back to Dashboard Link */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to ProcureFlow Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your ProcureFlow account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
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
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <User className="h-4 w-4 text-gray-500" />
                  <Badge className="bg-indigo-100 text-indigo-800 border-0">
                    {user.accountType}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <Button className="w-full btn-gradient">Edit Profile</Button>
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="mt-6 card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-red-600" />
                  </div>
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
            {/* Quick Access to ProcureFlow */}
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quick Access
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <div className="text-lg mb-1">📊</div>
                      <span className="text-sm">Dashboard</span>
                    </Button>
                  </Link>
                  <Link to="/submit-request">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <div className="text-lg mb-1">📝</div>
                      <span className="text-sm">New Request</span>
                    </Button>
                  </Link>
                  <Link to="/approve-requests">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <div className="text-lg mb-1">✅</div>
                      <span className="text-sm">Approvals</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Connected Accounts */}
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 text-blue-600" />
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
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Eye className="h-4 w-4 text-gray-600" />
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
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © 2024 ProcureFlow. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/terms"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Privacy
              </Link>
              <Link
                to="/support"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;