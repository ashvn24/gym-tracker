import { Link } from "react-router-dom";
import { useMuscleGroups, useAddMuscleGroup, useInit } from "../hooks";
import { useState, useEffect } from "react";

// Extract card to avoid useState in loop
function MuscleGroupCard({ g }: { g: any }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link
      key={g.id}
      to={`/muscle/${g.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
    >
      <div className="h-32 sm:h-36 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center relative overflow-hidden">
        {g.imageUrl ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}
            <img
              src={g.imageUrl}
              alt={g.name}
              className={`w-full h-full object-cover transition-opacity duration-700 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImgLoaded(true)}
            />
          </>
        ) : (
          <div className="text-6xl sm:text-7xl font-bold text-blue-600/60 dark:text-blue-400/60 group-hover:scale-110 transition-transform duration-300">
            {g.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {g.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Tap to explore workouts
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  useInit();
  const { data: muscleGroups, isLoading, error, refetch } = useMuscleGroups();
  const addMuscleGroup = useAddMuscleGroup();
  const [isAdding, setIsAdding] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  // Refetch data if it's empty but not loading
  useEffect(() => {
    if (!isLoading && (!muscleGroups || muscleGroups.length === 0)) {
      refetch();
    }
  }, [isLoading, muscleGroups, refetch]);

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addMuscleGroup.mutate({ name: newGroupName.trim() });
      setNewGroupName("");
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddGroup();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewGroupName("");
    }
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Error Loading Muscle Groups</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">There was a problem loading your muscle groups.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Muscle Groups Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="mt-3 h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : muscleGroups && muscleGroups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {muscleGroups.map(g => (
            <MuscleGroupCard key={g.id} g={g} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No muscle groups found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">It looks like you don't have any muscle groups yet.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Add New Muscle Group - Bottom of Page */}
      <div className="flex justify-center pt-8">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Muscle Group
          </button>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter muscle group name..."
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 min-w-[200px]"
              autoFocus
            />
            <button
              onClick={handleAddGroup}
              disabled={!newGroupName.trim() || addMuscleGroup.isPending}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {addMuscleGroup.isPending ? "Adding..." : "Add"}
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewGroupName("");
              }}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
