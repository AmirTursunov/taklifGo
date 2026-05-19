import { Metadata } from "next";
import { adminDb } from "@/lib/firebase-admin";
import InvitationClient from "./InvitationClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doc = await adminDb.collection("invitations").doc(id).get();
  
  if (!doc.exists) {
    return { title: "Taklifnoma topilmadi" };
  }

  const data = doc.data();
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
  const doc = await adminDb.collection("invitations").doc(id).get();

  if (!doc.exists) {
    notFound();
  }

  const data = JSON.parse(JSON.stringify({ id: doc.id, ...doc.data() }));

  return <InvitationClient data={data} id={id} />;
}
