import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export const profileQuery = (userId: string) =>
  queryOptions({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const petsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["pets", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("pets").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

export const bookingsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["bookings", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const enrollmentsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["enrollments", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("enrollments").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
