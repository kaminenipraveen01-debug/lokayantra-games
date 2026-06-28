import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "@/lib/firebase-admin";

const adminDb = getFirestore(adminApp);

export async function GET() {
  try {
    const snap = await adminDb.collection("games").get();
    const categories = new Set<string>();
    snap.docs.forEach((d) => {
      const cat = d.data().category;
      if (cat) categories.add(cat);
    });
    return NextResponse.json({ 
      categories: Array.from(categories).sort() 
    });
  } catch (err) {
    return NextResponse.json({ categories: [] });
  }
}