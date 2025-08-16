export type Unit = "kg" | "lb";

export interface MuscleGroup {
  id: string;
  name: string;
  imageUrl: string;
}

export interface WorkoutType {
  id: string;
  muscleGroupId: string;
  name: string;
}

export interface SetEntry {
  setNumber: number;
  reps: number;
  weight: number;
  rpe?: number;
}

export interface Session {
  id: string;
  workoutTypeId: string;
  date: string; // ISO
  notes?: string;
  sets: SetEntry[];
}

export interface Settings {
  unit: Unit;
}
