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
  const names = data?.names || "To'y taklifnomasi";
  const image = data?.imageUrl || "https://taklif-go.vercel.app/placeholder-logo.png";

  return {
    title: `${names} - Wedding Invitation`,
    description: "Sizni bizning eng baxtli kunimizda kutib qolamiz!",
    openGraph: {
      title: `${names} - Wedding Invitation`,
      description: "Sizni bizning eng baxtli kunimizda kutib qolamiz!",
      images: [{ url: image }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${names} - Wedding Invitation`,
      description: "Sizni bizning eng baxtli kunimizda kutib qolamiz!",
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
