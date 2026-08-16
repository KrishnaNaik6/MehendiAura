"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createTestimonial(formData: FormData) {
  try {
    const supabase = await createClient();

    const customer_name = formData.get("customer_name") as string;
    const testimonial = formData.get("testimonial") as string;
    const rating = parseInt((formData.get("rating") as string) || "5", 10);
    const event_type = formData.get("event_type") as string;
    const active = formData.get("active") !== "false";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

    if (!customer_name || !testimonial) {
      return { error: "Please enter customer name and testimonial review text." };
    }

    const { error } = await supabase.from("testimonials").insert({
      customer_name,
      testimonial,
      rating,
      event_type: event_type || null,
      active,
      display_order,
    });

    if (error) throw error;

    revalidatePath("/", "page");
    revalidatePath("/admin/testimonials", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create testimonial." };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/", "page");
    revalidatePath("/admin/testimonials", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete testimonial." };
  }
}

export async function toggleTestimonialActive(id: string, currentActive: boolean) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("testimonials")
      .update({ active: !currentActive })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/", "page");
    revalidatePath("/admin/testimonials", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle status." };
  }
}
