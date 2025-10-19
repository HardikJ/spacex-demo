"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Zap,
  Clock,
  Rocket,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

interface Launch {
  id: string;
  mission_name: string;
  launch_date_utc: string;
  rocket: {
    rocket_name: string;
    rocket_id: string;
  };
  launch_site: {
    site_name: string;
    site_id: string;
  };
  success: boolean;
  upcoming: boolean;
  flight_number: number;
  details?: string;
  cores?: Array<{
    core_serial: string;
    flight: number;
    landing_attempt: boolean;
    landing_success: boolean;
  }>;
  payloads?: Array<{
    payload_id: string;
    payload_type: string;
  }>;
  failures?: Array<{
    time: number;
    altitude: number;
    reason: string;
  }>;
  mission_patch?: {
    small: string;
    large: string;
  };
}

export default function LaunchDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [launch, setLaunch] = useState<Launch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    try {
      setLoading(true);
      //Get launch data from sessionStorage (passed from listing)
      const storedData = sessionStorage.getItem(`launch_${id}`);

      if (storedData) {
        const parsedLaunch = JSON.parse(storedData);
        setLaunch(parsedLaunch);
        setError(null);
      }
    } catch (err) {
      setError("Failed to load launch data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Rocket className="w-16 h-16 text-blue-500 animate-bounce mx-auto mb-4" />
          <p className="text-white text-xl">Loading launch details...</p>
        </div>
      </div>
    );
  }

  if (error || !launch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">
            {error || "Launch not found"}
          </p>
          <button
            onClick={() => router.back()}
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2 justify-center"
          >
            <ArrowLeft size={18} />
            Back to launches
          </button>
        </div>
      </div>
    );
  }

  const launchDate = new Date(launch.launch_date_utc);
  const statusColor = launch.upcoming
    ? "from-yellow-500 to-amber-600"
    : launch.success
    ? "from-green-500 to-emerald-600"
    : "from-red-500 to-rose-600";

  const statusText = launch.upcoming
    ? "Upcoming"
    : launch.success
    ? "Successful"
    : "Failed";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div
          className={`bg-gradient-to-r ${statusColor} opacity-20 absolute inset-0`}
        />
        <div className="relative px-6 py-12 sm:px-12">
          <button
            onClick={() => router.back()}
            className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to launches
          </button>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                {launch.mission_name}
              </h1>
              <div
                className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${statusColor}`}
              >
                <p className="text-white font-semibold">{statusText}</p>
              </div>
            </div>
            {launch.mission_patch?.large && (
              <div className="hidden sm:block">
                <img
                  src={launch.mission_patch.large}
                  alt={launch.mission_name}
                  className="h-32 w-32 rounded-lg object-cover border-2 border-slate-700"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 sm:px-12 py-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Key Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <p className="text-slate-400 text-sm">Launch Date</p>
                </div>
                <p className="text-white text-xl font-semibold">
                  {launchDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {launchDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition">
                <div className="flex items-center gap-3 mb-3">
                  <Rocket className="w-5 h-5 text-orange-400" />
                  <p className="text-slate-400 text-sm">Rocket</p>
                </div>
                <p className="text-white text-xl font-semibold">
                  {launch.rocket.rocket_name}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  ID: {launch.rocket.rocket_id}
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <p className="text-slate-400 text-sm">Location</p>
                </div>
                <p className="text-white text-xl font-semibold">
                  {launch.launch_site.site_name}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Site ID: {launch.launch_site.site_id}
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <p className="text-slate-400 text-sm">Flight Number</p>
                </div>
                <p className="text-white text-xl font-semibold">
                  #{launch.flight_number}
                </p>
                <p className="text-slate-500 text-xs mt-1">SpaceX Flight</p>
              </div>
            </div>

            {/* Description */}
            {launch.details && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Mission Details
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  {launch.details}
                </p>
              </div>
            )}

            {/* Cores Information */}
            {launch.cores && launch.cores.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-orange-400" />
                  Booster Cores
                </h2>
                <div className="space-y-3">
                  {launch.cores.map((core, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-700 rounded p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-white font-semibold">
                          Core: {core.core_serial}
                        </p>
                        <p className="text-slate-400 text-sm">
                          Flight #{core.flight}
                        </p>
                      </div>
                      <div className="text-right">
                        {core.landing_attempt ? (
                          <p className="text-sm text-slate-300">
                            Landing:{" "}
                            <span
                              className={
                                core.landing_success
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                              {core.landing_success ? "Success" : "Failed"}
                            </span>
                          </p>
                        ) : (
                          <p className="text-sm text-slate-400">
                            No landing attempt
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payloads */}
            {launch.payloads && launch.payloads.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  Payloads
                </h2>
                <div className="space-y-2">
                  {launch.payloads.map((payload, idx) => (
                    <div key={idx} className="bg-slate-700 rounded p-3">
                      <p className="text-white font-semibold text-sm">
                        {payload.payload_id}
                      </p>
                      <p className="text-slate-400 text-xs">
                        Type: {payload.payload_type}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Failures */}
            {launch.failures && launch.failures.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-6 border border-red-500/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-400" />
                  Failure Information
                </h2>
                <div className="space-y-3">
                  {launch.failures.map((failure, idx) => (
                    <div
                      key={idx}
                      className="bg-red-900/20 rounded p-4 border border-red-500/20"
                    >
                      <p className="text-red-300 font-semibold mb-2">
                        {failure.reason}
                      </p>
                      <p className="text-slate-400 text-sm">
                        Time: {failure.time}s | Altitude: {failure.altitude}m
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div
              className={`bg-gradient-to-r ${statusColor} rounded-lg p-6 text-white`}
            >
              <h3 className="font-bold text-lg mb-2">Mission Status</h3>
              <p className="text-sm opacity-90">
                {launch.upcoming
                  ? "This launch is scheduled for the future"
                  : launch.success
                  ? "This launch was completed successfully"
                  : "This launch experienced failures"}
              </p>
            </div>

            {/* Additional Info */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Launch ID</p>
                <p className="text-white font-mono text-sm break-all">
                  {launch.id}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Flight Number</p>
                <p className="text-white font-semibold text-lg">
                  #{launch.flight_number}
                </p>
              </div>
              {launch.payloads && (
                <div>
                  <p className="text-slate-400 text-sm mb-1">
                    Number of Payloads
                  </p>
                  <p className="text-white font-semibold text-lg">
                    {launch.payloads.length}
                  </p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={() => window.open(`https://www.spacex.com`, "_blank")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              View on SpaceX
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
