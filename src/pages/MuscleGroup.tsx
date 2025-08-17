import { useParams, Link } from "react-router-dom";
import { useMuscleGroup, useWorkoutTypes, useAddWorkoutType } from "../hooks";
import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";

export default function MuscleGroup() {
  const { muscleId = "" } = useParams();
  const { data: mg, isLoading, refetch } = useMuscleGroup(muscleId);
  const { data: workouts, isLoading: isLoadingWorkouts } = useWorkoutTypes(muscleId);
  const add = useAddWorkoutType();
  const [name, setName] = useState("");
  const [triedRefetch, setTriedRefetch] = useState(false);

  const group = mg;

  // Failsafe: If not found and not already tried, refetch
  useEffect(() => {
    if (!isLoading && !group && !triedRefetch) {
      setTriedRefetch(true);
      refetch();
    }
  }, [isLoading, group, triedRefetch, refetch]);

  if (isLoading || (!group && !triedRefetch)) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!group) {
    return <div className="p-6 text-center text-red-600 dark:text-red-400">Not found.</div>;
  }

  const handleAddWorkout = () => {
    if (!name.trim()) return;
    add.mutate({ muscleGroupId: muscleId, name: name.trim() });
    setName("");
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300 relative overflow-hidden">
      {/* Blurred background image */}
      {mg.imageUrl && (
        <div
        className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
        >
        <img
          src={mg.imageUrl}
          alt={mg.name}
          className="w-full h-full object-cover blur-lg scale-105 opacity-90"
        />
        </div>
      )}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
        <BackButton />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          {mg.imageUrl ? (
          <img src={mg.imageUrl} alt={mg.name} className="w-full h-full rounded-2xl object-cover" />
          ) : (
          <div className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400">{mg.name.charAt(0)}</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-white dark:text-gray-100 mb-2">{mg.name}</h1>
          <p className="text-white dark:text-gray-300 text-lg">Manage your {mg.name.toLowerCase()} workouts</p>
        </div>
        </div>
      </div>
      </div>

      {/* Add Workout Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add New Workout
      </h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleAddWorkout()}
        placeholder="e.g., Barbell Bench Press, Dumbbell Flyes..."
        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
        />
        <button
        onClick={handleAddWorkout}
        disabled={!name.trim() || add.isPending}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
        {add.isPending ? (
          <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Adding...
          </div>
        ) : (
          'Add Workout'
        )}
        </button>
      </div>
      </div>

      {/* Workouts List Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Your Workouts
      </h2>
      
      {isLoadingWorkouts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="mt-3 h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
        </div>
      ) : workouts && workouts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {workouts.map(w => (
          <Link 
          key={w.id} 
          to={`/workout/${w.id}`} 
          className="group block p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl hover:from-blue-50 hover:to-indigo-100 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 shadow-md hover:shadow-lg"
          >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-200">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            </div>
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2">
            {w.name}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Tap to view history and log workouts
          </div>
          </Link>
        ))}
        </div>
      ) : (
        <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No workouts yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Add your first workout above to get started</p>
        </div>
      )}
      </div>
    </div>
  );
}
