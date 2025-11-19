'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Calendar, Users, Star, Award, Target } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header currentPage="achievements" />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative text-white overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/public/achievement1.jpeg"
              alt="NUML Sports Team"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-indigo-900/90"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-white p-3 shadow-2xl">
                <img
                  src="/numl-logo-official.png"
                  alt="NUML Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Hall of Excellence</h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
                Celebrating the remarkable achievements and championship victories of NUML athletes
              </p>
              <div className="flex justify-center gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-yellow-300">15+</div>
                  <div className="text-blue-100">Championships</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-yellow-300">50+</div>
                  <div className="text-blue-100">Medals Won</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-yellow-300">100+</div>
                  <div className="text-blue-100">Athletes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Gallery */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Featured Achievements */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Championship Victories</h2>
              <p className="text-xl text-gray-600">Recent triumphs that make us proud</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Football Championship - Featured Large */}
              <div className="relative group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="aspect-[4/3] relative">
                    <img
                      src="./public/achievement2.jpeg"
                      alt="Football Championship Team"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-white hover:bg-yellow-600 text-lg px-4 py-2">
                        <Trophy className="w-5 h-5 mr-2" />
                        Runner Up
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Target className="w-6 h-6" />
                        </div>
                        <Badge className="bg-blue-600 text-white border-0">Football</Badge>
                      </div>
                      <h3 className="text-3xl font-bold mb-3">NUML Football Championship</h3>
                      <p className="text-lg text-gray-200 mb-4">
                        Outstanding performance securing runner-up position in the prestigious tournament
                      </p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Recent</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Team Victory</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          <span>Rs. 10,000 Prize</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Volleyball Championship - Featured Large */}
              <div className="relative group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="aspect-[4/3] relative">
                    <img
                      src="/public/achievement3.jpeg"
                      alt="Volleyball Champions Celebration"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 text-white hover:bg-green-600 text-lg px-4 py-2">
                        <Star className="w-5 h-5 mr-2" />
                        Champions
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Trophy className="w-6 h-6" />
                        </div>
                        <Badge className="bg-green-600 text-white border-0">Volleyball</Badge>
                      </div>
                      <h3 className="text-3xl font-bold mb-3">Inter Var Volleyball Champions</h3>
                      <p className="text-lg text-gray-200 mb-4">
                        Victory celebration! Emerging as champions in the 2023-24 season
                      </p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>2023-24</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Championship Title</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          <span>Perfect Season</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* National Level Achievement */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              
              <div className="relative z-10 md:flex items-center gap-12">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Medal className="w-8 h-8" />
                    </div>
                    <div>
                      <Badge className="bg-yellow-500 text-white border-0 mb-2">National Level</Badge>
                      <h3 className="text-3xl font-bold">All Pakistan Championship</h3>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold mb-4">Inter University Volleyball 2023-24</h4>
                  <p className="text-lg text-gray-200 mb-6">
                    Representing NUML at the national level, our volleyball team showcased exceptional talent 
                    and sportsmanship throughout the prestigious All Pakistan Inter University Championship.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-2xl font-bold text-yellow-300">National</div>
                      <div className="text-sm text-gray-300">Level</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-2xl font-bold text-yellow-300">2023-24</div>
                      <div className="text-sm text-gray-300">Season</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-2xl font-bold text-yellow-300">Excellence</div>
                      <div className="text-sm text-gray-300">Award</div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src="/public/achievement3.jpeg"
                      alt="All Pakistan Volleyball Championship Team"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Achievement Categories */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Categories of Excellence</h2>
              <p className="text-xl text-gray-600">Diverse achievements across multiple disciplines</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group cursor-pointer">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Trophy className="w-20 h-20 text-white" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3">Gold Medal Winners</h3>
                    <p className="text-gray-600 mb-4">
                      Exceptional athletes securing gold medals at national inter-university championships across various sports disciplines.
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-yellow-100 text-yellow-800">12 Medals</Badge>
                      <span className="text-yellow-600 font-semibold">View All →</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                    <Medal className="w-20 h-20 text-white" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3">Sportsmanship Awards</h3>
                    <p className="text-gray-600 mb-4">
                      Recognition for outstanding sportsmanship and fair play during inter-university competitions.
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-100 text-blue-800">8 Awards</Badge>
                      <span className="text-blue-600 font-semibold">View All →</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <Star className="w-20 h-20 text-white" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3">Record Breakers</h3>
                    <p className="text-gray-600 mb-4">
                      Individual athletes recognized for exceptional performance and breaking university records.
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-800">5 Records</Badge>
                      <span className="text-green-600 font-semibold">View All →</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Achievements Timeline */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Achievements</h2>
              <p className="text-xl text-gray-600">Our latest victories and milestones</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex items-center gap-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-bold">Football Championship Runner Up</h4>
                    <Badge className="bg-yellow-100 text-yellow-800">Recent</Badge>
                  </div>
                  <p className="text-gray-600">Secured second place with outstanding team performance</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">This Month</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex items-center gap-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-bold">Volleyball Inter Var Champions</h4>
                    <Badge className="bg-green-100 text-green-800">Victory</Badge>
                  </div>
                  <p className="text-gray-600">Championship title with perfect season record</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">2023-24</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Medal className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-bold">National Participation</h4>
                    <Badge className="bg-blue-100 text-blue-800">National</Badge>
                  </div>
                  <p className="text-gray-600">Represented NUML at All Pakistan Championship</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">2023-24</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}