import { TestimonialsClient } from "@/components/admin/story-pages";
import { listTestimonials } from "@/server/actions/story";

export default async function AdminTestimonialsPage() {
  return <TestimonialsClient rows={await listTestimonials()} />;
}
