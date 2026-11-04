import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/admin/project-editor";
import { getProject } from "@/server/actions/projects";

export default async function AdminProjectEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") return <ProjectEditor project={null} />;
  const project = await getProject(id);
  if (!project) notFound();
  return <ProjectEditor project={project} />;
}
