import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db, initDefaults } from "./storage";
import type { Session } from "./type";

export function useInit() {
  useEffect(() => { initDefaults(); }, []);
}

export function useMuscleGroups() {
  return useQuery({ queryKey: ["muscleGroups"], queryFn: () => db.getMuscleGroups() });
}

export function useMuscleGroup(id: string) {
  return useQuery({ queryKey: ["muscleGroup", id], queryFn: () => db.getMuscleGroup(id) });
}

export function useAddMuscleGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => db.addMuscleGroup(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["muscleGroups"] });
    }
  });
}

export function useWorkoutTypes(muscleId?: string) {
  return useQuery({
    queryKey: ["workoutTypes", muscleId],
    queryFn: () => muscleId ? db.getWorkoutTypesByMuscle(muscleId) : db.getWorkoutTypes()
  });
}

export function useAddWorkoutType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ muscleGroupId, name }: { muscleGroupId: string; name: string; }) =>
      db.addWorkoutType(muscleGroupId, name),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["workoutTypes", vars.muscleGroupId] });
    }
  });
}

export function useSessions(workoutId: string) {
  return useQuery({
    queryKey: ["sessions", workoutId],
    queryFn: () => db.getSessionsByWorkout(workoutId),
  });
}

export function useAddSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sess: Omit<Session, "id">) => db.addSession(sess),
    onSuccess: (_, sess) => {
      qc.invalidateQueries({ queryKey: ["sessions", sess.workoutTypeId] });
    }
  });
}

export function useSettings() {
  return useQuery({ queryKey: ["settings"], queryFn: () => db.getSettings() });
}

export function useSetSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: { unit: "kg"|"lb" }) => { db.setSettings(s as any); return s; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}
