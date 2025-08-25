"use client";

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Lock, 
  Bell, 
  Mail, 
  MapPin, 
  Briefcase,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { getUser } from '@/lib/api/services/user';

interface UserDetails {
  id?: string;
  name?: string;
  email?: string;
  location?: string;
  role?: string;
  specialization?: string;
  bio?: string;
  about?: string;
  profile_picture?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  messageNotifications: boolean;
  jobAlerts: boolean;
  networkUpdates: boolean;
  postLikes: boolean;
  postComments: boolean;
}

const SettingsPage = () => {
  const { currentUser, fetchCurrentUser } = useUserStore();
  const [userDetails, setUserDetails] = useState<UserDetails>({});
  const [originalDetails, setOriginalDetails] = useState<UserDetails>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    messageNotifications: true,
    jobAlerts: true,
    networkUpdates: false,
    postLikes: true,
    postComments: true,
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!currentUser) {
          await fetchCurrentUser();
        }
        
        // Fetch detailed user data
        const userData = await getUser();
        const details = {
          id: userData.id,
          name: userData.name,
          email: userData.email || '',
          location: userData.location || '',
          role: userData.role || '',
          specialization: userData.specialization || '',
          bio: userData.bio || '',
          about: userData.about || '',
          profile_picture: userData.profile_picture || '',
        };
        
        setUserDetails(details);
        setOriginalDetails(details);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser, fetchCurrentUser]);

  const handleInputChange = (field: keyof UserDetails, value: string) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (setting: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Here you would typically make an API call to update the user profile
      console.log('Saving profile:', userDetails);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOriginalDetails(userDetails);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    setSaving(true);
    try {
      // Here you would typically make an API call to change the password
      console.log('Changing password');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      // Here you would typically make an API call to update notification preferences
      console.log('Saving notifications:', notifications);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Notification preferences updated successfully!');
    } catch (error) {
      console.error('Error saving notifications:', error);
      alert('Error updating notification preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  const hasChanges = JSON.stringify(userDetails) !== JSON.stringify(originalDetails);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Password
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={userDetails.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userDetails.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={userDetails.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter your location"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={userDetails.role || ''}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    placeholder="Enter your role"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={userDetails.specialization || ''}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    placeholder="Enter your specialization"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={userDetails.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Enter your bio"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Input
                  id="about"
                  value={userDetails.about || ''}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  placeholder="Tell us about yourself"
                />
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={!hasChanges || saving}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    placeholder="Enter your current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    placeholder="Enter your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                  onClick={handleChangePassword}
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || saving}
                >
                  {saving ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Message Notifications</Label>
                    <p className="text-sm text-gray-500">Get notified when you receive new messages</p>
                  </div>
                  <Switch
                    checked={notifications.messageNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('messageNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Job Alerts</Label>
                    <p className="text-sm text-gray-500">Receive notifications about new job opportunities</p>
                  </div>
                  <Switch
                    checked={notifications.jobAlerts}
                    onCheckedChange={(checked) => handleNotificationChange('jobAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Network Updates</Label>
                    <p className="text-sm text-gray-500">Get notified about updates from your network</p>
                  </div>
                  <Switch
                    checked={notifications.networkUpdates}
                    onCheckedChange={(checked) => handleNotificationChange('networkUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Post Likes</Label>
                    <p className="text-sm text-gray-500">Get notified when someone likes your posts</p>
                  </div>
                  <Switch
                    checked={notifications.postLikes}
                    onCheckedChange={(checked) => handleNotificationChange('postLikes', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Post Comments</Label>
                    <p className="text-sm text-gray-500">Get notified when someone comments on your posts</p>
                  </div>
                  <Switch
                    checked={notifications.postComments}
                    onCheckedChange={(checked) => handleNotificationChange('postComments', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;