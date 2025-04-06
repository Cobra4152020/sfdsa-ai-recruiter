"use client"

import { useState } from "react"
import { UserProvider, useUser } from "@/context/user-context"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { OptInForm } from "@/components/opt-in-form"
import { ArrowLeft, Home, Check, MapPin, Car, Dumbbell, Bath, Bed, Users, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

function DiscountedHousingContent() {
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)
  const { isLoggedIn } = useUser()

  const showOptInForm = () => {
    setIsOptInFormOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ImprovedHeader showOptInForm={showOptInForm} />

      <main className="flex-1 bg-[#F8F5EE] dark:bg-[#121212] pt-40 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link href="/" prefetch={false}>
              <Button variant="ghost" className="text-[#0A3C1F] dark:text-[#FFD700] mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-4">
              Discounted Housing for Deputy Sheriffs
            </h1>
            <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70 max-w-3xl">
              As a member of the San Francisco Deputy Sheriffs' Association, you're eligible for exclusive housing
              discounts in San Francisco and nearby cities.
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-12">
            <img
              src={`https://placehold.co/1200x600/png?text=${encodeURIComponent("Parkmerced Townhouses")}`}
              alt="Parkmerced Townhouses"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6">
                <h2 className="text-white text-2xl font-bold">Exclusive Housing Options</h2>
                <p className="text-white/80">Premium living spaces at discounted rates for SF Deputy Sheriffs</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="h-6 w-6 text-[#0A3C1F] dark:text-[#FFD700] mr-2" />
                    Housing Benefit Overview
                  </CardTitle>
                  <CardDescription>Exclusive housing discounts for San Francisco Deputy Sheriffs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[#0A3C1F]/80 dark:text-white/80">
                    The San Francisco Deputy Sheriffs' Association has partnered with several housing providers to offer
                    exclusive discounts to our members. These partnerships help make living in the Bay Area more
                    affordable for those who serve and protect our community.
                  </p>

                  <p className="text-[#0A3C1F]/80 dark:text-white/80">
                    As a Deputy Sheriff and member of the San Francisco Deputy Sheriffs' Association, you'll receive:
                  </p>

                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#0A3C1F]/80 dark:text-white/80">
                        <strong>Reduced monthly rent</strong> - Save up to 50% off market rates at participating
                        properties
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#0A3C1F]/80 dark:text-white/80">
                        <strong>Waived application fees</strong> - Save hundreds on application and administrative fees
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#0A3C1F]/80 dark:text-white/80">
                        <strong>Reduced security deposits</strong> - Lower upfront costs when moving in
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#0A3C1F]/80 dark:text-white/80">
                        <strong>Priority placement</strong> - Get priority on waiting lists for popular properties
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#0A3C1F]/80 dark:text-white/80">
                        <strong>Flexible lease terms</strong> - Options for short-term or long-term commitments
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Tabs defaultValue="apartments" className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="apartments">Apartments</TabsTrigger>
                  <TabsTrigger value="townhouses">Townhouses</TabsTrigger>
                  <TabsTrigger value="locations">Locations</TabsTrigger>
                </TabsList>

                <TabsContent value="apartments" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Apartment Options</CardTitle>
                      <CardDescription>1 and 2 bedroom apartments with modern amenities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg overflow-hidden border border-[#E0D6B8] dark:border-[#333333]">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                              <img
                                src={`https://placehold.co/500x300/png?text=${encodeURIComponent("1 Bedroom Apartment")}`}
                                alt="1 Bedroom Apartment"
                                className="w-full h-full object-cover"
                              />
                              <Badge className="absolute top-2 right-2 bg-[#0A3C1F] text-white">
                                Up to 50% Discount
                              </Badge>
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-lg text-[#0A3C1F] dark:text-[#FFD700]">
                                1 Bedroom Apartments
                              </h3>
                              <div className="flex items-center text-sm text-[#0A3C1F]/60 dark:text-white/60 mt-1">
                                <Bed className="h-4 w-4 mr-1" /> 1 Bed
                                <span className="mx-2">•</span>
                                <Bath className="h-4 w-4 mr-1" /> 1 Bath
                                <span className="mx-2">•</span>
                                <span>650-850 sq ft</span>
                              </div>
                              <p className="mt-3 text-sm text-[#0A3C1F]/80 dark:text-white/80">
                                Modern 1-bedroom apartments with full amenities, perfect for individual deputies or
                                couples.
                              </p>
                              <div className="mt-3 flex items-center text-sm">
                                <span className="font-medium text-[#0A3C1F] dark:text-white">
                                  Contact for pricing details
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg overflow-hidden border border-[#E0D6B8] dark:border-[#333333]">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                              <img
                                src={`https://placehold.co/500x300/png?text=${encodeURIComponent("2 Bedroom Apartment")}`}
                                alt="2 Bedroom Apartment"
                                className="w-full h-full object-cover"
                              />
                              <Badge className="absolute top-2 right-2 bg-[#0A3C1F] text-white">
                                Up to 50% Discount
                              </Badge>
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-lg text-[#0A3C1F] dark:text-[#FFD700]">
                                2 Bedroom Apartments
                              </h3>
                              <div className="flex items-center text-sm text-[#0A3C1F]/60 dark:text-white/60 mt-1">
                                <Bed className="h-4 w-4 mr-1" /> 2 Beds
                                <span className="mx-2">•</span>
                                <Bath className="h-4 w-4 mr-1" /> 2 Baths
                                <span className="mx-2">•</span>
                                <span>900-1,100 sq ft</span>
                              </div>
                              <p className="mt-3 text-sm text-[#0A3C1F]/80 dark:text-white/80">
                                Spacious 2-bedroom apartments ideal for families or roommates, with modern finishes.
                              </p>
                              <div className="mt-3 flex items-center text-sm">
                                <span className="font-medium text-[#0A3C1F] dark:text-white">
                                  Contact for pricing details
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#0A3C1F]/5 dark:bg-[#FFD700]/5 p-4 rounded-lg">
                          <h4 className="font-semibold text-[#0A3C1F] dark:text-[#FFD700] mb-2">Apartment Amenities</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                              <span>Stainless steel appliances</span>
                            </div>
                            <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                              <span>In-unit washer & dryer</span>
                            </div>
                            <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                              <span>Hardwood floors</span>
                            </div>
                            <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                              <span>Central heating & AC</span>
                            </div>
                            <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                              <span>High-speed internet ready</span>
                            </div>
                            <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                              <span>Secure building access</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="townhouses" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Townhouse Options</CardTitle>
                      <CardDescription>Spacious townhouses with premium features</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                          <img
                            src={`https://placehold.co/800x400/png?text=${encodeURIComponent("Parkmerced Townhouses")}`}
                            alt="Parkmerced Townhouses"
                            className="w-full h-full object-cover"
                          />
                          <Badge className="absolute top-2 right-2 bg-[#0A3C1F] text-white">Up to 50% Discount</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-bold text-lg text-[#0A3C1F] dark:text-[#FFD700] mb-2">
                              Parkmerced Townhouses
                            </h3>
                            <div className="flex items-center text-sm text-[#0A3C1F]/60 dark:text-white/60 mb-3">
                              <Bed className="h-4 w-4 mr-1" /> 2-3 Beds
                              <span className="mx-2">•</span>
                              <Bath className="h-4 w-4 mr-1" /> 2.5 Baths
                              <span className="mx-2">•</span>
                              <span>1,200-1,800 sq ft</span>
                            </div>
                            <p className="text-sm text-[#0A3C1F]/80 dark:text-white/80 mb-3">
                              Luxurious townhouses in the Parkmerced community, featuring modern designs, private
                              entrances, and attached garages. Perfect for deputies with families.
                            </p>
                            <div className="flex items-center text-sm mb-4">
                              <span className="font-medium text-[#0A3C1F] dark:text-white">
                                Contact for pricing details
                              </span>
                            </div>

                            <div className="flex items-center text-sm text-[#0A3C1F]/60 dark:text-white/60">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>Parkmerced, San Francisco</span>
                            </div>
                          </div>

                          <div className="bg-[#0A3C1F]/5 dark:bg-[#FFD700]/5 p-4 rounded-lg">
                            <h4 className="font-semibold text-[#0A3C1F] dark:text-[#FFD700] mb-2">
                              Townhouse Features
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                                <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                                <span>Private entrance</span>
                              </div>
                              <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                                <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                                <span>Attached garage</span>
                              </div>
                              <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                                <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                                <span>Private backyard</span>
                              </div>
                              <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                                <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                                <span>Multiple levels</span>
                              </div>
                              <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                                <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                                <span>Premium finishes</span>
                              </div>
                              <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                                <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                                <span>Smart home features</span>
                              </div>
                              <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                                <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                                <span>Energy efficient</span>
                              </div>
                              <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                                <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                                <span>Extra storage space</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="locations" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Locations</CardTitle>
                      <CardDescription>Discounted housing options in San Francisco and nearby cities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg overflow-hidden border border-[#E0D6B8] dark:border-[#333333]">
                            <div className="h-40 bg-gray-200 dark:bg-gray-700">
                              <img
                                src={`https://placehold.co/400x200/png?text=${encodeURIComponent("San Francisco")}`}
                                alt="San Francisco"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-[#0A3C1F] dark:text-[#FFD700]">San Francisco</h3>
                              <p className="text-sm text-[#0A3C1F]/80 dark:text-white/80 mt-1">
                                Multiple locations throughout the city, including Parkmerced, SOMA, and Mission Bay.
                              </p>
                              <div className="mt-3 text-sm text-[#0A3C1F]/60 dark:text-white/60">
                                <div className="flex items-center">
                                  <Car className="h-4 w-4 mr-1" />
                                  <span>10-30 min commute to work</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg overflow-hidden border border-[#E0D6B8] dark:border-[#333333]">
                            <div className="h-40 bg-gray-200 dark:bg-gray-700">
                              <img
                                src={`https://placehold.co/400x200/png?text=${encodeURIComponent("Daly City")}`}
                                alt="Daly City"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-[#0A3C1F] dark:text-[#FFD700]">Daly City</h3>
                              <p className="text-sm text-[#0A3C1F]/80 dark:text-white/80 mt-1">
                                Affordable options just south of San Francisco with easy access to highways.
                              </p>
                              <div className="mt-3 text-sm text-[#0A3C1F]/60 dark:text-white/60">
                                <div className="flex items-center">
                                  <Car className="h-4 w-4 mr-1" />
                                  <span>15-25 min commute to work</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg overflow-hidden border border-[#E0D6B8] dark:border-[#333333]">
                            <div className="h-40 bg-gray-200 dark:bg-gray-700">
                              <img
                                src={`https://placehold.co/400x200/png?text=${encodeURIComponent("South San Francisco")}`}
                                alt="South San Francisco"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-[#0A3C1F] dark:text-[#FFD700]">South San Francisco</h3>
                              <p className="text-sm text-[#0A3C1F]/80 dark:text-white/80 mt-1">
                                Family-friendly neighborhoods with newer developments and amenities.
                              </p>
                              <div className="mt-3 text-sm text-[#0A3C1F]/60 dark:text-white/60">
                                <div className="flex items-center">
                                  <Car className="h-4 w-4 mr-1" />
                                  <span>20-30 min commute to work</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#0A3C1F]/5 dark:bg-[#FFD700]/5 p-4 rounded-lg">
                          <h4 className="font-semibold text-[#0A3C1F] dark:text-[#FFD700] mb-2">
                            Transportation Options
                          </h4>
                          <p className="text-sm text-[#0A3C1F]/80 dark:text-white/80 mb-3">
                            All partner housing locations are selected with deputy commutes in mind:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                              <span>Close to public transportation</span>
                            </div>
                            <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                              <span>Easy highway access</span>
                            </div>
                            <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                              <span>Bike-friendly routes</span>
                            </div>
                            <div className="flex items-center text-sm text-[#0A3C1F]/80 dark:text-white/80">
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                              <span>Carpool options available</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Community Amenities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[#0A3C1F]/80 dark:text-white/80">
                    All partner properties offer premium amenities to enhance your living experience:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 p-2 rounded-full mr-3 mt-1">
                        <Dumbbell className="h-5 w-5 text-[#0A3C1F] dark:text-[#FFD700]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0A3C1F] dark:text-white">Fitness Centers</h4>
                        <p className="text-sm text-[#0A3C1F]/70 dark:text-white/70">
                          State-of-the-art fitness equipment and workout spaces
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 p-2 rounded-full mr-3 mt-1">
                        <Car className="h-5 w-5 text-[#0A3C1F] dark:text-[#FFD700]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0A3C1F] dark:text-white">Parking Included</h4>
                        <p className="text-sm text-[#0A3C1F]/70 dark:text-white/70">
                          Secure parking spaces included with all units
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 p-2 rounded-full mr-3 mt-1">
                        <Users className="h-5 w-5 text-[#0A3C1F] dark:text-[#FFD700]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0A3C1F] dark:text-white">Community Spaces</h4>
                        <p className="text-sm text-[#0A3C1F]/70 dark:text-white/70">
                          Lounges, BBQ areas, and gathering spaces
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 p-2 rounded-full mr-3 mt-1">
                        <MapPin className="h-5 w-5 text-[#0A3C1F] dark:text-[#FFD700]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0A3C1F] dark:text-white">Convenient Locations</h4>
                        <p className="text-sm text-[#0A3C1F]/70 dark:text-white/70">
                          Close to shopping, dining, and entertainment
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Apply</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[#0A3C1F]/80 dark:text-white/80">
                    To take advantage of these exclusive housing discounts:
                  </p>

                  <ol className="space-y-3 list-decimal pl-5">
                    <li className="text-[#0A3C1F]/80 dark:text-white/80">
                      <span className="font-medium text-[#0A3C1F] dark:text-white">
                        Join the SF Deputy Sheriffs' Association
                      </span>
                      <p className="text-sm mt-1">Membership is available to all sworn deputies</p>
                    </li>
                    <li className="text-[#0A3C1F]/80 dark:text-white/80">
                      <span className="font-medium text-[#0A3C1F] dark:text-white">
                        Request a housing discount certificate
                      </span>
                      <p className="text-sm mt-1">Available through the DSA office or member portal</p>
                    </li>
                    <li className="text-[#0A3C1F]/80 dark:text-white/80">
                      <span className="font-medium text-[#0A3C1F] dark:text-white">
                        Contact our housing coordinator
                      </span>
                      <p className="text-sm mt-1">For personalized assistance finding the right property</p>
                    </li>
                    <li className="text-[#0A3C1F]/80 dark:text-white/80">
                      <span className="font-medium text-[#0A3C1F] dark:text-white">
                        Present your certificate when applying
                      </span>
                      <p className="text-sm mt-1">To receive your exclusive discounts and benefits</p>
                    </li>
                  </ol>

                  <div className="bg-[#0A3C1F]/5 dark:bg-[#FFD700]/5 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold text-[#0A3C1F] dark:text-[#FFD700] mb-2">Housing Coordinator</h4>
                    <p className="text-sm text-[#0A3C1F]/80 dark:text-white/80">Phone: (415) 554-7225</p>
                    <p className="text-sm text-[#0A3C1F]/80 dark:text-white/80">Email: housing@sfdsa.org</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={showOptInForm} className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                    Apply Now to Access Housing Benefits
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg overflow-hidden border border-[#E0D6B8] dark:border-[#333333] p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-2">
                  Ready to Join the San Francisco Sheriff's Office?
                </h3>
                <p className="text-[#0A3C1F]/70 dark:text-white/70 mb-4">
                  Apply now to start your career with the San Francisco Sheriff's Office and access these exclusive
                  housing benefits and more.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={showOptInForm}
                    className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-black font-bold"
                  >
                    Apply Now
                  </Button>
                  <Link href="/gi-bill" prefetch={false}>
                    <Button variant="outline" className="border-[#0A3C1F] dark:border-white/20">
                      Learn About G.I. Bill Benefits
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-24 h-24 md:w-32 md:h-32 bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 rounded-full flex items-center justify-center">
                <Shield className="h-12 w-12 md:h-16 md:w-16 text-[#0A3C1F] dark:text-[#FFD700]" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <ImprovedFooter />

      <OptInForm isOpen={isOptInFormOpen} onClose={() => setIsOptInFormOpen(false)} />
    </div>
  )
}

// Main export wrapped with UserProvider
export default function DiscountedHousingPage() {
  return (
    <UserProvider>
      <DiscountedHousingContent />
    </UserProvider>
  )
}