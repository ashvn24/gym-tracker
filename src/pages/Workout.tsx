import { useParams } from "react-router-dom";
import { useAddSession, useSessions, useWorkoutTypes, useSettings } from "../hooks";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import BackButton from "../components/BackButton";

export default function Workout() {
  const { workoutId = "" } = useParams();
  const { data: workouts } = useWorkoutTypes();
  const workout = workouts?.find(w => w.id === workoutId);
  const { data: sessions, isLoading } = useSessions(workoutId);
  const { data: settings } = useSettings();
  const addSession = useAddSession();

  const last = sessions && sessions[sessions.length - 1];
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [notes, setNotes] = useState("");
  const [sets, setSets] = useState(
    last?.sets?.map(s => ({ ...s })) ?? [{ setNumber: 1, reps: 8, weight: 20 }]
  );

  const best = useMemo(() => {
    if (!sessions) return null;
    let max = 0;
    sessions.forEach(s => s.sets.forEach(set => { max = Math.max(max, set.weight); }));
    return max;
  }, [sessions]);

  if (!workout) return <div>Not found.</div>;

  const unit = settings?.unit ?? "kg";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <BackButton />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{workout.name}</h1>
          {best && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personal Best: <span className="font-semibold text-blue-600 dark:text-blue-400">{best}{unit}</span>
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {sessions && sessions.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sessions.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {sessions.reduce((total, s) => total + s.sets.length, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Sets</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {sessions.reduce((total, s) => total + s.sets.reduce((sum, set) => sum + set.reps, 0), 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Reps</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {dayjs(sessions[sessions.length - 1]?.date).format("MMM DD")}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Last Workout</div>
          </div>
        </div>
      )}

      {/* Log New Session */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Log New Session</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
            <input 
              type="text" 
              placeholder="How did it feel?" 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" 
            />
          </div>
        </div>

        {/* Sets */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sets</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => addSet()} 
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md text-sm font-medium transition-colors"
              >
                + Set
              </button>
              <button 
                onClick={() => quickAdd(3)} 
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium transition-colors"
              >
                +3
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {sets.map((s, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <div className="w-12 text-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Set {s.setNumber}</span>
                </div>
                <input 
                  type="number" 
                  min={1} 
                  value={s.reps}
                  onChange={e => update(idx, { reps: Number(e.target.value) })}
                  className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center" 
                  placeholder="Reps"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">×</span>
                <input 
                  type="number" 
                  step="0.5" 
                  value={s.weight}
                  onChange={e => update(idx, { weight: Number(e.target.value) })}
                  className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center" 
                  placeholder="Weight"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">{unit}</span>
                <input 
                  type="number" 
                  step="0.5" 
                  min="1"
                  max="10"
                  value={s.rpe ?? 8}
                  onChange={e => update(idx, { rpe: Number(e.target.value) })}
                  className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center" 
                  placeholder="RPE"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">RPE</span>
                <button 
                  onClick={() => remove(idx)} 
                  className="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            addSession.mutate({
              workoutTypeId: workoutId,
              date,
              notes,
              sets: sets.map((s, i) => ({ ...s, setNumber: i + 1 })),
            });
            setNotes("");
          }}
          disabled={addSession.isPending}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {addSession.isPending ? "Saving..." : "Save Session"}
        </button>
      </div>

      {/* Workout History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Workout History</h2>
        
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{dayjs(s.date).format("MMM DD, YYYY")}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{s.sets.length} sets • {maxSetWeight(s)}{unit} top set</div>
                    </div>
                  </div>
                </div>
                
                {s.notes && (
                  <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <div className="text-sm text-blue-800 dark:text-blue-200">{s.notes}</div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {s.sets.map((set, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-600 rounded p-2 text-center text-sm">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{set.reps}</div>
                      <div className="text-gray-600 dark:text-gray-300">{set.weight}{unit}</div>
                      {set.rpe && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">RPE {set.rpe}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">No workout history yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Log your first session above to start tracking your progress</p>
          </div>
        )}
      </div>
    </div>
  );

  function update(index: number, patch: Partial<typeof sets[number]>) {
    setSets(prev => prev.map((s, i) => i === index ? { ...s, ...patch } : s));
  }
  function addSet() {
    setSets(prev => [...prev, { setNumber: prev.length + 1, reps: prev.at(-1)?.reps ?? 8, weight: prev.at(-1)?.weight ?? 20, rpe: prev.at(-1)?.rpe ?? 8 }]);
  }
  function quickAdd(n: number) {
    setSets(prev => {
      const last = prev.at(-1);
      const arr = [...prev];
      for (let i = 0; i < n; i++) {
        arr.push({ setNumber: arr.length + 1, reps: last?.reps ?? 8, weight: last?.weight ?? 20, rpe: last?.rpe ?? 8 });
      }
      return arr;
    });
  }
  function remove(index: number) {
    setSets(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, setNumber: i + 1 })));
  }
  function maxSetWeight(s: { sets: { weight: number }[] }) {
    return s.sets.reduce((m, x) => Math.max(m, x.weight), 0);
  }
}
