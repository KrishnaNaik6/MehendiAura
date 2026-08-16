"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createFaq(formData: FormData) {
  try {
    const supabase = await createClient();

    const question_en = formData.get("question_en") as string || formData.get("question") as string;
    const question_kn = formData.get("question_kn") as string;
    const answer_en = formData.get("answer_en") as string || formData.get("answer") as string;
    const answer_kn = formData.get("answer_kn") as string;
    const category = (formData.get("category") as string) || "General";
    const active = formData.get("active") !== "false";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

    if (!question_en || !answer_en) {
      return { error: "Please enter English question and answer text." };
    }

    const { error } = await supabase.from("faqs").insert({
      question: question_en,
      question_en,
      question_kn: question_kn || null,
      answer: answer_en,
      answer_en,
      answer_kn: answer_kn || null,
      category,
      active,
      display_order,
    });

    if (error) throw error;

    revalidatePath("/", "layout");
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

    revalidatePath("/", "layout");
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

    revalidatePath("/", "layout");
    revalidatePath("/admin/faqs", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle status." };
  }
}
