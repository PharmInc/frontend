import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Calendar, Users, BookOpen, Edit, ExternalLink, Search, FileText, Video, Camera, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { tokenStorage } from '@/utils/tokenStorage';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Posts');
  const tabs = ['Posts', 'About', 'Activity', 'Experience', 'Education'];

  const [profileData, setProfileData] = useState(null);
  const [institution, setInstitution] = useState(null);
  const [loading, setLoading] = useState(true);

  const userObj = tokenStorage.getUser();
  const userId = userObj?.userId || userObj?.id;

  
  // Fetch profile data
  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    fetch(`https://api.pharminc.in/user/${userId}`, {
      headers: { Authorization: `Bearer ${tokenStorage.getToken()}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject('Could not load user'))
      .then(data => {
        setProfileData(Array.isArray(data) ? data[0] : data);
      })
      .catch(err => {
        console.error(err);
        setProfileData(null);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // Fetch institution
  useEffect(() => {
    if (!profileData) return;

    // Try user.institutionId first, then education.institutionId, then experience.institutionId
    let institutionId = profileData.user?.institutionId;
    if (!institutionId && profileData.educations) institutionId = profileData.educations.institutionId;
    if (!institutionId && profileData.experiences) institutionId = profileData.experiences.institutionId;

    if (institutionId) {
      fetch(`https://api.pharminc.in/institution/${institutionId}`, {
        headers: { Authorization: `Bearer ${tokenStorage.getToken()}` }
      })
        .then(res => res.ok ? res.json() : Promise.reject('No institution found.'))
        .then(setInstitution)
        .catch(() => setInstitution(null));
    }
  }, [profileData]);

  if (loading && !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading profile...</div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-xl text-gray-700">No user ID found. Please log in.</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-xl text-gray-700">No profile data found.</div>
      </div>
    );
  }

  const user = profileData.user;
  const experience = profileData.experiences;
  const education = profileData.educations;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />
      <div className="pt-16 max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="col-span-3">
            <Card className="mb-6 rounded-xl shadow-lg border-0 overflow-hidden bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <div className="h-20 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-t-xl"></div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                    <AvatarImage src={user?.profilePicture || "/pp.png"} alt={user?.firstName || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold">
                      {user?.firstName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <CardContent className="pt-12 pb-6 text-center">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{user?.specialization || "Specialization not set"}</p>
                <Separator className="my-4" />
                <div className="space-y-3 text-left text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Profile viewers</span>
                    <span className="text-blue-600 font-semibold">142</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Post impressions</span>
                    <span className="text-blue-600 font-semibold">1,247</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6 rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Connections</span>
                  <span className="font-semibold text-blue-600">42</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Posts</span>
                  <span className="font-semibold text-blue-600">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Comments</span>
                  <span className="font-semibold text-blue-600">76</span>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6 rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Resources</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-700">Research Papers</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-700">Case Studies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-700">Webinars</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="px-2 py-1">
                    <Edit className="h-3 w-3 mr-1" />
                    <span>Posted</span>
                  </Badge>
                  <span className="text-gray-700">New research on cardiology</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="px-2 py-1">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Joined</span>
                  </Badge>
                  <span className="text-gray-700">Cardiology Group</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="px-2 py-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Attended</span>
                  </Badge>
                  <span className="text-gray-700">Webinar on AI in Pharma</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-6">
            <Card className="mb-8 rounded-xl shadow-lg border-0 overflow-hidden bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <div className="h-60 relative overflow-hidden rounded-t-xl">
                  <img 
                    src="/banner.png" 
                    alt="Medical Banner" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <Button variant="ghost" size="sm" className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Edit cover photo
                  </Button>
                </div>
                <div className="absolute -bottom-20 left-8">
                  <div className="relative">
                    <Avatar className="h-40 w-40 border-4 border-white shadow-xl">
                      <AvatarImage src={user?.profilePicture || "/pp.png"} alt={user?.firstName || "User"} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold">
                        {user?.firstName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="ghost" size="sm" className="absolute bottom-2 right-2 bg-white border border-gray-300 p-2 h-10 w-10 rounded-full shadow-lg hover:shadow-xl">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="pt-24 pb-8">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-3xl font-bold text-gray-900">{user ? `${user.firstName} ${user.lastName}` : "Loading..."}</h1>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Online</span>
                    </div>
                  </div>
                  <p className="text-xl text-gray-700 mb-4">{user?.specialization || "Specialization not set"}</p>
                  <div className="flex items-center gap-2 text-gray-600 mb-6">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <span className="text-base">{user?.location || "Location not set"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="outline">{user?.specialization || "Specialization"}</Badge>
                    <Badge variant="outline">Pharmacist</Badge>
                    <Badge variant="outline">Researcher</Badge>
                  </div>
                  {institution && (
                    <div className="flex items-center gap-2 text-gray-600 mb-6">
                      <div className="font-medium">{institution.name}</div>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <Button variant="default">Connect</Button>
                    <Button variant="outline">Message</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tab Navigation */}
            <div className="flex gap-8 border-b border-gray-200 mb-8 bg-white/50 backdrop-blur-sm rounded-t-xl px-6 py-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 text-base font-semibold border-b-2 transition-all duration-200 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'About' && (
              <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-6">
                  <CardTitle className="text-2xl">About</CardTitle>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-700 leading-relaxed mb-8">
                    {user?.about || "No about info set."}
                  </p>
                </CardContent>
              </Card>
            )}

            {activeTab === 'Experience' && (
              <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-6">
                  <CardTitle className="text-2xl">Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  {experience ? (
                    <div key={experience.id} className="flex gap-4 items-start mb-6">
                      <img src={experience.institutionLogo || "/default-institution.png"} alt={experience.institutionName} className="h-10 w-10 rounded shadow" />
                      <div>
                        <div className="font-semibold text-lg">{experience.institutionName || "Institution"}</div>
                        <div className="text-sm text-gray-600">{experience.title || "Title"}</div>
                        <div className="text-xs text-gray-500">
                          {experience.startDate ? new Date(experience.startDate).toLocaleDateString() : "Start"} - 
                          {experience.endDate ? new Date(experience.endDate).toLocaleDateString() : "Present"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{experience.description || "Description"}</div>
                      </div>
                    </div>
                  ) : (
                    <div>No experience found.</div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'Education' && (
              <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-6">
                  <CardTitle className="text-2xl">Education</CardTitle>
                </CardHeader>
                <CardContent>
                  {education ? (
                    <div key={education.id} className="flex gap-4 items-start mb-6">
                      <img src={education.institutionLogo || "/default-institution.png"} alt={education.institutionName} className="h-10 w-10 rounded shadow" />
                      <div>
                        <div className="font-semibold text-lg">{education.institutionName || "Institution"}</div>
                        <div className="text-sm text-gray-600">{education.title || "Degree"}</div>
                        <div className="text-xs text-gray-500">
                          {education.startDate ? new Date(education.startDate).toLocaleDateString() : "Start"} - 
                          {education.endDate ? new Date(education.endDate).toLocaleDateString() : "Present"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{education.description || "Description"}</div>
                      </div>
                    </div>
                  ) : (
                    <div>No education found.</div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'Posts' && (
              <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl">Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border rounded-xl p-4">
                      <h3 className="font-semibold text-lg mb-2">Latest research on cardiology</h3>
                      <p className="text-gray-700 mb-3">Published a new paper on the effects of...</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>2 days ago</span>
                        <span>Â·</span>
                        <span>42 likes</span>
                      </div>
                    </div>
                    <div className="border rounded-xl p-4">
                      <h3 className="font-semibold text-lg mb-2">Webinar announcement</h3>
                      <p className="text-gray-700 mb-3">Join us for a webinar on AI in pharmaceuticals...</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>1 week ago</span>
                        <span>Â·</span>
                        <span>18 likes</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'Activity' && (
              <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl">Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="px-2 py-1">
                        <Edit className="h-3 w-3 mr-1" />
                        <span>Posted</span>
                      </Badge>
                      <div>
                        <h4 className="font-semibold text-base">Published a new article</h4>
                        <p className="text-sm text-gray-600">Shared insights on the latest trends in cardiology.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="px-2 py-1">
                        <Users className="h-3 w-3 mr-1" />
                        <span>Joined</span>
                      </Badge>
                      <div>
                        <h4 className="font-semibold text-base">Joined Cardiology Group</h4>
                        <p className="text-sm text-gray-600">Became a member of the Cardiology Network.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="px-2 py-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Attended</span>
                      </Badge>
                      <div>
                        <h4 className="font-semibold text-base">Attended Webinar</h4>
                        <p className="text-sm text-gray-600">Participated in a session on AI in Pharma.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar: Institution */}
          <div className="col-span-3 space-y-6">
            <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Institution</CardTitle>
              </CardHeader>
              <CardContent>
                {institution
                  ? <div>
                      <div className="font-semibold text-base">{institution.name}</div>
                      <div className="text-sm text-gray-600">{institution.location}</div>
                    </div>
                  : <div>No institution found.</div>
                }
              </CardContent>
            </Card>
            {/* Connections Card */}
            <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Connections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/user1.png" alt="User 1" />
                    <AvatarFallback>U1</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Dr. Smith</div>
                    <div className="text-sm text-gray-600">Cardiologist</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/user2.png" alt="User 2" />
                    <AvatarFallback>U2</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Dr. Lee</div>
                    <div className="text-sm text-gray-600">Researcher</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/user3.png" alt="User 3" />
                    <AvatarFallback>U3</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Dr. Patel</div>
                    <div className="text-sm text-gray-600">Pharmacist</div>
                  </div>
                </div>
                <Button variant="ghost" className="w-full mt-2 text-sm text-blue-600">
                  See all connections
                </Button>
              </CardContent>
            </Card>
            {/* Trending Tags */}
            <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Trending Tags</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="px-3 py-1">Cardiology</Badge>
                <Badge variant="secondary" className="px-3 py-1">Pharmacy</Badge>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="px-3 py-1">Research</Badge>
                  <Badge variant="secondary" className="px-3 py-1">AI</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;