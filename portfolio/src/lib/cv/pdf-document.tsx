import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { SITE } from "@/lib/seo/site";

export type CvPdfData = {
  name: string;
  email: string;
  headline: string;
  summary: string;
  experience: Array<{ role: string; organisation: string; period: string; highlights: string[] }>;
  education: Array<{ degree: string; institution: string; period: string }>;
  skills: string[];
  certificates: Array<{ title: string; issuer: string; date: string }>;
  referencesNote: string;
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", lineHeight: 1.45, color: "#0B0F14" },
  h1: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
  meta: { fontSize: 9, color: "#5B6470", marginBottom: 12 },
  section: { marginTop: 14, marginBottom: 6 },
  sectionTitle: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  itemTitle: { fontWeight: 700, fontSize: 10 },
  itemSub: { color: "#5B6470", fontSize: 9 },
  bullet: { marginLeft: 8, fontSize: 9 },
});

export function CvPdfDocument({ data }: { data: CvPdfData }) {
  return (
    <Document title={`${data.name} CV`} author={data.name} subject="Curriculum Vitae" creator={SITE.name}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>{data.name}</Text>
        <Text style={styles.meta}>{data.headline} · {data.email}</Text>
        {data.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text>{data.summary}</Text>
          </View>
        ) : null}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experience.map((e) => (
            <View key={`${e.organisation}-${e.role}`} style={{ marginBottom: 8 }}>
              <Text style={styles.itemTitle}>{e.role}</Text>
              <Text style={styles.itemSub}>{e.organisation} · {e.period}</Text>
              {e.highlights.map((h) => (
                <Text key={h} style={styles.bullet}>• {h}</Text>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((e) => (
            <View key={e.institution} style={{ marginBottom: 6 }}>
              <Text style={styles.itemTitle}>{e.degree}</Text>
              <Text style={styles.itemSub}>{e.institution} · {e.period}</Text>
            </View>
          ))}
        </View>
        {data.skills.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text>{data.skills.join(" · ")}</Text>
          </View>
        ) : null}
        {data.certificates.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certificates.map((c) => (
              <Text key={c.title} style={{ marginBottom: 4 }}>
                {c.title} — {c.issuer} ({c.date})
              </Text>
            ))}
          </View>
        ) : null}
        <View style={styles.section}>
          <Text style={styles.itemSub}>{data.referencesNote}</Text>
        </View>
      </Page>
    </Document>
  );
}
