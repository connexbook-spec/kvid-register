import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slipId = searchParams.get("slipId");

    // If slipId provided, return just the slip for that registration
    if (slipId) {
      const reg = await prisma.registration.findUnique({
        where: { id: Number(slipId) },
        select: { slipPath: true },
      });
      return NextResponse.json({ slipPath: reg?.slipPath || null });
    }

    // List all registrations WITHOUT slipPath (base64 is too large)
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        package: true,
        fullName: true,
        lineId: true,
        phone: true,
        email: true,
        facebook: true,
        referralCode: true,
        needTaxInvoice: true,
        status: true,
        createdAt: true,
      },
    });
    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ id: registration.id, status: registration.status });
  } catch (error) {
    console.error("Error updating registration:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
