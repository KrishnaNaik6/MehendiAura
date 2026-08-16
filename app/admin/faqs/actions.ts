"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createFaq(formData: FormData) {
  try {
    const supabase = await createClient();

    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const category = (formData.get("category") as string) || "General";
    const active = formData.get("active") !== "false";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

    if (!question || !answer) {
      return { error: "Please enter both question and answer text." };
    }

    const { error } = await supabase.from("faqs").insert({
      question,
      answer,
      category,
      active,
      display_order,
    });

    if (error) throw error;

    revalidatePath("/", "page");
    revalidatePath("/admin/faqs", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create FAQ." };
  }
}

export async function deleteFaq(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/", "page");
    revalidatePath("/admin/faqs", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete FAQ." };
  }
}

export async function toggleFaqActive(id: string, currentActive: boolean) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("faqs")
      .update({ active: !currentActive })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/", "page");
    revalidatePath("/admin/faqs", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle status." };
  }
}
