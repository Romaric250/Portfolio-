import { CertificatesAdmin } from "@/components/admin/certificates-admin";
import { listCertificateCategories, listCertificates } from "@/server/actions/certificates";

export default async function AdminCertificatesPage() {
  const categories = await listCertificateCategories();
  const defaultCat = categories.find((c) => c.isDefault) ?? categories[0];
  const certs = defaultCat ? await listCertificates(defaultCat.id) : await listCertificates();

  return (
    <CertificatesAdmin
      initialCategories={categories}
      initialCerts={certs}
      defaultCategoryId={defaultCat?.id ?? ""}
    />
  );
}
