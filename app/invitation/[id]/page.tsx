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
  const names = data?.names || "Taklifnoma";
  const image = data?.imageUrl || "https://taklif-go.vercel.app/placeholder-logo.png";
  const category = data?.category || "wedding";

  let dynamicTitle = `${names} - Taklifnoma`;
  let dynamicDesc = "Sizni kutib qolamiz!";

  if (category === "birthday") {
    dynamicTitle = `${names} - Tug'ilgan kun taklifnomasi`;
    dynamicDesc = "Sizni tug'ilgan kun bayramiga lutfan taklif qilamiz!";
  } else if (category === "business") {
    dynamicTitle = `${names} - Biznes tadbiriga taklif`;
    dynamicDesc = "Sizni muhim biznes tadbirimizga taklif qilamiz.";
  } else if (category === "farewell") {
    dynamicTitle = `${names} - Qiz uzatish marosimi`;
    dynamicDesc = "Sizni qiz uzatish marosimiga taklif qilamiz!";
  } else {
    dynamicTitle = `${names} - To'y taklifnomasi`;
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
