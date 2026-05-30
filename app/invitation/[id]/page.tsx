import { Metadata } from "next";
import InvitationClient from "./InvitationClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/invitation-28b16/databases/(default)/documents/invitations/${id}`, { cache: 'no-store' });
  
  if (!res.ok) {
    return { title: "Taklifnoma topilmadi" };
  }

  const doc = await res.json();
  const parseFirestoreValue = (val: any): any => {
    if (!val) return null;
    if (val.stringValue !== undefined) return val.stringValue;
    if (val.integerValue !== undefined) return parseInt(val.integerValue, 10);
    if (val.booleanValue !== undefined) return val.booleanValue;
    if (val.arrayValue !== undefined) return (val.arrayValue.values || []).map(parseFirestoreValue);
    if (val.mapValue !== undefined) {
      const obj: any = {};
      for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
        obj[k] = parseFirestoreValue(v);
      }
      return obj;
    }
    return val;
  };

  const data: any = {};
  for (const [k, v] of Object.entries(doc.fields || {})) {
    data[k] = parseFirestoreValue(v);
  }
  const category = data?.category || "wedding";
  const image = (data?.images && data.images[0]) || data?.imageUrl || "https://taklif-go.vercel.app/placeholder-logo.png";
  
  let displayTitle = data?.names || "Taklifnoma";
  if (category === "business") {
    displayTitle = data?.eventTitle || data?.companyName || data?.names || "Biznes Tadbiri";
  }

  let dynamicTitle = `${displayTitle} - Taklifnoma`;
  let dynamicDesc = "Sizni kutib qolamiz!";

  if (category === "birthday") {
    dynamicTitle = `${displayTitle} - Tug'ilgan kun taklifnomasi`;
    dynamicDesc = "Sizni tug'ilgan kun bayramiga lutfan taklif qilamiz!";
  } else if (category === "business") {
    dynamicTitle = `${displayTitle} - Biznes tadbiriga taklifnoma`;
    dynamicDesc = "Sizni muhim biznes tadbirimizga lutfan taklif qilamiz.";
  } else if (category === "farewell") {
    dynamicTitle = `${displayTitle} - Qiz uzatish marosimi`;
    dynamicDesc = "Sizni qiz uzatish marosimiga lutfan taklif qilamiz!";
  } else {
    dynamicTitle = `${displayTitle} - To'y taklifnomasi`;
    dynamicDesc = "Sizni bizning eng baxtli kunimizda kutib qolamiz!";
  }

  return {
    title: dynamicTitle,
    description: dynamicDesc,
    openGraph: {
      title: dynamicTitle,
      description: dynamicDesc,
      images: [{ url: image }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dynamicTitle,
      description: dynamicDesc,
      images: [image],
    },
  };
}

export default async function InvitationPage({ params }: Props) {
  const { id } = await params;
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/invitation-28b16/databases/(default)/documents/invitations/${id}`, { cache: 'no-store' });

  if (!res.ok) {
    notFound();
  }

  const doc = await res.json();
  const parseFirestoreValue = (val: any): any => {
    if (!val) return null;
    if (val.stringValue !== undefined) return val.stringValue;
    if (val.integerValue !== undefined) return parseInt(val.integerValue, 10);
    if (val.booleanValue !== undefined) return val.booleanValue;
    if (val.arrayValue !== undefined) return (val.arrayValue.values || []).map(parseFirestoreValue);
    if (val.mapValue !== undefined) {
      const obj: any = {};
      for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
        obj[k] = parseFirestoreValue(v);
      }
      return obj;
    }
    return val;
  };

  const data: any = {};
  for (const [k, v] of Object.entries(doc.fields || {})) {
    data[k] = parseFirestoreValue(v);
  }
  data.id = id;

  return <InvitationClient data={data} id={id} />;
}
