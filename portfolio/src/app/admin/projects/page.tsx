import { ProjectsTable } from "@/components/admin/projects-table";
import { listProjects } from "@/server/actions/projects";

export default async function AdminProjectsPage() {
  const projects = await listProjects();
  return <ProjectsTable projects={projects} />;
}
