"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Award, CommunityEntry, Education, Experience, Testimonial } from "@prisma/client";
import { ModalCrudPage } from "@/components/admin/modal-crud";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteAward,
  deleteCommunity,
  deleteEducation,
  deleteExperience,
  deleteTestimonial,
  saveAward,
  saveCommunity,
  saveEducation,
  saveExperience,
  saveTestimonial,
} from "@/server/actions/story";

export function ExperienceClient({ rows }: { rows: Experience[] }) {
  const columns: ColumnDef<Experience>[] = [
    { accessorKey: "role", header: "Role" },
    { accessorKey: "organisation", header: "Organisation" },
  ];
  return (
    <ModalCrudPage
      title="Experience"
      rows={rows}
      columns={columns}
      initialForm={() => ({
        role: "",
        organisation: "",
        startDate: new Date().toISOString().slice(0, 10),
        current: false,
        highlights: [] as string[],
        stack: [] as string[],
        showOnCv: true,
        status: "PUBLISHED",
        order: 0,
      })}
      renderForm={(form, setForm) => (
        <div className="space-y-3">
          <Label>Role</Label>
          <Input value={String(form.role ?? "")} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
          <Label>Organisation</Label>
          <Input value={String(form.organisation ?? "")} onChange={(e) => setForm((f) => ({ ...f, organisation: e.target.value }))} />
          <Label>Start date</Label>
          <Input
            type="date"
            value={String(form.startDate ?? "").slice(0, 10)}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
          />
        </div>
      )}
      onSave={async (id, form) => {
        const res = await saveExperience(id, {
          role: String(form.role ?? ""),
          organisation: String(form.organisation ?? ""),
          startDate: String(form.startDate ?? new Date().toISOString()),
          endDate: form.endDate ? String(form.endDate) : null,
          current: Boolean(form.current),
          highlights: (form.highlights as string[]) ?? [],
          stack: (form.stack as string[]) ?? [],
          showOnCv: Boolean(form.showOnCv ?? true),
          status: (form.status as Experience["status"]) ?? "PUBLISHED",
          order: Number(form.order ?? 0),
          organisationUrl: form.organisationUrl ? String(form.organisationUrl) : undefined,
          location: form.location ? String(form.location) : undefined,
          employmentType: form.employmentType ? String(form.employmentType) : undefined,
          summary: form.summary ? String(form.summary) : undefined,
        });
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
      onDelete={async (id) => {
        const res = await deleteExperience(id);
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
    />
  );
}

export function EducationClient({ rows }: { rows: Education[] }) {
  const columns: ColumnDef<Education>[] = [
    { accessorKey: "degree", header: "Degree" },
    { accessorKey: "institution", header: "Institution" },
  ];
  return (
    <ModalCrudPage
      title="Education"
      rows={rows}
      columns={columns}
      initialForm={() => ({ institution: "", degree: "", startYear: new Date().getFullYear(), expected: false, details: [], status: "PUBLISHED", order: 0 })}
      renderForm={(form, setForm) => (
        <div className="space-y-3">
          <Input placeholder="Institution" value={String(form.institution ?? "")} onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))} />
          <Input placeholder="Degree" value={String(form.degree ?? "")} onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))} />
          <Input type="number" placeholder="Start year" value={Number(form.startYear ?? 2020)} onChange={(e) => setForm((f) => ({ ...f, startYear: Number(e.target.value) }))} />
        </div>
      )}
      onSave={async (id, form) => {
        const res = await saveEducation(id, {
          institution: String(form.institution ?? ""),
          degree: String(form.degree ?? ""),
          startYear: Number(form.startYear ?? 2020),
          endYear: form.endYear ? Number(form.endYear) : null,
          expected: Boolean(form.expected),
          details: (form.details as string[]) ?? [],
          status: (form.status as Education["status"]) ?? "PUBLISHED",
          order: Number(form.order ?? 0),
          field: form.field ? String(form.field) : undefined,
          location: form.location ? String(form.location) : undefined,
          url: form.url ? String(form.url) : undefined,
        });
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
      onDelete={async (id) => {
        const res = await deleteEducation(id);
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
    />
  );
}

export function AwardsClient({ rows }: { rows: Award[] }) {
  const columns: ColumnDef<Award>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "issuer", header: "Issuer" },
  ];
  return (
    <ModalCrudPage
      title="Awards"
      rows={rows}
      columns={columns}
      initialForm={() => ({ title: "", issuer: "", showOnCv: true, status: "PUBLISHED", order: 0 })}
      renderForm={(form, setForm) => (
        <div className="space-y-3">
          <Input value={String(form.title ?? "")} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Title" />
          <Input value={String(form.issuer ?? "")} onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))} placeholder="Issuer" />
        </div>
      )}
      onSave={async (id, form) => {
        const res = await saveAward(id, {
          title: String(form.title ?? ""),
          issuer: String(form.issuer ?? ""),
          year: form.year ? Number(form.year) : null,
          date: form.date ? String(form.date) : null,
          description: form.description ? String(form.description) : undefined,
          url: form.url ? String(form.url) : undefined,
          showOnCv: Boolean(form.showOnCv ?? true),
          status: (form.status as Award["status"]) ?? "PUBLISHED",
          order: Number(form.order ?? 0),
        });
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
      onDelete={async (id) => {
        const res = await deleteAward(id);
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
    />
  );
}

export function CommunityClient({ rows }: { rows: CommunityEntry[] }) {
  const columns: ColumnDef<CommunityEntry>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "organisation", header: "Organisation" },
  ];
  return (
    <ModalCrudPage
      title="Community"
      rows={rows}
      columns={columns}
      initialForm={() => ({ title: "", organisation: "", kind: "LEADERSHIP", summary: "", highlights: [], showOnCv: true, featured: false, status: "PUBLISHED", order: 0 })}
      renderForm={(form, setForm) => (
        <div className="space-y-3">
          <Input value={String(form.title ?? "")} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <Input value={String(form.organisation ?? "")} onChange={(e) => setForm((f) => ({ ...f, organisation: e.target.value }))} />
          <Textarea value={String(form.summary ?? "")} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} />
        </div>
      )}
      onSave={async (id, form) => {
        const res = await saveCommunity(id, {
          title: String(form.title ?? ""),
          organisation: String(form.organisation ?? ""),
          kind: String(form.kind ?? "LEADERSHIP"),
          summary: String(form.summary ?? ""),
          highlights: (form.highlights as string[]) ?? [],
          showOnCv: Boolean(form.showOnCv ?? true),
          featured: Boolean(form.featured),
          status: (form.status as CommunityEntry["status"]) ?? "PUBLISHED",
          order: Number(form.order ?? 0),
          organisationUrl: form.organisationUrl ? String(form.organisationUrl) : undefined,
          role: form.role ? String(form.role) : undefined,
          period: form.period ? String(form.period) : undefined,
        });
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
      onDelete={async (id) => {
        const res = await deleteCommunity(id);
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
    />
  );
}

export function TestimonialsClient({ rows }: { rows: Testimonial[] }) {
  const columns: ColumnDef<Testimonial>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "company", header: "Company" },
  ];
  return (
    <ModalCrudPage
      title="Testimonials"
      rows={rows}
      columns={columns}
      initialForm={() => ({ name: "", quote: "", status: "DRAFT", order: 0 })}
      renderForm={(form, setForm) => (
        <div className="space-y-3">
          <Input value={String(form.name ?? "")} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Textarea value={String(form.quote ?? "")} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} />
        </div>
      )}
      onSave={async (id, form) => {
        const res = await saveTestimonial(id, {
          name: String(form.name ?? ""),
          quote: String(form.quote ?? ""),
          role: form.role ? String(form.role) : undefined,
          company: form.company ? String(form.company) : undefined,
          url: form.url ? String(form.url) : undefined,
          status: (form.status as Testimonial["status"]) ?? "DRAFT",
          order: Number(form.order ?? 0),
        });
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
      onDelete={async (id) => {
        const res = await deleteTestimonial(id);
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
    />
  );
}
