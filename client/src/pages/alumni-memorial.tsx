import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { GraduationCap, Calendar, Award, BookOpen, Users, MessageSquare, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { AlumniMemorial } from "@shared/schema";

export default function AlumniMemorialDetail() {
  const { id } = useParams();

  const { data: memorial, isLoading, error } = useQuery<AlumniMemorial>({
    queryKey: [`/api/alumni-memorials/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !memorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Memorial not found</p>
            <Link href="/alumni-memorials">
              <Button className="w-full mt-4" data-testid="button-back-to-browse">
                Back to Alumni Memorials
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activities = (memorial.activities || []) as Array<{ name: string; role: string; years: string }>;
  const achievements = (memorial.notableAchievements || []) as string[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      {/* Hero Section */}
      <div className="bg-blue-950 border-b-4 border-yellow-400">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link href="/alumni-memorials">
            <Button variant="ghost" className="text-white mb-6" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Memorials
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* College Logo Placeholder */}
            <div className="w-48 h-48 border-4 border-dashed border-yellow-400/50 rounded-lg flex items-center justify-center bg-blue-900/30">
              <div className="text-center">
                <GraduationCap className="w-16 h-16 text-yellow-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400">College Logo</p>
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" data-testid="text-memorial-name">
                {memorial.preferredName || memorial.fullName}
              </h1>
              {memorial.preferredName && (
                <p className="text-xl text-gray-300 mb-4">{memorial.fullName}</p>
              )}
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                <Badge className="bg-yellow-400 text-blue-900 text-lg px-4 py-2" data-testid="badge-school">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {memorial.schoolName}
                </Badge>
                {memorial.graduationYear && (
                  <Badge className="bg-blue-700 text-white text-lg px-4 py-2" data-testid="badge-graduation-year">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {memorial.graduationYear}
                  </Badge>
                )}
                {memorial.degreeType && (
                  <Badge className="bg-blue-700 text-white text-lg px-4 py-2" data-testid="badge-degree">
                    {memorial.degreeType}
                    {memorial.major && ` in ${memorial.major}`}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-gray-300 justify-center md:justify-start">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {memorial.birthDate} - {memorial.deathDate}
                </span>
                {memorial.campusLocation && (
                  <span>{memorial.campusLocation}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Biography */}
          {memorial.biography && (
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Biography
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" data-testid="text-biography">
                  {memorial.biography}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Epitaph */}
          {memorial.epitaph && (
            <Card className="bg-gradient-to-r from-blue-900 to-blue-800 text-white border-2 border-yellow-400">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-serif italic mb-2" data-testid="text-epitaph">
                    "{memorial.epitaph}"
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Campus Activities */}
          {activities.length > 0 && (
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Campus Activities & Involvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg"
                      data-testid={`activity-${index}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-1">{activity.name}</h4>
                        <p className="text-sm text-gray-600">{activity.role}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.years}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notable Achievements */}
          {achievements.length > 0 && (
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Notable Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                      data-testid={`achievement-${index}`}
                    >
                      <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                      <p className="text-gray-700">{achievement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Class Notes */}
          {memorial.classNotes && (
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Class Notes & Memories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" data-testid="text-class-notes">
                  {memorial.classNotes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-950 border-t-4 border-yellow-400 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-300 mb-4">In Loving Memory</p>
          <GraduationCap className="w-12 h-12 text-yellow-400 mx-auto" />
        </div>
      </div>
    </div>
  );
}
