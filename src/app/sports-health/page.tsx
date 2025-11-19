'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Brain, Activity, Users, Calendar, Shield, Stethoscope, Award, Trophy } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function SportsHealthPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header currentPage="sports-health" />
      
      <main className="flex-grow">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white p-2 shadow-lg">
              <img
                src="/numl-logo-official.jpeg"
                alt="NUML Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sports & Health</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto italic">
              "Strong minds reside in healthy bodies"
            </p>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Commitment to Wellness</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            NUML emphasizes a healthy lifestyle for its community, aligning with our motto that strong minds reside in healthy bodies. 
            We are dedicated to providing comprehensive health and wellness programs that support both physical and mental well-being 
            of our students, faculty, and staff.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Health Initiatives Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-8 w-8 text-red-500" />
            <h2 className="text-3xl font-bold">Health Initiatives</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Health Seminars */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-center">Health Seminars & Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  The university regularly hosts seminars and awareness campaigns on topics such as mental health, 
                  a healthy heart, and breast cancer awareness to educate and empower our community.
                </CardDescription>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">Mental Health</Badge>
                  <Badge variant="outline">Heart Health</Badge>
                  <Badge variant="outline">Cancer Awareness</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Medical Facilities */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-center">Medical Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Campuses, such as the Hyderabad campus, have well-equipped Medical Inspection (MI) rooms 
                  for first aid and minor emergencies, with ambulance services available for prompt medical attention.
                </CardDescription>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">First Aid</Badge>
                  <Badge variant="outline">Emergency Care</Badge>
                  <Badge variant="outline">Ambulance Service</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Sports Events */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-xl text-center">Sports Events</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  NUML organizes sports galas and competitions to encourage physical activity and sportsmanship 
                  among students. Notable achievements include students winning gold medals at national inter-university championships.
                </CardDescription>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">Sports Galas</Badge>
                  <Badge variant="outline">Competitions</Badge>
                  <Badge variant="outline">National Champions</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Programs & Services */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="h-8 w-8 text-purple-500" />
            <h2 className="text-3xl font-bold">Programs & Services</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Regular Health Campaigns</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Mental Health Awareness</h4>
                      <p className="text-gray-600 text-sm">Workshops and seminars focusing on stress management, mindfulness, and psychological well-being.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Heart Health Programs</h4>
                      <p className="text-gray-600 text-sm">Regular check-ups, fitness assessments, and cardiovascular health education sessions.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Breast Cancer Awareness</h4>
                      <p className="text-gray-600 text-sm">Annual campaigns with educational materials, screenings, and expert talks.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Medical Infrastructure</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Medical Inspection Rooms</h4>
                      <p className="text-gray-600 text-sm">Well-equipped MI rooms across campuses for immediate medical attention and first aid.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Ambulance Services</h4>
                      <p className="text-gray-600 text-sm">24/7 ambulance services available for prompt medical transportation during emergencies.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Qualified Medical Staff</h4>
                      <p className="text-gray-600 text-sm">Professional medical personnel available during working hours for student healthcare needs.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sports Excellence */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Award className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl font-bold">Sports Excellence & Achievements</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">Gold Medals</div>
                <p className="text-gray-600">Students winning gold at national inter-university championships</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">Sports Galas</div>
                <p className="text-gray-600">Annual sports events promoting physical fitness and teamwork</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-600 mb-2">Championships</div>
                <p className="text-gray-600">Regular competitions in various sports disciplines</p>
              </div>
            </div>
          </div>
        </section>

        {/* Wellness Tips */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-8 w-8 text-indigo-500" />
            <h2 className="text-3xl font-bold">Wellness Tips for Students</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Stay Active</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Engage in at least 30 minutes of physical activity daily to maintain physical and mental health.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Mental Wellness</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Practice mindfulness, take regular breaks, and seek help when feeling overwhelmed.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Healthy Eating</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Maintain a balanced diet rich in nutrients to fuel your body and mind for optimal performance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Social Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Build strong relationships and participate in community activities for overall well-being.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Prioritize Your Health & Wellness</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join NUML's comprehensive health and sports programs to maintain a balanced and healthy lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Join Sports Hub
            </a>
            <a
              href="/events"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Sports Events
            </a>
          </div>
        </div>
      </div>
      </main>
      
      <Footer />
    </div>
  )
}