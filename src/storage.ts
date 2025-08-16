import type { MuscleGroup, WorkoutType, Session, Settings } from "./type";
import { v4 as uuid } from "uuid";

const KEYS = {
  muscleGroups: "gym.muscleGroups",
  workoutTypes: "gym.workoutTypes",
  sessions: "gym.sessions",
  settings: "gym.settings",
};

function read<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initDefaults() {
  const mg = read<MuscleGroup[]>(KEYS.muscleGroups, []);
  if (mg.length === 0) {
    const defaults: MuscleGroup[] = [
      { id: uuid(), name: "Chest", imageUrl: "/assets/chest.jpg" },
      { id: uuid(), name: "Triceps", imageUrl: "/assets/triceps.jpg" },
      { id: uuid(), name: "Shoulders", imageUrl: "/assets/shoulder.jpg" },
      { id: uuid(), name: "Biceps", imageUrl: "/assets/biceps.jpg" },
      { id: uuid(), name: "Back", imageUrl: "/assets/back.jpg" },
      { id: uuid(), name: "Legs", imageUrl: "/assets/legs.jpg" },
    ];
    write(KEYS.muscleGroups, defaults);
  }
  const settings = read<Settings>(KEYS.settings, { unit: "kg" });
  write(KEYS.settings, settings);
}

export const db = {
  getMuscleGroups(): MuscleGroup[] {
    return read(KEYS.muscleGroups, []);
  },
  getMuscleGroup(id: string) {
    return this.getMuscleGroups().find(m => m.id === id) || null;
  },
  addMuscleGroup(name: string): MuscleGroup {
    const list = this.getMuscleGroups();
    const item = { id: uuid(), name, imageUrl: "" };
    write(KEYS.muscleGroups, [...list, item]);
    return item;
  },
  getWorkoutTypes(): WorkoutType[] {
    return read(KEYS.workoutTypes, []);
  },
  getWorkoutTypesByMuscle(muscleId: string) {
    return this.getWorkoutTypes().filter(w => w.muscleGroupId === muscleId);
  },
  addWorkoutType(muscleGroupId: string, name: string): WorkoutType {
    const list = this.getWorkoutTypes();
    const item = { id: uuid(), muscleGroupId, name };
    write(KEYS.workoutTypes, [...list, item]);
    return item;
  },
  getSessions(): Session[] {
    return read(KEYS.sessions, []);
  },
  getSessionsByWorkout(workoutId: string) {
    return this.getSessions()
      .filter(s => s.workoutTypeId === workoutId)
      .sort((a,b) => a.date.localeCompare(b.date));
  },
  addSession(sess: Omit<Session,"id">): Session {
    const list = this.getSessions();
    const item: Session = { id: uuid(), ...sess };
    write(KEYS.sessions, [...list, item]);
    return item;
  },
  getSettings(): Settings {
    return read(KEYS.settings, { unit: "kg" });
  },
  setSettings(s: Settings) {
    write(KEYS.settings, s);
  },
};
